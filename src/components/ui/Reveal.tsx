"use client";

// ============================================================================
// Reveal - contenedor con stagger (ANIMATION_SYSTEM 5.10).
// Usa revealParent + slideVariants. Para listas/secciones que entran.
// Limitar a un máximo de 8 hijos con stagger (regla 5.10 / 11.2).
//
// v2 (fluidez): el reveal puede dispararse AL ENTRAR EN VIEWPORT (whileInView)
// en lugar de solo al montar. Así, al hacer scroll por la home, cada sección
// aparece justo cuando se necesita — más viva y con mejor ritmo. Se activa una
// sola vez (once) y con un margen que anticipa la entrada. Por defecto, el
// primer grupo de la página (above the fold) sigue animando al montar (animate)
// para no introducir parpadeos en la carga inicial.
//
// Con prefers-reduced-motion / ajuste del usuario, MotionConfig neutraliza el
// movimiento globalmente, así que no hace falta lógica extra aquí.
// ============================================================================

import { motion } from "framer-motion";
import { revealParent, slideVariants, transition } from "@/lib/motion";

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Si es true, el grupo se revela al entrar en el viewport (scroll-reveal).
   * Si es false (por defecto), se revela al montar (ideal para el hero/above
   * the fold, donde ya está visible al cargar).
   */
  onView?: boolean;
}

// Margen del viewport para anticipar la entrada: empieza a animar un poco antes
// de que la sección sea totalmente visible, y se considera "vista" con ~12%.
const VIEWPORT = { once: true, amount: 0.18, margin: "0px 0px -10% 0px" } as const;

export function RevealGroup({
  children,
  className = "",
  onView = false,
}: RevealGroupProps) {
  const activation = onView
    ? { whileInView: "visible" as const, viewport: VIEWPORT }
    : { animate: "visible" as const };

  return (
    <motion.div
      variants={revealParent}
      initial="hidden"
      {...activation}
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
