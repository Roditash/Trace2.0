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
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import ConceptCard, {
  type ConceptState,
} from "@/components/progression/ConceptCard";
import Icon from "@/components/ui/Icon";
import WordReveal from "@/components/ui/WordReveal";
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

          {/* Mensaje principal — revelado palabra por palabra (entrada Apple). */}
          <WordReveal
            text="Aprende a pensar como un programador"
            accentIndices={[5]}
            breakAfter={2}
            delay={0.08}
            className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
          />

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

        {/* Vista previa del producto: lo primero que la gente ve "en acción".
            Muestra la idea Problema -> Acción -> Resultado en miniatura. */}
        <RevealItem className="mt-10 sm:mt-14">
          <HeroPreview />
        </RevealItem>
      </RevealGroup>

      {/* ====================== 2. FILOSOFÍA ====================== */}
      <RevealGroup onView>
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
      <RevealGroup onView>
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
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
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
      <RevealGroup onView>
        <RevealItem>
          {!ready ? (
            <HomeProgressSkeleton />
          ) : hasStarted ? (
            <Card spotlight className="overflow-hidden">
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
            <Card spotlight className="!border-accent/20 text-center">
              <div
                aria-hidden
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"
              >
                <Icon name="play" className="h-6 w-6" strokeWidth={1.8} />
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
                    spotlight
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
// Vista previa del producto (above the fold). No es una captura: es una
// recreación fiel y ligera de la pantalla de juego — un problema visual, el
// código que lo resuelve y el resultado encendido. Comunica la promesa del
// producto en un vistazo, con la profundidad de marca (glass, acento, grid).
// ---------------------------------------------------------------------------
function HeroPreview() {
  // Parallax 3D: el panel se inclina suavemente hacia el cursor. Usamos
  // MotionValues + spring para 60fps sin re-render. Sutil (máx ~6deg).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), spring.smooth);
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), spring.smooth);
  // El halo de acento sigue al cursor en X para dar sensación de luz viva.
  const haloX = useTransform(px, [0, 1], ["35%", "65%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  // Líneas de código que aparecen en cascada (sensación de "escribiéndose").
  const codeLine = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="relative mx-auto max-w-3xl"
      style={{ perspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {/* Halo de acento detrás del panel; sigue al cursor en X. */}
      <motion.div
        aria-hidden
        style={{ left: haloX }}
        className="pointer-events-none absolute -top-6 h-40 w-[60%] -translate-x-1/2 -z-10 rounded-full bg-accent/20 blur-3xl"
      />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="glass overflow-hidden rounded-2xl border border-glass/10 elevation-xl"
      >
        {/* Barra de ventana: contexto de "app", sin caer en lo literal. */}
        <div className="flex items-center gap-2 border-b border-glass/10 bg-surface/60 px-4 py-2.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-text/15" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-text/15" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-text/15" />
          <span className="ml-2 font-mono text-[11px] text-muted">
            Mundo Python · Nivel 1 · Variables
          </span>
        </div>

        <div className="grid gap-px bg-glass/10 sm:grid-cols-2">
          {/* Izquierda: el PROBLEMA visual + RESULTADO. */}
          <div className="relative flex min-h-[200px] flex-col bg-surface/40 p-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Problema
            </span>
            <p className="mt-1 text-sm text-muted">
              Enciende el faro guardando su brillo en una variable.
            </p>

            {/* Escena: un faro que se enciende (resultado del código). */}
            <div className="mt-4 grid flex-1 place-items-center rounded-xl border border-glass/10 bg-grid-faint">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...spring.subtle, delay: 0.3 }}
                style={{ transform: "translateZ(40px)" }}
                className="relative flex flex-col items-center"
              >
                {/* Resplandor del faro encendido. */}
                <motion.span
                  aria-hidden
                  className="absolute -top-3 h-16 w-16 rounded-full bg-accent/30 blur-xl"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span
                  aria-hidden
                  className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-b from-accent to-accent-strong text-white shadow-lg"
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
                    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                    <circle cx="12" cy="12" r="3.2" />
                  </svg>
                </span>
                <span className="mt-3 font-mono text-[11px] text-success">
                  Faro encendido
                </span>
              </motion.div>
            </div>
          </div>

          {/* Derecha: la ACCIÓN (el código que el usuario razona). */}
          <div className="flex min-h-[200px] flex-col bg-surface/20 p-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Acción
            </span>
            <p className="mt-1 text-sm text-muted">
              Escribes el código y el resultado aparece al instante.
            </p>

            <motion.pre
              variants={staggerContainer(0.12, 0.3)}
              initial="hidden"
              animate="visible"
              style={{ transform: "translateZ(30px)" }}
              className="mt-4 flex-1 overflow-hidden rounded-xl border border-glass/10 bg-bg/60 p-4 font-mono text-[13px] leading-relaxed"
            >
              <code>
                <motion.span variants={codeLine} className="block text-muted">
                  # Guarda el brillo
                </motion.span>
                <motion.span variants={codeLine} className="block">
                  <span className="text-accent-2">brillo</span>
                  <span className="text-muted"> = </span>
                  <span className="text-accent">100</span>
                </motion.span>
                <span className="block">&nbsp;</span>
                <motion.span variants={codeLine} className="block text-muted">
                  # Enciende el faro
                </motion.span>
                <motion.span variants={codeLine} className="block">
                  <span className="text-accent-2">encender</span>
                  <span className="text-muted">(brillo)</span>
                </motion.span>
                <motion.span variants={codeLine} className="block text-success">
                  # -&gt; El faro brilla al 100%
                </motion.span>
              </code>
            </motion.pre>
          </div>
        </div>
      </motion.div>
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
              className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-muted/70 sm:block"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
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
