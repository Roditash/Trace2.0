"use client";

// ============================================================================
// WorldCard - tarjeta de mundo en la pantalla World Selection.
// Cada tarjeta transmite IDENTIDAD, PROGRESO y CURIOSIDAD (PART 2):
//   - Identidad: badge + nombre + tagline.
//   - Progreso: barra real + "N / total" + estrellas/checks de avance.
//   - Curiosidad: World Preview — fila de conceptos que se aprenden dentro,
//     sin abrir el mundo. Los ya dominados se resaltan; los pendientes se
//     muestran sobrios. Así se ve "qué hay dentro" antes de entrar.
//
// Estado desbloqueado: entrada con stagger + hover suave (Motion v3).
// Estado bloqueado (premium, NO simplemente gris): superficie con profundidad,
//   preview difuminada y atenuada, mensaje claro + motivación educativa.
// ANIMATION_SYSTEM 6.9 (hoverLift/stagger), 7.2 (Card), 7.6 (ProgressBar).
// ============================================================================

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";
import ConceptIcon from "@/components/ui/ConceptIcon";
import Icon from "@/components/ui/Icon";
import { type World, type Level } from "@/lib/progression";
import { conceptPreviewForWorld } from "@/lib/concepts";
import { scale, transition, hoverLift, stagger } from "@/lib/motion";

interface WorldCardProps {
  world: World;
  /** Niveles del mundo (ordenados) para construir la vista previa de conceptos. */
  levels: Level[];
  /** Ids de niveles completados (subconjunto global). */
  completedIds: Set<number>;
  progress: number; // 0-100
  completedCount: number;
  isCompleted: boolean;
  /** Mundo bloqueado: requiere completar el mundo anterior. */
  locked?: boolean;
  /** Nombre del mundo que desbloquea a este (copy del estado bloqueado). */
  unlockedBy?: string;
}

// ----------------------------------------------------------------------------
// World Preview — fila de conceptos del mundo. `dimmed` para estado bloqueado.
// ----------------------------------------------------------------------------
function WorldPreview({
  world,
  levels,
  completedIds,
  dimmed = false,
}: {
  world: World;
  levels: Level[];
  completedIds: Set<number>;
  dimmed?: boolean;
}) {
  const previews = conceptPreviewForWorld(world.id, levels);

  return (
    <div className={dimmed ? "pointer-events-none select-none opacity-60" : ""}>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">
        Lo que aprenderás
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {previews.map((c) => {
          const mastered = completedIds.has(c.levelId);
          return (
            <li
              key={c.levelId}
              title={c.title}
              className={[
                "flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors",
                mastered
                  ? "bg-accent/10 text-accent ring-1 ring-inset ring-accent/20"
                  : "bg-surface-2/70 text-muted ring-1 ring-inset ring-border/60",
              ].join(" ")}
            >
              <ConceptIcon name={c.icon} className="h-3.5 w-3.5" />
              <span className="leading-none">{c.title}</span>
              {mastered && (
                <Icon
                  name="check"
                  className="h-3 w-3 text-accent/90"
                  strokeWidth={2.4}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function WorldCard({
  world,
  levels,
  completedIds,
  progress,
  completedCount,
  isCompleted,
  locked = false,
  unlockedBy,
}: WorldCardProps) {
  // Spotlight que sigue al cursor (sin re-render): actualiza --mx / --my.
  const cardRef = useRef<HTMLElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // ---- Estado bloqueado: premium, con profundidad y preview difuminada. ----
  if (locked) {
    return (
      <article
        className="glass relative overflow-hidden rounded-2xl border border-glass/10 p-5 elevation-sm"
        aria-label={`Mundo ${world.name}, bloqueado. Completa ${
          unlockedBy ?? "el mundo anterior"
        } para desbloquearlo.`}
      >
        {/* Velo diagonal sutil para reforzar el estado bloqueado sin "grisear". */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bg/0 via-bg/0 to-surface-2/40"
        />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="glass-subtle grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-muted"
              >
                {world.badge}
              </span>
              <div>
                <h2 className="font-semibold leading-tight text-text/80">
                  {world.name}
                </h2>
                <p className="text-xs text-muted/80">{world.tagline}</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-surface-2/70 px-2 py-1 text-[11px] font-medium text-muted ring-1 ring-inset ring-border/60">
              <Icon name="lock" className="h-3.5 w-3.5" strokeWidth={1.8} />
              Bloqueado
            </span>
          </div>

          {/* Vista previa atenuada: deja ver "qué hay dentro" sin abrirlo. */}
          <div className="mb-4">
            <WorldPreview
              world={world}
              levels={levels}
              completedIds={completedIds}
              dimmed
            />
          </div>

          {/* Mensaje claro + motivación educativa. */}
          <div className="glass-subtle rounded-xl p-3">
            <p className="text-sm leading-relaxed text-text/90">
              Completa{" "}
              <span className="font-medium text-accent">
                {unlockedBy ?? "el mundo anterior"}
              </span>{" "}
              para desbloquear este mundo.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Cada mundo construye sobre el anterior: los conceptos que dominas
              hoy son la base de los que vienen.
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ---- Estado disponible / completado. --------------------------------------
  return (
    <Link href={`/worlds/${world.id}`} className="block rounded-2xl">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMove}
        className={[
          "card-spotlight glass group relative rounded-2xl border p-5 elevation-sm transition-[border-color,box-shadow] duration-200",
          isCompleted ? "border-success/40" : "border-glass/10",
          "[@media(hover:hover)]:hover:border-glass/20 [@media(hover:hover)]:hover:shadow-lg",
        ].join(" ")}
        whileHover={hoverLift}
        whileTap={{ scale: scale.pressed }}
        transition={transition.press}
        aria-label={`Mundo ${world.name}, ${completedCount} de ${world.levelIds.length} niveles completados`}
      >
        {/* Cabecera */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={[
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold",
                isCompleted
                  ? "bg-success/10 text-success"
                  : "bg-surface-2 text-text",
              ].join(" ")}
            >
              {world.badge}
            </span>
            <div>
              <h2 className="font-semibold leading-tight">{world.name}</h2>
              <p className="text-xs text-muted">{world.tagline}</p>
            </div>
          </div>

          {/* Badge completado */}
          {isCompleted && (
            <span className="shrink-0 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              Completado
            </span>
          )}
        </div>

        {/* World Preview: conceptos del mundo (curiosidad sin abrir). */}
        <div className="mb-4">
          <WorldPreview
            world={world}
            levels={levels}
            completedIds={completedIds}
          />
        </div>

        {/* Progreso */}
        <ProgressBar value={progress} />
        <p className="mt-2 text-right text-xs text-muted">
          {completedCount === 0
            ? `${world.levelIds.length} niveles por descubrir`
            : `${completedCount} / ${world.levelIds.length} niveles`}
        </p>

        {/* Affordance de apertura, discreta, sólo con hover fino. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-5 text-muted opacity-0 transition-all duration-200 [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </motion.article>
    </Link>
  );
}
