import Link from "next/link";
import { readProjects, categoryLabel } from "@/lib/projects";
import { publicAsset } from "@/lib/media";
import type { Project, ProjectCategory } from "@/lib/types";
import { ProjectForm } from "./ProjectForm";
import { DeleteButton } from "./DeleteButton";
import { logout } from "./actions";
import { card } from "./ui";

export const dynamic = "force-dynamic";

const ORDER: ProjectCategory[] = ["conteudo", "identidade", "design"];

function Thumb({ project }: { project: Project }) {
  const src = publicAsset(project.image);
  return (
    <div className="aspect-square w-14 shrink-0 overflow-hidden rounded-xl border border-paper/12 bg-night">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-[0.6rem] text-paper/30">
          sem
          <br />
          imagem
        </div>
      )}
    </div>
  );
}

function Row({ project }: { project: Project }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
      <Thumb project={project} />

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-bold">
          <span className="truncate">{project.title}</span>
          {project.featured ? (
            <span className="rounded-full border border-paper/25 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-paper/70">
              destaque
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 truncate text-sm text-paper/50">
          {project.client}
          {project.order ? ` · ordem ${project.order}` : ""}
          {project.href ? " · com link" : ""}
        </p>
      </div>

      {/* no mobile as ações caem para a linha de baixo, alinhadas sob o texto */}
      <div className="flex w-full items-center gap-4 pl-[4.5rem] text-sm sm:w-auto sm:pl-0">
        <Link
          href={`/projetos/${project.slug}`}
          target="_blank"
          className="text-paper/70 underline underline-offset-4 hover:text-paper"
        >
          ver
        </Link>
        <Link
          href={`/admin?editar=${project.slug}#formulario`}
          className="text-paper/70 underline underline-offset-4 hover:text-paper"
        >
          editar
        </Link>
        <DeleteButton slug={project.slug} title={project.title} />
      </div>
    </li>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string; publicado?: string }>;
}) {
  const { editar, publicado } = await searchParams;
  const projects = await readProjects();
  const editing = projects.find((p) => p.slug === editar);

  return (
    <main className="container-lp py-12 pb-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-4xl">portfólio</h1>
          <p className="mt-2 text-paper/55">
            {projects.length}{" "}
            {projects.length === 1 ? "projeto publicado" : "projetos publicados"}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-paper/60 underline underline-offset-4 hover:text-paper"
          >
            sair
          </button>
        </form>
      </header>

      {publicado ? (
        <p className="mt-8 rounded-xl border border-paper/25 bg-night-soft/60 px-4 py-3 text-sm text-paper/80">
          publicado. o site se atualiza sozinho em cerca de 40 segundos — atualize
          a página depois disso para ver a mudança no ar.
        </p>
      ) : null}

      <section id="formulario" className={`mt-10 scroll-mt-8 ${card}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-7">
          <h2 className="text-2xl font-bold">
            {editing ? `editando: ${editing.title}` : "novo projeto"}
          </h2>
          {editing ? (
            <Link
              href="/admin"
              className="text-sm text-paper/60 underline underline-offset-4 hover:text-paper"
            >
              criar um novo em vez disso
            </Link>
          ) : null}
        </div>

        <ProjectForm key={editing?.slug ?? "novo"} project={editing} />
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">projetos publicados</h2>

        {projects.length === 0 ? (
          <p className="mt-6 text-paper/50">
            nenhum projeto ainda. use o formulário acima para publicar o primeiro.
          </p>
        ) : (
          <div className="mt-8 grid gap-10">
            {ORDER.map((category) => {
              const group = projects.filter((p) => p.category === category);
              if (group.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-sm font-bold tracking-wide text-paper/45 uppercase">
                    {categoryLabel[category]} ({group.length})
                  </h3>
                  <ul className="mt-2 divide-y divide-paper/10">
                    {group.map((project) => (
                      <Row key={project.slug} project={project} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
