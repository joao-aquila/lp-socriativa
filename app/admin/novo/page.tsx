import { getAdmin } from "@/lib/access";
import { CATEGORIES } from "@/lib/projects";
import type { ProjectCategory } from "@/lib/types";
import { Denied } from "../Denied";
import { FormHeader } from "../FormHeader";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  if (!(await getAdmin())) return <Denied />;

  const { categoria } = await searchParams;
  const category = CATEGORIES.includes(categoria as ProjectCategory)
    ? (categoria as ProjectCategory)
    : "conteudo";

  return (
    <main className="container-lp py-10 sm:py-14">
      <FormHeader backHref={`/admin?categoria=${category}`} eyebrow="adicionar ao portfólio" title="novo projeto" />
      <ProjectForm defaultCategory={category} />
    </main>
  );
}
