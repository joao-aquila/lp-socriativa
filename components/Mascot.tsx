import Image from "next/image";

type Props = {
  /** nome do arquivo dentro de /public/images/mascote (ex.: "selfie.png") */
  file: string;
  alt: string;
  /** proporção largura/altura da arte, para reservar o espaço certo */
  ratio: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Mascote da Sô, com o espaço da arte reservado pela proporção. */
export function Mascot({
  file,
  alt,
  ratio,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 80vw, 40vw",
}: Props) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={`/images/mascote/${file}`}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
