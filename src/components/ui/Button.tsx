"use client";

// ============================================================================
// Button - ANIMATION_SYSTEM 7.1 + microinteracciones premium (iOS/Linear).
// Hover: scale.hover + elevación magnética de 1px (sutil, nunca exagerada).
// Press: scale.pressed (spring.snappy) — feedback suave, sin rebote.
// Focus: outline global + glow eléctrico discreto en el variant primary.
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
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium select-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg hover:bg-accent-strong shadow-sm focus-visible:shadow-[0_0_16px_rgb(var(--accent)/0.35)]",
  secondary:
    "bg-surface-2 text-text hover:bg-surface border border-border",
  ghost: "bg-transparent text-muted hover:text-text hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
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
