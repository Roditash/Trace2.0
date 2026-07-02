"use client";

// ============================================================================
// WordReveal - revela un titular palabra por palabra (entrada estilo Apple).
//
// Cada palabra entra con un sutil desenfoque + desplazamiento vertical y un
// stagger corto, dando una sensación de "enfoque" progresivo. Construido SOLO
// con los tokens de motion del sistema (distancias, easing, stagger). Respeta
// "reducir movimiento" porque MotionConfig (MotionRoot) neutraliza el gesto.
//
// Permite marcar palabras con acento (gradiente de marca) mediante el array
// `accentIndices`. El salto de línea responsivo se controla con `breakAfter`.
// ============================================================================

import { motion } from "framer-motion";
import { distance, duration, ease, stagger } from "@/lib/motion";

interface WordRevealProps {
  /** El titular como texto plano; se divide por espacios. */
  text: string;
  className?: string;
  /** Índices de palabra (0-based) que reciben el gradiente de acento. */
  accentIndices?: number[];
  /** Índice de palabra tras el cual insertar un salto de línea en sm+. */
  breakAfter?: number;
  /** Retardo inicial antes de empezar (s). */
  delay?: number;
}

const container = (delayChildren: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.slow, delayChildren },
  },
});

const word = {
  hidden: { opacity: 0, y: distance.md, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.large, ease: ease.out },
  },
};

export default function WordReveal({
  text,
  className = "",
  accentIndices = [],
  breakAfter,
  delay = 0,
}: WordRevealProps) {
  const words = text.split(" ");
  const accent = new Set(accentIndices);

  return (
    <motion.h1
      variants={container(delay)}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          {/* La palabra: el wrapper recorta el blur/slide sin afectar al layout. */}
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              variants={word}
              className={
                accent.has(i) ? "text-gradient-accent inline-block" : "inline-block"
              }
            >
              {w}
            </motion.span>
          </span>
          {/* Espacio entre palabras (preservado fuera del overflow). */}
          {i < words.length - 1 && (breakAfter === i ? (
            <br className="hidden sm:block" />
          ) : (
            " "
          ))}
        </span>
      ))}
    </motion.h1>
  );
}
