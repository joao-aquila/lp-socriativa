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

Falta só o **portfólio**, e ele é alimentado pelo `/admin`: o upload manda a arte para `public/images/portfolio/<slug>.<ext>` e preenche o campo `image` sozinho. Sem `image`, o card mostra um placeholder tracejado do mesmo tamanho — nada quebra.

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

### Publicação e persistência

O conteúdo é o próprio repositório: `content/projects.json` para os dados e
`public/images/portfolio/` para as artes. A leitura (`readProjects`) é sempre do
disco — como toda publicação gera um deploy, o JSON já vem embutido no build e
nenhuma página faz chamada de rede.

A escrita depende do ambiente:

| Ambiente | O que acontece |
| --- | --- |
| Desenvolvimento (sem `GITHUB_TOKEN`) | grava direto no repositório local; você commita quando quiser |
| Produção | um commit na branch configurada, via Git Data API (`lib/github.ts`) |

O JSON e a imagem entram no **mesmo commit**, então cada publicação dispara um
único rebuild. O site reflete a mudança em cerca de 40 segundos.

Vantagem: nada para hospedar, nada que hiberne ou expire, e histórico completo do
que foi publicado — dá para reverter qualquer alteração pelo git.

**Token:** GitHub > Settings > Developer settings > Personal access tokens >
Fine-grained, com escopo restrito a este repositório e permissão
*Contents: Read and write*. Configure `GITHUB_TOKEN`, `GITHUB_REPO` e
`GITHUB_BRANCH` no ambiente de produção.

Se um dia o volume crescer a ponto do rebuild incomodar, só `readProjects` e
`writeProjects` mudam de lugar. Nenhum componente precisa saber.

## SEO

- Metadata API com title template, canonical, Open Graph e Twitter card.
- `app/opengraph-image.tsx` gera a imagem social 1200×630 dinamicamente.
- JSON-LD: `ProfessionalService`, `WebSite`, `FAQPage`, `CreativeWork` e `BreadcrumbList` (`lib/schema.ts`).
- `sitemap.xml` e `robots.txt` dinâmicos, incluindo cada projeto.
- Páginas de projeto pré-renderizadas (SSG) via `generateStaticParams`.
- HTML semântico, `lang="pt-BR"`, headings em ordem, alt em todas as mídias.

Antes de publicar: definir `NEXT_PUBLIC_SITE_URL` com o domínio real, registrar o site no Google Search Console (opcionalmente via `GOOGLE_SITE_VERIFICATION`) e enviar o sitemap.

Dados de contato (WhatsApp, e-mail, Instagram) ficam em `lib/site.ts` — o número atual é placeholder.
