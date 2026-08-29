import Link from "next/link";
import { Reveal } from "./Reveal";
import { Star } from "./Star";
import { ContentIcon, DesignIcon, IdentityIcon } from "./ServiceIcons";

const services = [
  {
    title: "criação de conteúdo",
    /** a frase que traduz o serviço em problema resolvido */
    pitch: "para quem precisa aparecer com constância, sem depender de inspiração no dia.",
    items: ["cronograma editorial", "social media", "criação e captação de conteúdo"],
    href: "/projetos#conteudo",
    linkLabel: "ver conteúdos entregues",
    Icon: ContentIcon,
  },
  {
    title: "identidade visual",
    pitch: "para quem já é bom no que faz, mas ainda não parece à primeira vista.",
    items: ["identidade visual", "rebranding", "alinhamento visual"],
    href: "/projetos#identidade",
    linkLabel: "ver identidades criadas",
    Icon: IdentityIcon,
  },
  {
    title: "criação de design",
    pitch: "para quem precisa de peça pronta, no padrão da marca e sem retrabalho.",
    items: ["design para postagens", "materiais digitais"],
    href: "/projetos#design",
    linkLabel: "ver peças de design",
    Icon: DesignIcon,
  },
];

export function Services() {
  return (
    <section
      id="servicos"
      aria-labelledby="servicos-title"
      className="container-lp scroll-mt-24 py-10 md:py-14"
    >
      <Reveal className="text-center">
        <h2 id="servicos-title" className="headline text-4xl sm:text-5xl lg:text-6xl">
          o que a gente cria por aqui?
        </h2>
        <p className="mt-4 text-lg text-paper/80 md:text-xl">
          se tem algo para comunicar, tem um jeito de criar.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map((service, index) => (
          <Reveal
            as="li"
            key={service.title}
            delay={index * 90}
            className="group relative flex flex-col overflow-hidden rounded-card bg-paper p-7 text-ink transition duration-300 hover:-translate-y-1.5 md:p-8"
          >
            {/* número fantasma, só ritmo visual */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -top-6 text-[7rem] font-extrabold leading-none text-ink/[0.06] transition-colors duration-300 group-hover:text-ink/10"
            >
              {index + 1}
            </span>

            <service.Icon className="size-9 text-ink/70 transition-transform duration-500 group-hover:scale-110" />

            <h3 className="mt-5 text-3xl font-extrabold lg:text-4xl">
              {service.title}
            </h3>

            <p className="mt-3 text-base text-ink/65">{service.pitch}</p>

            <ul className="mt-6 space-y-2.5 text-lg">
              {service.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Star className="size-3.5 shrink-0 text-ink/45" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={service.href}
              className="mt-auto pt-7 text-base font-bold underline decoration-2 underline-offset-4 transition group-hover:decoration-ink"
            >
              {service.linkLabel} <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
