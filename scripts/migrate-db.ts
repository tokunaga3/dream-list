import 'dotenv/config';
import { db } from "../lib/db";
import { encrypt } from "../lib/crypto";

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

    // 新しいスキーマでusersテーブルを作成（nameカラムを削除）
    await db.execute(`
      CREATE TABLE users (
        email TEXT PRIMARY KEY,
        spreadsheet_id TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      )
    `);
    console.log("✓ 新しいスキーマでusersテーブルを作成しました");

    // バックアップからデータを復元（nameカラムを除外し、spreadsheet_idを暗号化）
    const backupData = await db.execute(`
      SELECT email, spreadsheet_id, created_at, updated_at
      FROM users_backup
    `);

    for (const row of backupData.rows) {
      const email = row.email as string;
      const spreadsheetId = row.spreadsheet_id as string | null;
      const createdAt = row.created_at as number;
      const updatedAt = row.updated_at as number;

      // spreadsheet_idが存在する場合は暗号化
      const encryptedId = spreadsheetId ? encrypt(spreadsheetId) : null;

      await db.execute({
        sql: `
          INSERT INTO users (email, spreadsheet_id, created_at, updated_at)
          VALUES (?, ?, ?, ?)
        `,
        args: [email, encryptedId, createdAt, updatedAt],
      });
    }

    console.log(`✓ ${backupData.rows.length}件のデータを復元しました（spreadsheet_idは暗号化済み）`);

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
