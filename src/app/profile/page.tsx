"use client";

// ============================================================================
// Profile - pantalla de logros (Fase 4 + Pulido Premium).
// ProgressDashboard: niveles, estrellas, mundos y conceptos aprendidos con
// anillos de progreso e insignias. Todo desde localStorage. Sin backend.
// ============================================================================

import { useState } from "react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import ProgressDashboard from "@/components/progression/ProgressDashboard";
import { useProgress } from "@/context/ProgressContext";
import { WORLDS } from "@/lib/progression";

export default function ProfilePage() {
  const {
    ready,
    completedIds,
    getWorldProgress,
    resetProgress,
    nextLevel,
  } = useProgress();

  const [confirmReset, setConfirmReset] = useState(false);

  const totalCompleted = completedIds.size;

  return (
    <RevealGroup className="mx-auto max-w-2xl">
      {/* Cabecera */}
      <RevealItem className="flex items-center gap-4">
        <span
          aria-label="Avatar"
          className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-lg font-semibold text-muted"
        >
          T
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mi progreso
          </h1>
          <p className="text-sm text-muted">
            {!ready
              ? "Cargando..."
              : totalCompleted === 0
              ? "Tu historia como programador empieza aquí."
              : `${totalCompleted} nivel${totalCompleted !== 1 ? "es" : ""} completado${totalCompleted !== 1 ? "s" : ""}`}
          </p>
        </div>
      </RevealItem>

      {/* Empty state premium: perfil vacío (mensaje + acción + motivación) */}
      {ready && totalCompleted === 0 && (
        <RevealItem className="mt-6">
          <Card className="!border-accent/20 text-center">
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
                <path d="M12 3l2.4 5.1 5.6.7-4.1 3.9 1 5.6-4.9-2.7-4.9 2.7 1-5.6L4 8.8l5.6-.7L12 3z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold">
              Este perfil se llenará de logros
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Cada nivel que completes deja una marca: estrellas, conceptos
              dominados y mundos conquistados. Tu primer nivel es el más
              importante de todos.
            </p>
            <div className="mt-4">
              <Link href="/worlds/python">
                <Button size="md">Completar mi primer nivel</Button>
              </Link>
            </div>
          </Card>
        </RevealItem>
      )}

      {/* Pantalla de logros: niveles, estrellas, mundos, conceptos */}
      <RevealItem className="mt-8">
        <ProgressDashboard />
      </RevealItem>

      {/* Progreso por mundo */}
      <RevealItem className="mt-4">
        <Card>
          <h2 className="mb-4 text-sm font-semibold">Por mundo</h2>
          <div className="space-y-4">
            {WORLDS.map((world) => {
              const prog = ready ? getWorldProgress(world) : 0;
              const done = ready
                ? world.levelIds.filter((id) => completedIds.has(id)).length
                : 0;
              return (
                <div key={world.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <Link
                      href={`/worlds/${world.id}`}
                      className="font-medium transition-colors hover:text-accent"
                    >
                      {world.name}
                    </Link>
                    <span className="text-xs text-muted">
                      {done} / {world.levelIds.length}
                    </span>
                  </div>
                  <ProgressBar value={prog} />
                </div>
              );
            })}
          </div>
        </Card>
      </RevealItem>

      {/* Siguiente nivel sugerido */}
      {ready && nextLevel && (
        <RevealItem className="mt-4">
          <Card className="!border-accent/30 !bg-accent/5">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Continuar
            </p>
            <h2 className="mt-1 font-semibold">{nextLevel.level.name}</h2>
            <p className="mt-0.5 text-sm text-muted">
              {nextLevel.world.name} · {nextLevel.level.concept}
            </p>
            <div className="mt-4">
              <Link href={`/worlds/${nextLevel.world.id}`}>
                <Button size="md">Ir al nivel</Button>
              </Link>
            </div>
          </Card>
        </RevealItem>
      )}

      {/* Reiniciar progreso */}
      <RevealItem className="mt-8">
        <div className="glass rounded-xl border border-glass/10 p-4">
          <h2 className="text-sm font-semibold">Reiniciar progreso</h2>
          <p className="mt-1 text-xs text-muted">
            Borra todo el progreso guardado en este navegador. Esta acción no
            se puede deshacer.
          </p>
          <div className="mt-3">
            {confirmReset ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setConfirmReset(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="md"
                  className="bg-danger text-bg hover:opacity-90"
                  onClick={() => {
                    resetProgress();
                    setConfirmReset(false);
                  }}
                >
                  Confirmar
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="md"
                className="text-danger"
                onClick={() => setConfirmReset(true)}
              >
                Reiniciar todo
              </Button>
            )}
          </div>
        </div>
      </RevealItem>
    </RevealGroup>
  );
}
