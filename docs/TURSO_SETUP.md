# Turso データベースセットアップガイド

このアプリケーションは Turso (libSQL) を使用してユーザーのスプレッドシートIDを保存します。

## 🚀 Turso のセットアップ

### 1. Turso CLI のインストール

**macOS/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm get.tur.so/windows | iex
```

### 2. Turso にログイン

```bash
turso auth signup
# または既にアカウントがある場合
turso auth login
```

### 3. データベースの作成

```bash
turso db create dream-list
```

### 4. 認証情報の取得

データベースURLを取得:
```bash
turso db show dream-list --url
```

出力例:
```
libsql://dream-list-your-username.turso.io
```

認証トークンを作成:
```bash
turso db tokens create dream-list
```

出力例:
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 5. 環境変数の設定

`.env` ファイルに以下を追加:

```env
TURSO_DATABASE_URL=libsql://dream-list-your-username.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 6. データベースの初期化

```bash
npm run db:init
```

成功すると以下のメッセージが表示されます:
```
データベースを初期化しています...
✓ データベースの初期化が完了しました
```

## 🔧 本番環境 (Netlify) での設定

### 1. Netlify の環境変数を設定

Netlify Dashboard → Site configuration → Environment variables

以下を追加:
- `TURSO_DATABASE_URL`: データベースのURL
- `TURSO_AUTH_TOKEN`: 認証トークン

### 2. デプロイ

```bash
git add .
git commit -m "Add Turso database integration"
git push
```

## 📊 データベーススキーマ

```sql
CREATE TABLE users (
  email TEXT PRIMARY KEY,         -- メールアドレス（プライマリキー）
  name TEXT,                      -- ユーザー名
  spreadsheet_id TEXT,            -- Google SheetsのID
  created_at INTEGER,             -- 作成日時 (Unix timestamp)
  updated_at INTEGER              -- 更新日時 (Unix timestamp)
);
```

### スキーマのマイグレーション

既存のデータベースがある場合は、以下のコマンドでマイグレーションしてください：

```bash
npm run db:migrate
```

このコマンドは：
1. 既存データをバックアップ
2. 古いテーブルを削除
3. 新しいスキーマでテーブルを作成
4. データを復元

**注意**: マイグレーション前に重要なデータがある場合は、必ずバックアップを取ってください。

## 🔍 データベースの確認

Turso Shell でデータを確認:

```bash
turso db shell dream-list
```

SQLコマンド例:
```sql
-- すべてのユーザーを表示
SELECT * FROM users;

-- 特定のユーザーを検索
SELECT * FROM users WHERE email = 'your-email@gmail.com';

-- ユーザー数を確認
SELECT COUNT(*) FROM users;
```

## 🗑️ データベースの削除（必要な場合）

```bash
turso db destroy dream-list
```

## 💡 よくある質問

### Q: Turso は無料で使えますか？
A: はい。無料プランで以下が利用可能:
- 3個のデータベース
- 月間9GB転送量
- 500MBストレージ

### Q: データはどこに保存されますか？
A: Turso はエッジネットワーク上に分散保存されます。日本からのアクセスも高速です。

### Q: SQLite と互換性がありますか？
A: はい。Turso は libSQL (SQLite のフォーク) を使用しているため、SQLite の機能がほぼすべて使えます。

## 🔗 参考リンク

- [Turso 公式サイト](https://turso.tech/)
- [Turso ドキュメント](https://docs.turso.tech/)
- [libSQL GitHub](https://github.com/tursodatabase/libsql)
