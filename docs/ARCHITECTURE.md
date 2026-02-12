# アーキテクチャ概要

## システム構成

```
┌─────────────────────────────────────────────────────────┐
│                     クライアント                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Login Page  │  │   DreamForm  │  │   Settings   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          │ Google OAuth     │ Dream Submit     │ Save Config
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────┐
│                    Next.js Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  NextAuth.js │  │  Dreams API  │  │  User API    │   │
│  │  (auth.ts)   │  │              │  │              │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          │ Token Refresh    │ Append Data      │ CRUD
          │                  │                  │
┌─────────▼──────────┐  ┌────▼──────────┐  ┌───▼──────────┐
│  Google OAuth API  │  │ Google Sheets │  │Turso Database│
│  (token endpoint)  │  │     API       │  │   (libSQL)   │
└────────────────────┘  └───────────────┘  └──────────────┘
```

## データフロー

### 1. 認証フロー
```
User → Login Page → NextAuth.js → Google OAuth
                         ↓
                   JWT Token (14日間)
                         ↓
                   Session Cookie
                         ↓
              Protected Pages Access
```

### 2. 夢の記録フロー
```
User Input → DreamForm → Confirmation Dialog
                              ↓
                         POST /api/dreams
                              ↓
                    Session Validation
                              ↓
                    Get Spreadsheet ID
                    (User DB or .env)
                              ↓
                    Check/Create Sheet
                              ↓
                    Append to Sheets
                              ↓
                    Success Response
                              ↓
                    Show Success Message
```

### 3. スプレッドシート設定フロー
```
User → Settings → Input Spreadsheet ID
                         ↓
                  POST /api/user/spreadsheet
                         ↓
               Session Validation
                         ↓
               Upsert User Record
               (email, spreadsheet_id)
                         ↓
               Success Response
                         ↓
               Update UI State
```

## コンポーネント構成

### サーバーコンポーネント
- **app/page.tsx**: メインページ、認証チェック
- **app/login/page.tsx**: ログインページ（一部クライアント）

### クライアントコンポーネント
- **components/DreamManager.tsx**: 状態管理（spreadsheetId）
- **components/DreamForm.tsx**: 夢入力フォーム
- **components/SpreadsheetSettings.tsx**: 設定UI
- **components/SignOutButton.tsx**: ログアウトボタン
- **components/Providers.tsx**: SessionProvider wrapper

### APIルート
- **app/api/auth/[...nextauth]/route.ts**: NextAuth handler
- **app/api/dreams/route.ts**: 夢追加API
- **app/api/user/spreadsheet/route.ts**: ユーザー設定API

## データモデル

### Tursoデータベース

#### usersテーブル
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  spreadsheet_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
```

### JWTトークン構造
```typescript
{
  sub: string;              // ユーザーID
  email: string;            // メールアドレス
  name: string;             // ユーザー名
  picture: string;          // プロフィール画像URL
  accessToken: string;      // Google APIアクセストークン
  refreshToken: string;     // トークンリフレッシュ用
  expiresAt: number;        // トークン有効期限（Unix timestamp）
  error?: "RefreshAccessTokenError"; // エラー状態
  iat: number;              // 発行時刻
  exp: number;              // JWT有効期限（14日後）
}
```

### Google Sheetsデータ構造
```
Dreams シート
┌─────────────────────┬─────────┬──────────────┐
│ 日時                │  夢      │  ユーザー名   │
├─────────────────────┼─────────┼──────────────┤
│ 2024-01-01T12:00:00 │ 夢の内容 │ 山田太郎     │
└─────────────────────┴─────────┴──────────────┘
```

## セキュリティ

### 認証・認可
- Google OAuthによる認証
- JWT署名付きセッション
- 14日間の有効期限
- 自動トークンリフレッシュ

### データ保護
- 環境変数による秘密情報管理
- サーバーサイドでのセッション検証
- HTTPS通信（本番環境）
- CSRFトークン（NextAuth.js内蔵）

### アクセス制御
- 認証済みユーザーのみAPI利用可能
- ユーザーは自分のspreadsheet_idのみ操作可能
- Google Sheets APIは各ユーザーのアクセストークンで実行

## パフォーマンス最適化

### クライアントサイド
- React Server Components活用
- 必要な箇所のみクライアントコンポーネント
- Tailwind CSSによる最小限のCSSバンドル

### サーバーサイド
- Edge-optimized Tursoデータベース
- JWT署名検証のみ（DB queryなし）
- Google Sheets APIのバッチ処理

### キャッシング
- Next.js自動キャッシング
- セッションCookie（14日間）
- アクセストークンキャッシング（有効期限まで）

## スケーラビリティ

### 現在の構成
- Statelessなサーバー（JWT認証）
- スケールアウト可能なTurso DB
- ユーザーごとに個別のGoogle Sheets

### 将来の拡張性
- ユーザー数増加→Tursoの自動スケーリング
- リージョン展開→Edge database replication
- 機能追加→モジュラーなAPI構造

## 環境変数

### 必須
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-secret-string
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIs...
```

### オプション
```env
SPREADSHEET_ID=1234567890abcdefghijklmnopqrstuvwxyz  # デフォルトスプレッドシート
```

## デプロイメント

### 開発環境
```bash
npm run dev
# http://localhost:3000
```

### 本番環境（Netlify）
- Continuous Deployment (Git push)
- 環境変数設定
- HTTPS自動設定
- Edge Functions対応

### データベース（Turso）
- Edge distributed
- 自動バックアップ
- Read replicas
- 監視ダッシュボード

## モニタリング

### ログ
- NextAuth.jsデバッグログ（開発時）
- API error logging
- データベースクエリログ

### メトリクス
- Tursoダッシュボード（query数、latency）
- Netlify Analytics（訪問者数、ビルド時間）

### アラート
- 認証エラー
- APIレート制限
- データベース接続エラー
