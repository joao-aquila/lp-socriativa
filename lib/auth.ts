/**
 * Sessão do admin: cookie assinado com HMAC-SHA256 (Web Crypto), compatível
 * com o runtime do middleware e com o runtime Node das server actions.
 */
export const SESSION_COOKIE = "so_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h

const encoder = new TextEncoder();

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET não configurado");
  return value;
}

async function key() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionValue() {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const signature = toHex(
    await crypto.subtle.sign("HMAC", await key(), encoder.encode(String(expiresAt))),
  );
  return { value: `${expiresAt}.${signature}`, maxAge: MAX_AGE_SECONDS };
}

export async function isValidSession(value?: string | null) {
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;

  const expected = toHex(
    await crypto.subtle.sign("HMAC", await key(), encoder.encode(expiresAt)),
  );
  if (expected.length !== signature.length) return false;

  // comparação em tempo constante
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
