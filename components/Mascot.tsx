import Image from "next/image";
import { publicAsset } from "@/lib/media";

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

/**
 * Mascote da Sô. Enquanto o arquivo não existir em /public/images/mascote,
 * renderiza um marcador reservando exatamente o mesmo espaço.
 */
export function Mascot({
  file,
  alt,
  ratio,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 80vw, 40vw",
}: Props) {
  const src = publicAsset(`/images/mascote/${file}`);

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center rounded-[2rem] border-2 border-dashed border-paper/20 bg-night-soft/40"
        >
          <span className="px-4 text-center text-xs font-medium uppercase tracking-widest text-paper/35">
            mascote
            <br />
            {file}
          </span>
        </div>
      )}
    </div>
  );
}
