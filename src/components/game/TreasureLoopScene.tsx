"use client";

// ============================================================================
// TreasureLoopScene - minijuego de Bucles (Fase 8, nivel 3).
//
// Un cofre del tesoro rodeado de 5 monedas mágicas. Para abrir el cofre hay que
// recoger TODAS las monedas, una por una. El jugador VE la repetición: la misma
// acción (recoger una moneda) ocurre 5 veces, mientras un contador marca cada
// iteración. Cuando no quedan monedas, el bucle termina y el cofre se abre con
// un destello de luz dorada contenido (sin partículas — ANIMATION_SYSTEM 9/10.1).
//
// Estados internos (la animación ocurre en las transiciones entre ellos):
//   idle        -> el cofre espera, cerrado, sin monedas.
//   coinsFound  -> se detectó `coins = 5`; aparecen 5 monedas (escalonadas).
//   looping     -> se detectó `while`; el anillo del bucle gira; las monedas
//                  desaparecen una a una según `iteration` (1..5).
//   completed   -> el bucle terminó; el cofre se abre, luz, partículas doradas.
//
// Tema dorado mediante hex (precedente: CrystalScene usa hex violeta). Para los
// tokens del sistema con alpha se usa SIEMPRE la forma rgb(var(--x) / a).
// Sin imágenes de red. Solo SVG + transform/opacity (rendimiento).
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { transition, spring, stagger } from "@/lib/motion";

// Estados visuales (nombres de la spec Fase 8).
export type LoopState = "idle" | "coinsFound" | "looping" | "completed";

interface TreasureLoopSceneProps {
  state: LoopState;
  /** Total de monedas detectadas (normalmente 5). */
  totalCoins: number;
  /** Iteración actual del bucle (0 = aún ninguna; N = N monedas recogidas). */
  iteration: number;
}

// Paleta dorada de la escena (hex, igual que el precedente violeta).
const GOLD = "#fbbf24";
const GOLD_LIGHT = "#fcd34d";
const GOLD_DEEP = "#f59e0b";
const GOLD_GLOW = "rgba(251, 191, 36, 0.55)";
const GOLD_GLOW_SOFT = "rgba(251, 191, 36, 0.22)";

// Radio del anillo de monedas alrededor del cofre (en px sobre el lienzo).
const RADIUS = 132;

export default function TreasureLoopScene({
  state,
  totalCoins,
  iteration,
}: TreasureLoopSceneProps) {
  const showCoins = state !== "idle";
  const looping = state === "looping";
  const opened = state === "completed";

  // Cantidad de monedas a dibujar (mínimo 1 para que la escena tenga sentido).
  const count = Math.max(1, totalCoins || 5);
  // Monedas recogidas hasta ahora (las primeras `collected` desaparecen).
  const collected = Math.min(iteration, count);
  const remaining = Math.max(0, count - collected);

  return (
    <div
      className="scene-dark relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 42%, rgba(251,191,36,0.10), rgba(13,16,19,0) 58%), linear-gradient(180deg, #0c0f12 0%, #0a0c0e 100%)",
      }}
      role="img"
      aria-label={`Cofre del tesoro: estado ${state}, ${remaining} monedas restantes`}
    >
      {/* Resplandor ambiental que se intensifica con el bucle / la apertura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${GOLD_GLOW_SOFT} 0%, rgba(251,191,36,0.06) 45%, transparent 70%)`,
        }}
        initial={false}
        animate={{ opacity: opened ? 1 : looping ? 0.85 : showCoins ? 0.5 : 0.25, scale: opened ? 1.15 : 1 }}
        transition={transition.fade}
      />

      {/* Explosión de luz al abrir el cofre */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="burst"
            aria-hidden
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0.7], scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={transition.celebrate}
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${GOLD_GLOW} 0%, rgba(251,191,36,0.18) 38%, transparent 68%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ===================== ESCENARIO CIRCULAR ===================== */}
      <div className="relative flex h-[300px] w-[300px] items-center justify-center">
        {/* Anillo del bucle: gira mientras se repite la acción */}
        <AnimatePresence>
          {(looping || showCoins) && !opened && (
            <motion.div
              key="loop-ring"
              aria-hidden
              className="pointer-events-none absolute"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: looping ? 1 : 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={transition.fade}
            >
              <motion.svg
                width={310}
                height={310}
                viewBox="0 0 310 310"
                animate={{ rotate: looping ? 360 : 0 }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: looping ? Infinity : 0,
                }}
              >
                <circle
                  cx="155"
                  cy="155"
                  r="148"
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="1.5"
                  strokeOpacity={looping ? 0.85 : 0.3}
                  strokeDasharray="14 22"
                  strokeLinecap="round"
                  style={{ filter: looping ? `drop-shadow(0 0 6px ${GOLD})` : "none" }}
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monedas alrededor del cofre */}
        <AnimatePresence>
          {showCoins &&
            !opened &&
            Array.from({ length: count }).map((_, i) => {
              const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * RADIUS;
              const y = Math.sin(angle) * RADIUS;
              const isCollected = i < collected;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: "50%", top: "50%" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isCollected
                      ? {
                          // La moneda recogida vuela hacia el cofre y se desvanece.
                          opacity: 0,
                          scale: 0.2,
                          x: -10,
                          y: 0,
                        }
                      : {
                          opacity: 1,
                          scale: 1,
                          x,
                          y,
                        }
                  }
                  exit={{ opacity: 0, scale: 0 }}
                  transition={
                    isCollected
                      ? { ...spring.snappy }
                      : { ...spring.smooth, delay: state === "coinsFound" ? i * stagger.normal : 0 }
                  }
                >
                  <Coin floatDelay={i * 0.3} />
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Cofre central */}
        <div className="relative z-10">
          <Chest opened={opened} glow={looping || opened} />
        </div>
      </div>

      {/* ===================== CAPA DE INFORMACIÓN ===================== */}
      <div className="relative z-10 flex min-h-[64px] w-full flex-col items-center gap-2 px-4 pb-5 pt-1">
        {/* ETAPA 1: monedas encontradas */}
        <AnimatePresence mode="wait">
          {state === "coinsFound" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={spring.smooth}
              className="rounded-full border px-3 py-1 font-mono text-xs"
              style={{
                color: GOLD_LIGHT,
                borderColor: "rgba(251,191,36,0.4)",
                background: "rgba(251,191,36,0.08)",
              }}
            >
              {count} monedas encontradas
            </motion.div>
          )}

          {/* ETAPA 2 + 3: repetición + contador de iteraciones */}
          {looping && (
            <motion.div
              key="looping"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="flex flex-col items-center gap-1.5"
            >
              {iteration === 0 ? (
                <p className="font-mono text-sm" style={{ color: GOLD_LIGHT }}>
                  Iniciando repetición...
                </p>
              ) : (
                <motion.p
                  key={iteration}
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={spring.snappy}
                  className="font-mono text-base font-bold tracking-wide"
                  style={{ color: GOLD_LIGHT, textShadow: `0 0 12px ${GOLD_GLOW}` }}
                >
                  Iteración {iteration}
                </motion.p>
              )}
              <p className="font-mono text-[11px] text-muted">
                Monedas restantes: {remaining}
              </p>
            </motion.div>
          )}

          {/* CIERRE: bucle completado / tesoro desbloqueado */}
          {opened && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring.snappy}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: GOLD_DEEP }}>
                Bucle completado
              </span>
              <span
                className="rounded-xl border px-4 py-1.5 text-base font-bold tracking-wide"
                style={{
                  color: GOLD_LIGHT,
                  borderColor: GOLD,
                  background: "rgba(251,191,36,0.12)",
                  textShadow: `0 0 14px ${GOLD_GLOW}`,
                  boxShadow: `0 0 22px ${GOLD_GLOW_SOFT}`,
                }}
              >
                TESORO DESBLOQUEADO
              </span>
            </motion.div>
          )}

          {/* Pista visual en idle */}
          {state === "idle" && (
            <p className="text-center font-mono text-xs text-muted">
              Crea <span style={{ color: GOLD_LIGHT }}>coins</span> y usa{" "}
              <span style={{ color: GOLD_LIGHT }}>while</span> para recoger todas
              las monedas.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

// Una moneda dorada con un suave flotar continuo y brillo.
function Coin({ floatDelay = 0 }: { floatDelay?: number }) {
  return (
    <motion.div
      className="-translate-x-1/2 -translate-y-1/2"
      animate={{ y: [0, -5, 0] }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
    >
      <svg width={34} height={34} viewBox="0 0 34 34" aria-hidden>
        <defs>
          <radialGradient id="coinFill" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor={GOLD_LIGHT} />
            <stop offset="60%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD_DEEP} />
          </radialGradient>
        </defs>
        <circle
          cx="17"
          cy="17"
          r="14"
          fill="url(#coinFill)"
          stroke={GOLD_DEEP}
          strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 6px ${GOLD_GLOW})` }}
        />
        <circle cx="17" cy="17" r="9.5" fill="none" stroke={GOLD_DEEP} strokeWidth="1.2" strokeOpacity="0.6" />
        <text
          x="17"
          y="22"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fontWeight="bold"
          fill={GOLD_DEEP}
        >
          $
        </text>
      </svg>
    </motion.div>
  );
}

// El cofre del tesoro. Cuando opened=true, la tapa se levanta y brilla el interior.
function Chest({ opened, glow }: { opened: boolean; glow: boolean }) {
  const lidShadow = glow ? `drop-shadow(0 0 10px ${GOLD_GLOW})` : "none";
  return (
    <div className="relative" style={{ width: 120, height: 104 }}>
      {/* Brillo del interior cuando se abre */}
      <AnimatePresence>
        {opened && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.celebrate}
            className="absolute left-1/2 top-7 h-10 w-24 -translate-x-1/2 rounded-t-full"
            style={{
              background: `radial-gradient(ellipse at center, ${GOLD_LIGHT} 0%, ${GOLD} 45%, transparent 75%)`,
              transformOrigin: "bottom",
            }}
          />
        )}
      </AnimatePresence>

      <svg width={120} height={104} viewBox="0 0 120 104" aria-hidden style={{ filter: lidShadow }}>
        <defs>
          <linearGradient id="chestBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b4423" />
            <stop offset="100%" stopColor="#4a2e16" />
          </linearGradient>
          <linearGradient id="chestLid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c5128" />
            <stop offset="100%" stopColor="#5a3a1c" />
          </linearGradient>
        </defs>

        {/* Cuerpo del cofre */}
        <rect x="14" y="50" width="92" height="48" rx="6" fill="url(#chestBody)" stroke={GOLD_DEEP} strokeWidth="2" />
        {/* Bandas metálicas */}
        <rect x="14" y="50" width="92" height="48" rx="6" fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.4" />
        <rect x="52" y="50" width="16" height="48" fill={GOLD_DEEP} fillOpacity="0.85" />

        {/* Tapa: rota hacia atrás al abrir */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "bottom center",
            transform: opened ? "rotateX(118deg) translateY(-2px)" : "rotateX(0deg)",
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <path
            d="M14 50 v-8 a46 30 0 0 1 92 0 v8 Z"
            fill="url(#chestLid)"
            stroke={GOLD_DEEP}
            strokeWidth="2"
          />
          <path
            d="M14 50 v-8 a46 30 0 0 1 92 0 v8 Z"
            fill="none"
            stroke={GOLD}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <rect x="52" y="20" width="16" height="30" fill={GOLD_DEEP} fillOpacity="0.85" />
        </g>

        {/* Cerradura (se ilumina con el glow) */}
        <rect
          x="54"
          y="58"
          width="12"
          height="14"
          rx="2"
          fill={glow ? GOLD_LIGHT : GOLD_DEEP}
          stroke={GOLD_DEEP}
          strokeWidth="1"
          style={{ filter: glow ? `drop-shadow(0 0 5px ${GOLD})` : "none" }}
        />
        <circle cx="60" cy="64" r="2.2" fill="#4a2e16" />
      </svg>
    </div>
  );
}
