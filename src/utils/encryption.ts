import crypto from "crypto";

// Encriptação AES-256-GCM para guardar passwords das contas da empresa.
// Usar só no servidor (rotas da API).
const ALGORITHM = "aes-256-gcm";

const getKey = () => {
  const secret = process.env.ACCOUNTS_SECRET || process.env.JWT_SECREAT;
  if (!secret) throw new Error("ACCOUNTS_SECRET não está definido");
  return crypto.createHash("sha256").update(secret).digest();
};

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((b) => b.toString("base64")).join(":");
};

export const decrypt = (payload: string) => {
  const [iv, tag, encrypted] = payload.split(":").map((p) => Buffer.from(p, "base64"));
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
};
