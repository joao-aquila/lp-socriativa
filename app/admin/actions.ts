"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdmin, requireAdmin } from "@/lib/access";
import { ImageError, deleteImage, putImage } from "@/lib/images";
import {
  CATEGORIES,
  deleteProjectRow,
  getProjectById,
  insertProject,
  moveProject,
  setProjectActive,
  slugTaken,
  updateProject,
  type ProjectInput,
} from "@/lib/projects";
import type { ProjectAspect, ProjectCategory } from "@/lib/types";

const ASPECTS: ProjectAspect[] = ["portrait", "landscape", "square"];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optionalId(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveProject(_state: string | null, formData: FormData) {
  if (!(await getAdmin())) return "sua sessão expirou — recarregue a página para entrar de novo";

  const id = optionalId(formData);
  const title = text(formData, "title");
  const client = text(formData, "client");
  const category = text(formData, "category") as ProjectCategory;
  const aspect = text(formData, "aspect") as ProjectAspect;
  const description = text(formData, "description");
  const href = text(formData, "href");

  if (!title || !client) return "título e cliente são obrigatórios";
  if (title.length > 200 || client.length > 120) return "título ou cliente longo demais";
  if (description.length > 1000) return "a descrição passa de 1000 caracteres";
  if (!CATEGORIES.includes(category)) return "categoria inválida";
  if (!ASPECTS.includes(aspect)) return "proporção inválida";
  if (href && !isHttpUrl(href)) return "o link externo precisa começar com https://";

  const slug = slugify(text(formData, "slug") || title);
  if (!slug) return "não consegui gerar um slug a partir do título";
  if (await slugTaken(slug, id ?? undefined)) return "já existe um projeto com esse slug";

  const previous = id ? await getProjectById(id) : null;
  if (id && !previous) return "esse projeto não existe mais — recarregue a página";

  let imageKey = formData.get("removeImage") === "on" ? null : (previous?.imageKey ?? null);
  let uploadedKey: string | null = null;

  const upload = formData.get("imageFile");
  if (upload instanceof File && upload.size > 0) {
    try {
      uploadedKey = await putImage(slug, upload);
      imageKey = uploadedKey;
    } catch (error) {
      if (error instanceof ImageError) return error.message;
      console.error(error);
      return "não consegui enviar a imagem. tente de novo em alguns segundos.";
    }
  }

  const input: ProjectInput = {
    slug,
    title,
    client,
    category,
    aspect,
    description: description || null,
    href: href || null,
    imageKey,
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    publishedAt: previous?.publishedAt ?? new Date().toISOString().slice(0, 10),
  };

  try {
    if (previous) await updateProject(previous.id, input);
    else await insertProject(input);
  } catch (error) {
    // o projeto não foi salvo: a imagem recém-enviada ficaria órfã
    await deleteImage(uploadedKey);
    console.error(error);
    return String(error).includes("UNIQUE")
      ? "já existe um projeto com esse slug"
      : "não consegui salvar agora. tente de novo em alguns segundos.";
  }

  // só depois de salvo: a arte antiga deixa de ser referenciada
  if (previous?.imageKey && previous.imageKey !== imageKey) {
    await deleteImage(previous.imageKey);
  }

  refresh();
  redirect(`/admin?categoria=${category}&ok=${previous ? "salvo" : "criado"}`);
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = optionalId(formData);
  const target = id ? await getProjectById(id) : null;
  if (!target) redirect("/admin");

  await deleteProjectRow(target.id);
  await deleteImage(target.imageKey);

  refresh();
  redirect(`/admin?categoria=${target.category}&ok=removido`);
}

export async function reorderProject(formData: FormData) {
  await requireAdmin();

  const id = optionalId(formData);
  const direction = formData.get("direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  await moveProject(id, direction);
  refresh();
}

export async function toggleProjectActive(formData: FormData) {
  await requireAdmin();

  const id = optionalId(formData);
  if (!id) return;

  await setProjectActive(id, formData.get("active") === "1");
  refresh();
}
