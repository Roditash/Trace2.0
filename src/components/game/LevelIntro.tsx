"use client";

// ============================================================================
// LevelIntro - pantalla previa al reto (Fase 5).
// Muestra historia corta, objetivo y concepto a aprender.
// Duración visual corta: aparece con stagger y un botón para comenzar.
// Animaciones tomadas de ANIMATION_SYSTEM (revealParent / slideVariants).
// ============================================================================

import { motion } from "framer-motion";
import {
  revealParent,
  slideVariants,
  scaleVariants,
  transition,
  spring,
} from "@/lib/motion";
import Button from "@/components/ui/Button";

interface LevelIntroProps {
  levelName: string;
  concept: string;
  story: string;
  objective: string;
  onStart: () => void;
}

export default function LevelIntro({
  levelName,
  concept,
  story,
  objective,
  onStart,
}: LevelIntroProps) {
  return (
    <motion.section
      aria-label={`Introducción: ${levelName}`}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center"
      variants={revealParent}
      initial="hidden"
      animate="visible"
    >
      {/* Concepto */}
      <motion.span
        variants={scaleVariants}
        transition={spring.smooth}
        className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent"
      >
        {concept}
      </motion.span>

      {/* Nombre del nivel */}
      <motion.h1
        variants={slideVariants}
        transition={transition.slide}
        className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {levelName}
      </motion.h1>

      {/* Historia */}
      <motion.p
        variants={slideVariants}
        transition={transition.slide}
        className="mt-4 text-base leading-relaxed text-muted"
      >
        {story}
      </motion.p>

      {/* Objetivo */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass mt-6 w-full rounded-2xl border border-glass/10 p-5 text-left"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Objetivo
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text">{objective}</p>
      </motion.div>

      {/* Acción */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="mt-8"
      >
        <Button size="lg" onClick={onStart} aria-label="Comenzar el reto">
          Comenzar
        </Button>
      </motion.div>
    </motion.section>
  );
}
