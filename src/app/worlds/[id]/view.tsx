"use client";

// ============================================================================
// WorldDetailView - mapa de niveles con estados reales.
// LOCKED / AVAILABLE / COMPLETED / MASTERED con animaciones del ANIMATION_SYSTEM.
//
// Fase 5: los niveles disponibles y completados navegan a la pantalla de juego
// (/worlds/[id]/[level]). Se eliminó el botón temporal "Completar nivel".
// Las estrellas obtenidas se muestran en cada nodo completado.
// ============================================================================

import { notFound, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ProgressBar from "@/components/ui/ProgressBar";
import LevelNode from "@/components/progression/LevelNode";
import { useProgress } from "@/context/ProgressContext";
import {
  getWorld,
  getLevelsForWorld,
  computeLevelStatuses,
  WORLDS,
} from "@/lib/progression";
import { transition, staggerContainer, slideVariants } from "@/lib/motion";
import Icon from "@/components/ui/Icon";

export default function WorldDetailView({ id }: { id: string }) {
  // Los hooks se ejecutan SIEMPRE y en el mismo orden (reglas de hooks);
  // el guard de notFound() va después, una vez resueltos los hooks.
  const router = useRouter();
  const { completedIds, getWorldProgress, getStars, ready } = useProgress();

  const world = getWorld(id);
  if (!world) notFound();

  const levels = getLevelsForWorld(id);
  const statuses = computeLevelStatuses(world, completedIds, WORLDS);
  const progress = ready ? getWorldProgress(world) : 0;
  const completedCount = ready
    ? world.levelIds.filter((lid) => completedIds.has(lid)).length
    : 0;
  const isWorldComplete = completedCount === world.levelIds.length;

  const openLevel = (levelId: number) =>
    router.push(`/worlds/${id}/${levelId}`);

  // Primer nivel disponible aún no iniciado (empty state: invitar a entrar).
  const firstAvailable = levels.find(
    (l) => (statuses[l.id] ?? "locked") === "available"
  );
  const worldNotStarted = ready && completedCount === 0;

  return (
    <RevealGroup className="mx-auto max-w-xl">
        {/* Navegación de vuelta */}
        <RevealItem>
          <Link
            href="/worlds"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            <span aria-hidden>←</span>
            Todos los mundos
          </Link>
        </RevealItem>

        {/* Cabecera del mundo */}
        <RevealItem className="mt-5 flex items-start gap-4">
          <span
            aria-hidden
            className={[
              "grid h-14 w-14 shrink-0 place-items-center rounded-xl text-base font-bold",
              isWorldComplete
                ? "bg-success/10 text-success"
                : "bg-surface-2 text-text",
            ].join(" ")}
          >
            {world.badge}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {world.name}
              </h1>
              {isWorldComplete && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition.celebrate}
                  className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                >
                  Mundo completado
                </motion.span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{world.tagline}</p>
            <div className="mt-3">
              <ProgressBar value={progress} />
              <p className="mt-1 text-right text-xs text-muted">
                {completedCount} / {world.levelIds.length} niveles
              </p>
            </div>
          </div>
        </RevealItem>

        {/* Empty state: mundo aún no iniciado. Mensaje + acción + motivación. */}
        {worldNotStarted && firstAvailable && (
          <RevealItem className="mt-6">
            <div className="glass rounded-2xl border border-accent/20 p-5 elevation-md">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Tu primer reto
              </p>
              <h2 className="mt-1 font-semibold">{firstAvailable.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {firstAvailable.description} Aprenderás{" "}
                <span className="text-text">
                  {firstAvailable.concept.toLowerCase()}
                </span>{" "}
                resolviendo, no memorizando.
              </p>
              <button
                type="button"
                onClick={() => openLevel(firstAvailable.id)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Entrar al nivel
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </RevealItem>
        )}

        {/* Mapa de niveles */}
        <RevealItem className="mt-8">
          <h2 className="mb-5 text-sm font-medium text-muted uppercase tracking-wide">
            Niveles
          </h2>

          <div className="relative">
            {/* Línea conectora vertical (carril base + relleno de progreso). */}
            <div
              aria-hidden
              className="absolute left-[23px] top-6 bottom-6 w-0.5 rounded-full bg-border"
            />
            <motion.div
              aria-hidden
              className="absolute left-[23px] top-6 w-0.5 origin-top rounded-full bg-gradient-to-b from-accent to-accent/40"
              style={{ bottom: 24 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: progress / 100 }}
              transition={transition.progress}
            />

            <motion.div
              className="relative space-y-1"
              variants={staggerContainer()}
              initial="hidden"
              animate="visible"
            >
              {levels.map((level, i) => {
                const status = statuses[level.id] ?? "locked";
                const clickable =
                  status === "available" ||
                  status === "completed" ||
                  status === "mastered";

                return (
                  <motion.div
                    key={level.id}
                    className={[
                      "rounded-xl p-3 transition-colors",
                      status === "available"
                        ? "bg-surface-2"
                        : "bg-transparent",
                    ].join(" ")}
                    // Reveal con stagger (5.10) + énfasis al desbloquear (5.21).
                    variants={slideVariants}
                    layout
                    transition={transition.slide}
                  >
                    <LevelNode
                      level={level}
                      status={status}
                      isActive={status === "available" && i === 0}
                      stars={getStars(level.id)}
                      onClick={clickable ? () => openLevel(level.id) : undefined}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </RevealItem>
      </RevealGroup>
  );
}
