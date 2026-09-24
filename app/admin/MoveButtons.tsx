"use client";

import { useFormStatus } from "react-dom";
import { reorderProject } from "./actions";

function Arrow({
  direction,
  disabled,
}: {
  direction: "up" | "down";
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="direction"
      value={direction}
      disabled={disabled || pending}
      aria-label={direction === "up" ? "mover para cima" : "mover para baixo"}
      className="flex h-6 w-7 items-center justify-center rounded-md text-paper/45 transition-colors hover:bg-paper/10 hover:text-paper disabled:pointer-events-none disabled:opacity-20"
    >
      <svg aria-hidden="true" viewBox="0 0 12 12" className={`size-3 ${direction === "down" ? "rotate-180" : ""}`}>
        <path d="M6 2.5 10 7.5H2Z" fill="currentColor" />
      </svg>
    </button>
  );
}

/** Ordem dentro da categoria: é a mesma ordem das fileiras no site. */
export function MoveButtons({
  id,
  first,
  last,
}: {
  id: number;
  first: boolean;
  last: boolean;
}) {
  return (
    <form action={reorderProject} className="flex flex-col">
      <input type="hidden" name="id" value={id} />
      <Arrow direction="up" disabled={first} />
      <Arrow direction="down" disabled={last} />
    </form>
  );
}
