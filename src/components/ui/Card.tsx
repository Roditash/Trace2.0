"use client";

// ============================================================================
// Card - ANIMATION_SYSTEM 7.2
// Hover (solo si interactiva y con puntero fino): y:-2 + sombra sutil, micro.
// Press: scale.pressed (spring.snappy). Estado selected: borde de acento.
//
// v2 (fluidez): prop opcional `spotlight` — un resplandor de acento muy sutil
// que SIGUE AL CURSOR (efecto Linear/Vercel). Se actualiza vía CSS custom
// properties en onMouseMove, sin re-render de React, para que sea fluido a
// 60fps. Solo se activa con puntero fino y respeta el blur de cristal.
// ============================================================================

import { useRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { hoverLift, scale, transition } from "@/lib/motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  interactive?: boolean;
  selected?: boolean;
  /** Resplandor de acento que sigue al cursor (premium, opt-in). */
  spotlight?: boolean;
}

export default function Card({
  interactive = false,
  selected = false,
  spotlight = false,
  className = "",
  children,
  onMouseMove,
  ...props
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Actualiza la posición del foco directamente sobre el nodo (sin re-render).
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlight && ref.current) {
      const r = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
      ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    onMouseMove?.(e);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className={[
        "glass rounded-2xl border p-5 elevation-sm",
        selected ? "border-accent" : "border-glass/10",
        interactive ? "cursor-pointer" : "",
        // Hover: el lift (y:-2) comunica elevación; el borde y la sombra suben
        // una sola capa (hover:shadow-lg). Sin sombras agresivas. Puntero fino.
        interactive
          ? "[@media(hover:hover)]:hover:border-glass/20 [@media(hover:hover)]:hover:shadow-lg"
          : "",
        spotlight ? "card-spotlight" : "",
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
