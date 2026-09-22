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
import type { CommitFile } from "@/lib/github";
import type { Project, ProjectCategory } from "@/lib/types";

const CATEGORIES: ProjectCategory[] = ["conteudo", "identidade", "design"];

/** Onde as imagens do portfólio moram dentro do repositório. */
const IMAGE_DIR = "images/portfolio";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

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

/** Caminho gerenciado pelo painel (o que podemos apagar com segurança). */
function isManagedImage(src?: string) {
  return Boolean(src?.startsWith(`/${IMAGE_DIR}/`));
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

  const previous = projects.find((p) => p.slug === originalSlug);
  const files: CommitFile[] = [];

  // imagem enviada pelo painel vence o campo de texto (que aceita URL externa)
  let image = String(formData.get("image") ?? "").trim() || undefined;
  const upload = formData.get("imageFile");

  if (upload instanceof File && upload.size > 0) {
    const extension = IMAGE_TYPES[upload.type];
    if (!extension) return "formato de imagem inválido — use jpg, png, webp ou avif";
    if (upload.size > MAX_IMAGE_BYTES) return "imagem muito grande — o limite é 6 MB";

    const target = `${IMAGE_DIR}/${slug}.${extension}`;
    files.push({
      path: `public/${target}`,
      content: Buffer.from(await upload.arrayBuffer()).toString("base64"),
      encoding: "base64",
    });
    image = `/${target}`;
  }

  // a imagem antiga vira lixo quando é substituída ou quando o slug muda
  if (isManagedImage(previous?.image) && previous?.image !== image) {
    files.push({ path: `public${previous!.image}`, delete: true });
  }

  const project: Project = {
    slug,
    title,
    client,
    category,
    image,
    aspect:
      (String(formData.get("aspect") ?? "portrait") as Project["aspect"]) ??
      "portrait",
    description: String(formData.get("description") ?? "").trim() || undefined,
    href: String(formData.get("href") ?? "").trim() || undefined,
    order: Number(formData.get("order") ?? 0) || undefined,
    featured: formData.get("featured") === "on",
    publishedAt:
      String(formData.get("publishedAt") ?? "").trim() ||
      previous?.publishedAt ||
      new Date().toISOString().slice(0, 10),
  };

  const next = originalSlug
    ? projects.map((p) => (p.slug === originalSlug ? project : p))
    : [...projects, project];

  try {
    await writeProjects(next, {
      files,
      message: `content: ${originalSlug ? "atualiza" : "adiciona"} projeto "${title}"`,
    });
  } catch (error) {
    console.error(error);
    return "não consegui publicar agora. tente de novo em alguns segundos.";
  }

  refresh();
  redirect("/admin?publicado=1");
}

export async function deleteProject(formData: FormData) {
  await requireSession();

  const slug = String(formData.get("slug") ?? "");
  const projects = await readProjects();
  const target = projects.find((p) => p.slug === slug);
  if (!target) redirect("/admin");

  const files: CommitFile[] = isManagedImage(target.image)
    ? [{ path: `public${target.image}`, delete: true }]
    : [];

  await writeProjects(
    projects.filter((p) => p.slug !== slug),
    { files, message: `content: remove projeto "${target.title}"` },
  );

  refresh();
  redirect("/admin?publicado=1");
}
