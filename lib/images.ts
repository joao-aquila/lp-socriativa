import "server-only";
import { cf } from "./cloudflare";

/** Prefixo de todas as artes do portfólio dentro do bucket. */
export const IMAGE_PREFIX = "projects/";
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/**
 * URL pública de um objeto do R2. Em produção é o domínio próprio do bucket
 * (img.socriativaestudio.com.br, com CDN e sem custo de saída); sem ele — no
 * `next dev`, com o R2 local — o próprio app serve o arquivo em /media/*.
 */
export function imageUrl(key: string) {
  const base = cf().IMAGES_BASE_URL?.replace(/\/$/, "");
  return base ? `${base}/${key}` : `/media/${key}`;
}

const signatures: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    type: "image/png",
    ext: "png",
    test: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  },
  { type: "image/webp", ext: "webp", test: (b) => ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP" },
  {
    type: "image/avif",
    ext: "avif",
    test: (b) => ascii(b, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(b, 8, 12)),
  },
];

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}

/**
 * Tipo real da imagem pelos primeiros bytes — o `type` que o navegador manda
 * é só a extensão do arquivo e não prova nada.
 */
export function sniffImage(bytes: Uint8Array) {
  return signatures.find((s) => s.test(bytes)) ?? null;
}

export async function putImage(slug: string, file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) throw new ImageError("formato de imagem inválido — use jpg, png, webp ou avif");
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new ImageError("imagem muito grande — o limite é 6 MB");

  // sufixo aleatório: a URL muda a cada troca, então o cache pode ser eterno
  const key = `${IMAGE_PREFIX}${slug}-${crypto.randomUUID().slice(0, 8)}.${kind.ext}`;
  await cf().BUCKET.put(key, bytes, {
    httpMetadata: {
      contentType: kind.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  return key;
}

export async function deleteImage(key?: string | null) {
  if (!key?.startsWith(IMAGE_PREFIX)) return;
  try {
    await cf().BUCKET.delete(key);
  } catch (error) {
    // arquivo órfão no bucket não quebra nada; o projeto já foi salvo
    console.error("falha ao apagar imagem do R2", key, error);
  }
}

export class ImageError extends Error {}
