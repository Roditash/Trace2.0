"use client";

// ============================================================================
// ProgressBar - ANIMATION_SYSTEM 7.6 / 5.18.
// Anima scaleX del valor con transition.progress. Solo transform/opacity.
// Datos de progreso son placeholders en esta fase (no hay progresión real).
// ============================================================================

import { motion } from "framer-motion";
import { transition } from "@/lib/motion";

export default function ProgressBar({
  value,
  label,
}: {
  /** 0 a 100 */
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted">{label}</span>
          <span className="tabular-nums text-muted">{clamped}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: clamped / 100 }}
          transition={transition.progress}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
