"use client";

// ============================================================================
// StarRating - muestra 1-3 estrellas. ANIMATION_SYSTEM 5.7 / 9.3 (star reward).
// Las estrellas obtenidas aparecen con scale + spring.snappy y un leve stagger.
// Sin exageraciones, sin rebote.
// ============================================================================

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";

interface StarRatingProps {
  /** Estrellas obtenidas (0-3). */
  value: number;
  /** Tamaño del icono en px. */
  size?: number;
  /** Si true, anima la aparición (para pantalla de victoria). */
  animate?: boolean;
}

function Star({
  filled,
  size,
  index,
  animate,
}: {
  filled: boolean;
  size: number;
  index: number;
  animate: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      initial={animate ? { scale: 0.4, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ ...spring.snappy, delay: animate ? index * stagger.slow : 0 }}
    >
      <path
        d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z"
        fill={filled ? "rgb(var(--star))" : "none"}
        stroke={filled ? "rgb(var(--star))" : "rgb(var(--border))"}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export default function StarRating({
  value,
  size = 28,
  animate = false,
}: StarRatingProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={`${value} de 3 estrellas`}
    >
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          index={i}
          filled={i < value}
          size={size}
          animate={animate}
        />
      ))}
    </div>
  );
}
