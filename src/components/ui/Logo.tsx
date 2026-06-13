// ============================================================================
// Logo de Trace - marca tipográfica sobria. Sin emojis.
// La marca: un cuadrado con la "T" y el wordmark "Trace".
// ============================================================================

export default function Logo({
  showWordmark = true,
  size = "md",
}: {
  showWordmark?: boolean;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base";
  const word = size === "sm" ? "text-base" : "text-lg";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={`grid ${box} place-items-center rounded-lg bg-accent font-bold text-bg`}
      >
        T
      </span>
      {showWordmark && (
        <span className={`${word} font-semibold tracking-tight`}>Trace</span>
      )}
    </span>
  );
}
