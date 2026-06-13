"use client";

// ============================================================================
// ListCompleteScreen - pantalla de victoria del nivel Memory Puzzle.
// Específica de LISTAS (nivel 5). Refuerza el concepto con una explicación
// visual de una lista ordenada antes de las estrellas y la navegación.
//
// Debe sentirse como una RECOMPENSA, no como una lección: texto mínimo, tema
// índigo (identidad del minijuego de Listas), una sola idea clave: una lista
// guarda varios valores juntos y se puede organizar.
//
// Reutiliza StarRating y Button. Animaciones de los tokens del sistema.
// ============================================================================

import { motion } from "framer-motion";
import {
  revealParent,
  slideVariants,
  scaleVariants,
  transition,
  spring,
} from "@/lib/motion";
import StarRating from "@/components/game/StarRating";
import Button from "@/components/ui/Button";
import ConceptMasteryCard from "@/components/game/ConceptMasteryCard";

interface ListCompleteScreenProps {
  levelId: number;
  levelName: string;
  stars: number;
  hintsUsed: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToMap: () => void;
}

const INDIGO = "#818cf8";

function starMessage(stars: number): string {
  if (stars >= 3) return "Perfecto, sin pistas.";
  if (stars === 2) return "Bien hecho, con pocas pistas.";
  return "Completado. Inténtalo con menos pistas para más estrellas.";
}

export default function ListCompleteScreen({
  levelId,
  levelName,
  stars,
  hintsUsed,
  hasNext,
  onNext,
  onBackToMap,
}: ListCompleteScreenProps) {
  const solved = [1, 2, 3, 4];

  return (
    <motion.section
      aria-label={`Nivel completado: ${levelName}`}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center"
      variants={revealParent}
      initial="hidden"
      animate="visible"
    >
      {/* Marca de logro */}
      <motion.div
        variants={scaleVariants}
        transition={spring.smooth}
        className="grid h-16 w-16 place-items-center rounded-full border-2"
        style={{
          borderColor: INDIGO,
          background: "rgb(129 140 248 / 0.1)",
          boxShadow: "0 0 24px rgb(129 140 248 / 0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <motion.path
            d="M5 13l4 4L19 7"
            stroke={INDIGO}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={spring.snappy}
          />
        </svg>
      </motion.div>

      <motion.p
        variants={slideVariants}
        transition={transition.slide}
        className="mt-5 font-mono text-xs uppercase tracking-widest"
        style={{ color: INDIGO }}
      >
        Rompecabezas resuelto
      </motion.p>

      <motion.h1
        variants={slideVariants}
        transition={transition.slide}
        className="mt-2 text-3xl font-semibold tracking-tight"
      >
        {levelName}
      </motion.h1>

      {/* Estrellas */}
      <motion.div
        variants={scaleVariants}
        transition={spring.smooth}
        className="mt-6"
      >
        <StarRating value={stars} size={40} animate />
      </motion.div>

      <motion.p
        variants={slideVariants}
        transition={transition.slide}
        className="mt-3 text-sm text-muted"
      >
        {starMessage(stars)}
      </motion.p>

      {/* Concepto dominado: ENSEÑA "Has aprendido a ___" + lista ordenada. */}
      <ConceptMasteryCard
        levelId={levelId}
        fallbackConcept="Listas"
        hintsUsed={hintsUsed}
      >
        {/* Visual: las celdas ordenadas con su índice (identidad del nivel). */}
        <div className="rounded-xl border border-border bg-code-bg p-4">
          <div className="flex items-end justify-center gap-2">
            {solved.map((value, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl border font-mono text-lg font-bold"
                  style={{
                    color: INDIGO,
                    borderColor: "rgb(129 140 248 / 0.5)",
                    background: "rgb(129 140 248 / 0.12)",
                  }}
                >
                  {value}
                </span>
                <span className="font-mono text-[10px] text-muted">{i}</span>
              </div>
            ))}
          </div>
          <p
            className="mt-4 text-center font-mono text-sm"
            style={{ color: INDIGO }}
          >
            pieces = [1, 2, 3, 4]
          </p>
        </div>
      </ConceptMasteryCard>

      {/* Acciones */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row"
      >
        <Button variant="ghost" size="md" onClick={onBackToMap}>
          Volver al mapa
        </Button>
        {hasNext && (
          <Button size="lg" onClick={onNext} aria-label="Ir al siguiente nivel">
            Siguiente nivel
          </Button>
        )}
      </motion.div>
    </motion.section>
  );
}
