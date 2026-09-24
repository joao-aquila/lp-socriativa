// Entrada do Worker: redireciona os domínios secundários antes de chegar no
// Next. (Os `redirects` do next.config com `has: host` não funcionam no OpenNext.)
// @ts-ignore gerado por `opennextjs-cloudflare build` (não existe num clone limpo)
import { default as handler } from "./.open-next/worker.js";

const CANONICAL_HOST = "socriativaestudio.com.br";
const ALIAS_HOSTS = new Set([
  "www.socriativaestudio.com.br",
  "socriativaestudio.com",
  "www.socriativaestudio.com",
]);

export default {
  fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (ALIAS_HOSTS.has(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return handler.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
