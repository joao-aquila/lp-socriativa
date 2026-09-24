import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import type { Project } from "@/lib/types";

type Row = {
  /** rótulo acessível da fileira — não aparece na tela */
  label: string;
  projects: Project[];
  ctaLabel: string;
  ctaHref: string;
  cardAspect?: Project["aspect"];
  emptyLabel?: string;
};

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  rows: Row[];
};

export function ProjectShowcase({ id, title, subtitle, rows }: Props) {
  return (
    <section
      id={id}
      aria-labelledby="projetos-title"
      className="container-lp scroll-mt-24 py-10 md:py-14"
    >
      <Reveal className="text-center">
        <h2 id="projetos-title" className="headline text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-lg text-paper/80 md:text-xl">{subtitle}</p>
        ) : null}
      </Reveal>

      {rows.map((row) => (
        <div key={row.label} className="mt-10">
          {row.projects.length ? (
            <ul aria-label={row.label} className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {row.projects.map((project, index) => (
                <Reveal as="li" key={project.slug} delay={(index % 3) * 90} className="flex">
                  <ProjectCard project={project} aspect={row.cardAspect} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="rounded-card border-2 border-dashed border-paper/25 p-10 text-center text-paper/50">
              {row.emptyLabel ?? "novos projetos chegando por aqui"}
            </p>
          )}

          <Reveal className="mt-5 text-right">
            <Link
              href={row.ctaHref}
              className="text-lg font-medium underline decoration-2 underline-offset-4 transition hover:text-white md:text-xl"
            >
              {row.ctaLabel} <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      ))}
    </section>
  );
}
