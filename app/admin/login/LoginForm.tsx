"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [error, formAction, pending] = useActionState<string | null, FormData>(
    login,
    null,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      <label className="block">
        <span className="text-sm text-paper/70">senha</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-paper/25 bg-night-soft px-4 py-3 text-paper outline-none focus:border-paper"
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-paper px-4 py-3 font-bold text-ink disabled:opacity-60"
      >
        {pending ? "entrando…" : "entrar"}
      </button>
    </form>
  );
}
