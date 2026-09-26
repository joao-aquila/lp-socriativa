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

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

function ShowcaseHeading({ title, subtitle }: Pick<Props, "title" | "subtitle">) {
  return (
    <Reveal className="text-center">
      <h2 id="projetos-title" className="headline text-4xl sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-lg text-paper/80 md:text-xl">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}

/**
 * Placeholder enquanto os projetos vêm do banco: mesma grade e proporções dos
 * cards, para a página não pular quando eles chegarem.
 */
export function ProjectShowcaseSkeleton({
  id,
  title,
  subtitle,
  aspects,
}: Omit<Props, "rows"> & { aspects: Project["aspect"][] }) {
  return (
    <section
      id={id}
      aria-labelledby="projetos-title"
      aria-busy="true"
      className="container-lp scroll-mt-24 py-10 md:py-14"
    >
      <ShowcaseHeading title={title} subtitle={subtitle} />

      {aspects.map((aspect, row) => (
        <div key={row} className="mt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-card bg-ink">
                <div className={`${aspectClass[aspect ?? "portrait"]} animate-pulse bg-night-soft`} />
                <div className="h-[7.125rem]" />
              </div>
            ))}
          </div>
          <div className="mt-5 h-7" />
        </div>
      ))}
    </section>
  );
}

export function ProjectShowcase({ id, title, subtitle, rows }: Props) {
  return (
    <section
      id={id}
      aria-labelledby="projetos-title"
      className="container-lp scroll-mt-24 py-10 md:py-14"
    >
      <ShowcaseHeading title={title} subtitle={subtitle} />

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
            <p className="rounded-card border-2 border-dashed border-paper/25 p-10 text-center text-paper/60">
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
