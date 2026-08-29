const POINTS = 8;
const OUTER = 12;
const INNER = 3.6;

const path = Array.from({ length: POINTS * 2 }, (_, i) => {
  const radius = i % 2 === 0 ? OUTER : INNER;
  const angle = (Math.PI * i) / POINTS - Math.PI / 2;
  const x = (12 + radius * Math.cos(angle)).toFixed(2);
  const y = (12 + radius * Math.sin(angle)).toFixed(2);
  return `${i === 0 ? "M" : "L"}${x} ${y}`;
}).join(" ") + " Z";

/** Estrela de 8 pontas da marca — usada como separador e como bullet. */
export function Star({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}
