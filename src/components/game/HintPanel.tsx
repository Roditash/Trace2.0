"use client";

// ============================================================================
// HintPanel - sistema de pistas progresivas (Fase 5).
// Pistas MANUALES. Se revelan de una en una (ANIMATION_SYSTEM 5.19 / 9.5).
// Tras las 4 pistas, se puede revelar la solución.
// Visible y accesible. Nunca oculto tras menús.
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { slideVariants, transition } from "@/lib/motion";
import Button from "@/components/ui/Button";

interface HintPanelProps {
  hints: string[];
  solution: string;
  /** Número de pistas reveladas (0-4). */
  revealed: number;
  /** Si la solución está visible. */
  solutionShown: boolean;
  onRevealHint: () => void;
  onRevealSolution: () => void;
}

export default function HintPanel({
  hints,
  solution,
  revealed,
  solutionShown,
  onRevealHint,
  onRevealSolution,
}: HintPanelProps) {
  const allHintsShown = revealed >= hints.length;

  return (
    <section
      aria-label="Pistas"
      className="glass rounded-2xl border border-glass/10 p-5 elevation-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Pistas</h2>
        <span className="font-mono text-xs text-muted">
          {revealed} / {hints.length}
        </span>
      </div>

      {/* Pistas reveladas (de una en una, ANIMATION_SYSTEM 5.19) */}
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {hints.slice(0, revealed).map((hint, i) => (
            <motion.li
              key={i}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={transition.slide}
              className="glass-subtle flex gap-3 rounded-xl p-3"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{hint}</p>
            </motion.li>
          ))}
        </AnimatePresence>

        {/* Solución */}
        <AnimatePresence initial={false}>
          {solutionShown && (
            <motion.li
              key="solution"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              transition={transition.slide}
              className="rounded-xl border border-accent/30 bg-accent/5 p-3"
            >
              <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                Solución
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-text">
                {solution}
              </pre>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>

      {/* Estado inicial */}
      {revealed === 0 && !solutionShown && (
        <p className="mb-3 mt-1 text-sm text-muted">
          ¿Atascado? Revela una pista a la vez. Usar menos pistas otorga más
          estrellas.
        </p>
      )}

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap gap-2">
        {!allHintsShown && (
          <Button variant="secondary" size="md" onClick={onRevealHint}>
            {revealed === 0 ? "Ver una pista" : "Siguiente pista"}
          </Button>
        )}
        {allHintsShown && !solutionShown && (
          <Button variant="secondary" size="md" onClick={onRevealSolution}>
            Ver solución
          </Button>
        )}
      </div>
    </section>
  );
}
