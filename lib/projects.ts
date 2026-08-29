import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Project, ProjectCategory } from "./types";

const DATA_FILE = path.join(process.cwd(), "content", "projects.json");

/**
 * Camada de acesso aos projetos. Hoje lê/escreve um JSON no repositório —
 * troque as duas funções abaixo por um banco (Postgres, Supabase, Sanity…)
 * sem tocar em nenhum componente.
 */
export async function readProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Project[];
    return parsed.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } catch {
    return [];
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

export async function getProjectsByCategory(category: ProjectCategory) {
  return (await readProjects()).filter((p) => p.category === category);
}

export async function getFeatured(category: ProjectCategory, limit = 3) {
  const all = await getProjectsByCategory(category);
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(slug: string) {
  return (await readProjects()).find((p) => p.slug === slug) ?? null;
}

export const categoryLabel: Record<ProjectCategory, string> = {
  conteudo: "conteúdo",
  identidade: "identidade",
  design: "design",
};
