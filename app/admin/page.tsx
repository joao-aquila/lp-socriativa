import { Suspense } from "react";
import Link from "next/link";
import { getAdmin } from "@/lib/access";
import { readAllProjects, CATEGORIES } from "@/lib/projects";
import type { Project, ProjectCategory } from "@/lib/types";
import { ActiveToggle } from "./ActiveToggle";
import { Denied } from "./Denied";
import { MoveButtons } from "./MoveButtons";
import { Toast } from "./Toast";
import { buttonPrimary, buttonSmall } from "./ui";

export const dynamic = "force-dynamic";

const tabLabel: Record<ProjectCategory, string> = {
  conteudo: "conteúdo",
  identidade: "identidade visual",
  design: "design",
};

function Thumb({ project }: { project: Project }) {
  return (
    <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-ink ring-1 ring-paper/10 sm:size-16">
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-paper/20">
          <span aria-hidden="true" className="text-lg">
            ✳
          </span>
        </div>
      )}
    </div>
  );
}

function Row({
  project,
  first,
  last,
}: {
  project: Project;
  first: boolean;
  last: boolean;
}) {
  return (
    <li
      className={`grid grid-cols-[auto_auto_1fr] items-center gap-x-3 gap-y-3 px-3 py-3 transition-colors hover:bg-paper/[0.03] sm:grid-cols-[auto_auto_1fr_auto_auto] sm:gap-x-5 sm:px-4 ${
        project.active ? "" : "text-paper/60"
      }`}
    >
      <MoveButtons id={project.id} first={first} last={last} />

      <div className={project.active ? "" : "opacity-45 grayscale"}>
        <Thumb project={project} />
      </div>

      <div className="min-w-0">
        <p className="truncate font-bold">{project.title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper/50">
          <span className="truncate">{project.client}</span>
          {project.featured ? (
            <span className="rounded-full bg-paper/10 px-2 py-px text-[0.7rem] font-medium text-paper/75">
              destaque
            </span>
          ) : null}
          {project.image ? null : (
            <span className="text-[0.7rem] text-paper/40">sem imagem</span>
          )}
        </p>
      </div>

      {/* no mobile, controles descem para uma segunda linha alinhada ao texto */}
      <div className="col-span-3 flex items-center justify-between gap-4 pl-[5.75rem] sm:col-span-2 sm:justify-end sm:gap-6 sm:pl-0">
        <ActiveToggle id={project.id} active={project.active} title={project.title} />
        <Link href={`/admin/${project.id}`} className={buttonSmall}>
          editar
        </Link>
      </div>
    </li>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  if (!(await getAdmin())) return <Denied />;

  const { categoria } = await searchParams;
  const current = CATEGORIES.includes(categoria as ProjectCategory)
    ? (categoria as ProjectCategory)
    : "conteudo";

  const projects = await readAllProjects();
  const list = projects.filter((p) => p.category === current);
  const hidden = projects.filter((p) => !p.active).length;

  return (
    <main className="container-lp max-w-5xl! py-10 pb-28 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="headline text-5xl sm:text-6xl">projetos</h1>
          <p className="mt-3 text-paper/50">
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
            {hidden ? ` · ${hidden} ${hidden === 1 ? "oculto" : "ocultos"}` : ""}
          </p>
        </div>

        <Link href={`/admin/novo?categoria=${current}`} className={buttonPrimary}>
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          novo projeto
        </Link>
      </div>

      <nav
        aria-label="categorias"
        className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0"
      >
        {CATEGORIES.map((category) => {
          const count = projects.filter((p) => p.category === category).length;
          const selected = category === current;
          return (
            <Link
              key={category}
              href={`/admin?categoria=${category}`}
              scroll={false}
              aria-current={selected ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "bg-paper text-ink"
                  : "text-paper/60 ring-1 ring-paper/15 hover:text-paper hover:ring-paper/35"
              }`}
            >
              {tabLabel[category]}
              <span className={selected ? "text-ink/55" : "text-paper/35"}>{count}</span>
            </Link>
          );
        })}
      </nav>

      {list.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-card border-2 border-dashed border-paper/12 px-6 py-16 text-center">
          <span aria-hidden="true" className="text-3xl text-paper/25">
            ✳
          </span>
          <p className="mt-4 text-paper/60">
            nenhum projeto de {tabLabel[current]} ainda.
          </p>
          <Link href={`/admin/novo?categoria=${current}`} className={`${buttonSmall} mt-6`}>
            adicionar o primeiro
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-paper/8 overflow-hidden rounded-card border border-paper/10 bg-night-soft/30">
            {list.map((project, index) => (
              <Row
                key={project.id}
                project={project}
                first={index === 0}
                last={index === list.length - 1}
              />
            ))}
          </ul>
          <p className="mt-4 text-sm text-paper/40">
            a ordem da lista é a ordem do site. a home mostra os 3 primeiros
            destaques que estão no ar.
          </p>
        </>
      )}

      <Suspense>
        <Toast />
      </Suspense>
    </main>
  );
}
