"use client";

import { useFormStatus } from "react-dom";
import { deleteProject } from "./actions";

function Submit({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-300 underline underline-offset-4 transition-colors hover:text-red-200 disabled:opacity-50"
    >
      {pending ? "excluindo…" : "excluir"}
    </button>
  );
}

/** Exclusão é irreversível pelo painel — confirma antes de disparar a action. */
export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        if (!confirm(`Excluir "${title}"? Essa ação não pode ser desfeita pelo painel.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <Submit title={title} />
    </form>
  );
}
