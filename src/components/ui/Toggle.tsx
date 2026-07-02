"use client";

// ============================================================================
// Toggle - conmutador accesible con proporciones y color de iOS (verde de
// sistema al activarse, pulgar blanco con sombra suave). Movimiento del
// thumb con spring.subtle. Usado en Ajustes (tema oscuro, reducir animaciones).
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
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ${
        checked
          ? "bg-success"
          : "bg-text/[0.16] dark:bg-white/[0.18]"
      }`}
    >
      {/* Pulgar estilo iOS: blanco con sombra suave, contraste en ambos temas */}
      <motion.span
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0/0.15),0_1px_1px_rgb(0_0_0/0.16)]"
        animate={{ left: checked ? 22 : 2 }}
        transition={spring.subtle}
      />
    </button>
  );
}
