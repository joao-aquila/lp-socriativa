"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  criado: "projeto publicado — já está no ar.",
  salvo: "alterações salvas.",
  removido: "projeto excluído.",
};

/** Confirmação depois de salvar/excluir; some sozinha e limpa a URL. */
export function Toast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const code = params.get("ok");
  const [visible, setVisible] = useState(Boolean(code));

  useEffect(() => {
    if (!code) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      const next = new URLSearchParams(params);
      next.delete("ok");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 3500);
    return () => clearTimeout(timer);
  }, [code, params, pathname, router]);

  const message = code ? messages[code] : null;
  if (!message) return null;

  return (
    <div
      role="status"
      className={`fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 transition-[opacity,transform] duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <p className="flex items-center gap-3 rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink shadow-2xl shadow-black/40">
        <span aria-hidden="true">✳</span>
        {message}
      </p>
    </div>
  );
}
