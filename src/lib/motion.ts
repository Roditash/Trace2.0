// ============================================================================
// Trace - Motion Tokens
// Implementación EXACTA de la sección 6 de ANIMATION_SYSTEM.md.
// Toda animación del proyecto debe construirse a partir de estos tokens.
// No inventar valores. No crear excepciones.
// ============================================================================

import type { Transition, Variants } from "framer-motion";

// 6.1 Duraciones (segundos)
export const duration = {
  instant: 0,
  micro: 0.12,
  normal: 0.22,
  large: 0.36,
  celebrate: 0.6,
} as const;

// 6.2 Easing (cubic-bezier)
export const ease = {
  standard: [0.2, 0, 0, 1],
  out: [0.0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  inOut: [0.4, 0, 0.2, 1],
  emphasis: [0.2, 0, 0, 1],
} as const;

// 6.3 Springs (sin rebote visible)
export const spring = {
  subtle: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
  smooth: { type: "spring", stiffness: 220, damping: 28, mass: 1 },
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 1 },
} as const satisfies Record<string, Transition>;

// 6.4 Distancias (px)
export const distance = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

// 6.5 Escalas
export const scale = {
  pressed: 0.98,
  in: 0.98,
  hover: 1.02,
} as const;

// 6.6 Stagger y retardos (segundos)
export const stagger = {
  fast: 0.03,
  normal: 0.04,
  slow: 0.06,
} as const;

export const delay = {
  tooltip: 0.3,
  none: 0,
} as const;

// 6.7 Presets semánticos de transición (interfaz preferida)
export const transition = {
  micro: { duration: duration.micro, ease: ease.standard },
  fade: { duration: duration.normal, ease: ease.out },
  slide: { duration: duration.normal, ease: ease.out },
  scale: spring.smooth,
  press: spring.snappy,
  page: { duration: duration.large, ease: ease.standard },
  modal: spring.smooth,
  tooltip: { duration: duration.normal, ease: ease.out, delay: delay.tooltip },
  progress: { duration: duration.normal, ease: ease.out },
  celebrate: { duration: duration.celebrate, ease: ease.emphasis },
} as const satisfies Record<string, Transition>;

// 6.8 Variants reutilizables (contrato)
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideVariants: Variants = {
  hidden: { opacity: 0, y: distance.sm },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: distance.sm },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: scale.in },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: scale.in },
};

// Contenedor para reveal con stagger entre hijos (sección 5.10).
export const revealParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.normal } },
};

// Page transition (sección 5.11): saliente/entrante con y pequeño.
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: distance.sm },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -distance.sm },
};

// ============================================================================
// Motion v3 (PART 4) — helpers de stagger y hover unificados.
// Documentados en ANIMATION_SYSTEM.md sección 6.9. Construidos SOLO con los
// tokens existentes (duraciones, easing, stagger, distancias). No introducen
// nuevas duraciones ni curvas: solo combinan las ya aprobadas.
// ============================================================================

/**
 * Contenedor de stagger parametrizable. Reutiliza staggerChildren y permite un
 * pequeño delayChildren para que la cabecera entre antes que la lista.
 * Mantiene el límite de la sección 11.2 (máximo 8 hijos simultáneos).
 */
export function staggerContainer(
  each: number = stagger.normal,
  delayChildren: number = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: each, delayChildren },
    },
  };
}

/**
 * Elevación de hover unificada (cards/superficies interactivas). Un único
 * gesto: y:-2 + sombra que sube de capa. Solo con puntero fino (los
 * componentes aplican whileHover dentro de [@media(hover:hover)]).
 */
export const hoverLift = {
  y: -distance.xs / 2, // -2px
  transition: { duration: duration.micro, ease: ease.standard },
} as const;

// Preset de énfasis discreto (un solo pulso, sin loop): pasar de 1 a scale.hover
// y volver. Para "respuesta correcta" o un hito recién desbloqueado.
export const emphasisPulse = {
  scale: [1, scale.hover, 1],
  transition: { duration: duration.large, ease: ease.standard },
} as const;
