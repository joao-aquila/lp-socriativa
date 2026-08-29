"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/site";

const field =
  "mt-1 w-full rounded-2xl border border-paper/25 bg-night-soft px-4 py-3 text-paper placeholder:text-paper/35 outline-none transition focus:border-paper";

/**
 * O envio abre o WhatsApp do estúdio com a mensagem já montada — não há
 * backend de e-mail configurado. Para receber por e-mail, troque o handler
 * por uma server action que chame o provedor escolhido.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [idea, setIdea] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      `oi! sou ${name || "alguém que veio pelo site"}.`,
      idea && `a ideia é: ${idea}`,
      contact && `meu contato: ${contact}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="block">
        <span className="text-sm text-paper/70">seu nome</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="como te chamam?"
          className={field}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-paper/70">e-mail ou whatsapp</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          placeholder="pra gente te responder"
          className={field}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-paper/70">o que a gente cria?</span>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          placeholder="pode ser uma ideia pronta, meio pronta ou um “não sei por onde começar”"
          className={field}
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-paper px-6 py-4 text-lg font-extrabold text-ink transition hover:bg-white md:text-xl"
      >
        tire sua ideia do papel <span aria-hidden="true">↗</span>
      </button>

      <p className="mt-3 text-center text-xs text-paper/45">
        abre uma conversa no whatsapp com o que você escreveu.
      </p>
    </form>
  );
}
