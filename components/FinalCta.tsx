import { Mascot } from "./Mascot";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";

export function FinalCta() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="container-lp scroll-mt-24 pt-10 md:pt-14"
    >
      <Reveal className="text-center">
        <h2 id="contato-title" className="headline text-4xl sm:text-5xl lg:text-6xl">
          e agora, o que a gente cria?
        </h2>
        {/* uma linha só a partir do md; no mobile pode quebrar à vontade */}
        <p className="mx-auto mt-4 text-base text-paper/85 md:whitespace-nowrap md:text-lg">
          <strong className="font-bold">me conta!</strong> pode ser uma ideia
          pronta, meio pronta ou um “não sei por onde começar”.
        </p>
      </Reveal>

      {/* a arte encosta no rodapé: nada de padding inferior aqui */}
      <div className="mt-12 grid items-end gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="self-end">
          <Mascot
            file="microfone.png"
            alt="Mascote da Sô Criativa segurando um microfone boom em frente a uma câmera"
            ratio={1600 / 816}
            className="w-full"
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </Reveal>

        <Reveal delay={120} className="pb-12 md:pb-16">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
