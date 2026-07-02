// ============================================================================
// Icon - sistema de iconos de interfaz unificado (fase Premium).
//
// Antes cada componente reimplementaba su propio "check", "lock" o "play" con
// grosores y radios distintos. Esto centraliza la familia para que TODOS los
// iconos compartan: viewBox 24, trazo redondeado, currentColor y una geometría
// óptica consistente (estilo Linear/Feather). Sin emojis (regla de marca).
//
// Uso:
//   <Icon name="check" className="h-4 w-4" />
//   <Icon name="arrow-right" strokeWidth={1.6} />
//
// Para iconos de CONCEPTO (variable, bucle, función…) usa <ConceptIcon />.
// Para "check" animado (pathLength) los componentes que lo necesiten siguen
// usando <motion.path> directamente con el mismo path expuesto aquí (CHECK_PATH).
// ============================================================================

export type IconName =
  | "check"
  | "lock"
  | "arrow-right"
  | "arrow-up-right"
  | "play"
  | "star"
  | "sparkle"
  | "chevron-right"
  | "target"
  | "bolt";

/** Path del check, compartido con los componentes que lo animan. */
export const CHECK_PATH = "M5 12.5l4.2 4.2L19 6.5";

interface IconProps {
  name: IconName;
  className?: string;
  /** Grosor de trazo. Por defecto 1.7 (equilibrio nitidez/elegancia). */
  strokeWidth?: number;
  /** Etiqueta accesible; si se omite, el icono es decorativo (aria-hidden). */
  title?: string;
}

export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.7,
  title,
}: IconProps) {
  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Geometría de cada icono. Centrada en 24×24 para alineación óptica uniforme.
// ----------------------------------------------------------------------------
const PATHS: Record<IconName, React.ReactNode> = {
  check: <path d={CHECK_PATH} />,

  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.2" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),

  "arrow-right": (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),

  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),

  "chevron-right": <path d="M9 6l6 6-6 6" />,

  play: <path d="M7 5.5l11 6.5-11 6.5z" />,

  // Estrella de líneas limpias (no la celebratoria rellena del perfil).
  star: (
    <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.77 6.79 19.5l.99-5.8-4.21-4.1 5.82-.85L12 3.5z" />
  ),

  // Chispa de comprensión: destello de cuatro puntas + brillo.
  sparkle: (
    <>
      <path d="M12 3.5c.4 3.6 1.4 4.6 5 5-3.6.4-4.6 1.4-5 5-.4-3.6-1.4-4.6-5-5 3.6-.4 4.6-1.4 5-5z" />
      <path d="M19 14.5c.2 1.6.7 2.1 2.3 2.3-1.6.2-2.1.7-2.3 2.3-.2-1.6-.7-2.1-2.3-2.3 1.6-.2 2.1-.7 2.3-2.3z" />
    </>
  ),

  // Diana: objetivo / meta.
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),

  // Rayo: progreso / impulso.
  bolt: <path d="M13 3 5 13.5h6L11 21l8-10.5h-6L13 3z" />,
};
