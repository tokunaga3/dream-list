# 夢リスト - Dream List 🌟

Next.jsで作成された、あなたの夢をGoogle Sheetsに記録するWebアプリケーションです。

## 機能

- ✨ Googleアカウントでログイン
- 📝 シンプルなフォームで夢を記録
- 📊 Google Sheetsに自動保存
- 🆕 初回記録時にスプレッドシート自動作成
- 💾 スプレッドシートIDをデータベースに保存（Turso）
- 🔐 セッション管理（14日間有効、自動更新）
- 🔒 スプレッドシートIDをAES-256-GCM暗号化
- 🎨 ダークモード対応
- 📱 レスポンシブデザイン
- 🔄 タブ切り替えUI（記録/設定）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Turso データベースのセットアップ

詳細は [docs/TURSO_SETUP.md](docs/TURSO_SETUP.md) を参照してください。

**クイックスタート:**

```bash
# Turso CLI のインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベース作成
turso db create dream-list

# 認証情報を取得
turso db show dream-list --url
turso db tokens create dream-list
```

### 3. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **APIとサービス** > **認証情報**に移動
4. **OAuth 2.0 クライアント ID**を作成
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みのリダイレクトURI: `http://localhost:3000/api/auth/callback/google`
5. **APIとサービス** > **ライブラリ**で以下を有効化:
   - Google Sheets API
   - Google Drive API

### 3. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. **APIとサービス** > **認証情報**に移動
4. **OAuth 2.0 クライアント ID**を作成
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みのリダイレクトURI: `http://localhost:3000/api/auth/callback/google`
5. **APIとサービス** > **ライブラリ**で以下を有効化:
   - Google Sheets API
   - Google Drive API

### 4. 環境変数の設定

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

TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

ENCRYPTION_KEY=your-encryption-key-here
```

**NEXTAUTH_SECRET**の生成:
```bash
openssl rand -base64 32
```

**ENCRYPTION_KEY**の生成:
```bash
npm run generate-key
```

このキーはスプレッドシートIDを安全に暗号化するために使用されます。

### 5. データベースの初期化

```bash
npm run db:init
```

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

1. **ログイン**: 「Googleでログイン」ボタンをクリック
2. **夢を記録**: フォームに夢を入力して「夢を記録する」ボタンをクリック
3. **確認**: 入力内容を確認して「記録する」をクリック
4. **完了**: Google Sheetsに自動的に記録されます
   - 初回記録時は新しいスプレッドシートが自動作成されます
   - 次回からは同じスプレッドシートに記録されます

## スプレッドシートについて

### 自動作成機能

初めて夢を記録すると、アプリが自動的に新しいスプレッドシート「Dream List - 夢リスト」を作成します。
作成されたスプレッドシートIDはデータベースに暗号化して保存され、次回以降はそのスプレッドシートに記録されます。

### スプレッドシートの変更

既存のスプレッドシートを使いたい場合は、「⚙️ 設定」タブから変更できます：

1. ログイン後、「⚙️ 設定」タブをクリック
2. 「設定する」をクリック
3. Google SheetsのスプレッドシートIDを入力
   - URLから取得: `https://docs.google.com/spreadsheets/d/【ここの部分】/edit`
4. 「保存」をクリック

設定はデータベースに暗号化して保存され、どのデバイスからログインしても同じスプレッドシートが使用されます。

## プロジェクト構成

```
dream-list/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth APIルート
│   │   ├── dreams/                 # 夢を追加するAPIルート
│   │   └── user/spreadsheet/       # ユーザー設定API
│   ├── login/                       # ログインページ
│   ├── globals.css                  # グローバルスタイル
│   ├── layout.tsx                   # ルートレイアウト
│   └── page.tsx                     # ホームページ
├── components/
│   ├── DreamForm.tsx                # 夢入力フォーム
│   ├── DreamManager.tsx             # 夢管理コンポーネント
│   ├── SpreadsheetSettings.tsx     # スプレッドシート設定
│   ├── Providers.tsx                # SessionProvider
│   └── SignOutButton.tsx            # ログアウトボタン
├── lib/
│   ├── db.ts                        # Tursoデータベース接続
│   └── crypto.ts                    # AES-256-GCM暗号化
├── types/
│   └── next-auth.d.ts               # NextAuth型定義
├── scripts/
│   ├── init-db.ts                   # DB初期化スクリプト
│   ├── migrate-db.ts                # DBマイグレーションスクリプト
│   └── generate-key.ts              # 暗号化キー生成
├── docs/
│   ├── TURSO_SETUP.md               # Tursoセットアップガイド
│   └── ENCRYPTION_SETUP.md          # 暗号化セットアップガイド
├── auth.ts                       # NextAuth設定
└── .env                          # 環境変数（gitignore）
```

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **認証**: NextAuth.js v5 (beta) - Google OAuth 2.0
- **データベース**: Turso (libSQL) - ユーザー設定の永続化
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **API**: Google Sheets API (googleapis v144)
- **セッション管理**: JWT (14日間有効、自動トークンリフレッシュ)

## デプロイ

### Netlify / Vercelへのデプロイ

1. プラットフォームにプロジェクトをインポート
2. 環境変数を設定:
   - `NEXTAUTH_URL`: デプロイ先のURL (例: https://your-app.netlify.app)
   - `NEXTAUTH_SECRET`: ランダムな文字列
   - `GOOGLE_CLIENT_ID`: Google Cloud Consoleから取得
   - `GOOGLE_CLIENT_SECRET`: Google Cloud Consoleから取得
   - `TURSO_DATABASE_URL`: Tursoデータベース接続URL
   - `TURSO_AUTH_TOKEN`: Turso認証トークン
   - `SPREADSHEET_ID` (オプション): デフォルトのスプレッドシートID

3. Google Cloud Consoleで承認済みリダイレクトURIを追加:
   - `https://your-domain.netlify.app/api/auth/callback/google`
   - または `https://your-domain.vercel.app/api/auth/callback/google`

4. ビルド設定:（開発: `http://localhost:3000/api/auth/callback/google`）
- 環境変数が正しく設定されているか確認
- OAuth同意画面のテストユーザーに追加されているか確認（公開前）

### スプレッドシートに書き込めない

- Google Sheets APIが有効になっているか確認
- Google Drive APIが有効になっているか確認
- OAuth同意画面でスコープ `https://www.googleapis.com/auth/spreadsheets` が設定されているか確認
- 指定したスプレッドシートIDが正しいか確認

### データベースエラー

- `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が正しく設定されているか確認
- データベースが初期化されているか確認: `npm run db:init`
- Tursoダッシュボードでデータベースのステータスを確認

### セッションの期限切れ

- セッションは14日間有効です
- トークンは自動的にリフレッシュされますが、失敗した場合は再ログインが必要です
- エラーメッセージ「セッションの有効期限が切れました」が表示された場合、再度ログインしてください
```bash
# Turso CLIでデータベース作成
turso db create dream-list

# 認証情報を取得してデプロイ環境に設定
turso db show dream-list --url
turso db tokens create dream-list
```

詳細は[TURSO_SETUP.md](docs/TURSO_SETUP.md)を参照してください。

## トラブルシューティング

### ログインできない

- Google Cloud ConsoleでOAuth 2.0クライアントIDが正しく設定されているか確認
- リダイレクトURIが正しいか確認
- 環境変数が正しく設定されているか確認

### スプレッドシートに書き込めない

- Google Sheets APIが有効になっているか確認
- Google Drive APIが有効になっているか確認
- OAuth同意画面でスコープ `https://www.googleapis.com/auth/spreadsheets` が設定されているか確認
- 指定したスプレッドシートIDが正しいか確認

### データベースエラー

- `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` が正しく設定されているか確認
- データベースが初期化されているか確認: `npm run db:init`
- Tursoダッシュボードでデータベースのステータスを確認

### セッションの期限切れ

- セッションは14日間有効です
- トークンは自動的にリフレッシュされますが、失敗した場合は再ログインが必要です
- エラーメッセージ「セッションの有効期限が切れました」が表示された場合、再度ログインしてください

## ドキュメント

プロジェクトの詳細な情報は以下のドキュメントを参照してください：

- **[TURSO_SETUP.md](docs/TURSO_SETUP.md)** - Tursoデータベースのセットアップガイド
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - システムアーキテクチャとデータフロー
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - 開発ガイドとベストプラクティス

## ライセンス

MIT
