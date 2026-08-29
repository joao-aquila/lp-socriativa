"use client";

import { useActionState } from "react";
import { saveProject } from "./actions";
import type { Project } from "@/lib/types";

const field =
  "mt-1 w-full rounded-xl border border-paper/25 bg-night-soft px-4 py-2.5 text-paper outline-none focus:border-paper";

export function ProjectForm({ project }: { project?: Project }) {
  const [error, formAction, pending] = useActionState<string | null, FormData>(
    saveProject,
    null,
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="originalSlug" defaultValue={project?.slug ?? ""} />

      <label className="block">
        <span className="text-sm text-paper/70">título *</span>
        <input name="title" required defaultValue={project?.title} className={field} />
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">cliente / nicho *</span>
        <input name="client" required defaultValue={project?.client} className={field} />
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">categoria *</span>
        <select name="category" defaultValue={project?.category ?? "conteudo"} className={field}>
          <option value="conteudo">conteúdo</option>
          <option value="identidade">identidade visual</option>
          <option value="design">design</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">slug (opcional)</span>
        <input name="slug" defaultValue={project?.slug} className={field} placeholder="gerado do título" />
      </label>

      <label className="block sm:col-span-2">
        <span className="text-sm text-paper/70">
          imagem — caminho em /public (ex.: /images/portfolio/glauco.jpg)
        </span>
        <input name="image" defaultValue={project?.image} className={field} />
      </label>

      <label className="block sm:col-span-2">
        <span className="text-sm text-paper/70">descrição (usada no SEO)</span>
        <textarea name="description" rows={3} defaultValue={project?.description} className={field} />
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">link externo</span>
        <input name="href" type="url" defaultValue={project?.href} className={field} />
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">proporção</span>
        <select name="aspect" defaultValue={project?.aspect ?? "portrait"} className={field}>
          <option value="portrait">retrato (3:4)</option>
          <option value="landscape">paisagem (4:3)</option>
          <option value="square">quadrada</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-paper/70">ordem</span>
        <input name="order" type="number" min={0} defaultValue={project?.order ?? 0} className={field} />
      </label>

      <label className="flex items-center gap-3 self-end">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? true}
          className="size-5 accent-white"
        />
        <span className="text-sm text-paper/80">destacar na home</span>
      </label>

      {error ? (
        <p role="alert" className="sm:col-span-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-paper px-6 py-3 font-bold text-ink disabled:opacity-60"
        >
          {pending ? "salvando…" : project ? "salvar alterações" : "adicionar projeto"}
        </button>
      </div>
    </form>
  );
}
