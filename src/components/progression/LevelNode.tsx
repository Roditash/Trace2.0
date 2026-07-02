"use client";

// ============================================================================
// LevelNode - nodo visual de nivel en el mapa de mundo.
// Estados: locked, available, completed, mastered.
// ANIMATION_SYSTEM: 5.21 (unlock), 5.7 (check/completed), 7.8 (states).
// ============================================================================

import { motion } from "framer-motion";
import { type LevelStatus, type Level } from "@/lib/progression";
import { transition, spring, scale } from "@/lib/motion";
import StarRating from "@/components/game/StarRating";
import Icon, { CHECK_PATH } from "@/components/ui/Icon";

interface LevelNodeProps {
  level: Level;
  status: LevelStatus;
  isActive?: boolean;
  onClick?: () => void;
  /** Estrellas obtenidas (0-3). Se muestran si el nivel está completado. */
  stars?: number;
}

// Configuración visual por estado.
const STATE_CONFIG: Record<
  LevelStatus,
  { ring: string; bg: string; label: string; textColor: string }
> = {
  locked: {
    ring: "border-border",
    bg: "bg-surface-2",
    label: "Bloqueado",
    textColor: "text-muted",
  },
  available: {
    ring: "border-accent",
    bg: "bg-surface",
    label: "Disponible",
    textColor: "text-text",
  },
  completed: {
    ring: "border-success",
    bg: "bg-surface",
    label: "Completado",
    textColor: "text-text",
  },
  mastered: {
    ring: "border-accent",
    bg: "bg-accent/10",
    label: "Dominado",
    textColor: "text-accent",
  },
};

export default function LevelNode({
  level,
  status,
  isActive = false,
  onClick,
  stars = 0,
}: LevelNodeProps) {
  const cfg = STATE_CONFIG[status];
  const isClickable = status === "available" || status === "completed" || status === "mastered";

  return (
    <motion.div
      // 5.21: al pasar de locked a available, opacity sube.
      initial={false}
      animate={{
        opacity: status === "locked" ? 0.45 : 1,
      }}
      transition={transition.fade}
      className="flex items-start gap-4"
    >
      {/* Indicador circular */}
      <div className="relative flex flex-col items-center">
        <motion.button
          disabled={!isClickable}
          onClick={isClickable ? onClick : undefined}
          aria-label={`${level.name} — ${cfg.label}`}
          className={[
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            cfg.ring,
            cfg.bg,
            isClickable ? "cursor-pointer" : "cursor-default",
            isActive ? "shadow-[0_0_0_4px] shadow-accent/20" : "",
          ].join(" ")}
          whileHover={
            isClickable ? { scale: scale.hover } : undefined
          }
          whileTap={isClickable ? { scale: scale.pressed } : undefined}
          transition={spring.snappy}
        >
          {/* Icono por estado */}
          {status === "completed" || status === "mastered" ? (
            // Check (ANIMATION_SYSTEM 5.7): pathLength 0->1 con spring.snappy.
            // Usa CHECK_PATH compartido para una geometría coherente.
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden
            >
              <motion.path
                d={CHECK_PATH}
                stroke="rgb(var(--success))"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={spring.snappy}
              />
            </svg>
          ) : status === "locked" ? (
            // Candado (ANIMATION_SYSTEM 5.21)
            <Icon
              name="lock"
              className="h-4 w-4 opacity-40"
              strokeWidth={1.6}
            />
          ) : (
            // Disponible: número del nivel
            <span className="text-sm font-semibold text-accent">
              {level.order}
            </span>
          )}

          {/* Pulso sutil en nivel disponible (único, no en bucle) */}
          {status === "available" && isActive && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-accent opacity-40 animate-ping"
              style={{ animationIterationCount: 1, animationDuration: "1s" }}
            />
          )}
        </motion.button>
      </div>

      {/* Texto del nivel */}
      <div className="min-w-0 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${cfg.textColor}`}
          >
            {level.name}
          </span>
          <span
            className={[
              "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              status === "completed" || status === "mastered"
                ? "bg-success/10 text-success"
                : status === "available"
                ? "bg-accent/10 text-accent"
                : "bg-surface-2 text-muted",
            ].join(" ")}
          >
            {cfg.label}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">{level.concept}</p>
        {status !== "locked" && (
          <p className="mt-0.5 text-xs text-muted">{level.description}</p>
        )}
        {(status === "completed" || status === "mastered") && (
          <div className="mt-1.5">
            <StarRating value={stars} size={14} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
