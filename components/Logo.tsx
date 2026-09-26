import Image from "next/image";
import logo from "@/public/images/logo-horizontal-light.png";
import { site } from "@/lib/site";

/** Logotipo da Sô Criativa na variante clara, para os fundos escuros da LP. */
export function Logo({
  className = "",
  width = 190,
  eager = false,
}: {
  className?: string;
  width?: number;
  /** acima da dobra: carrega sem lazy, mas sem disputar prioridade com o LCP */
  eager?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt={`${site.name} — logotipo`}
      width={width}
      height={Math.round((width * logo.height) / logo.width)}
      loading={eager ? "eager" : undefined}
      className={className}
    />
  );
}
