import Link from "next/link";
import { readProjects, categoryLabel } from "@/lib/projects";
import { ProjectForm } from "./ProjectForm";
import { deleteProject, logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  const { editar } = await searchParams;
  const projects = await readProjects();
  const editing = projects.find((p) => p.slug === editar);

  return (
    <main className="container-lp py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="headline text-4xl">portfólio</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline underline-offset-4">
            sair
          </button>
        </form>
      </div>

      <section className="mt-10 rounded-card border border-paper/15 p-6">
        <h2 className="text-2xl font-bold">
          {editing ? `editando: ${editing.title}` : "novo projeto"}
        </h2>
        {editing ? (
          <Link href="/admin" className="text-sm underline underline-offset-4">
            cancelar edição
          </Link>
        ) : null}
        <div className="mt-6">
          <ProjectForm key={editing?.slug ?? "novo"} project={editing} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">
          projetos publicados ({projects.length})
        </h2>

        <ul className="mt-6 divide-y divide-paper/12">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-bold">{project.title}</p>
                <p className="text-sm text-paper/60">
                  {categoryLabel[project.category]} · {project.client} ·{" "}
                  {project.image ? "com imagem" : "sem imagem"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/projetos/${project.slug}`}
                  target="_blank"
                  className="underline underline-offset-4"
                >
                  ver
                </Link>
                <Link
                  href={`/admin?editar=${project.slug}`}
                  className="underline underline-offset-4"
                >
                  editar
                </Link>
                <form action={deleteProject}>
                  <input type="hidden" name="slug" value={project.slug} />
                  <button type="submit" className="text-red-300 underline underline-offset-4">
                    excluir
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
