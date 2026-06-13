// ============================================================================
// ConceptIcon - iconos SVG sobrios para cada concepto fundamental.
// Sin emojis (regla de marca). Trazo de 1.6, currentColor, estilo Linear.
// Cada icono comunica la IDEA del concepto, no su sintaxis:
//   variable    -> una caja que guarda un valor.
//   conditional -> una bifurcación (dos caminos).
//   loop        -> una flecha circular (repetición).
//   function    -> bloque reutilizable con flecha de retorno.
//   list         -> filas apiladas (colección ordenada).
// ============================================================================

import type { ConceptIconName } from "@/lib/concepts";

interface ConceptIconProps {
  name: ConceptIconName;
  className?: string;
}

const COMMON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function ConceptIcon({
  name,
  className = "h-5 w-5",
}: ConceptIconProps) {
  switch (name) {
    case "variable":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <rect x="4" y="7" width="16" height="10" rx="2.5" />
          <path d="M9 12h6" />
          <circle cx="7" cy="12" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "conditional":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M12 4v6" />
          <path d="M12 10c0 3-5 3-5 7" />
          <path d="M12 10c0 3 5 3 5 7" />
          <circle cx="12" cy="4" r="1.4" />
          <circle cx="7" cy="18" r="1.4" />
          <circle cx="17" cy="18" r="1.4" />
        </svg>
      );
    case "loop":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M5 12a7 7 0 1 1 2.5 5.36" />
          <path d="M4.5 18.5 7.5 17l1 3" />
        </svg>
      );
    case "function":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <rect x="4" y="6" width="11" height="12" rx="2.5" />
          <path d="M15 12h5" />
          <path d="M17.5 9.5 20 12l-2.5 2.5" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M9 7h11" />
          <path d="M9 12h11" />
          <path d="M9 17h11" />
          <circle cx="4.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="17" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
