"use client";

// ============================================================================
// Button - ANIMATION_SYSTEM 7.1 + microinteracciones premium (iOS/macOS).
// Estética Apple: píldora continua, azul de sistema con texto blanco,
// secundario tipo "filled gray" de iOS y ghost tipo enlace de barra.
// Hover: scale.hover + elevación magnética de 1px (sutil, nunca exagerada).
// Press: scale.pressed (spring.snappy) — feedback suave, sin rebote.
// Focus: outline global + halo discreto en el variant primary.
// Disabled: sin animaciones de movimiento.
// ============================================================================

import { motion, type HTMLMotionProps } from "framer-motion";
import { scale, transition } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] select-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "sheen bg-accent text-white hover:bg-accent-strong shadow-sm focus-visible:shadow-[0_0_16px_rgb(var(--accent)/0.4)]",
  secondary:
    "bg-surface-2/80 text-text hover:bg-surface-2 border border-glass/10 backdrop-blur",
  ghost: "bg-transparent text-accent hover:bg-accent/10",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: scale.hover, y: -1 }}
      whileTap={disabled ? undefined : { scale: scale.pressed, y: 0 }}
      transition={transition.press}
      {...props}
    >
      {children}
    </motion.button>
  );
}
