"use client";

// ============================================================================
// Home - Landing de producto (fase Premium).
// Objetivo: en los primeros 5 segundos el usuario entiende QUÉ es Trace, POR
// QUÉ existe y QUÉ lo hace diferente. Inspiración: Brilliant, Linear, Arc.
//
// Estructura:
//   1. Hero       -> mensaje principal + propuesta de valor + acción.
//   2. Filosofía  -> Problema -> Acción -> Resultado (la visión del producto).
//   3. Conceptos  -> las 5 habilidades fundamentales como desbloqueables.
//   4. Progreso   -> continuación real desde localStorage (o empty state).
//
// Sin backend. Progreso real desde ProgressContext. Animaciones con tokens.
// ============================================================================

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import ConceptCard, {
  type ConceptState,
} from "@/components/progression/ConceptCard";
import { useProgress } from "@/context/ProgressContext";
import { WORLDS } from "@/lib/progression";
import { PYTHON_CONCEPTS } from "@/lib/concepts";
import { slideVariants, transition, spring, staggerContainer } from "@/lib/motion";

export default function HomePage() {
  const { ready, globalProgress, completedIds, getWorldProgress, nextLevel } =
    useProgress();

  const hasStarted = ready && completedIds.size > 0;
  const masteredConcepts = ready
    ? PYTHON_CONCEPTS.filter((c) => completedIds.has(c.levelId)).length
    : 0;

  // El "siguiente concepto a aprender": el primero no dominado.
  const nextConceptId =
    PYTHON_CONCEPTS.find((c) => !completedIds.has(c.levelId))?.levelId ??
    null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 pb-6 sm:gap-24 sm:pb-12">
      {/* ====================== 1. HERO ====================== */}
      <RevealGroup className="relative">
        {/* Fondo: rejilla muy sutil + halo de acento, da profundidad (Linear). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-12 -z-10 mx-auto h-[420px] max-w-3xl bg-grid-faint opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
        />

        <RevealItem className="flex flex-col items-center pt-4 text-center sm:pt-8">
          {/* Etiqueta de categoría: qué es, en una línea. */}
          <span className="inline-flex items-center gap-2 rounded-full border border-glass/10 bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
            Aprende a programar resolviendo, no memorizando
          </span>

          {/* Mensaje principal. */}
          <h1 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Aprende a pensar
            <br className="hidden sm:block" />{" "}
            como un{" "}
            <span className="text-gradient-accent">programador</span>.
          </h1>

          {/* Propuesta de valor: por qué existe + qué lo hace diferente. */}
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            No memorices sintaxis. Resuelve problemas visuales y mira cómo el
            código aparece como consecuencia de tu razonamiento.
          </p>

          {/* Acción principal. */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            {hasStarted && nextLevel ? (
              <Link href={`/worlds/${nextLevel.world.id}`}>
                <Button size="lg">Continuar aprendiendo</Button>
              </Link>
            ) : (
              <Link href="/worlds/python">
                <Button size="lg">Empezar gratis</Button>
              </Link>
            )}
            <Link href="/worlds">
              <Button size="lg" variant="ghost">
                Ver los mundos
              </Button>
            </Link>
          </div>

          {/* Señal de confianza sobria (sin métricas inventadas). */}
          <p className="mt-5 text-xs text-muted">
            100% en tu navegador · Sin cuentas · 5 minutos por nivel
          </p>
        </RevealItem>
      </RevealGroup>

      {/* ====================== 2. FILOSOFÍA ====================== */}
      <RevealGroup>
        <RevealItem className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Una sola idea, repetida hasta dominarla
          </h2>
        </RevealItem>

        <RevealItem className="mt-8">
          <PhilosophyFlow />
        </RevealItem>
      </RevealGroup>

      {/* ====================== 3. CONCEPTOS ====================== */}
      <RevealGroup>
        <RevealItem className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Habilidades
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Cinco formas de pensar que desbloqueas
            </h2>
          </div>
          {ready && (
            <span className="rounded-full border border-glass/10 bg-surface/60 px-3 py-1 font-mono text-xs tabular-nums text-muted">
              {masteredConcepts} / {PYTHON_CONCEPTS.length} dominadas
            </span>
          )}
        </RevealItem>

        <RevealItem className="mt-6">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            {PYTHON_CONCEPTS.map((concept, i) => {
              const state: ConceptState = completedIds.has(concept.levelId)
                ? "mastered"
                : concept.levelId === nextConceptId
                  ? "next"
                  : "locked";
              return (
                <ConceptCard
                  key={concept.levelId}
                  concept={concept}
                  order={i + 1}
                  state={ready ? state : "locked"}
                />
              );
            })}
          </motion.div>
        </RevealItem>
      </RevealGroup>

      {/* ====================== 4. PROGRESO / CTA ====================== */}
      <RevealGroup>
        <RevealItem>
          {!ready ? (
            <HomeProgressSkeleton />
          ) : hasStarted ? (
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                    Continúa donde lo dejaste
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold">
                    {nextLevel
                      ? nextLevel.level.name
                      : "Has completado todos los niveles"}
                  </h3>
                  {nextLevel && (
                    <p className="mt-0.5 text-sm text-muted">
                      {nextLevel.world.name} · {nextLevel.level.concept}
                    </p>
                  )}
                </div>
                {nextLevel && (
                  <Link href={`/worlds/${nextLevel.world.id}`} className="shrink-0">
                    <Button size="lg">Continuar</Button>
                  </Link>
                )}
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted">Progreso total</span>
                  <span className="tabular-nums text-muted">
                    {completedIds.size} / 15 niveles
                  </span>
                </div>
                <ProgressBar value={globalProgress} />
              </div>
            </Card>
          ) : (
            <Card className="!border-accent/20 text-center">
              <div
                aria-hidden
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">
                Tu primer concepto te espera
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                Empieza por las variables en el Mundo Python. En cinco minutos
                resolverás tu primer reto y verás aparecer tu primer código.
              </p>
              <div className="mt-5">
                <Link href="/worlds/python">
                  <Button size="lg">Empezar con Python</Button>
                </Link>
              </div>
            </Card>
          )}
        </RevealItem>

        {/* Mundos disponibles (acceso rápido). */}
        <RevealItem className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted">Explora los mundos</h2>
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
                  <Card
                    interactive
                    className="flex flex-col items-center gap-2 p-4"
                  >
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
                      <span className="text-[11px] tabular-nums text-muted">
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tira PROBLEMA -> ACCIÓN -> RESULTADO (la visión del producto, estática).
// ---------------------------------------------------------------------------
const FLOW = [
  {
    title: "Problema",
    body: "Un reto visual claro: una puerta cerrada, un cofre, un robot detenido.",
  },
  {
    title: "Acción",
    body: "Razonas la solución y escribes el código que la hace realidad.",
  },
  {
    title: "Resultado",
    body: "Ves el efecto al instante. El concepto queda comprendido, no memorizado.",
  },
];

function PhilosophyFlow() {
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="grid items-stretch gap-3 sm:grid-cols-3"
    >
      {FLOW.map((step, i) => (
        <motion.div
          key={step.title}
          variants={slideVariants}
          transition={transition.slide}
          className="relative flex flex-col gap-2 rounded-2xl border border-glass/10 bg-surface/50 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
              {i + 1}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              {step.title}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted">{step.body}</p>

          {/* Conector entre pasos (solo desktop). */}
          {i < FLOW.length - 1 && (
            <span
              aria-hidden
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-muted sm:block"
            >
              →
            </span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton del bloque de progreso mientras se lee localStorage (PART 8).
// ---------------------------------------------------------------------------
function HomeProgressSkeleton() {
  return (
    <div className="glass rounded-2xl border border-glass/10 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-3 w-32 rounded-full" />
          <div className="skeleton h-5 w-44 rounded-md" />
        </div>
        <div className="skeleton h-12 w-28 rounded-xl" />
      </div>
      <div className="skeleton mt-5 h-2 w-full rounded-full" />
    </div>
  );
}
