"use client";

// ============================================================================
// ProgressDashboard - panel de logros del perfil.
// Muestra: niveles completados, estrellas totales, mundos completados y
// conceptos aprendidos. Todo desde localStorage (ProgressContext).
//
// Debe sentirse como una pantalla de logros (Apple Fitness / Brilliant):
// métricas grandes con anillo de progreso, conceptos como insignias que se
// iluminan al aprenderse. Sin backend, sin economía, sin ranking.
//
// Microinteracciones contenidas: aparición progresiva (revealParent),
// hover de elevación sutil solo con puntero fino, anillo animado una vez.
// ============================================================================

import { motion } from "framer-motion";
import {
  revealParent,
  slideVariants,
  transition,
  spring,
} from "@/lib/motion";
import { LEVELS, WORLDS } from "@/lib/progression";
import { useProgress } from "@/context/ProgressContext";

// Máximos derivados de la fuente de verdad (progression.ts).
const TOTAL_LEVELS = LEVELS.length;
const TOTAL_WORLDS = WORLDS.length;
const MAX_STARS = TOTAL_LEVELS * 3;

// ---------------------------------------------------------------------------
// Anillo de progreso (estilo Apple Fitness, una sola vuelta, sin bucle)
// ---------------------------------------------------------------------------
function Ring({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const pct = max > 0 ? Math.min(1, value / max) : 0;

  return (
    <div className="relative grid h-16 w-16 place-items-center" aria-hidden>
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="rgb(var(--border))"
          strokeWidth="5"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct) }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        />
      </svg>
      <span className="absolute font-mono text-[11px] font-semibold text-text">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Métrica con anillo
// ---------------------------------------------------------------------------
function Metric({
  value,
  max,
  title,
  detail,
}: {
  value: number;
  max: number;
  title: string;
  detail: string;
}) {
  return (
    <motion.div
      variants={slideVariants}
      transition={transition.slide}
      className="glass flex items-center gap-4 rounded-2xl border border-glass/10 p-4"
      whileHover={{ y: -2, transition: transition.micro }}
    >
      <Ring value={value} max={max} label={`${value}`} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{detail}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Insignia de concepto aprendido
// ---------------------------------------------------------------------------
function ConceptBadge({
  concept,
  levelName,
  earned,
}: {
  concept: string;
  levelName: string;
  earned: boolean;
}) {
  return (
    <motion.li
      variants={slideVariants}
      transition={transition.slide}
      className={[
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        earned
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-surface-2/40 opacity-60",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "grid h-7 w-7 shrink-0 place-items-center rounded-full border",
          earned
            ? "border-accent/50 bg-accent/10"
            : "border-border bg-surface-2",
        ].join(" ")}
      >
        {earned ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="rgb(var(--accent))"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={spring.snappy}
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 opacity-50">
            <rect
              x="5"
              y="11"
              width="14"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 11V7a4 4 0 1 1 8 0v4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <div className="min-w-0">
        <p
          className={[
            "truncate text-sm font-medium",
            earned ? "text-text" : "text-muted",
          ].join(" ")}
        >
          {concept}
        </p>
        <p className="truncate text-[11px] text-muted">{levelName}</p>
      </div>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function ProgressDashboard() {
  const { ready, completedIds, totalStars, completedWorldCount } =
    useProgress();

  const completedCount = ready ? completedIds.size : 0;
  const conceptsLearned = LEVELS.filter((l) => completedIds.has(l.id));

  return (
    <motion.section
      aria-label="Logros"
      variants={revealParent}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Métricas principales con anillos */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          value={completedCount}
          max={TOTAL_LEVELS}
          title="Niveles"
          detail={`${completedCount} de ${TOTAL_LEVELS} completados`}
        />
        <Metric
          value={ready ? totalStars : 0}
          max={MAX_STARS}
          title="Estrellas"
          detail={`${ready ? totalStars : 0} de ${MAX_STARS} posibles`}
        />
        <Metric
          value={ready ? completedWorldCount : 0}
          max={TOTAL_WORLDS}
          title="Mundos"
          detail={`${ready ? completedWorldCount : 0} de ${TOTAL_WORLDS} completados`}
        />
      </div>

      {/* Conceptos aprendidos (insignias) */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass rounded-2xl border border-glass/10 p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Conceptos aprendidos</h2>
          <span className="font-mono text-xs tabular-nums text-muted">
            {conceptsLearned.length} / {TOTAL_LEVELS}
          </span>
        </div>
        {conceptsLearned.length === 0 ? (
          /* Empty state: sin conceptos todavía. Adelanto de lo que viene
             (mensaje claro + visual amigable + motivación educativa). */
          <div className="glass-subtle rounded-xl p-4">
            <p className="text-sm leading-relaxed text-text/90">
              Aquí aparecerán los conceptos que vayas dominando: variables,
              condicionales, bucles, funciones y listas.
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              No se trata de memorizarlos, sino de usarlos para resolver
              problemas. Completa tu primer nivel y gana tu primera insignia.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
              {["Variables", "Condicionales", "Bucles", "Funciones", "Listas"].map(
                (c) => (
                  <span
                    key={c}
                    className="rounded-md bg-surface-2/70 px-2 py-1 text-[11px] text-muted"
                  >
                    {c}
                  </span>
                )
              )}
            </div>
          </div>
        ) : (
          <motion.ul
            variants={revealParent}
            initial="hidden"
            animate="visible"
            className="grid gap-2 sm:grid-cols-2"
          >
            {LEVELS.map((level) => (
              <ConceptBadge
                key={level.id}
                concept={level.concept}
                levelName={level.name}
                earned={completedIds.has(level.id)}
              />
            ))}
          </motion.ul>
        )}
      </motion.div>
    </motion.section>
  );
}
