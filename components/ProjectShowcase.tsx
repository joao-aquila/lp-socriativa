import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import type { Project } from "@/lib/types";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  projects: Project[];
  ctaLabel: string;
  ctaHref: string;
  emptyLabel?: string;
  /** proporção única para todos os cards da grade */
  cardAspect?: Project["aspect"];
};

export function ProjectShowcase({
  id,
  title,
  subtitle,
  projects,
  ctaLabel,
  ctaHref,
  emptyLabel = "novos projetos chegando por aqui",
  cardAspect,
}: Props) {
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

      {projects.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 3) * 90}>
              <ProjectCard project={project} aspect={cardAspect} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-card border-2 border-dashed border-paper/25 p-10 text-center text-paper/50">
          {emptyLabel}
        </p>
      )}

      <Reveal className="mt-8 text-right">
        <Link
          href={ctaHref}
          className="text-lg font-medium underline decoration-2 underline-offset-4 transition hover:text-white md:text-xl"
        >
          {ctaLabel} <span aria-hidden="true">↗</span>
        </Link>
      </Reveal>
    </section>
  );
}
