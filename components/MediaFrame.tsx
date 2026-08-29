import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  /** texto mostrado no placeholder enquanto a arte final não existe */
  fallbackLabel?: string;
  aspect?: "portrait" | "landscape" | "square";
  className?: string;
  sizes?: string;
  priority?: boolean;
};

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

/**
 * Moldura de mídia com fallback: se `src` for nulo (arte ainda não enviada),
 * desenha um placeholder tracejado com o rótulo, mantendo o layout estável.
 */
export function MediaFrame({
  src,
  alt,
  fallbackLabel = "imagem em breve",
  aspect = "portrait",
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden ${aspectClass[aspect]} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-paper/25 bg-night-soft/60 p-4 text-center"
        >
          <span aria-hidden="true" className="text-2xl opacity-50">
            ✳
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-paper/45">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}
