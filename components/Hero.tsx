import Link from "next/link";
import { Mascot } from "./Mascot";
import { Reveal } from "./Reveal";
import { Star } from "./Star";
import { whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="container-lp pt-8 pb-10 md:pt-10 md:pb-12" id="topo">
      <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <h1 className="headline text-[4rem] leading-[0.88] sm:text-[6rem] lg:text-[7.5rem] xl:text-[8.5rem]">
            estúdio criativo feito para marcas pessoais
          </h1>

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
        </Reveal>

        <Reveal delay={120}>
          <Mascot
            file="selfie.png"
            alt="Mascote da Sô Criativa, uma border collie, olhando o celular"
            ratio={1200 / 1061}
            className="w-full max-w-md justify-self-center"
            sizes="(max-width: 768px) 85vw, 480px"
            priority
          />
        </Reveal>
      </div>

      <Reveal delay={200}>
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xl font-medium text-paper/85 sm:text-2xl md:text-3xl">
          criação de conteúdo
          <Star className="size-4 text-paper/60 md:size-5" />
          design
          <Star className="size-4 text-paper/60 md:size-5" />
          identidade visual
        </p>
      </Reveal>
    </section>
  );
}
