"use client";

import { useOptimistic, useTransition } from "react";
import { toggleProjectActive } from "./actions";

/** Liga/desliga o projeto no site. Muda na hora; o servidor confirma depois. */
export function ActiveToggle({
  id,
  active,
  title,
}: {
  id: number;
  active: boolean;
  title: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(active);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !optimistic;
    const data = new FormData();
    data.set("id", String(id));
    data.set("active", next ? "1" : "0");
    startTransition(async () => {
      setOptimistic(next);
      await toggleProjectActive(data);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={`${optimistic ? "ocultar" : "mostrar"} "${title}" no site`}
      onClick={toggle}
      disabled={pending}
      className="group flex items-center gap-2.5 text-sm"
    >
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
          optimistic ? "border-paper bg-paper" : "border-paper/25 bg-transparent"
        }`}
      >
        <span
          className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200 ${
            optimistic ? "left-[1.4rem] bg-ink" : "left-1 bg-paper/50"
          }`}
        />
      </span>
      <span className={`w-12 text-left ${optimistic ? "text-paper/85" : "text-paper/45"}`}>
        {optimistic ? "no ar" : "oculto"}
      </span>
    </button>
  );
}
