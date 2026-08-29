import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-lp flex min-h-[50vh] flex-col justify-center py-20">
        <h1 className="headline text-5xl sm:text-6xl">
          essa página a Sô ainda não criou
        </h1>
        <p className="mt-4 text-lg text-paper/75">
          mas tem bastante coisa boa por aqui:
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-paper px-6 py-3 font-bold text-ink">
            voltar para o início
          </Link>
          <Link href="/projetos" className="rounded-full border border-paper/45 px-6 py-3">
            ver projetos
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
