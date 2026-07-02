// ============================================================================
// Logo de Trace — marca con significado. Sin emojis.
//
// La marca cuenta la idea del producto: TRAZAR el camino del razonamiento.
// El glifo es una línea que conecta tres nodos (problema → acción → resultado),
// con el nodo final encendido en acento. Es a la vez una "ruta" y una chispa
// de comprensión. El wordmark "Trace" acompaña en tipografía de marca.
//
// Reutilizable como: marca completa (glifo + wordmark), solo glifo (favicon,
// avatares), o monocromo. currentColor para heredar el contexto.
// ============================================================================

interface LogoProps {
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  /** Glifo en un color sólido (monocromo) en vez del acento. */
  mono?: boolean;
}

const SIZES = {
  sm: { box: "h-7 w-7", word: "text-base" },
  md: { box: "h-8 w-8", word: "text-lg" },
  lg: { box: "h-10 w-10", word: "text-2xl" },
} as const;

/** El glifo de la marca: ruta con tres nodos, el último encendido. */
export function LogoMark({
  className = "h-8 w-8",
  mono = false,
}: {
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`relative grid place-items-center rounded-xl ${className}`}
      style={{
        background: mono
          ? "rgb(var(--surface-2))"
          : "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-strong)))",
        boxShadow: mono ? undefined : "0 4px 14px rgb(var(--accent) / 0.35)",
      }}
    >
      {/* `color` define currentColor para los nodos rellenos. */}
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="none"
        color={mono ? "rgb(var(--text))" : "rgb(var(--bg))"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* La ruta: sube en zigzag de izquierda a derecha (un "trazo").
            Centrada ópticamente con margen para el nodo final encendido. */}
        <path d="M5 16.5 L10.5 11 L14 14 L19 7" />
        {/* Nodo de inicio. */}
        <circle cx="5" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
        {/* Nodo intermedio. */}
        <circle cx="14" cy="14" r="1.5" fill="currentColor" stroke="none" />
        {/* Nodo final encendido (la comprensión alcanzada). */}
        <circle
          cx="19"
          cy="7"
          r="2.5"
          fill={mono ? "rgb(var(--accent))" : "rgb(var(--bg))"}
          stroke="none"
        />
      </svg>
    </span>
  );
}

export default function Logo({
  showWordmark = true,
  size = "md",
  mono = false,
}: LogoProps) {
  const s = SIZES[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={s.box} mono={mono} />
      {showWordmark && (
        <span
          className={`${s.word} font-semibold tracking-tight`}
          style={{ letterSpacing: "-0.02em" }}
        >
          Trace
        </span>
      )}
    </span>
  );
}
