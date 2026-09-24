"use client";

import { useFormStatus } from "react-dom";
import { deleteProject } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-full border border-red-300/30 px-5 py-2.5 text-sm font-medium text-red-300 transition-colors hover:border-red-300/70 hover:bg-red-300/10 disabled:opacity-50"
    >
      {pending ? "excluindo…" : "excluir projeto"}
    </button>
  );
}

/** Exclusão apaga o projeto e a arte do bucket — confirma antes de disparar. */
export function DeleteButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        if (!confirm(`Excluir "${title}"? O projeto e a imagem serão apagados de vez.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Submit />
    </form>
  );
}
