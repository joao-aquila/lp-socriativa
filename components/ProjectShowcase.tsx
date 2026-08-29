import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import type { Project, ProjectCategory } from "@/lib/types";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  projects: Project[];
  ctaLabel: string;
  category: ProjectCategory;
  emptyLabel?: string;
};

export function ProjectShowcase({
  id,
  title,
  subtitle,
  projects,
  ctaLabel,
  category,
  emptyLabel = "novos projetos chegando por aqui",
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${category}-title`}
      className="container-lp scroll-mt-24 py-16 md:py-24"
    >
      <div className="text-center">
        <h2
          id={`${category}-title`}
          className="headline text-4xl sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-lg text-paper/80 md:text-xl">{subtitle}</p>
        ) : null}
      </div>

      {projects.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-card border-2 border-dashed border-paper/25 p-10 text-center text-paper/50">
          {emptyLabel}
        </p>
      )}

      <div className="mt-8 text-right">
        <Link
          href={`/projetos#${category}`}
          className="text-lg font-medium underline decoration-2 underline-offset-4 transition hover:text-white md:text-xl"
        >
          {ctaLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
