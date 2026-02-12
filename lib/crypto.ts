import crypto from "crypto";

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY環境変数が設定されていません");
}

// 暗号化キーは32バイト（256ビット）である必要があります
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    `ENCRYPTION_KEYは64文字の16進数文字列である必要があります（現在: ${process.env.ENCRYPTION_KEY.length}文字）`
  );
}

const ALGORITHM = "aes-256-gcm";

/**
 * 文字列を暗号化します
 * @param text 暗号化するテキスト
 * @returns 暗号化されたテキスト（iv:authTag:encrypted の形式）
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // iv:authTag:encrypted の形式で保存
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * 暗号化された文字列を復号化します
 * @param encryptedText 暗号化されたテキスト（iv:authTag:encrypted の形式）
 * @returns 復号化されたテキスト
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
