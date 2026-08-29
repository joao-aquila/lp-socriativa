import Link from "next/link";
import { site, whatsappUrl } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/15">
      <div className="container-lp flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo width={160} className="h-auto w-[160px]" />
          <p className="mt-1 text-sm text-paper/65">{site.tagline}</p>
        </div>

        <nav aria-label="Links de contato">
          <ul className="flex flex-wrap gap-4 text-sm text-paper/80">
            <li>
              <Link
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                className="underline underline-offset-4 hover:text-paper"
              >
                instagram
              </Link>
            </li>
            <li>
              <Link
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-paper"
              >
                whatsapp
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4 hover:text-paper"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container-lp pb-8 text-xs text-paper/45">
        © {new Date().getFullYear()} {site.legalName}. todos os direitos
        reservados.
      </div>
    </footer>
  );
}
