"use client";

// ============================================================================
// WorldCard - tarjeta de mundo en la pantalla World Selection.
// Muestra: badge, nombre, tagline, progreso, niveles completados / total.
// Estado bloqueado (empty state premium): mensaje claro + acción recomendada
// + motivación educativa. No es un Link cuando está bloqueado.
// ANIMATION_SYSTEM 7.2 (Card), 7.6 (ProgressBar).
// ============================================================================

import Link from "next/link";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";
import { type World } from "@/lib/progression";
import { scale, transition } from "@/lib/motion";

interface WorldCardProps {
  world: World;
  progress: number;       // 0-100
  completedCount: number;
  isCompleted: boolean;
  /** Mundo bloqueado: requiere completar el mundo anterior. */
  locked?: boolean;
  /** Nombre del mundo que desbloquea a este (copy del estado bloqueado). */
  unlockedBy?: string;
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function WorldCard({
  world,
  progress,
  completedCount,
  isCompleted,
  locked = false,
  unlockedBy,
}: WorldCardProps) {
  // ---- Estado bloqueado: tarjeta informativa, no navegable. ----------------
  if (locked) {
    return (
      <article
        className="glass rounded-2xl border border-glass/10 p-5"
        aria-label={`Mundo ${world.name}, bloqueado. Completa ${
          unlockedBy ?? "el mundo anterior"
        } para desbloquearlo.`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="glass-subtle grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-muted"
            >
              {world.badge}
            </span>
            <div>
              <h2 className="font-semibold leading-tight text-muted">
                {world.name}
              </h2>
              <p className="text-xs text-muted/80">{world.tagline}</p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-surface-2/70 px-2 py-1 text-[11px] font-medium text-muted">
            <LockIcon />
            Bloqueado
          </span>
        </div>

        {/* Mensaje claro + acción recomendada + motivación educativa */}
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
      </article>
    );
  }

  // ---- Estado disponible / completado. --------------------------------------
  return (
    <Link href={`/worlds/${world.id}`} className="block rounded-2xl">
      <motion.article
        className={[
          "glass group rounded-2xl border p-5 transition-colors",
          isCompleted ? "border-success/40" : "border-glass/10",
          "[@media(hover:hover)]:hover:border-glass/20",
        ].join(" ")}
        whileHover={{ y: -2, transition: transition.micro }}
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

        {/* Progreso */}
        <ProgressBar value={progress} />
        <p className="mt-2 text-right text-xs text-muted">
          {completedCount === 0
            ? `${world.levelIds.length} niveles por descubrir`
            : `${completedCount} / ${world.levelIds.length} niveles`}
        </p>
      </motion.article>
    </Link>
  );
}
