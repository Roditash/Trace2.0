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
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function ConceptIcon({
  name,
  className = "h-5 w-5",
}: ConceptIconProps) {
  switch (name) {
    case "variable":
      // Una caja que guarda un valor: el punto es el dato; la línea, su nombre.
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <rect x="4" y="6.5" width="16" height="11" rx="3" />
          <circle cx="8" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <path d="M11.5 12H16" />
        </svg>
      );
    case "conditional":
      // Una bifurcaci\u00f3n: un camino que se divide en dos seg\u00fan la decisi\u00f3n.
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M12 5.5v3" />
          <path d="M12 8.5c0 3.2-5 2.8-5 6.5" />
          <path d="M12 8.5c0 3.2 5 2.8 5 6.5" />
          <circle cx="12" cy="4.4" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="7" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="17" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "loop":
      // Flecha circular: la repetición que vuelve a empezar.
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M19 12a7 7 0 1 1-2.05-4.95" />
          <path d="M19 4.5V8h-3.5" />
        </svg>
      );
    case "function":
      // Bloque reutilizable con una flecha que devuelve un resultado.
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <rect x="3.5" y="6" width="10.5" height="12" rx="3" />
          <path d="M14 12h6.5" />
          <path d="M18 9.5 20.5 12 18 14.5" />
        </svg>
      );
    case "list":
      // Filas apiladas con su viñeta: una colección ordenada.
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...COMMON}>
          <path d="M9.5 7h10.5" />
          <path d="M9.5 12h10.5" />
          <path d="M9.5 17h10.5" />
          <circle cx="4.5" cy="7" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="17" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
