"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionValue,
  isValidSession,
} from "@/lib/auth";
import { readProjects, writeProjects } from "@/lib/projects";
import type { Project, ProjectCategory } from "@/lib/types";

const CATEGORIES: ProjectCategory[] = ["conteudo", "identidade", "design"];

async function requireSession() {
  const store = await cookies();
  if (!(await isValidSession(store.get(SESSION_COOKIE)?.value))) {
    redirect("/admin/login");
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}

export async function login(_state: string | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return "senha incorreta";

  const { value, maxAge } = await createSessionValue();
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  const redirectTo = String(formData.get("redirect") ?? "/admin");
  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveProject(_state: string | null, formData: FormData) {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ProjectCategory;

  if (!title || !client) return "título e cliente são obrigatórios";
  if (!CATEGORIES.includes(category)) return "categoria inválida";

  const originalSlug = String(formData.get("originalSlug") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return "não consegui gerar um slug a partir do título";

  const projects = await readProjects();
  const duplicated = projects.some(
    (p) => p.slug === slug && p.slug !== originalSlug,
  );
  if (duplicated) return "já existe um projeto com esse slug";

  const project: Project = {
    slug,
    title,
    client,
    category,
    image: String(formData.get("image") ?? "").trim() || undefined,
    aspect:
      (String(formData.get("aspect") ?? "portrait") as Project["aspect"]) ??
      "portrait",
    description: String(formData.get("description") ?? "").trim() || undefined,
    href: String(formData.get("href") ?? "").trim() || undefined,
    order: Number(formData.get("order") ?? 0) || undefined,
    featured: formData.get("featured") === "on",
    publishedAt:
      String(formData.get("publishedAt") ?? "").trim() ||
      new Date().toISOString().slice(0, 10),
  };

  const next = originalSlug
    ? projects.map((p) => (p.slug === originalSlug ? project : p))
    : [...projects, project];

  await writeProjects(next);
  refresh();
  redirect("/admin");
}

export async function deleteProject(formData: FormData) {
  await requireSession();
  const slug = String(formData.get("slug") ?? "");
  const projects = await readProjects();
  await writeProjects(projects.filter((p) => p.slug !== slug));
  refresh();
  redirect("/admin");
}
