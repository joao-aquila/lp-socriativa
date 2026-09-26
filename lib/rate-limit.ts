import "server-only";
import { headers } from "next/headers";
import { cf } from "./cloudflare";

/** Envios permitidos por IP dentro da janela. */
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RETENTION_MS = 24 * 60 * 60 * 1000;

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Registra uma tentativa de contato do IP atual e diz se ela passa do limite.
 * Toda tentativa conta, mesmo as bloqueadas — insistir não ajuda o robô.
 * O IP vem do `cf-connecting-ip` (no `next dev` não existe: vira "local").
 */
export async function contactAllowed() {
  const ip = (await headers()).get("cf-connecting-ip") ?? "local";
  const ipHash = await sha256(`contato:${ip}`);
  const now = Date.now();
  const db = cf().DB;

  const [, count] = await db.batch([
    db.prepare("DELETE FROM contact_log WHERE created_at < ?").bind(now - RETENTION_MS),
    db
      .prepare("SELECT COUNT(*) AS n FROM contact_log WHERE ip_hash = ? AND created_at >= ?")
      .bind(ipHash, now - WINDOW_MS),
    db.prepare("INSERT INTO contact_log (ip_hash, created_at) VALUES (?, ?)").bind(ipHash, now),
  ]);

  const previous = (count.results[0] as { n: number } | undefined)?.n ?? 0;
  return previous < LIMIT;
}
