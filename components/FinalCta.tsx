import Link from "next/link";
import { Mascot } from "./Mascot";
import { whatsappUrl } from "@/lib/site";

export function FinalCta() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="container-lp scroll-mt-24 py-20 md:py-28"
    >
      <div className="text-center">
        <h2
          id="contato-title"
          className="headline text-4xl sm:text-5xl lg:text-6xl"
        >
          e agora, o que a gente cria?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-paper/85 md:text-xl">
          <strong className="font-bold">me conta!</strong> pode ser uma ideia
          pronta, meio pronta ou um “não sei por onde começar”.
        </p>
      </div>

      <div className="mt-12 grid items-end gap-8 md:grid-cols-[1fr_auto]">
        <Mascot
          file="microfone.png"
          alt="Mascote da Sô Criativa segurando um microfone boom em frente a uma câmera"
          className="aspect-[4/3] w-full max-w-xl"
        />

        <Link
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-center rounded-card bg-paper px-8 py-6 text-2xl font-extrabold leading-tight text-ink transition hover:bg-white md:justify-self-end md:text-3xl"
        >
          <span className="underline decoration-2 underline-offset-4">
            clique aqui e tire sua ideia do papel
          </span>{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
