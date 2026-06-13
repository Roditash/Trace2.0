"use client";

// ============================================================================
// Toggle - conmutador accesible. Movimiento del thumb con spring.subtle.
// Usado en Ajustes (tema oscuro, reducir animaciones).
// ============================================================================

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors ${
        checked ? "bg-accent" : "bg-surface-2"
      }`}
    >
      {/* Pulgar estilo iOS: blanco con sombra suave, contraste en ambos temas */}
      <motion.span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.35)]"
        animate={{ left: checked ? 22 : 3 }}
        transition={spring.subtle}
      />
    </button>
  );
}
