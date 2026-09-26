import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { getProjectsByCategory, categoryLabel } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema";
import type { ProjectCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "projetos",
  description:
    "Portfólio da Sô Criativa: conteúdos, identidades visuais e peças de design criadas para marcas pessoais.",
  alternates: { canonical: "/projetos" },
};

export const dynamic = "force-dynamic";

const sections: { category: ProjectCategory; title: string }[] = [
  { category: "conteudo", title: "conteúdos entregues" },
  { category: "identidade", title: "identidades visuais" },
  { category: "design", title: "design e materiais digitais" },
];

export default async function ProjetosPage() {
  const grouped = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      projects: await getProjectsByCategory(section.category),
    })),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "início", url: "/" },
          { name: "projetos", url: "/projetos" },
        ])}
      />
      <SiteHeader />

      <main className="container-lp py-10 md:py-14">
        <h1 className="headline text-5xl sm:text-6xl lg:text-7xl">
          projetos entregues
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-paper/80 md:text-xl">
          um pouquinho do que já saiu daqui — conteúdo, identidade visual e
          design para quem é a própria marca.
        </p>

        {grouped.map((section) => (
          <section
            key={section.category}
            id={section.category}
            aria-labelledby={`${section.category}-heading`}
            className="scroll-mt-24 pt-10"
          >
            <h2
              id={`${section.category}-heading`}
              className="headline text-3xl sm:text-4xl"
            >
              {section.title}
            </h2>

            {section.projects.length ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-card border-2 border-dashed border-paper/25 p-8 text-paper/60">
                nenhum projeto de {categoryLabel[section.category]} publicado
                ainda.
              </p>
            )}
          </section>
        ))}

        <p className="mt-16">
          <Link
            href="/#contato"
            className="text-lg underline decoration-2 underline-offset-4"
          >
            bora criar o seu? <span aria-hidden="true">↗</span>
          </Link>
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
