import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "painel",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-night">{children}</div>;
}
