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
  hoverLift,
} from "@/lib/motion";
import { LEVELS, WORLDS, getLevel } from "@/lib/progression";
import { getConcept, iconForConcept } from "@/lib/concepts";
import ConceptIcon from "@/components/ui/ConceptIcon";
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
  emphasis = false,
}: {
  value: number;
  max: number;
  title: string;
  detail: string;
  /** Resalta la métrica como un logro destacado (estrellas). */
  emphasis?: boolean;
}) {
  return (
    <motion.div
      variants={slideVariants}
      transition={transition.slide}
      className={[
        "glass flex items-center gap-4 rounded-2xl border p-4 elevation-sm transition-[border-color,box-shadow] duration-200",
        emphasis ? "border-accent/30" : "border-glass/10",
        "[@media(hover:hover)]:hover:shadow-lg",
      ].join(" ")}
      whileHover={hoverLift}
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
// Insignia de concepto aprendido (con identidad: icono + frase que ENSEÑA)
// ---------------------------------------------------------------------------
function ConceptBadge({ levelId, earned }: { levelId: number; earned: boolean }) {
  const level = getLevel(levelId);
  const meta = getConcept(levelId); // identidad rica (Python 1-5)
  const title = meta?.title ?? level?.concept ?? "";
  const icon = meta?.icon ?? iconForConcept(level?.concept ?? "");
  // Línea secundaria: para conceptos con identidad, la frase que enseña.
  const detail = earned && meta ? meta.teaches : level?.name ?? "";

  return (
    <motion.li
      variants={slideVariants}
      transition={transition.slide}
      className={[
        "flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        earned
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-surface-2/40 opacity-70",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
          earned
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border bg-surface-2 text-muted",
        ].join(" ")}
      >
        <ConceptIcon name={icon} className="h-4 w-4" />
        {earned && (
          <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-bg">
            <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={spring.snappy}
              />
            </svg>
          </span>
        )}
      </span>
      <div className="min-w-0 pt-0.5">
        <p
          className={[
            "truncate text-sm font-semibold",
            earned ? "text-text" : "text-muted",
          ].join(" ")}
        >
          {title}
        </p>
        <p
          className={[
            "mt-0.5 text-[11px] leading-snug",
            earned ? "text-muted" : "text-muted/80",
          ].join(" ")}
        >
          {earned && meta ? (
            <>
              Has aprendido a <span className="text-text/80">{detail}</span>
            </>
          ) : (
            detail
          )}
        </p>
      </div>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function ProgressDashboard() {
  const { ready, completedIds, totalStars, completedWorldCount, nextLevel } =
    useProgress();

  const completedCount = ready ? completedIds.size : 0;
  const conceptsLearned = LEVELS.filter((l) => completedIds.has(l.id));

  // "Próximo objetivo": el siguiente nivel disponible y su concepto.
  const nextConcept = nextLevel ? getConcept(nextLevel.level.id) : undefined;
  const nextTitle =
    nextConcept?.title ?? nextLevel?.level.concept ?? null;

  return (
    <motion.section
      aria-label="Logros"
      variants={revealParent}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Learning Journey: resumen del recorrido (conceptos + próximo objetivo) */}
      <motion.div
        variants={slideVariants}
        transition={transition.slide}
        className="glass-elevated relative overflow-hidden rounded-2xl border border-glass/10 p-5 elevation-md"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Tu recorrido
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {conceptsLearned.length === 0
              ? "Empieza a dominar conceptos"
              : `${conceptsLearned.length} concepto${
                  conceptsLearned.length !== 1 ? "s" : ""
                } dominado${conceptsLearned.length !== 1 ? "s" : ""}`}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {ready && nextTitle ? (
              <>
                Próximo objetivo:{" "}
                <span className="font-medium text-text">{nextTitle}</span>
                {nextLevel ? ` · ${nextLevel.world.name}` : ""}
              </>
            ) : completedCount > 0 ? (
              "Has recorrido todos los conceptos disponibles. Domínalos sin pistas para las tres estrellas."
            ) : (
              "Cada nivel desbloquea una habilidad de pensamiento que se queda contigo."
            )}
          </p>
        </div>
      </motion.div>

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
          emphasis
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
        className="glass rounded-2xl border border-glass/10 p-5 elevation-sm"
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
              {[
                { t: "Variables", i: "variable" as const },
                { t: "Condicionales", i: "conditional" as const },
                { t: "Bucles", i: "loop" as const },
                { t: "Funciones", i: "function" as const },
                { t: "Listas", i: "list" as const },
              ].map((c) => (
                <span
                  key={c.t}
                  className="flex items-center gap-1.5 rounded-md bg-surface-2/70 px-2 py-1 text-[11px] text-muted ring-1 ring-inset ring-border/60"
                >
                  <ConceptIcon name={c.i} className="h-3.5 w-3.5" />
                  {c.t}
                </span>
              ))}
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
                levelId={level.id}
                earned={completedIds.has(level.id)}
              />
            ))}
          </motion.ul>
        )}
      </motion.div>
    </motion.section>
  );
}
