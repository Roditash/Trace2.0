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
import StarRating from "@/components/game/StarRating";
import Button from "@/components/ui/Button";

interface ConditionalCompleteScreenProps {
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

      {/* Concepto aprendido: explicación visual del if */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass-elevated mt-6 w-full rounded-2xl border border-accent/30 !bg-accent/5 p-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Concepto aprendido
        </p>
        <p className="mt-1 text-lg font-semibold text-text">Condicionales</p>

        {/* Bloque visual del if */}
        <div className="mt-4 rounded-xl border border-border bg-code-bg p-4 text-left">
          <pre className="font-mono text-sm leading-relaxed text-text">
            <span className="text-accent">if</span> condición
            <span className="text-muted">:</span>
            {"\n"}
            {"    "}
            <span className="text-muted">ejecutar</span>
          </pre>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          La computadora ejecuta el bloque solo cuando la condición es
          verdadera.
        </p>

        <p className="mt-3 text-xs text-muted">Pistas usadas: {hintsUsed}</p>
      </motion.div>

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
