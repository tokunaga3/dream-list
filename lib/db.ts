import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error(
    "TURSO_DATABASE_URLとTURSO_AUTH_TOKENが設定されていません"
  );
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// データベースの初期化
export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      spreadsheet_id TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )
  `);
}
