"use server";

import { cf } from "@/lib/cloudflare";
import { contactAllowed } from "@/lib/rate-limit";
import { site } from "@/lib/site";

// remetente num endereço do domínio (Email Routing); o destino fica preso ao
// binding EMAIL no wrangler.jsonc
const SENDER = "site@socriativaestudio.com.br";

export type ContactState = { ok: boolean; message: string } | null;

function text(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function sendContact(_state: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: campo invisível que só robô preenche — finge sucesso e descarta
  if (text(formData, "website", 200)) return { ok: true, message: "mensagem enviada!" };

  const name = text(formData, "name", 120);
  const contact = text(formData, "contact", 200);
  const idea = text(formData, "idea", 4000);
  if (!name || !contact) return { ok: false, message: "preencha seu nome e um contato" };

  // se o D1 falhar, deixa passar: melhor um spam que perder um cliente
  const allowed = await contactAllowed().catch((error) => {
    console.error("falha no limite de contato", error);
    return true;
  });
  if (!allowed) {
    return { ok: false, message: "muitas mensagens em pouco tempo — tente de novo daqui a pouco ou chame no whatsapp" };
  }

  try {
    await cf().EMAIL.send({
      from: { name: `${site.name} (site)`, email: SENDER },
      to: site.email,
      // "responder" no Gmail já vai direto para quem escreveu
      replyTo: isEmail(contact) ? contact : undefined,
      subject: `novo contato pelo site: ${name}`,
      text: [`nome: ${name}`, `contato: ${contact}`, "", "ideia:", idea || "(não escreveu)"].join("\n"),
    });
  } catch (error) {
    console.error("falha ao enviar contato", error);
    return { ok: false, message: "não deu para enviar agora — tente de novo ou chame no whatsapp" };
  }

  return { ok: true, message: "mensagem enviada! a gente te responde em breve ✨" };
}
