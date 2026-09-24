"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProject } from "./actions";
import { MediaField } from "./MediaField";
import { buttonGhost, buttonPrimary, field, hint, label, panel, panelTitle } from "./ui";
import type { Project, ProjectCategory } from "@/lib/types";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "conteudo", label: "conteúdo" },
  { value: "identidade", label: "identidade visual" },
  { value: "design", label: "design" },
];

const DESCRIPTION_MAX = 1000;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`${panel} p-5 sm:p-7`}>
      <h2 className={panelTitle}>{title}</h2>
      <div className="mt-6 grid gap-6">{children}</div>
    </section>
  );
}

function Switch({
  name,
  defaultChecked,
  title,
  description,
}: {
  name: string;
  defaultChecked: boolean;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-paper/85">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-paper/45">{description}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-paper/25 transition-colors peer-checked:border-paper peer-checked:bg-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper [&>span]:left-1 [&>span]:bg-paper/50 peer-checked:[&>span]:left-[1.4rem] peer-checked:[&>span]:bg-ink"
      >
        <span className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200" />
      </span>
    </label>
  );
}

export function ProjectForm({
  project,
  defaultCategory = "conteudo",
}: {
  project?: Project;
  defaultCategory?: ProjectCategory;
}) {
  const [error, formAction, pending] = useActionState<string | null, FormData>(
    saveProject,
    null,
  );
  const [description, setDescription] = useState(project?.description ?? "");
  const backHref = `/admin?categoria=${project?.category ?? defaultCategory}`;

  return (
    <form action={formAction}>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="grid gap-5">
          <Panel title="sobre o projeto">
            <label className="block">
              <span className={label}>título</span>
              <input
                name="title"
                required
                maxLength={200}
                defaultValue={project?.title}
                placeholder="quem é a natália fora da versão psicóloga?"
                className={`${field} text-lg font-bold`}
              />
            </label>

            <label className="block">
              <span className={label}>cliente / nicho</span>
              <input
                name="client"
                required
                maxLength={120}
                defaultValue={project?.client}
                placeholder="psicologia"
                className={field}
              />
              <span className={hint}>aparece em destaque no card, acima do título.</span>
            </label>

            <fieldset>
              <legend className={label}>categoria</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((option) => (
                  <label
                    key={option.value}
                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-paper/60 ring-1 ring-paper/15 transition-colors hover:text-paper hover:ring-paper/40 has-checked:bg-paper has-checked:text-ink has-checked:ring-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-paper"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      defaultChecked={(project?.category ?? defaultCategory) === option.value}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {project ? (
                <span className={hint}>trocar de categoria leva o projeto para o fim da lista nova.</span>
              ) : null}
            </fieldset>

            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className={label}>descrição</span>
                <span
                  className={`text-xs tabular-nums ${
                    description.length > DESCRIPTION_MAX * 0.9 ? "text-paper/70" : "text-paper/30"
                  }`}
                >
                  {description.length}/{DESCRIPTION_MAX}
                </span>
              </span>
              <textarea
                name="description"
                rows={4}
                maxLength={DESCRIPTION_MAX}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="uma ou duas frases sobre o que foi feito."
                className={`${field} resize-y`}
              />
              <span className={hint}>usada na página do projeto e no Google.</span>
            </label>
          </Panel>

          <Panel title="link e endereço">
            <label className="block">
              <span className={label}>link externo</span>
              <input
                name="href"
                type="url"
                defaultValue={project?.href}
                placeholder="https://instagram.com/p/…"
                className={field}
              />
              <span className={hint}>post, perfil ou Behance. opcional.</span>
            </label>

            <label className="block">
              <span className={label}>endereço da página</span>
              <span className="mt-2 flex items-center overflow-hidden rounded-xl border border-paper/15 bg-ink/60 transition-colors focus-within:border-paper/70 hover:border-paper/30">
                <span className="shrink-0 pl-4 text-paper/35">/projetos/</span>
                <input
                  name="slug"
                  defaultValue={project?.slug}
                  placeholder="gerado a partir do título"
                  className="w-full bg-transparent py-3 pr-4 pl-0.5 text-paper outline-none placeholder:text-paper/30"
                />
              </span>
              {project ? (
                <span className={hint}>mudar depois de publicado quebra links antigos.</span>
              ) : null}
            </label>
          </Panel>
        </div>

        <div className="grid gap-5 lg:sticky lg:top-24">
          <Panel title="imagem">
            <MediaField current={project?.image} aspect={project?.aspect ?? "portrait"} />
          </Panel>

          <Panel title="visibilidade">
            <Switch
              name="active"
              defaultChecked={project?.active ?? true}
              title="no ar"
              description="desligado, o projeto some do site mas fica salvo aqui."
            />
            <Switch
              name="featured"
              defaultChecked={project?.featured ?? true}
              title="destaque na home"
              description="a home mostra até 3 destaques por categoria."
            />
          </Panel>
        </div>
      </div>

      {/* barra de ações fixa: salvar sempre à mão, mesmo no fim de um formulário longo */}
      <div className="sticky bottom-0 z-20 -mx-5 mt-8 border-t border-paper/8 bg-night/85 px-5 py-4 backdrop-blur-md md:mx-0 md:rounded-t-2xl md:border-x md:px-6">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {error ? (
            <p role="alert" className="mr-auto text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <Link href={backHref} className={buttonGhost}>
            cancelar
          </Link>
          <button type="submit" disabled={pending} className={buttonPrimary}>
            {pending ? "salvando…" : project ? "salvar alterações" : "publicar projeto"}
          </button>
        </div>
      </div>
    </form>
  );
}
