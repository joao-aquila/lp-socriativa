export const faq = [
  {
    question: "para quem a Sô Criativa trabalha?",
    answer:
      "Para marcas pessoais: psicólogos, dentistas, advogados, consultores e profissionais liberais que precisam comunicar com direção nas redes sociais.",
  },
  {
    question: "quais serviços o estúdio oferece?",
    answer:
      "Criação de conteúdo (cronograma editorial, social media, captação), identidade visual (criação, rebranding e alinhamento) e design para postagens e materiais digitais.",
  },
  {
    question: "como funciona o processo criativo?",
    answer:
      "Começa com briefing, passa por estudo e direção, alinhamento com você e só então a execução. A gente não começa criando: começa entendendo.",
  },
  {
    question: "o atendimento é presencial ou online?",
    answer:
      "O atendimento é online para todo o Brasil, com captação de conteúdo presencial combinada caso a caso.",
  },
];

export function Faq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="container-lp py-20 md:py-28"
    >
      <h2 id="faq-title" className="headline text-center text-4xl sm:text-5xl">
        dúvidas rápidas
      </h2>

      <dl className="mx-auto mt-10 max-w-3xl divide-y divide-paper/15">
        {faq.map((item) => (
          <div key={item.question} className="py-6">
            <dt className="text-xl font-bold md:text-2xl">{item.question}</dt>
            <dd className="mt-2 text-lg text-paper/75">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
