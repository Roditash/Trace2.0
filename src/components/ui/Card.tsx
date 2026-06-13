"use client";

// ============================================================================
// Card - ANIMATION_SYSTEM 7.2
// Hover (solo si interactiva y con puntero fino): y:-2 + sombra sutil, micro.
// Press: scale.pressed (spring.snappy). Estado selected: borde de acento.
// ============================================================================

import { motion, type HTMLMotionProps } from "framer-motion";
import { hoverLift, scale, transition } from "@/lib/motion";

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
        "glass rounded-2xl border p-5 elevation-sm",
        selected ? "border-accent" : "border-glass/10",
        interactive ? "cursor-pointer" : "",
        // Hover: el lift (y:-2) comunica elevación; el borde y la sombra suben
        // una sola capa (hover:shadow-lg). Sin sombras agresivas. Puntero fino.
        interactive
          ? "[@media(hover:hover)]:hover:border-glass/20 [@media(hover:hover)]:hover:shadow-lg"
          : "",
        "transition-[border-color,box-shadow] duration-200",
        className,
      ].join(" ")}
      whileHover={interactive ? hoverLift : undefined}
      whileTap={interactive ? { scale: scale.pressed } : undefined}
      transition={transition.press}
      {...props}
    >
      {children}
    </motion.div>
  );
}
