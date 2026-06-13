"use client";

// ============================================================================
// FunctionCompleteScreen - pantalla de victoria del nivel Robot Path.
// Específica de FUNCIONES (Fase 9). Refuerza el concepto con una explicación
// visual de `def move():` antes de las estrellas y la navegación.
//
// Debe sentirse como una RECOMPENSA, no como una lección: texto mínimo, tema
// teal (token --accent), una sola idea clave: las funciones guardan acciones
// reutilizables.
//
// Reutiliza StarRating y Button. Animaciones de los tokens del sistema.
// Para alpha se usa SIEMPRE la forma rgb(var(--accent) / a).
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

interface FunctionCompleteScreenProps {
  levelName: string;
  stars: number;
  hintsUsed: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToMap: () => void;
}

const ACCENT = "rgb(var(--accent))";

function starMessage(stars: number): string {
  if (stars >= 3) return "Perfecto, sin pistas.";
  if (stars === 2) return "Bien hecho, con pocas pistas.";
  return "Completado. Inténtalo con menos pistas para más estrellas.";
}

export default function FunctionCompleteScreen({
  levelName,
  stars,
  hintsUsed,
  hasNext,
  onNext,
  onBackToMap,
}: FunctionCompleteScreenProps) {
  return (
    <motion.section
      aria-label={`Nivel completado: ${levelName}`}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center"
      variants={revealParent}
      initial="hidden"
      animate="visible"
    >
      {/* Marca de logro: objetivo alcanzado */}
      <motion.div
        variants={scaleVariants}
        transition={spring.smooth}
        className="grid h-16 w-16 place-items-center rounded-full border-2"
        style={{
          borderColor: ACCENT,
          background: "rgb(46 229 157 / 0.10)",
          boxShadow: "0 0 24px rgb(46 229 157 / 0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
          <motion.path
            d="M5 13l4 4L19 7"
            stroke={ACCENT}
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
        style={{ color: ACCENT }}
      >
        Objetivo alcanzado
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

      {/* Concepto aprendido: explicación visual de la función (recompensa) */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass-elevated mt-6 w-full rounded-2xl border p-5"
        style={{
          borderColor: "rgb(46 229 157 / 0.3)",
          background: "rgb(46 229 157 / 0.05)",
        }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          Concepto aprendido
        </p>
        <p className="mt-1 text-lg font-semibold text-text">Funciones</p>

        {/* Bloque visual de la definición de función */}
        <div className="mt-4 rounded-xl border border-border bg-code-bg p-4 text-left">
          <pre className="font-mono text-sm leading-relaxed text-text">
            <span style={{ color: ACCENT }}>def</span> move()
            <span className="text-muted">:</span>
            {"\n"}
            {"    "}
            <span className="text-muted">print(</span>
            <span style={{ color: ACCENT }}>&quot;MOVE&quot;</span>
            <span className="text-muted">)</span>
          </pre>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Las funciones permiten guardar acciones y reutilizarlas cuando las
          necesites.
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
