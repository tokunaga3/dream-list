# データベース暗号化のセットアップ

このアプリケーションは、ユーザーのスプレッドシートIDをAES-256-GCM暗号化方式で保護しています。

## 初回セットアップ

### 1. 暗号化キーの生成

```bash
npm run generate-key
```

出力例：
```
🔐 新しい暗号化キーを生成しました:

ENCRYPTION_KEY=26e59567c3b41f18d3e9fa907f8412d75cd83ceb40e7495d3bd888e581d08273
```

### 2. .envファイルに追加

生成されたキーを`.env`ファイルに追加：

```env
ENCRYPTION_KEY=26e59567c3b41f18d3e9fa907f8412d75cd83ceb40e7495d3bd888e581d08273
```

### 3. データベースの初期化またはマイグレーション

**新規セットアップの場合:**
```bash
npm run db:init
```

**既存データベースからの移行の場合:**
```bash
npm run db:migrate
```

マイグレーションでは以下が実行されます：
- 既存データのバックアップ
- `name`カラムの削除
- `spreadsheet_id`の暗号化

## 本番環境への展開

### Netlify環境変数の設定

1. Netlify Dashboard → Site configuration → Environment variables
2. 以下の環境変数を追加：
   - `ENCRYPTION_KEY`: 本番用の暗号化キー（開発環境とは異なるキーを使用）

**重要**: 本番環境では必ず異なる暗号化キーを生成してください！

```bash
# 本番用キーの生成
npm run generate-key
```

## セキュリティのベストプラクティス

### ✅ やるべきこと

- [ ] 開発環境と本番環境で異なる暗号化キーを使用
- [ ] 暗号化キーは`.env`ファイルに保存（Gitにコミットしない）
- [ ] 暗号化キーをバックアップ（安全な場所に）
- [ ] 定期的にキーをローテーション（オプション）

### ❌ やってはいけないこと

- ❌ 暗号化キーをGitにコミットしない
- ❌ 暗号化キーをコードにハードコードしない
- ❌ 暗号化キーを他人と共有しない
- ❌ 暗号化キーを公開しない

## トラブルシューティング

### エラー: ENCRYPTION_KEY環境変数が設定されていません

`.env`ファイルに`ENCRYPTION_KEY`が設定されているか確認してください。

```bash
# .envファイルの確認
cat .env | grep ENCRYPTION_KEY
```

### エラー: Invalid encrypted text format

データベース内の暗号化データが壊れている可能性があります。
マイグレーションを再実行するか、該当ユーザーのスプレッドシートIDを再設定してください。

### 暗号化キーを紛失した場合

暗号化キーを紛失すると、既存の暗号化データを復号できなくなります。

**対処法:**
1. 新しい暗号化キーを生成
2. ユーザーに再度スプレッドシートIDを設定してもらう
3. または、データベースの`spreadsheet_id`カラムをクリア

## 技術詳細

### 暗号化アルゴリズム

- **方式**: AES-256-GCM
- **キー長**: 256ビット（32バイト）
- **IV長**: 128ビット（16バイト、ランダム生成）
- **認証タグ**: 128ビット（16バイト）

### データ形式

暗号化されたデータは以下の形式で保存されます：

```
iv:authTag:encrypted
```

例：
```
a1b2c3d4e5f6g7h8:i9j0k1l2m3n4o5p6:q7r8s9t0u1v2w3x4...
```

### 実装ファイル

- 暗号化ライブラリ: `lib/crypto.ts`
- API エンドポイント: `app/api/user/spreadsheet/route.ts`
- マイグレーション: `scripts/migrate-db.ts`

## 参考リンク

- [Node.js Crypto documentation](https://nodejs.org/api/crypto.html)
- [AES-GCMについて](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
