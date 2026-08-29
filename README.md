# lp-socriativa

Landing page do estúdio criativo **Sô Criativa** — Next.js 15 (App Router), React 19, TypeScript e Tailwind v4.

## Rodando

```bash
cp .env.example .env.local   # ajuste as variáveis
npm run dev                  # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `typecheck`.

## Imagens

Marca e mascote já estão no repositório (recortados e redimensionados a partir das artes originais):

| O quê | Arquivo |
| --- | --- |
| Logotipo (variante clara, usada no fundo escuro) | `public/images/logo-horizontal-light.png` |
| Logotipo original (tinta escura, para fundos claros) | `public/images/logo-horizontal.png` |
| Mascote do hero | `public/images/mascote/selfie.png` |
| Mascote do processo | `public/images/mascote/notebook.png` |
| Mascote do CTA final | `public/images/mascote/microfone.png` |
| Favicon / ícone iOS | `app/icon.png`, `app/apple-icon.png` |

Falta só o **portfólio**: coloque as artes em `public/images/portfolio/` e aponte o caminho no campo `image` de cada projeto (pelo `/admin` ou direto no JSON). Sem `image`, o card mostra um placeholder tracejado do mesmo tamanho — nada quebra.

`lib/media.ts` checa se o arquivo existe em `/public` antes de renderizar; se existir, o `next/image` assume no lugar do placeholder.

## Conteúdo do portfólio

Os projetos ficam em `content/projects.json` e são lidos por `lib/projects.ts`.
Campos em `lib/types.ts`. Categorias: `conteudo`, `identidade`, `design`.

## Painel `/admin`

Painel logado para cadastrar, editar e excluir projetos do portfólio sem mexer em código.

- Login em `/admin/login` com `ADMIN_PASSWORD`.
- Sessão = cookie httpOnly assinado com HMAC (`ADMIN_SESSION_SECRET`), válida por 8h.
- `middleware.ts` bloqueia toda a rota `/admin`; as server actions revalidam a home, `/projetos` e o `sitemap.xml` a cada alteração.
- `/admin` é `noindex` e está no `Disallow` do `robots.txt`.

### Deploy e persistência

O armazenamento hoje é o JSON do repositório (`readProjects` / `writeProjects` em `lib/projects.ts`).
Isso funciona em servidor com disco persistente (VPS, Docker, Railway, Render).
**Em serverless (Vercel) o filesystem é somente leitura**: troque as duas funções por um banco — Vercel Postgres, Supabase, Turso — ou por um CMS. Nenhum componente precisa mudar.

O mesmo vale para upload de imagem: hoje o campo `image` recebe um caminho de `/public`. Para upload pelo painel, plugue Vercel Blob / S3 / Cloudinary no formulário.

## SEO

- Metadata API com title template, canonical, Open Graph e Twitter card.
- `app/opengraph-image.tsx` gera a imagem social 1200×630 dinamicamente.
- JSON-LD: `ProfessionalService`, `WebSite`, `FAQPage`, `CreativeWork` e `BreadcrumbList` (`lib/schema.ts`).
- `sitemap.xml` e `robots.txt` dinâmicos, incluindo cada projeto.
- Páginas de projeto pré-renderizadas (SSG) via `generateStaticParams`.
- HTML semântico, `lang="pt-BR"`, headings em ordem, alt em todas as mídias.

Antes de publicar: definir `NEXT_PUBLIC_SITE_URL` com o domínio real, registrar o site no Google Search Console (opcionalmente via `GOOGLE_SITE_VERIFICATION`) e enviar o sitemap.

Dados de contato (WhatsApp, e-mail, Instagram) ficam em `lib/site.ts` — o número atual é placeholder.
