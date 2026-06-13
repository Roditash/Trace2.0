"use client";

// ============================================================================
// Reveal - contenedor con stagger (ANIMATION_SYSTEM 5.10).
// Usa revealParent + slideVariants. Para listas/secciones que entran.
// Limitar a un máximo de 8 hijos con stagger (regla 5.10 / 11.2).
// ============================================================================

import { motion } from "framer-motion";
import { revealParent, slideVariants, transition } from "@/lib/motion";

export function RevealGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={revealParent}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={slideVariants}
      transition={transition.slide}
      className={className}
    >
      {children}
    </motion.div>
  );
}
