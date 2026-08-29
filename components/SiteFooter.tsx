import Link from "next/link";
import { Logo } from "./Logo";
import { Star } from "./Star";
import { InstagramIcon, MailIcon, WhatsappIcon } from "./SocialIcons";
import { site, whatsappUrl } from "@/lib/site";

const navegue = [
  { href: "/#servicos", label: "serviços" },
  { href: "/projetos", label: "projetos" },
  { href: "/#sobre", label: "sobre a sô" },
  { href: "/#contato", label: "bora criar?" },
];

const servicos = [
  { href: "/projetos#conteudo", label: "criação de conteúdo" },
  { href: "/projetos#identidade", label: "identidade visual" },
  { href: "/projetos#design", label: "criação de design" },
];

const socials = [
  { href: site.instagram, label: "instagram", Icon: InstagramIcon, external: true },
  { href: whatsappUrl(), label: "whatsapp", Icon: WhatsappIcon, external: true },
  { href: `mailto:${site.email}`, label: `e-mail: ${site.email}`, Icon: MailIcon, external: false },
];

const columnTitle = "text-xs font-bold uppercase tracking-[0.18em] text-paper/40";
const columnLink =
  "text-paper/75 transition hover:text-paper hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="container-lp py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <Logo width={180} className="h-auto w-[180px]" />
            <p className="mt-4 max-w-xs text-lg leading-snug text-paper/70">
              {site.tagline}
            </p>
            <Link
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-white"
            >
              bora criar? <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className={columnTitle}>navegue</h2>
            <ul className="mt-4 space-y-2.5">
              {navegue.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={columnLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Serviços">
            <h2 className={columnTitle}>o que criamos</h2>
            <ul className="mt-4 space-y-2.5">
              {servicos.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={columnLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnTitle}>onde a gente está</h2>
            <ul className="mt-4 flex gap-3">
              {socials.map(({ href, label, Icon, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-paper/20 text-paper/75 transition hover:border-paper hover:bg-paper hover:text-ink"
                  >
                    <Icon className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm text-paper/60 transition hover:text-paper"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. todos os direitos
            reservados.
          </p>
          <p className="flex items-center gap-2">
            feito com direção
            <Star className="size-3 text-paper/40" />
            atendimento online para todo o Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
