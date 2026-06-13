"use client";

// ============================================================================
// ProblemFlow - visualización del modelo educativo del producto:
//
//   PROBLEMA -> ACCIÓN -> RESULTADO
//
// Una tira compacta sobre la escena de cada minijuego. El paso activo se
// ilumina según el estado real del nivel, para que el jugador entienda qué
// está resolviendo incluso sin leer texto. Sin representación de código
// interno: solo lenguaje del problema (piezas, monedas, puertas...).
//
// Estados de cada paso: done (check), active (acento + glow) o pending (muted).
// Animaciones con tokens del sistema; solo transform/opacity.
// ============================================================================

import { motion } from "framer-motion";
import { transition, spring } from "@/lib/motion";

export type FlowStage = "problem" | "action" | "result";

interface ProblemFlowProps {
  /** Descripción del problema en lenguaje del jugador (sin código). */
  problem: string;
  /** La acción que lo resuelve. */
  action: string;
  /** El resultado que se obtiene. */
  result: string;
  /** Paso actualmente activo según el estado del minijuego. */
  stage: FlowStage;
}

const ORDER: FlowStage[] = ["problem", "action", "result"];

const TITLES: Record<FlowStage, string> = {
  problem: "Problema",
  action: "Acción",
  result: "Resultado",
};

function Step({
  title,
  label,
  state,
}: {
  title: string;
  label: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: state === "pending" ? 0.55 : 1 }}
      transition={transition.fade}
      className={[
        "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center transition-colors",
        state === "active"
          ? "border-accent/50 bg-accent/10"
          : state === "done"
            ? "border-accent/25 bg-accent/5"
            : "border-border bg-surface-2/50",
      ].join(" ")}
    >
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
        {state === "done" && (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="rgb(var(--accent))"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={spring.snappy}
            />
          </svg>
        )}
        <span className={state === "pending" ? "text-muted" : "text-accent"}>
          {title}
        </span>
      </span>
      <span
        className={[
          "w-full truncate text-xs",
          state === "active" ? "font-medium text-text" : "text-muted",
        ].join(" ")}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function ProblemFlow({
  problem,
  action,
  result,
  stage,
}: ProblemFlowProps) {
  const labels: Record<FlowStage, string> = { problem, action, result };
  const activeIndex = ORDER.indexOf(stage);

  return (
    <div
      role="group"
      aria-label={`Progreso del reto: ${TITLES[stage]} — ${labels[stage]}`}
      className="flex items-stretch gap-2"
    >
      {ORDER.map((key, i) => (
        <div key={key} className="flex min-w-0 flex-1 items-center gap-2">
          <Step
            title={TITLES[key]}
            label={labels[key]}
            state={i < activeIndex ? "done" : i === activeIndex ? "active" : "pending"}
          />
          {i < ORDER.length - 1 && (
            <motion.span
              aria-hidden
              initial={false}
              animate={{ opacity: i < activeIndex ? 1 : 0.35 }}
              transition={transition.fade}
              className={i < activeIndex ? "text-accent" : "text-muted"}
            >
              →
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}
