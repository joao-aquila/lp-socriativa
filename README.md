# lp-socriativa

Landing page do estúdio criativo **Sô Criativa** — Next.js 16 (App Router), React 19, TypeScript e Tailwind v4, hospedada na Cloudflare (Workers via [OpenNext](https://opennext.js.org/cloudflare)).

## Rodando

```bash
npm install
cp .env.example .env.local          # ajuste as variáveis
cp .dev.vars.example .dev.vars      # overrides locais dos vars do Worker
npm run db:migrate:local            # cria o D1 local com os projetos iniciais
npm run dev                         # http://localhost:3000
```

No `next dev` os bindings `DB` (D1) e `BUCKET` (R2) são versões locais
(`.wrangler/state`), e o `/admin` abre sem login.

| Script | O quê |
| --- | --- |
| `dev` | Next em modo dev, com D1/R2 locais |
| `preview` | build do Worker + `wrangler dev` (runtime real, porta 8787) |
| `deploy` | build do Worker + deploy na Cloudflare |
| `db:migrate:local` / `db:migrate:remote` | aplica `migrations/` no D1 |
| `cf-typegen` | regenera `cloudflare-env.d.ts` após mudar o `wrangler.jsonc` |
| `typecheck` | `tsc --noEmit` |

## Imagens

Marca e mascote ficam no repositório, em `public/images` (logotipo e
mascotes) e `app/icon.png` / `app/apple-icon.png`.

As artes do **portfólio** ficam no bucket R2 `portfolio-images`, enviadas pelo
`/admin` com a chave `projects/<slug>-<id>.<ext>` (o sufixo muda a cada troca,
então o cache é eterno). Em produção elas saem por `https://img.socriativaestudio.com.br`
(domínio próprio do bucket: CDN e sem custo de saída). Sem `IMAGES_BASE_URL` — no
`next dev` — o app serve o R2 local em `/media/*`. Sem imagem, o card mostra um
placeholder tracejado do mesmo tamanho.

O `next/image` usa o binding `IMAGES` (Cloudflare Images) para redimensionar.

## Conteúdo do portfólio

Os projetos ficam na tabela `projects` do D1 (`portfolio-db`), lida por
`lib/projects.ts` a cada request — o que é salvo no painel aparece no site na
hora, sem rebuild. Schema em `migrations/0001_create_projects.sql`; os projetos
iniciais em `0002_seed_projects.sql`. Campos em `lib/types.ts`. Categorias:
`conteudo`, `identidade`, `design`. A ordem (`position`) é por categoria.

Mudança de schema = nova migration em `migrations/` e
`npm run db:migrate:remote`.

## Painel `/admin`

Cadastrar, editar, ocultar, excluir e reordenar projetos sem mexer em código.

- `/admin`: lista por categoria, com a chave "no ar" (oculta o projeto do site
  sem apagar), setas de ordem e o botão de novo projeto.
- `/admin/novo` e `/admin/<id>`: formulário. A exclusão fica no fim da edição.

- **Login:** Cloudflare Access (código de uso único por e-mail) na frente de
  `/admin`. Não há senha no app.
- **Defesa em profundidade:** a página e cada server action validam o JWT do
  cabeçalho `Cf-Access-Jwt-Assertion` (assinatura, `iss` do time e `aud` da
  aplicação) em `lib/access.ts`. Sem `CF_ACCESS_TEAM_DOMAIN`/`CF_ACCESS_AUD`
  configurados, o painel fica fechado — exceto no `next dev`.
  `ADMIN_EMAILS` (opcional, secret do Worker: `npx wrangler secret put ADMIN_EMAILS`)
  restringe ainda mais.
- `*.workers.dev` e as URLs de preview estão desligados no `wrangler.jsonc`:
  o Worker só responde pelo domínio próprio, que passa pelo Access.
- Upload valida o tipo pelos bytes do arquivo (jpg, png, webp, avif), até 6 MB.
- `/admin` é `noindex` e está no `Disallow` do `robots.txt`.

## Deploy (Cloudflare)

Uma vez só:

1. **DNS:** adicione `socriativaestudio.com.br` e `socriativaestudio.com` na
   Cloudflare (plano Free) e, na Hostinger, troque os nameservers de cada um
   para os que a Cloudflare indicar (o registro continua na Hostinger). Se
   houver DNSSEC ligado na Hostinger, desligue antes. Se usa e-mail da
   Hostinger, confira se os registros MX foram importados.
2. **Recursos** (o R2 exige cartão cadastrado, mesmo no plano grátis):
   ```bash
   npx wrangler login
   npx wrangler d1 create portfolio-db        # copie o database_id para o wrangler.jsonc
   npx wrangler r2 bucket create portfolio-images
   npm run db:migrate:remote
   ```
3. **Domínio das imagens:** R2 > `portfolio-images` > Settings > Custom Domains >
   `img.socriativaestudio.com.br`.
4. **Deploy:** `npm run deploy` (ou Workers Builds conectado ao GitHub, com
   build command `npx opennextjs-cloudflare build` e deploy command
   `npx opennextjs-cloudflare deploy`). Os `routes` do `wrangler.jsonc` criam os
   custom domains dos quatro endereços (com e sem `www`, `.com` e `.com.br`);
   o `worker.ts` redireciona (301) todos para `socriativaestudio.com.br`.
5. **Access:** Zero Trust > Access > Applications > Add > Self-hosted.
   Domínio `socriativaestudio.com.br`, paths `admin` e `admin/*`; policy *Allow* com
   *Emails* = o seu; login method *One-time PIN*. Depois copie:
   - a *Application Audience (AUD) Tag* para `CF_ACCESS_AUD`;
   - `https://<time>.cloudflareaccess.com` para `CF_ACCESS_TEAM_DOMAIN`

   (em `vars` no `wrangler.jsonc`) e faça o deploy de novo.
6. **Formulário de contato:** Email > Email Routing em `socriativaestudio.com.br`
   > *Enable* (ele cria os MX e o SPF; se o domínio já recebe e-mail em outro
   provedor, isso substitui os MX). Em *Destination addresses*, adicione
   `am.mellomantovani@gmail.com` e clique no link de verificação que chega no
   Gmail. O envio sai de `site@socriativaestudio.com.br` pelo binding `EMAIL`
   (`send_email` no `wrangler.jsonc`, travado nesse destino); no `next dev` o
   envio é simulado, nada chega de verdade.

   Anti-spam: campo honeypot + limite de 3 envios por IP por hora
   (`lib/rate-limit.ts`, tabela `contact_log` no D1, só com o hash do IP).
   O deploy não roda migrations: depois de criar uma nova em `migrations/`,
   rode `npm run db:migrate:remote`.

## SEO

- Metadata API com title template, canonical, Open Graph e Twitter card.
- `app/opengraph-image.tsx` gera a imagem social 1200×630 dinamicamente.
- JSON-LD: `ProfessionalService`, `WebSite`, `FAQPage`, `CreativeWork` e `BreadcrumbList` (`lib/schema.ts`).
- `sitemap.xml` e `robots.txt` dinâmicos, incluindo cada projeto.
- Páginas de projeto renderizadas a cada request a partir do D1 (publicação instantânea).
- HTML semântico, `lang="pt-BR"`, headings em ordem, alt em todas as mídias.

Antes de publicar: definir `NEXT_PUBLIC_SITE_URL` com o domínio real, registrar o site no Google Search Console (opcionalmente via `GOOGLE_SITE_VERIFICATION`) e enviar o sitemap.

Dados de contato (WhatsApp, e-mail, Instagram) ficam em `lib/site.ts` — o WhatsApp vai só com dígitos (DDI + DDD + número). O formulário envia para `site.email` (`app/contato.ts`).
