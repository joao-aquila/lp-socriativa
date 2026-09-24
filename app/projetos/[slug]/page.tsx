import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MediaFrame } from "@/components/MediaFrame";
import { JsonLd } from "@/components/JsonLd";
import { getProject, categoryLabel } from "@/lib/projects";
import { breadcrumbSchema, projectSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

// lê do D1 a cada request: o que é publicado no painel aparece na hora
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "projeto não encontrado" };

  const title = `${project.title} — ${project.client}`;

  return {
    title,
    description: project.description,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.description,
      url: `/projetos/${project.slug}`,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  };
}

export default async function ProjetoPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          projectSchema(project),
          breadcrumbSchema([
            { name: "início", url: "/" },
            { name: "projetos", url: "/projetos" },
            { name: project.title, url: `/projetos/${project.slug}` },
          ]),
        ]}
      />
      <SiteHeader />

      <main className="container-lp py-10 md:py-14">
        <nav aria-label="Trilha de navegação" className="text-sm text-paper/60">
          <Link href="/" className="underline underline-offset-4">
            início
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/projetos" className="underline underline-offset-4">
            projetos
          </Link>
        </nav>

        <article className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
          <MediaFrame
            src={project.image ?? null}
            alt={`${project.title} — projeto para ${project.client}`}
            aspect={project.aspect}
            fallbackLabel="arte em breve"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="rounded-card"
          />

          <div>
            <p className="inline-flex rounded-full bg-paper px-4 py-1.5 text-sm font-bold text-ink">
              {categoryLabel[project.category]}
            </p>
            <h1 className="headline mt-5 text-4xl sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 text-xl text-paper/70">{project.client}</p>

            {project.description ? (
              <p className="mt-6 text-lg text-paper/85">{project.description}</p>
            ) : null}

            {project.href ? (
              <Link
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-paper px-6 py-3 font-bold text-ink"
              >
                ver publicação <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
