import Link from "next/link";
import { Mascot } from "./Mascot";
import { whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="container-lp pt-10 pb-16 md:pt-16 md:pb-24" id="topo">
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="headline text-[3.25rem] leading-[0.9] sm:text-7xl lg:text-[5.5rem]">
            estúdio criativo feito para marcas pessoais
          </h1>

          <p className="mt-6 max-w-xl text-lg text-paper/80 md:text-xl">
            Criação de conteúdo, design e identidade visual para profissionais
            que são a própria marca — psicólogos, dentistas, consultores e quem
            mais precisa comunicar com direção.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-paper px-6 py-3 text-base font-bold text-night transition hover:bg-white"
            >
              bora criar? ↗
            </Link>
            <Link
              href="#projetos"
              className="rounded-full border border-paper/45 px-6 py-3 text-base font-medium transition hover:border-paper hover:bg-paper/10"
            >
              ver projetos
            </Link>
          </div>
        </div>

        <Mascot
          file="selfie.png"
          alt="Mascote da Sô Criativa, uma border collie, olhando o celular"
          ratio={1200 / 1061}
          className="w-full max-w-md justify-self-center"
          sizes="(max-width: 768px) 85vw, 420px"
          priority
        />
      </div>

      <p className="mt-12 text-center text-base text-paper/75 md:text-lg">
        criação de conteúdo <span aria-hidden="true">✳</span> design{" "}
        <span aria-hidden="true">✳</span> identidade visual
      </p>
    </section>
  );
}
