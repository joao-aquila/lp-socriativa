"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectAspect } from "@/lib/types";
import { hint } from "./ui";

const aspects: { value: ProjectAspect; label: string; className: string }[] = [
  { value: "portrait", label: "retrato", className: "aspect-3/4" },
  { value: "landscape", label: "paisagem", className: "aspect-4/3" },
  { value: "square", label: "quadrada", className: "aspect-square" },
];

/**
 * Arte do projeto + proporção do card. A prévia já usa a proporção escolhida,
 * então dá para ver o corte antes de salvar. O arquivo vai para o R2 no save.
 */
export function MediaField({
  current,
  aspect: initialAspect,
}: {
  current?: string;
  aspect: ProjectAspect;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [removeCurrent, setRemoveCurrent] = useState(false);
  const [aspect, setAspect] = useState(initialAspect);
  const [dragging, setDragging] = useState(false);

  // libera o object URL do preview ao trocar de arquivo ou desmontar
  useEffect(() => {
    if (!preview?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(file?: File) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setRemoveCurrent(false);
  }

  function undo() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(current ?? null);
    setFileName(null);
  }

  const showing = removeCurrent && !fileName ? null : preview;
  const frame = aspects.find((a) => a.value === aspect)?.className ?? "aspect-3/4";

  return (
    <div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (!file || !inputRef.current) return;
          const transfer = new DataTransfer();
          transfer.items.add(file);
          inputRef.current.files = transfer.files;
          pick(file);
        }}
        className={`group relative mx-auto block w-full cursor-pointer overflow-hidden rounded-2xl bg-ink transition-[aspect-ratio,box-shadow] duration-300 ${frame} ${
          dragging ? "ring-2 ring-paper" : "ring-1 ring-paper/12 hover:ring-paper/35"
        }`}
      >
        {showing ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showing} alt="" className="size-full object-cover" />
            <span className="absolute inset-x-3 bottom-3 rounded-full bg-ink/85 px-3 py-1.5 text-center text-xs font-medium text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              trocar imagem
            </span>
          </>
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-2 border-2 border-dashed border-transparent p-4 text-center">
            <span aria-hidden="true" className="text-2xl text-paper/30">
              ↑
            </span>
            <span className="text-sm font-medium text-paper/70">
              escolher ou arrastar
            </span>
            <span className="text-xs text-paper/35">jpg, png, webp, avif · até 6 MB</span>
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          name="imageFile"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => pick(event.target.files?.[0])}
        />
      </label>

      {fileName ? (
        <p className="mt-3 flex items-center justify-between gap-3 text-xs text-paper/55">
          <span className="truncate">{fileName}</span>
          <button
            type="button"
            onClick={undo}
            className="shrink-0 underline underline-offset-4 hover:text-paper"
          >
            desfazer
          </button>
        </p>
      ) : current ? (
        <label className="mt-3 flex items-center gap-2 text-xs text-paper/55">
          <input
            type="checkbox"
            name="removeImage"
            checked={removeCurrent}
            onChange={(event) => setRemoveCurrent(event.target.checked)}
            className="size-3.5 accent-white"
          />
          remover imagem atual
        </label>
      ) : null}

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-paper/80">proporção no card</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-ink/60 p-1 ring-1 ring-paper/10">
          {aspects.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-full py-1.5 text-center text-xs font-medium text-paper/55 transition-colors hover:text-paper has-checked:bg-paper has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-paper"
            >
              <input
                type="radio"
                name="aspect"
                value={option.value}
                checked={aspect === option.value}
                onChange={() => setAspect(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <span className={hint}>é assim que ela aparece no card do site.</span>
      </fieldset>
    </div>
  );
}
