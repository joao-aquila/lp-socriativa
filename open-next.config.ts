import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// As páginas que dependem do portfólio são dinâmicas (leem do D1 a cada
// request), então não há ISR e nenhum cache incremental para configurar.
export default defineCloudflareConfig();
