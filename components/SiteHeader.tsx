import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const nav = [
  { href: "/#projetos", label: "projetos" },
  { href: "/#servicos", label: "serviços" },
  { href: "/#sobre", label: "sobre a sô" },
  { href: "/#contato", label: "bora criar?" },
];

export function SiteHeader() {
  return (
    <header className="container-lp pt-6 md:pt-8">
      <div className="flex flex-col-reverse items-center gap-5 md:flex-row md:justify-between">
        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full border border-paper/45 px-4 py-1.5 text-sm text-paper/90 transition hover:border-paper hover:bg-paper hover:text-night md:text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" aria-label={`${site.name} — página inicial`}>
          <Logo width={190} eager className="h-auto w-[150px] md:w-[190px]" />
        </Link>
      </div>
    </header>
  );
}
