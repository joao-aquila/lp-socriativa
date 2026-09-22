"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject } from "./actions";
import { ImageField } from "./ImageField";
import { buttonGhost, buttonPrimary, field, hint, label } from "./ui";
import type { Project } from "@/lib/types";

function Fieldset({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-paper/12 pt-7">
      <legend className="sr-only">{title}</legend>
      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <div>
          <h3 className="font-bold">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-paper/50">{description}</p>
          ) : null}
        </div>
        <div className="grid gap-5">{children}</div>
      </div>
    </fieldset>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const [error, formAction, pending] = useActionState<string | null, FormData>(
    saveProject,
    null,
  );

  return (
    <form action={formAction} className="grid gap-8">
      <input type="hidden" name="originalSlug" defaultValue={project?.slug ?? ""} />

      <Fieldset title="o projeto" description="o que aparece no card e na página.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={label}>título *</span>
            <input
              name="title"
              required
              defaultValue={project?.title}
              placeholder="quem é a natália fora da versão psicóloga?"
              className={field}
            />
          </label>

          <label className="block">
            <span className={label}>cliente / nicho *</span>
            <input
              name="client"
              required
              defaultValue={project?.client}
              placeholder="psicologia"
              className={field}
            />
            <span className={hint}>é o texto em destaque no card.</span>
          </label>
        </div>

        <label className="block">
          <span className={label}>categoria *</span>
          <select
            name="category"
            defaultValue={project?.category ?? "conteudo"}
            className={field}
          >
            <option value="conteudo">conteúdo</option>
            <option value="identidade">identidade visual</option>
            <option value="design">design</option>
          </select>
          <span className={hint}>define em qual seção de /projetos ele entra.</span>
        </label>

        <label className="block">
          <span className={label}>descrição</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={project?.description}
            placeholder="uma ou duas frases sobre o que foi feito."
            className={field}
          />
          <span className={hint}>usada na página do projeto e no Google.</span>
        </label>
      </Fieldset>

      <Fieldset title="imagem" description="a arte que ilustra o projeto.">
        <ImageField current={project?.image} />

        <label className="block sm:max-w-xs">
          <span className={label}>proporção no card</span>
          <select
            name="aspect"
            defaultValue={project?.aspect ?? "portrait"}
            className={field}
          >
            <option value="portrait">retrato (3:4)</option>
            <option value="landscape">paisagem (4:3)</option>
            <option value="square">quadrada</option>
          </select>
        </label>
      </Fieldset>

      <Fieldset title="exibição" description="onde e como ele aparece no site.">
        <label className="block">
          <span className={label}>link externo</span>
          <input
            name="href"
            type="url"
            defaultValue={project?.href}
            placeholder="https://instagram.com/p/…"
            className={field}
          />
          <span className={hint}>
            perfil, post ou projeto completo no Behance. deixe vazio se não houver.
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={label}>ordem</span>
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={project?.order ?? 0}
              className={field}
            />
            <span className={hint}>menor aparece primeiro.</span>
          </label>

          <label className="flex items-start gap-3 sm:mt-8">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? true}
              className="mt-0.5 size-5 shrink-0 accent-white"
            />
            <span>
              <span className="text-sm font-medium text-paper/85">
                destacar na home
              </span>
              <span className="mt-0.5 block text-xs text-paper/45">
                projetos destacados abrem a fileira da categoria.
              </span>
            </span>
          </label>
        </div>

        <label className="block sm:max-w-md">
          <span className={label}>slug</span>
          <input
            name="slug"
            defaultValue={project?.slug}
            placeholder="gerado a partir do título"
            className={field}
          />
          <span className={hint}>
            endereço da página: /projetos/<em>slug</em>. mudar depois de publicado
            quebra o link antigo.
          </span>
        </label>
      </Fieldset>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/35 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-paper/12 pt-6">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending
            ? "publicando…"
            : project
              ? "salvar alterações"
              : "publicar projeto"}
        </button>

        {project ? (
          <Link href="/admin" className={buttonGhost}>
            cancelar
          </Link>
        ) : null}

        <span className="text-sm text-paper/45">
          o site leva cerca de 40 segundos para atualizar.
        </span>
      </div>
    </form>
  );
}
