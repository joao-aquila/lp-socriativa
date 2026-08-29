import Image from "next/image";
import { site } from "@/lib/site";

/** Logotipo da Sô Criativa na variante clara, para os fundos escuros da LP. */
export function Logo({
  className = "",
  width = 190,
  priority = false,
}: {
  className?: string;
  width?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/logo-horizontal-light.png"
      alt={`${site.name} — logotipo`}
      width={width}
      height={Math.round((width * 214) / 900)}
      priority={priority}
      className={className}
    />
  );
}
