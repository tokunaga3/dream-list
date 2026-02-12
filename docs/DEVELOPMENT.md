# 開発ガイド

## セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd dream-list
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定

`.env`ファイルを作成（`.env.example`を参考に）:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Turso Database
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIs...

# Optional
SPREADSHEET_ID=your-default-spreadsheet-id
```

### 4. Google Cloud Console設定

1. プロジェクト作成
2. OAuth 2.0クライアントID作成
3. 承認済みリダイレクトURI追加:
   - `http://localhost:3000/api/auth/callback/google`
4. OAuth同意画面設定
5. スコープ追加:
   - `https://www.googleapis.com/auth/spreadsheets`

詳細は[README.md](../README.md)を参照。

### 5. Tursoデータベース設定

```bash
# Turso CLIインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベース作成
turso db create dream-list

# 接続情報取得
turso db show dream-list --url
turso db tokens create dream-list

# .envファイルに追加
```

詳細は[TURSO_SETUP.md](./TURSO_SETUP.md)を参照。

### 6. データベース初期化

```bash
npm run db:init
```

### 7. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 にアクセス

## 開発ワークフロー

### 機能追加の流れ

1. **ブランチ作成**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **コード実装**
   - コンポーネント作成: `components/`
   - APIルート追加: `app/api/`
   - 型定義: `types/`

3. **ローカルテスト**
   ```bash
   npm run dev
   # ブラウザで動作確認
   ```

4. **ビルド確認**
   ```bash
   npm run build
   npm start
   ```

5. **コミット**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

6. **プルリクエスト**
   - GitHub/GitLabでPR作成
   - レビュー後マージ

### コーディング規約

#### TypeScript
- 型定義を明示的に記述
- `any`の使用は避ける
- Optional chaining (`?.`) を活用

```typescript
// Good
const email: string | undefined = session?.user?.email;

// Bad
const email = session.user.email as any;
```

#### コンポーネント
- 関数コンポーネントを使用
- デフォルトエクスポート
- Propsは型定義

```typescript
interface DreamFormProps {
  spreadsheetId: string | null;
}

export default function DreamForm({ spreadsheetId }: DreamFormProps) {
  // ...
}
```

#### API Routes
- エラーハンドリングを徹底
- 適切なステータスコードを返す
- セッション検証を実施

```typescript
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 処理
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### スタイリング
- Tailwind CSSクラスを使用
- カスタムCSSは最小限に
- レスポンシブデザインを考慮

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
  <div className="max-w-md mx-auto p-6">
    {/* コンテンツ */}
  </div>
</div>
```

## デバッグ

### セッション情報の確認

```typescript
// app/page.tsx
const session = await auth();
console.log('Session:', JSON.stringify(session, null, 2));
```

### APIレスポンスの確認

```typescript
// components/DreamForm.tsx
const response = await fetch('/api/dreams', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dream, spreadsheetId }),
});
const data = await response.json();
console.log('API Response:', data);
```

### データベースクエリの確認

```typescript
// lib/db.ts
const result = await db.execute({
  sql: 'SELECT * FROM users WHERE email = ?',
  args: [email]
});
console.log('DB Result:', result.rows);
```

### Google Sheets API

```typescript
// app/api/dreams/route.ts
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
const response = await sheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'Dreams!A:C',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [[timestamp, dream, userName]] }
});
console.log('Sheets API Response:', response.data);
```

## トラブルシューティング

### よくあるエラー

#### 1. NextAuth Configuration Error
```
Error: NextAuth configuration error
```

**原因**: 環境変数が設定されていない

**解決策**:
```bash
# .envファイルを確認
cat .env

# 必須変数が全て設定されているか確認
echo $NEXTAUTH_SECRET
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
```

#### 2. Database Connection Error
```
LibsqlError: The specified database does not exist
```

**原因**: データベースが初期化されていない、または接続情報が間違っている

**解決策**:
```bash
# データベースの存在確認
turso db list

# 再初期化
npm run db:init

# .envファイルの確認
cat .env | grep TURSO
```

#### 3. Sheets API Error
```
Error: Unable to parse range: Dreams!A:C
```

**原因**: スプレッドシートにDreamsシートが存在しない

**解決策**: コードは自動的にシートを作成するはずだが、権限がない可能性がある
```typescript
// スプレッドシートの共有設定を確認
// Google Cloud ConsoleでSheets APIとDrive APIが有効か確認
```

#### 4. Token Refresh Error
```
error: "RefreshAccessTokenError"
```

**原因**: Googleのリフレッシュトークンが無効

**解決策**: 再ログインが必要
```typescript
// ユーザーに再ログインを促す
// auth.tsのエラーハンドリングで自動的に処理される
```

### ログの確認

#### Development
```bash
# 開発サーバーのログ
npm run dev
# コンソールに表示される
```

#### Production (Netlify)
```bash
# Netlify CLI
netlify logs:function <function-name>

# または Netlifyダッシュボードで確認
```

#### Database (Turso)
```bash
# データベースの状態確認
turso db show dream-list

# SQLシェルで直接確認
turso db shell dream-list

# クエリ実行
SELECT * FROM users;
```

## テスト

### 手動テスト

1. **認証フロー**
   - [ ] ログインページでGoogleログインボタンをクリック
   - [ ] Google OAuth画面が表示される
   - [ ] 承認後、メインページにリダイレクトされる
   - [ ] ユーザー名が表示される

2. **夢の記録**
   - [ ] フォームに夢を入力
   - [ ] 「夢を記録する」ボタンをクリック
   - [ ] 確認ダイアログが表示される
   - [ ] 「記録する」をクリック
   - [ ] 成功メッセージが表示される
   - [ ] Google Sheetsに記録されている

3. **スプレッドシート設定**
   - [ ] 「設定する」をクリック
   - [ ] スプレッドシートIDを入力
   - [ ] 「保存」をクリック
   - [ ] 成功メッセージが表示される
   - [ ] 次回から指定したスプレッドシートに記録される

4. **セッション管理**
   - [ ] ログアウト
   - [ ] 再度ログイン
   - [ ] 設定したスプレッドシートIDが保持されている

### 自動テスト（TODO）

現在、自動テストは実装されていません。以下のテストを追加することを推奨:

- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

## デプロイ

### Netlifyへのデプロイ

1. **Netlifyにログイン**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **プロジェクトをリンク**
   ```bash
   netlify init
   ```

3. **環境変数を設定**
   ```bash
   netlify env:set NEXTAUTH_URL https://your-app.netlify.app
   netlify env:set NEXTAUTH_SECRET your-secret
   netlify env:set GOOGLE_CLIENT_ID your-client-id
   netlify env:set GOOGLE_CLIENT_SECRET your-client-secret
   netlify env:set TURSO_DATABASE_URL your-db-url
   netlify env:set TURSO_AUTH_TOKEN your-auth-token
   ```

4. **デプロイ**
   ```bash
   netlify deploy --prod
   ```

5. **Google Cloud Console更新**
   - 承認済みリダイレクトURIに本番URLを追加
   - `https://your-app.netlify.app/api/auth/callback/google`

### GitHub Actionsでの自動デプロイ（TODO）

`.github/workflows/deploy.yml`を作成:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './.next'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## パフォーマンス最適化

### バンドルサイズの確認

```bash
npm run build
# Build output will show bundle sizes
```

### 画像最適化

Next.jsの`Image`コンポーネントを使用:
```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
  priority
/>
```

### クライアントサイドJSの最小化

Server Componentsを優先的に使用:
```tsx
// app/page.tsx - Server Component
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <ClientComponent data={data} />;
}
```

## セキュリティ

### 環境変数の管理

- `.env`ファイルをGitにコミットしない
- `.gitignore`に`.env`が含まれていることを確認
- 本番環境では環境変数を安全に管理

### 依存関係の更新

```bash
# 脆弱性チェック
npm audit

# アップデート
npm update

# メジャーバージョンアップデート
npx npm-check-updates -u
npm install
```

### CSRFトークン

NextAuth.jsが自動的に処理するため、追加の実装は不要。

### XSS対策

Reactのデフォルトエスケープを活用:
```tsx
// Safe - React automatically escapes
<div>{userInput}</div>

// Dangerous - avoid unless necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Turso Documentation](https://docs.turso.tech)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 貢献

バグ報告や機能リクエストはIssueで受け付けています。
プルリクエストも歓迎します！
