import 'dotenv/config';
import { db } from "../lib/db";

async function migrate() {
  try {
    console.log("データベースをマイグレーションしています...");

    // 既存のusersテーブルをバックアップ
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users
    `);
    console.log("✓ 既存データをバックアップしました");

    // 既存のusersテーブルを削除
    await db.execute(`DROP TABLE IF EXISTS users`);
    console.log("✓ 既存のusersテーブルを削除しました");

    // 新しいスキーマでusersテーブルを作成
    await db.execute(`
      CREATE TABLE users (
        email TEXT PRIMARY KEY,
        name TEXT,
        spreadsheet_id TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      )
    `);
    console.log("✓ 新しいスキーマでusersテーブルを作成しました");

    // バックアップから データを復元（idカラムを除外）
    await db.execute(`
      INSERT INTO users (email, name, spreadsheet_id, created_at, updated_at)
      SELECT email, name, spreadsheet_id, created_at, updated_at
      FROM users_backup
    `);
    console.log("✓ データを復元しました");

    // バックアップテーブルを削除
    await db.execute(`DROP TABLE users_backup`);
    console.log("✓ バックアップテーブルを削除しました");

    console.log("✓ マイグレーションが完了しました");
  } catch (error) {
    console.error("マイグレーションに失敗しました:", error);
    console.log("\nバックアップテーブル (users_backup) が存在する場合は手動で確認してください");
    process.exit(1);
  }
}

migrate();
