import Link from "next/link";

export function FormHeader({
  backHref,
  eyebrow,
  title,
  children,
}: {
  backHref: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-paper/50 transition-colors hover:text-paper"
      >
        <span aria-hidden="true">←</span> projetos
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.14em] text-paper/40 uppercase">{eyebrow}</p>
          <h1 className="headline mt-3 text-4xl sm:text-5xl">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
