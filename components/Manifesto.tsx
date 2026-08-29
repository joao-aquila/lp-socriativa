import { Reveal } from "./Reveal";
import { Star } from "./Star";

export function Manifesto() {
  return (
    <section
      id="sobre"
      aria-labelledby="manifesto-title"
      className="container-lp scroll-mt-24 py-20 text-center md:py-28"
    >
      <Reveal>
      <h2
        id="manifesto-title"
        className="headline mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl"
      >
        a verdade é que quando a marca é você, tudo comunica
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg text-paper/80 md:text-xl">
        O que você fala, o que você mostra, a forma como se apresenta — e até o
        que escolhe <em className="italic">não mostrar</em>.
      </p>

      <p className="mx-auto mt-6 max-w-2xl text-lg font-bold md:text-2xl">
        E óbvio que não basta só “estar por aí”: tem que ter{" "}
        <span className="underline decoration-2 underline-offset-4">
          direção
        </span>{" "}
        <Star className="inline size-5 align-[-0.15em] text-paper/70" />
      </p>
      </Reveal>
    </section>
  );
}
