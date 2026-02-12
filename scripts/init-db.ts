import 'dotenv/config';
import { initDatabase } from "../lib/db";

async function setup() {
  try {
    console.log("データベースを初期化しています...");
    await initDatabase();
    console.log("✓ データベースの初期化が完了しました");
  } catch (error) {
    console.error("データベースの初期化に失敗しました:", error);
    process.exit(1);
  }
}

setup();
