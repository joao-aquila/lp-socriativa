"use client";

import { useRef, useState, useTransition } from "react";
import { sendContact, type ContactState } from "@/app/contato";

const field =
  "mt-1 w-full rounded-2xl border border-paper/25 bg-night-soft px-4 py-3 text-paper placeholder:text-paper/35 outline-none transition focus:border-paper disabled:opacity-60";

/**
 * O envio vira um e-mail para o estúdio (server action + Email Routing).
 * Campos controlados: se o envio falhar, o texto continua lá. Depois de um
 * envio certo, o formulário trava até recarregar a página (evita repetição).
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [idea, setIdea] = useState("");
  const [state, setState] = useState<ContactState>(null);
  const [pending, startTransition] = useTransition();
  const sent = state?.ok === true;
  // trava síncrona: o `disabled` só chega na próxima renderização, e cliques
  // em sequência rápida passariam antes dele
  const busy = useRef(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await sendContact(null, formData);
      setState(result);
      // só libera de novo se deu erro; enviado, fica travado até recarregar
      if (!result?.ok) busy.current = false;
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* desabilita campos e botão de uma vez */}
      <fieldset disabled={pending || sent} className="min-w-0">
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
          className="mt-6 w-full rounded-full bg-paper px-6 py-4 text-lg font-extrabold text-ink transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:text-xl"
        >
          {sent ? (
            <>
              mensagem enviada <span aria-hidden="true">✓</span>
            </>
          ) : pending ? (
            "enviando…"
          ) : (
            <>
              tire sua ideia do papel <span aria-hidden="true">↗</span>
            </>
          )}
        </button>
      </fieldset>

      {/* região viva: leitores de tela anunciam o resultado do envio */}
      <div role="status" aria-live="polite">
        {sent ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-paper/40 bg-night-soft px-4 py-3 text-left">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-paper text-sm font-extrabold text-ink"
            >
              ✓
            </span>
            <p className="text-sm text-paper">
              <strong className="font-bold">recebemos sua mensagem!</strong>{" "}
              a gente te responde em breve pelo contato que você deixou ✨
            </p>
          </div>
        ) : (
          <p className={`mt-3 text-center text-xs ${state ? "text-paper" : "text-paper/60"}`}>
            {state?.message ?? "sua mensagem chega direto no nosso e-mail."}
          </p>
        )}
      </div>
    </form>
  );
}
