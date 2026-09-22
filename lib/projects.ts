import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Project, ProjectCategory } from "./types";
import { commitFiles, isGitHubConfigured, type CommitFile } from "./github";

const DATA_PATH = "content/projects.json";
const DATA_FILE = path.join(process.cwd(), DATA_PATH);

/**
 * Camada de acesso aos projetos.
 *
 * Leitura: sempre do arquivo no disco. Como cada publicação é um commit que
 * dispara um novo deploy, o JSON já vem embutido no build — nenhuma chamada de
 * rede por pageview.
 *
 * Escrita: commit no GitHub em produção; disco em desenvolvimento.
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

/**
 * Publica a lista de projetos. `extraFiles` viaja no mesmo commit — é assim que
 * a imagem enviada pelo painel entra junto, sem gerar um segundo rebuild.
 */
export async function writeProjects(
  projects: Project[],
  { files = [], message = "chore: atualiza portfólio" }: {
    files?: CommitFile[];
    message?: string;
  } = {},
): Promise<void> {
  const json = `${JSON.stringify(projects, null, 2)}\n`;

  if (isGitHubConfigured()) {
    await commitFiles(
      [{ path: DATA_PATH, content: json, encoding: "utf-8" }, ...files],
      message,
    );
    return;
  }

  // desenvolvimento: grava direto no repositório local
  await fs.writeFile(DATA_FILE, json, "utf8");
  for (const file of files) {
    const target = path.join(/*turbopackIgnore: true*/ process.cwd(), file.path);
    if ("delete" in file) {
      await fs.rm(target, { force: true });
      continue;
    }
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(
      target,
      file.encoding === "base64" ? Buffer.from(file.content, "base64") : file.content,
    );
  }
}

export async function getProjectsByCategory(category: ProjectCategory) {
  return (await readProjects()).filter((p) => p.category === category);
}

/** Destaques de uma categoria, para as fileiras da home. */
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
