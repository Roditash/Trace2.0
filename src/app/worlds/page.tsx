"use client";

// ============================================================================
// World Selection - progreso visual real por mundo (Fase 4).
// Muestra: progreso de barra, niveles completados, estado global.
// ANIMATION_SYSTEM 8.2: slide + stagger en entrada.
// ============================================================================

import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import WorldCard from "@/components/progression/WorldCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { useProgress } from "@/context/ProgressContext";
import { WORLDS } from "@/lib/progression";

export default function WorldsPage() {
  const { getWorldProgress, completedIds, globalProgress, ready } =
    useProgress();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Cabecera */}
      <RevealGroup>
        <RevealItem>
          <header className="mb-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Mundos
            </h1>
            <p className="mt-2 text-muted">
              Cada mundo es un lenguaje. Completa los niveles para avanzar.
            </p>
          </header>
        </RevealItem>

        {/* Progreso global */}
        <RevealItem className="glass mb-8 mt-4 rounded-2xl border border-glass/10 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progreso total</span>
            <span className="tabular-nums text-muted">
              {ready ? completedIds.size : 0} / 15 niveles
            </span>
          </div>
          <ProgressBar value={ready ? globalProgress : 0} />
        </RevealItem>

        {/* Lista de mundos */}
        <RevealItem>
          <div className="grid gap-4 sm:grid-cols-2">
            {WORLDS.map((world, i) => {
              const prog = ready ? getWorldProgress(world) : 0;
              const done = ready
                ? world.levelIds.filter((id) => completedIds.has(id)).length
                : 0;
              const isCompleted = done === world.levelIds.length;

              // Mundo bloqueado: el mundo anterior debe estar completo.
              const prevWorld = i > 0 ? WORLDS[i - 1] : null;
              const locked =
                ready && prevWorld
                  ? !prevWorld.levelIds.every((id) => completedIds.has(id))
                  : false;

              return (
                <WorldCard
                  key={world.id}
                  world={world}
                  progress={prog}
                  completedCount={done}
                  isCompleted={isCompleted}
                  locked={locked}
                  unlockedBy={prevWorld?.name}
                />
              );
            })}
          </div>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
