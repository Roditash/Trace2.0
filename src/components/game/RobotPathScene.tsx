"use client";

// ============================================================================
// RobotPathScene - minijuego de Funciones (Fase 9, nivel 4).
//
// Un pequeño robot explorador debe cruzar un camino de casillas hasta una
// estación de energía (la meta). Moverlo paso a paso sería tedioso: la solución
// es CREAR una habilidad (la función move) y USARLA varias veces.
//
// El jugador VE el concepto de reutilización:
//   - Primero crea la habilidad una sola vez  -> "Nueva habilidad creada".
//   - Luego cada llamada move() la USA          -> el robot avanza una casilla.
//   - move() -> MOVE -> el robot se mueve        (la función contiene acciones).
//
// Estados internos (la animación ocurre en las transiciones entre ellos):
//   idle         -> el robot espera al inicio del camino, sin habilidad.
//   skillCreated -> se detectó `def move():`; energía entra al robot, glow teal.
//   moving       -> se llama move(); el robot avanza una casilla por cada llamada.
//   completed    -> el robot llegó a la meta; estación activándose, destello, fiesta.
//
// Tema teal mediante el token del sistema --accent (la identidad pedida en la
// spec). Para alpha se usa SIEMPRE la forma rgb(var(--accent) / a). Sin hex
// concatenado, sin .replace(). Sin imágenes de red. Solo SVG + transform/opacity.
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { transition, spring } from "@/lib/motion";

// Estados visuales (nombres de la spec Fase 9).
export type RobotState = "idle" | "skillCreated" | "moving" | "completed";

interface RobotPathSceneProps {
  state: RobotState;
  /** Total de casillas del camino (= llamadas esperadas, normalmente 3). */
  totalTiles: number;
  /** Casilla actual del robot (0 = inicio; N = ha dado N pasos). */
  step: number;
}

// Paleta teal basada en el token del sistema --accent (rgb 46 229 157).
// Se usan strings rgb(var(--accent) / a) para respetar la regla de alpha.
const ACCENT = "rgb(var(--accent))";
const ACCENT_GLOW = "rgb(var(--accent) / 0.55)";
const ACCENT_GLOW_SOFT = "rgb(var(--accent) / 0.22)";
const ACCENT_FAINT = "rgb(var(--accent) / 0.08)";

// Geometría del camino.
const TILE = 60; // ancho/alto de cada casilla
const GAP = 14; // separación entre casillas

export default function RobotPathScene({
  state,
  totalTiles,
  step,
}: RobotPathSceneProps) {
  const hasSkill = state !== "idle";
  const moving = state === "moving";
  const arrived = state === "completed";

  // Número de casillas a dibujar (mínimo 3 para que el camino tenga sentido).
  const tiles = Math.max(3, totalTiles || 3);
  // Casilla en la que está el robot (clamp al rango válido).
  const pos = Math.min(Math.max(step, 0), tiles);

  // Anchura total del camino (casillas + huecos + meta).
  const trackWidth = (tiles + 1) * TILE + tiles * GAP;
  // Desplazamiento horizontal del robot según su casilla.
  const robotX = pos * (TILE + GAP);

  return (
    <div
      className="scene-dark relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, rgb(46 229 157 / 0.10), rgb(13 16 19 / 0) 58%), linear-gradient(180deg, #0c0f12 0%, #0a0c0e 100%)",
      }}
      role="img"
      aria-label={`Robot explorador: estado ${state}, casilla ${pos} de ${tiles}`}
    >
      {/* Resplandor ambiental, más intenso al crear la habilidad y al llegar */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${ACCENT_GLOW_SOFT} 0%, ${ACCENT_FAINT} 45%, transparent 70%)`,
        }}
        initial={false}
        animate={{
          opacity: arrived ? 1 : moving ? 0.8 : hasSkill ? 0.55 : 0.28,
          scale: arrived ? 1.18 : 1,
        }}
        transition={transition.fade}
      />

      {/* Cuadrícula tenue de fondo (sensación de laboratorio / mapa sci-fi) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(46 229 157 / 0.25) 1px, transparent 1px), linear-gradient(90deg, rgb(46 229 157 / 0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(110% 80% at 50% 45%, #000 35%, transparent 80%)",
        }}
      />

      {/* Destello al llegar a la meta */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            key="flash"
            aria-hidden
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.6], scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={transition.celebrate}
            className="pointer-events-none absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, ${ACCENT_GLOW_SOFT} 38%, transparent 68%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ===================== EL CAMINO ===================== */}
      <div className="relative flex h-[220px] w-full items-center justify-center px-6">
        <div
          className="relative"
          style={{ width: trackWidth, height: TILE + 40, maxWidth: "100%" }}
        >
          {/* Casillas del camino */}
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center" style={{ gap: GAP }}>
            {Array.from({ length: tiles }).map((_, i) => {
              const reached = i < pos; // casillas ya pisadas
              const isCurrent = i === pos - 1 && !arrived;
              return (
                <PathTile
                  key={i}
                  active={reached || (arrived && i < tiles)}
                  pulse={isCurrent}
                  index={i}
                />
              );
            })}
            {/* Meta: estación de energía */}
            <EnergyStation active={arrived} charging={moving} />
          </div>

          {/* Robot, posicionado sobre la casilla actual */}
          <motion.div
            className="absolute top-1/2 z-10"
            style={{ left: 0 }}
            initial={false}
            animate={{ x: robotX + TILE / 2, y: "-50%" }}
            transition={spring.smooth}
          >
            <div className="-translate-x-1/2">
              <Robot
                hasSkill={hasSkill}
                charging={state === "skillCreated"}
                walking={moving}
                celebrating={arrived}
              />
            </div>
          </motion.div>

          {/* Obstáculos decorativos (cristales sci-fi a los lados del camino) */}
          <Decoration className="absolute -top-3 left-[18%]" delay={0} />
          <Decoration className="absolute -bottom-2 left-[46%]" delay={0.8} small />
          <Decoration className="absolute -top-1 left-[72%]" delay={1.4} />
        </div>
      </div>

      {/* ===================== CAPA DE INFORMACIÓN ===================== */}
      <div className="relative z-10 flex min-h-[78px] w-full flex-col items-center gap-2 px-4 pb-5 pt-1">
        <AnimatePresence mode="wait">
          {/* Pista visual en idle */}
          {state === "idle" && (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="text-center font-mono text-xs text-muted"
            >
              Crea la habilidad{" "}
              <span style={{ color: ACCENT }}>move</span> y úsala para llegar a
              la estación.
            </motion.p>
          )}

          {/* ETAPA 1: habilidad creada */}
          {state === "skillCreated" && (
            <motion.div
              key="skill"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={spring.smooth}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: ACCENT }}
              >
                def move():
              </span>
              <span
                className="rounded-full border px-4 py-1.5 text-base font-bold tracking-wide"
                style={{
                  color: ACCENT,
                  borderColor: "rgb(46 229 157 / 0.4)",
                  background: "rgb(46 229 157 / 0.10)",
                  textShadow: `0 0 14px ${ACCENT_GLOW}`,
                }}
              >
                Nueva habilidad creada
              </span>
            </motion.div>
          )}

          {/* ETAPA 2: cada llamada move() -> MOVE -> el robot se mueve */}
          {moving && (
            <motion.div
              key="moving"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="flex flex-col items-center gap-1.5"
            >
              {pos === 0 ? (
                <p className="font-mono text-sm" style={{ color: ACCENT }}>
                  Usando la habilidad...
                </p>
              ) : (
                <motion.div
                  key={pos}
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={spring.snappy}
                  className="flex items-center gap-2 font-mono text-sm"
                >
                  <span style={{ color: ACCENT }}>move()</span>
                  <span className="text-muted">&rarr;</span>
                  <span className="text-text">MOVE</span>
                  <span className="text-muted">&rarr;</span>
                  <span className="text-muted">avanza</span>
                </motion.div>
              )}
              <p className="font-mono text-[11px] text-muted">
                Pasos dados: {pos} / {tiles}
              </p>
            </motion.div>
          )}

          {/* FINAL: objetivo alcanzado */}
          {arrived && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring.snappy}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: ACCENT }}
              >
                Estación de energía
              </span>
              <span
                className="rounded-xl border px-4 py-1.5 text-base font-bold tracking-wide"
                style={{
                  color: ACCENT,
                  borderColor: ACCENT,
                  background: "rgb(46 229 157 / 0.12)",
                  textShadow: `0 0 14px ${ACCENT_GLOW}`,
                  boxShadow: `0 0 22px ${ACCENT_GLOW_SOFT}`,
                }}
              >
                OBJETIVO ALCANZADO
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

// Una casilla del camino. Se ilumina cuando el robot la pisa.
function PathTile({
  active,
  pulse,
  index,
}: {
  active: boolean;
  pulse: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="relative grid place-items-center rounded-xl border"
      style={{
        width: TILE,
        height: TILE,
        borderColor: active ? "rgb(46 229 157 / 0.6)" : "rgb(255 255 255 / 0.08)",
        background: active ? "rgb(46 229 157 / 0.12)" : "rgb(255 255 255 / 0.02)",
        boxShadow: active ? `0 0 16px ${ACCENT_GLOW_SOFT}` : "none",
      }}
      initial={false}
      animate={{
        scale: pulse ? [1, 1.08, 1] : 1,
      }}
      transition={pulse ? { duration: 0.5, ease: "easeOut" } : transition.fade}
    >
      {/* Marca central de la casilla */}
      <span
        className="block rounded-full"
        style={{
          width: 8,
          height: 8,
          background: active ? ACCENT : "rgb(255 255 255 / 0.18)",
          boxShadow: active ? `0 0 8px ${ACCENT}` : "none",
        }}
      />
      {/* Numeración tenue (mapa de exploración) */}
      <span className="absolute bottom-1 right-1.5 font-mono text-[9px] text-muted/60">
        {index + 1}
      </span>
    </motion.div>
  );
}

// La meta: una estación de energía que se activa cuando el robot llega.
function EnergyStation({ active, charging }: { active: boolean; charging: boolean }) {
  return (
    <div className="relative grid place-items-center" style={{ width: TILE, height: TILE }}>
      {/* Halo de la estación */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: TILE + 28,
          height: TILE + 28,
          background: `radial-gradient(circle, ${ACCENT_GLOW_SOFT} 0%, transparent 70%)`,
        }}
        animate={{ opacity: active ? [0.6, 1, 0.6] : charging ? 0.4 : 0.2, scale: active ? 1.1 : 1 }}
        transition={active ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : transition.fade}
      />
      <svg width={TILE} height={TILE} viewBox="0 0 60 60" aria-hidden>
        <defs>
          <linearGradient id="stationBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16323a" />
            <stop offset="100%" stopColor="#0e2026" />
          </linearGradient>
        </defs>
        {/* Base de la estación */}
        <rect
          x="12"
          y="10"
          width="36"
          height="40"
          rx="6"
          fill="url(#stationBody)"
          stroke={active ? ACCENT : "rgb(46 229 157 / 0.4)"}
          strokeWidth="2"
          style={{ filter: active ? `drop-shadow(0 0 8px ${ACCENT})` : "none" }}
        />
        {/* Núcleo de energía (rombo) */}
        <motion.path
          d="M30 18 L40 30 L30 42 L20 30 Z"
          fill={active ? ACCENT : "rgb(46 229 157 / 0.25)"}
          stroke={ACCENT}
          strokeWidth="1.5"
          animate={{ opacity: active ? [0.7, 1, 0.7] : charging ? 0.5 : 0.35 }}
          transition={active ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : transition.fade}
          style={{ filter: active ? `drop-shadow(0 0 6px ${ACCENT})` : "none" }}
        />
        {/* Antenas */}
        <line x1="18" y1="10" x2="18" y2="3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="10" x2="42" y2="3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="3" r="1.8" fill={ACCENT} />
        <circle cx="42" cy="3" r="1.8" fill={ACCENT} />
      </svg>
    </div>
  );
}

// El robot explorador: adorable, sci-fi, con ojo expresivo y antena.
function Robot({
  hasSkill,
  charging,
  walking,
  celebrating,
}: {
  hasSkill: boolean;
  charging: boolean;
  walking: boolean;
  celebrating: boolean;
}) {
  const glow = hasSkill ? `drop-shadow(0 0 10px ${ACCENT_GLOW})` : "none";

  return (
    <motion.div
      className="relative"
      style={{ width: 56, height: 64 }}
      // Pequeño "bote" continuo: flota cuando tiene habilidad, salta al celebrar.
      animate={
        celebrating
          ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] }
          : walking
            ? { y: [0, -6, 0] }
            : hasSkill
              ? { y: [0, -3, 0] }
              : { y: 0 }
      }
      transition={
        celebrating
          ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
          : walking
            ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
            : hasSkill
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
      }
    >
      {/* Pulso de energía contenido al crear la habilidad (ETAPA 1) */}
      <AnimatePresence>
        {charging && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 block rounded-full border"
            style={{
              width: 70,
              height: 70,
              marginLeft: -35,
              marginTop: -35,
              borderColor: ACCENT_GLOW,
            }}
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <svg width={56} height={64} viewBox="0 0 56 64" aria-hidden style={{ filter: glow }}>
        <defs>
          <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe7ea" />
            <stop offset="100%" stopColor="#aab7bd" />
          </linearGradient>
          <radialGradient id="robotEye" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#eafff6" />
            <stop offset="55%" stopColor={ACCENT} />
            <stop offset="100%" stopColor="#0e8f63" />
          </radialGradient>
        </defs>

        {/* Antena */}
        <line x1="28" y1="10" x2="28" y2="3" stroke="#aab7bd" strokeWidth="2" strokeLinecap="round" />
        <motion.circle
          cx="28"
          cy="3"
          r="3"
          fill={hasSkill ? ACCENT : "#8a979d"}
          animate={hasSkill ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={hasSkill ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : transition.fade}
          style={{ filter: hasSkill ? `drop-shadow(0 0 5px ${ACCENT})` : "none" }}
        />

        {/* Cabeza / cuerpo (cápsula redondeada y adorable) */}
        <rect x="8" y="10" width="40" height="34" rx="14" fill="url(#robotBody)" stroke="#8a979d" strokeWidth="1.5" />

        {/* Visor oscuro */}
        <rect x="13" y="17" width="30" height="18" rx="9" fill="#10171a" stroke="#2a3640" strokeWidth="1" />

        {/* Ojo expresivo (brilla con la habilidad) */}
        <motion.circle
          cx="28"
          cy="26"
          r="6.5"
          fill="url(#robotEye)"
          animate={celebrating ? { r: [6.5, 7.5, 6.5] } : { r: 6.5 }}
          transition={celebrating ? { duration: 0.5, repeat: Infinity } : transition.fade}
          style={{ filter: hasSkill ? `drop-shadow(0 0 6px ${ACCENT})` : "none" }}
        />
        {/* Brillo del ojo (toque entrañable) */}
        <circle cx="25.5" cy="23.5" r="1.8" fill="#ffffff" fillOpacity="0.9" />

        {/* Patitas */}
        <rect x="16" y="44" width="9" height="12" rx="3.5" fill="#aab7bd" stroke="#8a979d" strokeWidth="1" />
        <rect x="31" y="44" width="9" height="12" rx="3.5" fill="#aab7bd" stroke="#8a979d" strokeWidth="1" />
        {/* Brazos */}
        <rect x="3" y="22" width="6" height="14" rx="3" fill="#aab7bd" stroke="#8a979d" strokeWidth="1" />
        <rect x="47" y="22" width="6" height="14" rx="3" fill="#aab7bd" stroke="#8a979d" strokeWidth="1" />

        {/* Núcleo de energía en el pecho (se enciende con la habilidad) */}
        <motion.circle
          cx="28"
          cy="40"
          r="2.6"
          fill={hasSkill ? ACCENT : "#8a979d"}
          animate={hasSkill ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.8 }}
          transition={hasSkill ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : transition.fade}
        />
      </svg>
    </motion.div>
  );
}

// Cristal decorativo flotante (obstáculo ambiental, no bloquea).
function Decoration({
  className,
  delay = 0,
  small = false,
}: {
  className?: string;
  delay?: number;
  small?: boolean;
}) {
  const s = small ? 14 : 20;
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{ y: [0, -6, 0], opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={s} height={s * 1.4} viewBox="0 0 20 28">
        <path
          d="M10 0 L18 11 L10 28 L2 11 Z"
          fill="rgb(46 229 157 / 0.18)"
          stroke="rgb(46 229 157 / 0.5)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}
