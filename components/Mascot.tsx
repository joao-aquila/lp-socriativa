import Image, { type StaticImageData } from "next/image";

type Props = {
  /** arte importada de /public/images/mascote — import estático gera URL com
   *  hash, e o otimizador responde com cache imutável */
  src: StaticImageData;
  alt: string;
  className?: string;
  /** imagem LCP: pré-carrega com prioridade alta */
  preload?: boolean;
  sizes?: string;
};

/** Mascote da Sô, com o espaço da arte reservado pela proporção. */
export function Mascot({
  src,
  alt,
  className = "",
  preload = false,
  sizes = "(max-width: 768px) 80vw, 40vw",
}: Props) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: src.width / src.height }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        className="object-contain"
      />
    </div>
  );
}
