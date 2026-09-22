"use client";

import { useEffect, useRef, useState } from "react";
import { field, hint, label } from "./ui";

/**
 * Envio da imagem do projeto: arquivo com pré-visualização imediata, e um
 * campo de URL para quando a arte já está hospedada em outro lugar.
 */
export function ImageField({ current }: { current?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [url, setUrl] = useState(current ?? "");

  // libera o object URL do preview ao trocar de arquivo ou desmontar
  useEffect(() => {
    if (!preview?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(file?: File) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploaded(file.name);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(url || null);
    setUploaded(null);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-start">
      <div className="aspect-3/4 w-32 overflow-hidden rounded-2xl border border-paper/15 bg-night sm:w-full">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center px-3 text-center text-xs text-paper/35">
            sem imagem
          </div>
        )}
      </div>

      <div>
        <span className={label}>imagem do projeto</span>

        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-xl border border-paper/20 px-4 py-2.5 text-sm font-medium transition-colors hover:border-paper/45">
            escolher arquivo
            <input
              ref={inputRef}
              type="file"
              name="imageFile"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              onChange={(event) => pick(event.target.files?.[0])}
            />
          </label>

          {uploaded ? (
            <>
              <span className="max-w-[14rem] truncate text-sm text-paper/70">
                {uploaded}
              </span>
              <button
                type="button"
                onClick={clear}
                className="text-sm text-paper/50 underline underline-offset-4 hover:text-paper"
              >
                remover
              </button>
            </>
          ) : null}
        </div>

        <p className={hint}>jpg, png, webp ou avif — até 6 MB</p>

        <label className="mt-5 block">
          <span className="text-sm text-paper/55">ou usar uma URL externa</span>
          <input
            name="image"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              if (!uploaded) setPreview(event.target.value || null);
            }}
            placeholder="https://…"
            className={field}
          />
          <span className={hint}>
            se você escolher um arquivo acima, ele tem prioridade sobre a URL.
          </span>
        </label>
      </div>
    </div>
  );
}
