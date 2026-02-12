import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "環境変数が設定されていません。GOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETを設定してください。"
  );
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "環境変数NEXTAUTH_SECRETが設定されていません。"
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14日間（秒単位）
    updateAge: 24 * 60 * 60, // 24時間ごとにセッションを更新
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at; // Googleアクセストークンの有効期限
      }
      
      // トークンの有効期限をチェック
      if (token.expiresAt && typeof token.expiresAt === "number") {
        const isExpired = Date.now() >= token.expiresAt * 1000;
        
        if (isExpired && token.refreshToken) {
          // トークンが期限切れの場合、リフレッシュを試みる
          try {
            const response = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken as string,
              }),
            });

            const refreshedTokens = await response.json();

            if (!response.ok) throw refreshedTokens;

            token.accessToken = refreshedTokens.access_token;
            token.expiresAt = Math.floor(Date.now() / 1000 + refreshedTokens.expires_in);
            
            if (refreshedTokens.refresh_token) {
              token.refreshToken = refreshedTokens.refresh_token;
            }
          } catch (error) {
            console.error("トークンのリフレッシュに失敗しました:", error);
            // リフレッシュが失敗した場合、ユーザーに再ログインを要求
            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
