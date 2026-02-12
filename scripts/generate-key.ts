import crypto from "crypto";

/**
 * AES-256-GCM用の暗号化キーを生成します
 */
function generateEncryptionKey(): string {
  const key = crypto.randomBytes(32); // 256ビット = 32バイト
  return key.toString("hex");
}

console.log("🔐 新しい暗号化キーを生成しました:\n");
console.log("ENCRYPTION_KEY=" + generateEncryptionKey());
console.log("\n⚠️  このキーを.envファイルに追加してください");
console.log("⚠️  このキーは絶対に公開しないでください");
console.log("⚠️  本番環境とは異なるキーを使用してください");
