import "server-only";
import { cache } from "react";
import { cf } from "./cloudflare";
import { imageUrl } from "./images";
import type { Project, ProjectAspect, ProjectCategory } from "./types";

/**
 * Camada de acesso aos projetos (D1). Leitura a cada request — a publicação
 * pelo painel aparece no site na hora, sem rebuild.
 */

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string | null;
  image_key: string | null;
  aspect: ProjectAspect;
  link: string | null;
  position: number;
  featured: number;
  active: number;
  published_at: string | null;
};

export type ProjectInput = {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string | null;
  imageKey: string | null;
  aspect: ProjectAspect;
  href: string | null;
  featured: boolean;
  active: boolean;
  publishedAt: string | null;
};

const COLUMNS =
  "id, slug, title, client, category, description, image_key, aspect, link, position, featured, active, published_at";

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    category: row.category,
    description: row.description ?? undefined,
    imageKey: row.image_key ?? undefined,
    image: row.image_key ? imageUrl(row.image_key) : undefined,
    aspect: row.aspect,
    href: row.link ?? undefined,
    position: row.position,
    featured: row.featured === 1,
    active: row.active === 1,
    publishedAt: row.published_at ?? undefined,
  };
}

function db() {
  return cf().DB;
}

/** Projetos visíveis no site. Uma consulta por request. */
export const readProjects = cache(async (): Promise<Project[]> => {
  const { results } = await db()
    .prepare(`SELECT ${COLUMNS} FROM projects WHERE active = 1 ORDER BY category, position, id`)
    .all<ProjectRow>();
  return results.map(toProject);
});

/** Todos os projetos, inclusive os ocultos — só para o painel. */
export async function readAllProjects(): Promise<Project[]> {
  const { results } = await db()
    .prepare(`SELECT ${COLUMNS} FROM projects ORDER BY category, position, id`)
    .all<ProjectRow>();
  return results.map(toProject);
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

export const getProject = cache(async (slug: string) => {
  const row = await db()
    .prepare(`SELECT ${COLUMNS} FROM projects WHERE slug = ? AND active = 1`)
    .bind(slug)
    .first<ProjectRow>();
  return row ? toProject(row) : null;
});

export async function getProjectById(id: number) {
  const row = await db()
    .prepare(`SELECT ${COLUMNS} FROM projects WHERE id = ?`)
    .bind(id)
    .first<ProjectRow>();
  return row ? toProject(row) : null;
}

export async function slugTaken(slug: string, exceptId?: number) {
  const row = await db()
    .prepare("SELECT id FROM projects WHERE slug = ? AND id IS NOT ?")
    .bind(slug, exceptId ?? null)
    .first();
  return row !== null;
}

/** Novo projeto entra no fim da categoria. */
export async function insertProject(input: ProjectInput) {
  await db()
    .prepare(
      `INSERT INTO projects
         (slug, title, client, category, description, image_key, aspect, link, featured, published_at, active, position)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11,
         (SELECT COALESCE(MAX(position), 0) + 1 FROM projects WHERE category = ?4))`,
    )
    .bind(...values(input))
    .run();
}

/** Trocar de categoria manda o projeto para o fim da categoria nova. */
export async function updateProject(id: number, input: ProjectInput) {
  await db()
    .prepare(
      `UPDATE projects SET
         slug = ?1, title = ?2, client = ?3, description = ?5, image_key = ?6,
         aspect = ?7, link = ?8, featured = ?9, published_at = ?10, active = ?11,
         position = CASE WHEN category = ?4 THEN position
           ELSE (SELECT COALESCE(MAX(position), 0) + 1 FROM projects WHERE category = ?4) END,
         category = ?4,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?12`,
    )
    .bind(...values(input), id)
    .run();
}

export async function setProjectActive(id: number, active: boolean) {
  await db()
    .prepare(
      "UPDATE projects SET active = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
    .bind(active ? 1 : 0, id)
    .run();
}

export async function deleteProjectRow(id: number) {
  await db().prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
}

/**
 * Sobe ou desce um projeto dentro da categoria. Renumera a categoria inteira
 * (1, 2, 3…) numa única transação, o que também desfaz empates antigos.
 */
export async function moveProject(id: number, direction: "up" | "down") {
  const target = await getProjectById(id);
  if (!target) return;

  const { results } = await db()
    .prepare("SELECT id FROM projects WHERE category = ? ORDER BY position, id")
    .bind(target.category)
    .all<{ id: number }>();

  const ids = results.map((r) => r.id);
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];

  const statement = db().prepare(
    "UPDATE projects SET position = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
  );
  await db().batch(ids.map((projectId, index) => statement.bind(index + 1, projectId)));
}

function values(input: ProjectInput) {
  return [
    input.slug,
    input.title,
    input.client,
    input.category,
    input.description,
    input.imageKey,
    input.aspect,
    input.href,
    input.featured ? 1 : 0,
    input.publishedAt,
    input.active ? 1 : 0,
  ] as const;
}

export const categoryLabel: Record<ProjectCategory, string> = {
  conteudo: "conteúdo",
  identidade: "identidade",
  design: "design",
};

export const CATEGORIES = Object.keys(categoryLabel) as ProjectCategory[];
