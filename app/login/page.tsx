"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "SessionExpired":
        return "セッションの有効期限が切れました。再度ログインしてください。";
      case "Configuration":
        return "認証設定にエラーがあります。管理者にお問い合わせください。";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            夢リスト 🌟
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            あなたの夢・目標を Google Sheets に記録するアプリ
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left inline-block">
            <li>✅ Google アカウントでかんたんログイン</li>
            <li>✅ 夢を入力するだけで自動的にシートへ記録</li>
            <li>✅ 初回利用時にスプレッドシートを自動作成</li>
            <li>✅ データはあなた自身の Google Sheets に保存</li>
          </ul>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {errorMessage}
            </p>
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Googleでログイン
        </button>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
          ログインすることで、
          <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
            プライバシーポリシー
          </Link>
          および
          <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
            利用規約
          </Link>
          に同意したものとみなされます。
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
