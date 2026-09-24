import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Bindings e vars do Worker (wrangler.jsonc). No `next dev`, versões locais. */
export function cf(): CloudflareEnv {
  return getCloudflareContext().env;
}
