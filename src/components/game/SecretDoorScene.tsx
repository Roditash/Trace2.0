"use client";

// ============================================================================
// SecretDoorScene - minijuego de Condicionales (Fase 7, nivel 2).
//
// Una puerta mágica imponente que reacciona a una DECISIÓN lógica.
// Estados internos (la animación ocurre en las transiciones entre ellos):
//
//   idle        -> la puerta espera, cerrada.
//   keyDetected -> se detectó `key = ...`; la llave aparece flotando.
//   checking    -> se detectó `if key:`; runas recorren el marco.
//   granted     -> condición verdadera: la puerta se abre, luz teal.
//   denied      -> condición falsa: la puerta sigue cerrada, glow rojo.
//
// El jugador VE el razonamiento:  key  ->  True/False  ->  CONDICIÓN ...
//
// Sin imágenes de red. Solo SVG + transform/opacity (rendimiento).
// Animaciones derivadas de los tokens del sistema (spring/transition).
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { transition, spring } from "@/lib/motion";

// Estados visuales (nombres de la spec Fase 7).
export type DoorState =
  | "idle"
  | "keyDetected"
  | "checking"
  | "granted"
  | "denied";

interface SecretDoorSceneProps {
  state: DoorState;
  /** Valor de la llave detectada (para el razonamiento visual). */
  keyValue: boolean | null;
}

// Posiciones de runas a lo largo del marco de la puerta.
const RUNES = ["∆", "ᛟ", "ᚦ", "ᛉ", "◇", "ᚱ", "ᛗ", "✦"];

export default function SecretDoorScene({
  state,
  keyValue,
}: SecretDoorSceneProps) {
  const opening = state === "granted";
  const denied = state === "denied";
  const checking = state === "checking";
  const showKey = state !== "idle";
  const showReasoning =
    state === "checking" || state === "granted" || state === "denied";

  // Color de acento de la escena según el estado. Se usan formas sólidas y
  // con alpha por separado (CSS rgb(var(--x) / a)) para sombras y glows.
  const glow = denied ? "rgb(var(--danger))" : "rgb(var(--accent))";
  const glowVar = denied ? "--danger" : "--accent";
  const glowSoft = `rgb(var(${glowVar}) / 0.33)`;
  const glowFaint = `rgb(var(${glowVar}) / 0.13)`;

  return (
    <div
      className="scene-dark relative flex min-h-[420px] w-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-border"
      style={{
        background:
          "radial-gradient(130% 90% at 50% 18%, rgba(46,229,157,0.10), rgba(13,16,19,0) 55%), linear-gradient(180deg, #0c0f12 0%, #0a0c0e 100%)",
      }}
      role="img"
      aria-label={`Puerta secreta: estado ${state}`}
    >
      {/* Luz intensa detrás de la puerta al abrirse */}
      <AnimatePresence>
        {opening && (
          <motion.div
            key="backlight"
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.celebrate}
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(46,229,157,0.55) 0%, rgba(46,229,157,0.12) 40%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ===================== LA PUERTA ===================== */}
      <div className="relative mb-0 mt-6 flex h-[340px] w-[260px] items-end justify-center">
        {/* Marco de piedra */}
        <div
          className="absolute inset-0 rounded-t-[130px] border-2 transition-colors"
          style={{
            borderColor: checking || opening ? glow : "rgb(var(--border))",
            background:
              "linear-gradient(180deg, #1b2026 0%, #14181c 60%, #0f1316 100%)",
            boxShadow:
              checking || opening
                ? `0 0 28px ${glowSoft}, inset 0 0 30px ${glowFaint}`
                : denied
                ? "0 0 26px rgb(var(--danger) / 0.4), inset 0 0 24px rgb(var(--danger) / 0.18)"
                : "inset 0 0 24px rgba(0,0,0,0.6)",
          }}
        />

        {/* Runas recorriendo el marco (fase checking) */}
        <div aria-hidden className="absolute inset-0 rounded-t-[130px]">
          {RUNES.map((rune, i) => {
            const angle = (i / RUNES.length) * Math.PI; // semicírculo superior
            const cx = 50 + Math.cos(Math.PI - angle) * 46;
            const cy = 52 - Math.sin(angle) * 44;
            return (
              <motion.span
                key={i}
                className="absolute font-mono text-sm"
                style={{
                  left: `${cx}%`,
                  top: `${cy}%`,
                  color: glow,
                  textShadow: `0 0 8px ${glow}`,
                }}
                initial={false}
                animate={{
                  opacity: checking || opening ? [0.2, 1, 0.4] : 0.12,
                  scale: checking ? [1, 1.25, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: checking ? Infinity : 0,
                  delay: i * stagger.fast,
                  ease: "easeInOut",
                }}
              >
                {rune}
              </motion.span>
            );
          })}
        </div>

        {/* Dos hojas de la puerta que se separan al abrir */}
        <div className="absolute inset-x-3 bottom-3 top-10 overflow-hidden rounded-t-[110px]">
          {/* Hoja izquierda */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 border-r"
            style={{
              borderColor: "rgba(0,0,0,0.5)",
              background:
                "linear-gradient(180deg, #232a31 0%, #161b20 100%)",
            }}
            initial={false}
            animate={{ x: opening ? "-105%" : "0%" }}
            transition={opening ? transition.celebrate : spring.smooth}
          >
            <div
              className="absolute right-1.5 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full"
              style={{ background: opening ? glow : "rgb(var(--border))" }}
            />
          </motion.div>
          {/* Hoja derecha */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2"
            style={{
              background:
                "linear-gradient(180deg, #232a31 0%, #161b20 100%)",
            }}
            initial={false}
            animate={{ x: opening ? "105%" : "0%" }}
            transition={opening ? transition.celebrate : spring.smooth}
          >
            <div
              className="absolute left-1.5 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full"
              style={{ background: opening ? glow : "rgb(var(--border))" }}
            />
          </motion.div>

          {/* Símbolo central de condición sobre las hojas cerradas */}
          <AnimatePresence>
            {!opening && (
              <motion.div
                key="seal"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={false}
                animate={{
                  opacity: denied ? 0.85 : 0.6,
                  scale: denied ? [1, 1.06, 1] : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={transition.fade}
              >
                <span
                  className="font-mono text-3xl font-bold"
                  style={{
                    color: denied ? "rgb(var(--danger))" : "rgb(var(--text-muted))",
                    textShadow: denied ? "0 0 12px rgb(var(--danger))" : "none",
                  }}
                >
                  if
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===================== CAPA DE INFORMACIÓN ===================== */}
      <div className="relative z-10 flex w-full flex-col items-center gap-3 px-4 pb-5 pt-2">
        {/* Llave detectada flotando */}
        <AnimatePresence>
          {showKey && (
            <motion.div
              key="key"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={spring.smooth}
              className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1"
            >
              <KeyIcon />
              <span className="font-mono text-xs text-accent">
                Llave detectada
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado de comprobación */}
        <AnimatePresence mode="wait">
          {checking && (
            <motion.p
              key="checking"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="font-mono text-sm text-accent"
            >
              Comprobando condición...
            </motion.p>
          )}
        </AnimatePresence>

        {/* Razonamiento visual: key -> True/False -> CONDICIÓN ... */}
        <AnimatePresence>
          {showReasoning && keyValue !== null && (
            <motion.div
              key="reasoning"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.18 } },
              }}
              className="flex flex-col items-center gap-1"
            >
              <ReasonStep>key</ReasonStep>
              <Arrow />
              <ReasonStep highlight={keyValue ? "ok" : "bad"}>
                {keyValue ? "True" : "False"}
              </ReasonStep>
              <Arrow />
              <ReasonStep highlight={keyValue ? "ok" : "bad"} strong>
                {keyValue ? "CONDICIÓN VERDADERA" : "CONDICIÓN FALSA"}
              </ReasonStep>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Veredicto final */}
        <AnimatePresence mode="wait">
          {opening && (
            <motion.div
              key="granted"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring.snappy}
              className="rounded-xl border border-accent bg-accent/15 px-4 py-1.5 font-semibold text-accent glow-accent"
            >
              ACCESO PERMITIDO
            </motion.div>
          )}
          {denied && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, scale: 0.9, x: 0 }}
              animate={{ opacity: 1, scale: 1, x: [0, -4, 4, -2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ ...transition.slide }}
              className="rounded-xl border border-danger bg-danger/10 px-4 py-1.5 font-semibold text-danger"
              style={{ textShadow: "0 0 10px rgb(var(--danger) / 0.6)" }}
            >
              ACCESO DENEGADO
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pista visual en idle */}
        {state === "idle" && (
          <p className="text-center font-mono text-xs text-muted">
            Crea una <span className="text-accent">key</span> y usa{" "}
            <span className="text-accent">if key:</span> para convencer a la
            puerta.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

function ReasonStep({
  children,
  highlight,
  strong,
}: {
  children: React.ReactNode;
  highlight?: "ok" | "bad";
  strong?: boolean;
}) {
  const palette =
    highlight === "ok"
      ? {
          color: "rgb(var(--accent))",
          borderColor: "rgb(var(--accent) / 0.4)",
          background: "rgb(var(--accent) / 0.08)",
        }
      : highlight === "bad"
      ? {
          color: "rgb(var(--danger))",
          borderColor: "rgb(var(--danger) / 0.4)",
          background: "rgb(var(--danger) / 0.08)",
        }
      : {
          color: "rgb(var(--text))",
          borderColor: "rgb(var(--border))",
          background: "transparent",
        };
  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 6, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={spring.smooth}
      className={`rounded-lg border px-3 py-1 font-mono ${
        strong ? "text-sm font-bold tracking-wide" : "text-sm"
      }`}
      style={palette}
    >
      {children}
    </motion.span>
  );
}

function Arrow() {
  return (
    <motion.span
      aria-hidden
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={transition.fade}
      className="text-muted"
    >
      ↓
    </motion.span>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden>
      <circle
        cx="8"
        cy="8"
        r="4.5"
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth="1.8"
      />
      <path
        d="M11 11l8 8M16 16l2-2M18 18l2-2"
        stroke="rgb(var(--accent))"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
