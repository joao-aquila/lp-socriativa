import { Mascot } from "./Mascot";
import notebook from "@/public/images/mascote/notebook.png";
import { Reveal } from "./Reveal";

const steps = [
  { title: "briefing", detail: "a gente escuta antes de propor qualquer coisa." },
  { title: "estudo e direção", detail: "referência, posicionamento e um caminho claro." },
  { title: "alinhamento", detail: "você valida a direção antes da produção começar." },
  { title: "execução", detail: "criação, captação e entrega no ritmo combinado." },
];

export function Process() {
  return (
    <section
      aria-labelledby="processo-title"
      className="container-lp py-10 md:py-14"
    >
      <Reveal className="text-center">
        <h2
          id="processo-title"
          className="headline text-4xl sm:text-5xl lg:text-6xl"
        >
          processo criativo
        </h2>
        <p className="mt-4 text-lg text-paper/80 md:text-xl">
          a gente <em className="italic">não começa criando</em>: começa{" "}
          <strong className="font-bold">entendendo</strong>.
        </p>
      </Reveal>

      <div className="mt-12 grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
        <Mascot
          src={notebook}
          alt="Mascote da Sô Criativa trabalhando atrás de um notebook"
          className="w-full max-w-sm justify-self-center"
          sizes="(max-width: 768px) 80vw, 340px"
        />
        </Reveal>

        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 90}
              className="rounded-card bg-paper p-6 text-ink"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-ink/50">
                etapa {index + 1}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold lg:text-3xl">
                {step.title}
              </h3>
              <p className="mt-2 text-base text-ink/75">{step.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
