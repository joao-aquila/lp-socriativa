"use client";

import { useState, useTransition } from "react";
import { sendContact, type ContactState } from "@/app/contato";

const field =
  "mt-1 w-full rounded-2xl border border-paper/25 bg-night-soft px-4 py-3 text-paper placeholder:text-paper/35 outline-none transition focus:border-paper";

/**
 * O envio vira um e-mail para o estúdio (server action + Email Routing).
 * Campos controlados: se o envio falhar, o texto continua lá.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [idea, setIdea] = useState("");
  const [state, setState] = useState<ContactState>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await sendContact(null, formData);
      setState(result);
      if (result?.ok) {
        setName("");
        setContact("");
        setIdea("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* honeypot: fora da tela e do teclado; gente de verdade não preenche */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <label className="block">
        <span className="text-sm text-paper/70">seu nome</span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          required
          autoComplete="name"
          placeholder="como te chamam?"
          className={field}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-paper/70">e-mail ou whatsapp</span>
        <input
          name="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={200}
          required
          placeholder="pra gente te responder"
          className={field}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-paper/70">o que a gente cria?</span>
        <textarea
          name="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          maxLength={4000}
          rows={3}
          placeholder="pode ser uma ideia pronta, meio pronta ou um “não sei por onde começar”"
          className={field}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-paper px-6 py-4 text-lg font-extrabold text-ink transition hover:bg-white disabled:opacity-60 md:text-xl"
      >
        {pending ? "enviando…" : "tire sua ideia do papel"} <span aria-hidden="true">↗</span>
      </button>

      <p
        role="status"
        className={`mt-3 text-center text-xs ${state && !state.ok ? "text-paper" : "text-paper/45"}`}
      >
        {state?.message ?? "sua mensagem chega direto no nosso e-mail."}
      </p>
    </form>
  );
}
