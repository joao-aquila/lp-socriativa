const services = [
  {
    title: "criação de conteúdo",
    items: ["cronograma editorial", "social media", "criação e captação de conteúdo"],
  },
  {
    title: "identidade visual",
    items: ["identidade visual", "rebranding", "alinhamento visual"],
  },
  {
    title: "criação de design",
    items: ["design para postagens", "materiais digitais"],
  },
];

export function Services() {
  return (
    <section
      id="servicos"
      aria-labelledby="servicos-title"
      className="container-lp scroll-mt-24 py-20 md:py-28"
    >
      <div className="text-center">
        <h2
          id="servicos-title"
          className="headline text-4xl sm:text-5xl lg:text-6xl"
        >
          o que a gente cria por aqui?
        </h2>
        <p className="mt-4 text-lg text-paper/80 md:text-xl">
          se tem algo para comunicar, tem um jeito de criar.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <li
            key={service.title}
            className="rounded-card bg-paper p-7 text-ink md:p-8"
          >
            <h3 className="text-3xl font-extrabold lg:text-4xl">
              {service.title}
            </h3>
            <ul className="mt-5 space-y-2 text-lg text-ink/80">
              {service.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
