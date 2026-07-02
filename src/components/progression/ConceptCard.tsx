"use client";

// ============================================================================
// ConceptCard - una habilidad desbloqueable (Variables, Condicionales, ...).
// Estilo Brilliant/Arc: el concepto se presenta como una habilidad de
// pensamiento, no como sintaxis. Tres estados:
//   mastered  -> dominado: acento, check, borde vivo.
//   next      -> el siguiente a aprender: borde de acento sutil + pulso único.
//   locked    -> aún por llegar: sobrio (no gris muerto), número de orden.
// Animaciones: solo opacity/transform con tokens del sistema.
// ============================================================================

import { motion } from "framer-motion";
import { slideVariants, transition, spring, hoverLift } from "@/lib/motion";
import ConceptIcon from "@/components/ui/ConceptIcon";
import { CHECK_PATH } from "@/components/ui/Icon";
import type { ConceptMeta } from "@/lib/concepts";

export type ConceptState = "mastered" | "next" | "locked";

interface ConceptCardProps {
  concept: ConceptMeta;
  order: number;
  state: ConceptState;
}

export default function ConceptCard({
  concept,
  order,
  state,
}: ConceptCardProps) {
  const mastered = state === "mastered";
  const next = state === "next";

  return (
    <motion.div
      variants={slideVariants}
      transition={transition.slide}
      whileHover={hoverLift}
      className={[
        "group relative flex flex-col gap-3 rounded-2xl border p-4 transition-[border-color,box-shadow] duration-200",
        "[@media(hover:hover)]:hover:shadow-lg",
        mastered
          ? "border-accent/40 bg-accent/[0.06] shadow-md [@media(hover:hover)]:hover:border-accent/60"
          : next
            ? "border-accent/30 bg-surface/60 shadow-sm [@media(hover:hover)]:hover:border-accent/50"
            : "border-glass/10 bg-surface/40 [@media(hover:hover)]:hover:border-glass/20",
      ].join(" ")}
    >
      {/* Icono + estado */}
      <div className="flex items-center justify-between">
        <span
          className={[
            "relative grid h-10 w-10 place-items-center rounded-xl border transition-transform duration-200",
            "[@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:scale-105",
            mastered
              ? "border-accent/40 bg-accent/10 text-accent"
              : next
                ? "border-accent/25 bg-accent/5 text-accent"
                : "border-glass/10 bg-surface-2 text-muted",
          ].join(" ")}
        >
          <ConceptIcon name={concept.icon} className="h-5 w-5" />
          {next && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl border border-accent/50 opacity-50 motion-safe:animate-ping"
              style={{ animationIterationCount: 1, animationDuration: "1.1s" }}
            />
          )}
        </span>

        {mastered ? (
          <span
            className="grid h-6 w-6 place-items-center rounded-full bg-accent/15"
            aria-label="Dominado"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <motion.path
                d={CHECK_PATH}
                stroke="rgb(var(--accent))"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={spring.snappy}
              />
            </svg>
          </span>
        ) : (
          <span
            className={[
              "font-mono text-xs tabular-nums",
              next ? "text-accent" : "text-muted/70",
            ].join(" ")}
            aria-hidden
          >
            0{order}
          </span>
        )}
      </div>

      {/* Texto */}
      <div>
        <p
          className={[
            "text-sm font-semibold",
            mastered || next ? "text-text" : "text-text/80",
          ].join(" ")}
        >
          {concept.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          {concept.skill}
        </p>
      </div>
    </motion.div>
  );
}
