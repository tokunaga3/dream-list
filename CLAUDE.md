# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev          # 開発サーバー起動（0.0.0.0でリッスン）
npm run build        # プロダクションビルド
npm run lint         # ESLint
npm run db:init      # Tursoデータベース初期化（初回セットアップ時）
npm run db:migrate   # DBマイグレーション
npm run generate-key # ENCRYPTION_KEY生成（AES-256-GCM用）
```

## 必須環境変数

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=       # openssl rand -base64 32 で生成
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TURSO_DATABASE_URL=    # libsql://your-database.turso.io
TURSO_AUTH_TOKEN=
ENCRYPTION_KEY=        # npm run generate-key で生成（64文字の16進数）
```

## アーキテクチャ

**技術スタック**: Next.js 16 App Router / NextAuth.js v5 beta / Turso (libSQL) / Google Sheets API / Tailwind CSS

### 認証フロー

`auth.ts` がNextAuth設定の中心。Google OAuth 2.0でログインし、`access_token`と`refresh_token`をJWTセッションに保存する。JWTコールバック内でアクセストークンの有効期限切れを検知し、自動リフレッシュを実行。失敗時は `error: "RefreshAccessTokenError"` をトークンに設定してフロントに通知。セッション有効期限は30日。

OAuthスコープ: `spreadsheets` + `drive.file`（スプレッドシート作成にDrive APIが必要）

### データ永続化

Turso (libSQL) に `users` テーブルが1つだけ存在:
```sql
users (email TEXT PRIMARY KEY, spreadsheet_id TEXT, created_at INTEGER, updated_at INTEGER)
```

`spreadsheet_id` はAES-256-GCMで暗号化して保存（`lib/crypto.ts`）。暗号化フォーマットは `iv:authTag:encrypted`（`:` 区切りの3パート）。

### スプレッドシート管理フロー

`POST /api/dreams`:
1. DBからユーザーのスプレッドシートIDを取得・復号化
2. IDが未登録 → Google Drive APIで新規スプレッドシート「Dream List - 夢リスト」を作成 → IDを暗号化してDBに保存
3. ID登録済み → 「Dreams」シートの存在を確認（なければ作成）
4. 日時（JST）と夢のテキストを追記

### APIルート

| ルート | メソッド | 用途 |
|--------|---------|------|
| `/api/auth/[...nextauth]` | - | NextAuthハンドラー |
| `/api/dreams` | POST | 夢をスプレッドシートに追記 |
| `/api/user/spreadsheet` | GET/POST | スプレッドシートID取得・保存 |

### セキュリティミドルウェア

`middleware.ts` で全リクエストにセキュリティヘッダーを付与（X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy）。

### パスエイリアス

`@/*` → プロジェクトルート（`tsconfig.json`で設定）
