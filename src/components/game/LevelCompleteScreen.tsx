"use client";

// ============================================================================
// LevelCompleteScreen - pantalla de victoria (Fase 5).
// Muestra estrellas obtenidas, concepto aprendido y botón siguiente nivel.
// Animación premium SIN exageraciones (ANIMATION_SYSTEM: celebrate + star reward).
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

interface LevelCompleteScreenProps {
  levelId: number;
  levelName: string;
  concept: string;
  stars: number;
  hintsUsed: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToMap: () => void;
}

function starMessage(stars: number): string {
  if (stars >= 3) return "Perfecto, sin pistas.";
  if (stars === 2) return "Bien hecho, con pocas pistas.";
  return "Completado. Inténtalo con menos pistas para más estrellas.";
}

export default function LevelCompleteScreen({
  levelId,
  levelName,
  concept,
  stars,
  hintsUsed,
  hasNext,
  onNext,
  onBackToMap,
}: LevelCompleteScreenProps) {
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
        className="grid h-16 w-16 place-items-center rounded-full border-2 border-accent bg-accent/10 glow-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="rgb(var(--accent))"
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
        className="mt-5 font-mono text-xs uppercase tracking-widest text-accent"
      >
        Nivel completado
      </motion.p>

      <motion.h1
        variants={slideVariants}
        transition={transition.slide}
        className="mt-2 text-3xl font-semibold tracking-tight"
      >
        {levelName}
      </motion.h1>

      {/* Estrellas (star reward animado) */}
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

      {/* Concepto dominado: momento que ENSEÑA, no que celebra (PART 3). */}
      <ConceptMasteryCard
        levelId={levelId}
        fallbackConcept={concept}
        hintsUsed={hintsUsed}
      />

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
