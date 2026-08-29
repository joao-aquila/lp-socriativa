import Link from "next/link";
import { Logo } from "./Logo";
import { InstagramIcon, MailIcon, WhatsappIcon } from "./SocialIcons";
import { site, whatsappUrl } from "@/lib/site";

const socials = [
  { href: site.instagram, label: "instagram", Icon: InstagramIcon, external: true },
  { href: whatsappUrl(), label: "whatsapp", Icon: WhatsappIcon, external: true },
  { href: `mailto:${site.email}`, label: `e-mail: ${site.email}`, Icon: MailIcon, external: false },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="container-lp flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo width={160} className="h-auto w-[160px]" />
          <p className="mt-2 text-sm text-paper/60">{site.tagline}</p>
          <p className="mt-6 text-xs text-paper/40">
            © {new Date().getFullYear()} {site.legalName}. todos os direitos
            reservados.
          </p>
        </div>

        <nav aria-label="Redes e contato">
          <ul className="flex flex-col gap-3">
            {socials.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <Link
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-paper/20 text-paper/75 transition hover:border-paper hover:bg-paper hover:text-ink"
                >
                  <Icon className="size-5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
