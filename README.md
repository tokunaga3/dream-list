# 夢リスト - Dream List 🌟

Next.jsで作成された、あなたの夢をGoogle Sheetsに記録するWebアプリケーションです。

## 機能

- ✨ Googleアカウントでログイン
- 📝 シンプルなフォームで夢を記録
- 📊 Google Sheetsに自動保存
- 🔐 セッション管理（ログイン状態の保持）
- 🎨 ダークモード対応
- 📱 レスポンシブデザイン

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **APIとサービス** > **認証情報**に移動
4. **OAuth 2.0 クライアント ID**を作成
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みのリダイレクトURI: `http://localhost:3000/api/auth/callback/google`
5. **APIとサービス** > **ライブラリ**で以下を有効化:
   - Google Sheets API
   - Google Drive API

### 3. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成:

```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下の値を設定:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**NEXTAUTH_SECRET**の生成:
```bash
openssl rand -base64 32
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

1. **ログイン**: 「Googleでログイン」ボタンをクリック
2. **夢を記録**: フォームに夢を入力して「夢を記録する」ボタンをクリック
3. **確認**: Google Sheetsに自動的に記録されます

## スプレッドシートの設定

デフォルトでは、初回使用時に自動的に新しいスプレッドシートが作成されます。

既存のスプレッドシートを使用したい場合:

1. Google Sheetsで新しいスプレッドシートを作成
2. URLからスプレッドシートIDをコピー
   - `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. `.env`ファイルに追加:
   ```env
   SPREADSHEET_ID=your-spreadsheet-id
   ```

## プロジェクト構成

```
dream-list/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth APIルート
│   │   └── dreams/              # 夢を追加するAPIルート
│   ├── login/                    # ログインページ
│   ├── globals.css              # グローバルスタイル
│   ├── layout.tsx               # ルートレイアウト
│   └── page.tsx                 # ホームページ
├── components/
│   ├── DreamForm.tsx            # 夢入力フォーム
│   ├── Providers.tsx            # SessionProvider
│   └── SignOutButton.tsx        # ログアウトボタン
├── types/
│   └── next-auth.d.ts           # NextAuth型定義
├── auth.ts                       # NextAuth設定
└── .env                          # 環境変数（gitignore）
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **認証**: NextAuth.js v5
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **API**: Google Sheets API, googleapis

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数を設定:
   - `NEXTAUTH_URL`: デプロイ先のURL
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. Google Cloud Consoleで承認済みリダイレクトURIを追加:
   - `https://your-domain.vercel.app/api/auth/callback/google`

## トラブルシューティング

### ログインできない

- Google Cloud ConsoleでOAuth 2.0クライアントIDが正しく設定されているか確認
- リダイレクトURIが正しいか確認
- 環境変数が正しく設定されているか確認

### スプレッドシートに書き込めない

- Google Sheets APIが有効になっているか確認
- Google Drive APIが有効になっているか確認
- OAuth同意画面でスコープが正しく設定されているか確認

## ライセンス

MIT
