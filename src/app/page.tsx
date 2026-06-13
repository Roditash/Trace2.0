"use client";

// ============================================================================
// Home - presentación del producto con progreso real (Fase 4).
// Logo, eslogan, botón comenzar, último progreso desde localStorage,
// acceso a mundos con estado visual de avance.
// ============================================================================

import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useProgress } from "@/context/ProgressContext";
import { WORLDS } from "@/lib/progression";

export default function HomePage() {
  const { ready, globalProgress, completedIds, getWorldProgress, nextLevel } =
    useProgress();

  const hasStarted = ready && completedIds.size > 0;

  return (
    <RevealGroup className="mx-auto flex max-w-2xl flex-col gap-10 py-6 sm:py-12">
      {/* Marca + eslogan */}
      <RevealItem className="flex flex-col items-center gap-5 text-center">
        <span
          aria-hidden
          className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-2xl font-bold text-bg"
        >
          T
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trace
          </h1>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Aprende a pensar como programador.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {hasStarted && nextLevel ? (
            <Link href={`/worlds/${nextLevel.world.id}`}>
              <Button size="lg">Continuar</Button>
            </Link>
          ) : (
            <Link href="/worlds">
              <Button size="lg">Comenzar</Button>
            </Link>
          )}
          <Link href="/worlds">
            <Button size="lg" variant="ghost">
              Ver mundos
            </Button>
          </Link>
        </div>
      </RevealItem>

      {/* Progreso (con datos) o primer ingreso (empty state premium) */}
      <RevealItem className="w-full">
        {hasStarted ? (
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">
                {nextLevel ? "Continuar en " + nextLevel.world.name : "Tu progreso"}
              </span>
              <Link
                href="/profile"
                className="text-xs text-accent transition-colors hover:text-accent-strong"
              >
                Ver perfil
              </Link>
            </div>
            <ProgressBar value={globalProgress} />
            <p className="mt-2 text-xs text-muted">
              {completedIds.size} de 15 niveles completados
            </p>
            {nextLevel && (
              <p className="mt-1 text-xs text-muted">
                Siguiente: {nextLevel.level.name} — {nextLevel.level.concept}
              </p>
            )}
          </Card>
        ) : (
          <Card className="text-center">
            {/* Empty state: primer ingreso. Mensaje + acción + motivación. */}
            <div
              aria-hidden
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold">
              Tu primer concepto te espera
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {ready
                ? "En Trace no memorizas código: resuelves problemas y el código aparece como consecuencia. Empieza con las variables en el Mundo Python."
                : "Cargando tu progreso..."}
            </p>
            {ready && (
              <div className="mt-4">
                <Link href="/worlds/python">
                  <Button size="md">Empezar con Python</Button>
                </Link>
              </div>
            )}
            <p className="mt-3 text-xs text-muted">
              5 minutos bastan para completar tu primer nivel.
            </p>
          </Card>
        )}
      </RevealItem>

      {/* Mundos con progreso */}
      <RevealItem className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">Mundos</h2>
          <Link
            href="/worlds"
            className="text-sm text-accent transition-colors hover:text-accent-strong"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {WORLDS.map((world) => {
            const prog = ready ? getWorldProgress(world) : 0;
            const done = ready
              ? world.levelIds.filter((id) => completedIds.has(id)).length
              : 0;
            return (
              <Link key={world.id} href={`/worlds/${world.id}`}>
                <Card interactive className="flex flex-col items-center gap-2 p-4">
                  <span
                    aria-hidden
                    className={[
                      "grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold",
                      prog === 100
                        ? "bg-success/10 text-success"
                        : "bg-surface-2 text-text",
                    ].join(" ")}
                  >
                    {world.badge}
                  </span>
                  <span className="text-sm font-medium">{world.name}</span>
                  {ready && done > 0 && (
                    <span className="text-[11px] text-muted tabular-nums">
                      {done}/{world.levelIds.length}
                    </span>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </RevealItem>
    </RevealGroup>
  );
}
