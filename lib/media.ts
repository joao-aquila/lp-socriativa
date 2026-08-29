import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Retorna o caminho apenas se o arquivo existir em /public.
 * Assim a página nunca renderiza uma imagem quebrada enquanto as artes
 * definitivas (mascote, portfólio) não são adicionadas.
 */
export function publicAsset(src?: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  const clean = src.startsWith("/") ? src : `/${src}`;
  return existsSync(path.join(process.cwd(), "public", clean)) ? clean : null;
}
