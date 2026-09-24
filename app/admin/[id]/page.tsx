import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/access";
import { getProjectById } from "@/lib/projects";
import { DeleteButton } from "../DeleteButton";
import { Denied } from "../Denied";
import { FormHeader } from "../FormHeader";
import { ProjectForm } from "../ProjectForm";
import { buttonSmall, panel } from "../ui";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getAdmin())) return <Denied />;

  const id = Number((await params).id);
  const project = Number.isInteger(id) && id > 0 ? await getProjectById(id) : null;
  if (!project) notFound();

  return (
    <main className="container-lp py-10 sm:py-14">
      <FormHeader
        backHref={`/admin?categoria=${project.category}`}
        eyebrow={project.active ? "editando · no ar" : "editando · oculto"}
        title={project.title}
      >
        {project.active ? (
          <Link href={`/projetos/${project.slug}`} target="_blank" className={buttonSmall}>
            ver no site <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </FormHeader>

      <ProjectForm key={project.id} project={project} />

      <section className={`${panel} mt-12 flex flex-wrap items-center justify-between gap-4 border-red-300/15 p-5 sm:p-7`}>
        <div>
          <h2 className="font-bold">excluir projeto</h2>
          <p className="mt-1 text-sm text-paper/50">
            apaga o projeto e a imagem de vez. para só tirar do site, desligue
            &ldquo;no ar&rdquo;.
          </p>
        </div>
        <DeleteButton id={project.id} title={project.title} />
      </section>
    </main>
  );
}
