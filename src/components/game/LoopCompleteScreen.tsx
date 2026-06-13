"use client";

// ============================================================================
// LoopCompleteScreen - pantalla de victoria del nivel Treasure Loop.
// Específica de BUCLES (Fase 8). Refuerza el concepto con una explicación
// visual del while antes de las estrellas y la navegación.
//
// Debe sentirse como una RECOMPENSA, no como una lección: texto mínimo, tema
// dorado, una sola idea clave.
//
// Reutiliza StarRating y Button. Animaciones de los tokens del sistema.
// Tema dorado mediante hex (precedente: CrystalScene / TreasureLoopScene).
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

interface LoopCompleteScreenProps {
  levelName: string;
  stars: number;
  hintsUsed: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToMap: () => void;
}

const GOLD = "#fbbf24";
const GOLD_LIGHT = "#fcd34d";
const GOLD_DEEP = "#f59e0b";

function starMessage(stars: number): string {
  if (stars >= 3) return "Perfecto, sin pistas.";
  if (stars === 2) return "Bien hecho, con pocas pistas.";
  return "Completado. Inténtalo con menos pistas para más estrellas.";
}

export default function LoopCompleteScreen({
  levelName,
  stars,
  hintsUsed,
  hasNext,
  onNext,
  onBackToMap,
}: LoopCompleteScreenProps) {
  return (
    <motion.section
      aria-label={`Nivel completado: ${levelName}`}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center"
      variants={revealParent}
      initial="hidden"
      animate="visible"
    >
      {/* Marca de logro: cofre abierto */}
      <motion.div
        variants={scaleVariants}
        transition={spring.smooth}
        className="grid h-16 w-16 place-items-center rounded-full border-2"
        style={{
          borderColor: GOLD,
          background: "rgba(251,191,36,0.10)",
          boxShadow: "0 0 24px rgba(251,191,36,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <motion.path
            d="M5 13l4 4L19 7"
            stroke={GOLD_LIGHT}
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
        style={{ color: GOLD_DEEP }}
      >
        Tesoro desbloqueado
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

      {/* Concepto aprendido: explicación visual del while (mínima, recompensa) */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass-elevated mt-6 w-full rounded-2xl border p-5"
        style={{
          borderColor: "rgba(251,191,36,0.3)",
          background: "rgba(251,191,36,0.05)",
        }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: GOLD_DEEP }}
        >
          Concepto aprendido
        </p>
        <p className="mt-1 text-lg font-semibold text-text">Bucles</p>

        {/* Bloque visual del while */}
        <div className="mt-4 rounded-xl border border-border bg-code-bg p-4 text-left">
          <pre className="font-mono text-sm leading-relaxed text-text">
            <span style={{ color: GOLD_LIGHT }}>while</span> condición
            <span className="text-muted">:</span>
            {"\n"}
            {"    "}
            <span className="text-muted">repetir</span>
          </pre>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Repetir acciones hasta que la condición deje de cumplirse.
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
