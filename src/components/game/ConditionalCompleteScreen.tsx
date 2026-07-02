"use client";

// ============================================================================
// ConditionalCompleteScreen - pantalla de victoria del nivel Secret Door.
// Específica de CONDICIONALES (Fase 7). Refuerza el concepto con una
// explicación visual del if antes de las estrellas y la navegación.
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
import { CHECK_PATH } from "@/components/ui/Icon";
import StarRating from "@/components/game/StarRating";
import Button from "@/components/ui/Button";
import ConceptMasteryCard from "@/components/game/ConceptMasteryCard";

interface ConditionalCompleteScreenProps {
  levelId: number;
  levelName: string;
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

export default function ConditionalCompleteScreen({
  levelId,
  levelName,
  stars,
  hintsUsed,
  hasNext,
  onNext,
  onBackToMap,
}: ConditionalCompleteScreenProps) {
  return (
    <motion.section
      aria-label={`Nivel completado: ${levelName}`}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center"
      variants={revealParent}
      initial="hidden"
      animate="visible"
    >
      {/* Marca de logro: puerta abierta */}
      <motion.div
        variants={scaleVariants}
        transition={spring.smooth}
        className="grid h-16 w-16 place-items-center rounded-full border-2 border-accent bg-accent/10 glow-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <motion.path
            d={CHECK_PATH}
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
        Puerta abierta
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

      {/* Concepto dominado: ENSEÑA "Has aprendido a ___" + visual del if. */}
      <ConceptMasteryCard
        levelId={levelId}
        fallbackConcept="Condicionales"
        hintsUsed={hintsUsed}
      >
        {/* Bloque visual del if (identidad del nivel). */}
        <div className="rounded-xl border border-border bg-code-bg p-4 text-left">
          <pre className="font-mono text-sm leading-relaxed text-text">
            <span className="text-accent">if</span> condición
            <span className="text-muted">:</span>
            {"\n"}
            {"    "}
            <span className="text-muted">ejecutar</span>
          </pre>
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
