import { cf } from "@/lib/cloudflare";
import { IMAGE_PREFIX } from "@/lib/images";

/**
 * Serve artes do R2 pelo próprio app. Só existe sem domínio próprio do bucket
 * (IMAGES_BASE_URL vazio) — no `next dev`, com o R2 local. Em produção as
 * imagens saem do CDN e esta rota não gasta requests do Worker.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const env = cf();
  if (env.IMAGES_BASE_URL) return new Response("not found", { status: 404 });

  const key = (await params).key.join("/");
  if (!key.startsWith(IMAGE_PREFIX)) return new Response("not found", { status: 404 });

  const object = await env.BUCKET.get(key, {
    onlyIf: request.headers,
  });
  if (!object) return new Response("not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("x-content-type-options", "nosniff");

  // `onlyIf` casou (If-None-Match): objeto sem corpo
  if (!("body" in object)) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
}
