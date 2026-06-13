"use client";

// ============================================================================
// Visualization - zona central de la pantalla de juego (el foco absoluto).
// Visualización conceptual y sobria, inspirada en la claridad de AlgoMaster.
// No es un motor real: es una representación visual del concepto del nivel.
// Nodos con glow teal y una fila de "orden" que se revela con stagger.
// ============================================================================

import { motion } from "framer-motion";
import { revealParent, slideVariants, transition, spring } from "@/lib/motion";

interface VisualizationProps {
  /** Concepto a representar (texto corto, ej. "Variables"). */
  concept: string;
  /** Etiquetas de los nodos a mostrar en secuencia. */
  sequence: string[];
  /** Estado: si el nivel ya está resuelto, los nodos brillan completos. */
  solved: boolean;
}

export default function Visualization({
  concept,
  sequence,
  solved,
}: VisualizationProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 py-8">
      {/* Etiqueta de concepto */}
      <span className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
        {concept}
      </span>

      {/* Nodo principal animado */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.smooth}
        className={[
          "grid h-24 w-24 place-items-center rounded-full border-2 font-mono text-2xl font-bold transition-colors sm:h-28 sm:w-28",
          solved
            ? "border-accent bg-accent/15 text-accent glow-accent text-glow"
            : "border-border bg-surface-2 text-muted",
        ].join(" ")}
      >
        {sequence[0] ?? "?"}
      </motion.div>

      {/* Secuencia de nodos (orden de ejecución) */}
      {sequence.length > 1 && (
        <div className="w-full">
          <motion.div
            variants={revealParent}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {sequence.map((label, i) => (
              <motion.div
                key={`${label}-${i}`}
                variants={slideVariants}
                transition={transition.slide}
                className="flex items-center gap-2"
              >
                <span
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border font-mono text-sm font-semibold transition-colors",
                    solved
                      ? "border-accent bg-accent/15 text-accent glow-accent"
                      : "border-border bg-surface text-muted",
                  ].join(" ")}
                >
                  {label}
                </span>
                {i < sequence.length - 1 && (
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
            Orden de ejecución
          </p>
        </div>
      )}
    </div>
  );
}
