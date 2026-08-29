type IconProps = { className?: string };

const base = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

/** Câmera + play: criação e captação de conteúdo. */
export function ContentIcon({ className = "size-8" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="8" width="19" height="16" rx="4" />
      <path d="m22 14 6-3.6v11.2L22 18" />
      <path d="m10.5 12.8 5 3.2-5 3.2z" />
    </svg>
  );
}

/** Compasso/estrela: direção e identidade visual. */
export function IdentityIcon({ className = "size-8" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="16" cy="16" r="12.5" />
      <circle cx="16" cy="16" r="4" />
      <path d="M16 3.5v8M16 20.5v8M3.5 16h8M20.5 16h8" />
    </svg>
  );
}

/** Camadas: peças e materiais digitais. */
export function DesignIcon({ className = "size-8" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m16 3.5 12 6.5-12 6.5L4 10z" />
      <path d="m4 16 12 6.5L28 16" />
      <path d="m4 22 12 6.5L28 22" />
    </svg>
  );
}
