import type { Metadata } from "next";
import Link from "next/link";
import { getAdmin, LOGOUT_URL } from "@/lib/access";

export const metadata: Metadata = {
  title: "painel",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // cada página confere o acesso de novo; aqui é só para a barra do topo
  const admin = await getAdmin();
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-night">
      <header className="sticky top-0 z-30 border-b border-paper/8 bg-night/80 backdrop-blur-md">
        <div className="container-lp flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-baseline gap-2 font-bold">
            sô criativa
            <span className="text-sm font-medium text-paper/40">painel</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm text-paper/55">
            <Link href="/" target="_blank" className="hidden hover:text-paper sm:inline">
              ver site <span aria-hidden="true">↗</span>
            </Link>
            {admin ? (
              <>
                <span className="hidden max-w-[16rem] truncate md:inline">{admin.email}</span>
                {isDev ? null : (
                  <a href={LOGOUT_URL} className="hover:text-paper">
                    sair
                  </a>
                )}
              </>
            ) : null}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
