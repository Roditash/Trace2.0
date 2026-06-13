"use client";

// ============================================================================
// Card - ANIMATION_SYSTEM 7.2
// Hover (solo si interactiva y con puntero fino): y:-2 + sombra sutil, micro.
// Press: scale.pressed (spring.snappy). Estado selected: borde de acento.
// ============================================================================

import { motion, type HTMLMotionProps } from "framer-motion";
import { distance, scale, transition } from "@/lib/motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  interactive?: boolean;
  selected?: boolean;
}

export default function Card({
  interactive = false,
  selected = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={[
        "glass rounded-2xl border p-5",
        selected ? "border-accent" : "border-glass/10",
        interactive ? "cursor-pointer" : "",
        // Hover: el lift (y:-2) ya comunica elevación; el borde sube apenas.
        // Sin sombras agresivas adicionales (la sombra vive en .glass).
        interactive ? "[@media(hover:hover)]:hover:border-glass/20" : "",
        "transition-colors",
        className,
      ].join(" ")}
      whileHover={
        interactive
          ? { y: -distance.xs / 2, transition: transition.micro }
          : undefined
      }
      whileTap={interactive ? { scale: scale.pressed } : undefined}
      transition={transition.press}
      {...props}
    >
      {children}
    </motion.div>
  );
}
