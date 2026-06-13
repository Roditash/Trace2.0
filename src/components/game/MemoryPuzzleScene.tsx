"use client";

// ============================================================================
// MemoryPuzzleScene - minijuego de Listas (nivel 5).
//
// VISUALIZA EL PROBLEMA, no la sintaxis. Hay cuatro piezas desordenadas
// [3] [1] [4] [2]. El objetivo es ORGANIZARLAS en una lista, de menor a mayor.
//
// El jugador VE el concepto de lista como colección ORDENADA de elementos:
//   - idle        -> las piezas flotan sueltas y desordenadas (el problema).
//   - listFormed  -> las piezas entran en una lista (un riel con celdas 0..3).
//                    Siguen desordenadas: "Lista creada".
//   - organizing  -> las piezas se reordenan a su posición correcta, una a una,
//                    mostrando el índice donde cae cada valor.
//   - completed   -> la lista queda ordenada [1, 2, 3, 4]: rompecabezas resuelto.
//
// Identidad de color índigo/cielo (la lista como estructura de datos), distinta
// del violeta (Crystal), dorado (Treasure) y teal (Door/Robot). Para alpha se
// usa SIEMPRE rgb(r g b / a). Solo se anima transform/opacity (rendimiento).
//
// Animaciones derivadas de ANIMATION_SYSTEM: aparición slide/scale, reordenado
// con spring.smooth (10.2 "Reordenamiento": layout con spring.smooth, sin rebote)
// y feedback de éxito al completar. Sin partículas en la resolución (sección 9 /
// 10.1 regla 3): la celebración es un único pulso de halo y color, contenido.
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { transition, spring } from "@/lib/motion";

// Estados visuales del minijuego.
export type MemoryState = "idle" | "listFormed" | "organizing" | "completed";

interface MemoryPuzzleSceneProps {
  state: MemoryState;
  /** Piezas desordenadas de origen (p. ej. [3, 1, 4, 2]). */
  pieces: number[];
  /** Piezas ya colocadas en su sitio durante "organizing" (0..pieces.length). */
  placed: number;
  /** Orden final resuelto (p. ej. [1, 2, 3, 4]). */
  solved: number[];
}

// Paleta índigo/cielo basada en hex (identidad del minijuego de Listas).
const INDIGO = "#818cf8"; // índigo claro
const INDIGO_DEEP = "#6366f1";
const INDIGO_SOFT = "rgb(129 140 248 / 0.14)";
const INDIGO_GLOW = "rgb(129 140 248 / 0.5)";
const INDIGO_GLOW_SOFT = "rgb(129 140 248 / 0.22)";
const INDIGO_FAINT = "rgb(129 140 248 / 0.08)";

const CELL = 56; // tamaño de cada celda/pieza (4 celdas + 3 gaps caben en móvil ~320px)
const GAP = 12; // separación entre celdas

export default function MemoryPuzzleScene({
  state,
  pieces,
  placed,
  solved,
}: MemoryPuzzleSceneProps) {
  const inList = state !== "idle";
  const organizing = state === "organizing";
  const done = state === "completed";

  // Lo que se muestra dentro del riel en cada momento:
  //  - listFormed: las piezas tal cual (desordenadas).
  //  - organizing: las primeras `placed` posiciones ya ordenadas; el resto, el
  //    orden original "pendiente" (visualmente más tenue).
  //  - completed: todo ordenado.
  const display: number[] = done
    ? solved
    : organizing
      ? solved.map((v, i) => (i < placed ? v : pieces[i]))
      : pieces;

  return (
    <div
      className="scene-dark relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 38%, rgb(99 102 241 / 0.12), rgb(13 16 19 / 0) 58%), linear-gradient(180deg, #0c0f12 0%, #0a0c0e 100%)",
      }}
      role="img"
      aria-label={`Rompecabezas de memoria: estado ${state}. Lista actual ${display.join(", ")}`}
    >
      {/* Resplandor ambiental, más intenso al formar la lista y al resolver */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${INDIGO_GLOW_SOFT} 0%, ${INDIGO_FAINT} 45%, transparent 70%)`,
        }}
        initial={false}
        animate={{
          opacity: done ? 1 : organizing ? 0.7 : inList ? 0.5 : 0.28,
          scale: done ? 1.12 : 1,
        }}
        transition={transition.fade}
      />

      {/* Cuadrícula tenue de fondo (sensación de tablero / estructura de datos) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(129 140 248 / 0.25) 1px, transparent 1px), linear-gradient(90deg, rgb(129 140 248 / 0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(110% 80% at 50% 42%, #000 35%, transparent 80%)",
        }}
      />

      {/* Pulso de éxito al resolver (contenido, sin partículas — sección 9/10.1) */}
      <AnimatePresence>
        {done && (
          <motion.div
            key="solve-flash"
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.8, 0], scale: 1.25 }}
            exit={{ opacity: 0 }}
            transition={transition.celebrate}
            className="pointer-events-none absolute left-1/2 top-[40%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${INDIGO_GLOW} 0%, ${INDIGO_GLOW_SOFT} 38%, transparent 68%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ===================== EL TABLERO ===================== */}
      <div className="relative flex h-[230px] w-full items-center justify-center px-4">
        {/* En idle, las piezas flotan sueltas (el problema). Después entran en
            el riel ordenado. AnimatePresence con mode wait para una transición
            limpia entre "sueltas" y "en lista". */}
        <AnimatePresence mode="wait">
          {!inList ? (
            <motion.div
              key="loose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={transition.fade}
              className="flex items-center"
              style={{ gap: GAP + 8 }}
            >
              {pieces.map((value, i) => (
                <LoosePiece key={`${value}-${i}`} value={value} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="relative"
            >
              {/* Riel de la lista: celdas con índice 0..n-1 */}
              <div className="flex items-end" style={{ gap: GAP }}>
                {display.map((value, i) => {
                  const settled = done || (organizing && i < placed);
                  const isLanding = organizing && i === placed - 1;
                  return (
                    <ListCell
                      key={i}
                      index={i}
                      value={value}
                      settled={settled}
                      landing={isLanding}
                    />
                  );
                })}
              </div>

              {/* Etiqueta de la estructura: una lista con corchetes */}
              <div className="pointer-events-none mt-3 flex items-center justify-center gap-1 font-mono text-sm">
                <span style={{ color: INDIGO }}>pieces</span>
                <span className="text-muted">=</span>
                <span style={{ color: INDIGO }}>[</span>
                <span className="text-text">{display.join(", ")}</span>
                <span style={{ color: INDIGO }}>]</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              Cuatro piezas desordenadas. Reúnelas en una{" "}
              <span style={{ color: INDIGO }}>lista</span> y organízalas.
            </motion.p>
          )}

          {/* ETAPA 1: lista creada (aún desordenada) */}
          {state === "listFormed" && (
            <motion.div
              key="formed"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={spring.smooth}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: INDIGO }}
              >
                Una lista guarda varios valores
              </span>
              <span
                className="rounded-full border px-4 py-1.5 text-base font-bold tracking-wide"
                style={{
                  color: INDIGO,
                  borderColor: "rgb(129 140 248 / 0.4)",
                  background: INDIGO_SOFT,
                  textShadow: `0 0 14px ${INDIGO_GLOW}`,
                }}
              >
                Lista creada
              </span>
            </motion.div>
          )}

          {/* ETAPA 2: organizando, paso a paso */}
          {organizing && (
            <motion.div
              key="organizing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition.slide}
              className="flex flex-col items-center gap-1.5"
            >
              {placed === 0 ? (
                <p className="font-mono text-sm" style={{ color: INDIGO }}>
                  Organizando la lista...
                </p>
              ) : (
                <motion.div
                  key={placed}
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={spring.snappy}
                  className="flex items-center gap-2 font-mono text-sm"
                >
                  <span style={{ color: INDIGO }}>pieces[{placed - 1}]</span>
                  <span className="text-muted">=</span>
                  <span className="text-text">{solved[placed - 1]}</span>
                </motion.div>
              )}
              <p className="font-mono text-[11px] text-muted">
                Colocadas: {placed} / {solved.length}
              </p>
            </motion.div>
          )}

          {/* FINAL: rompecabezas resuelto */}
          {done && (
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
                style={{ color: INDIGO }}
              >
                Lista ordenada
              </span>
              <span
                className="rounded-xl border px-4 py-1.5 text-base font-bold tracking-wide"
                style={{
                  color: INDIGO,
                  borderColor: INDIGO,
                  background: INDIGO_SOFT,
                  textShadow: `0 0 14px ${INDIGO_GLOW}`,
                  boxShadow: `0 0 22px ${INDIGO_GLOW_SOFT}`,
                }}
              >
                ROMPECABEZAS RESUELTO
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

// Pieza suelta (estado idle): una ficha desordenada que flota suavemente.
function LoosePiece({ value, index }: { value: number; index: number }) {
  // Pequeña inclinación/desfase para transmitir "desorden" sin caos.
  const tilt = [(-6 + index * 4) % 8, -3, 5, -4][index % 4];
  const lift = [0, -10, 6, -6][index % 4];
  return (
    <motion.div
      className="grid place-items-center rounded-2xl border font-mono font-bold"
      style={{
        width: CELL,
        height: CELL,
        color: INDIGO,
        borderColor: "rgb(129 140 248 / 0.45)",
        background: INDIGO_SOFT,
        fontSize: 24,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [lift, lift - 5, lift],
        rotate: tilt,
      }}
      transition={{
        opacity: transition.fade,
        scale: spring.smooth,
        rotate: transition.fade,
        y: {
          duration: 3 + index * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {value}
    </motion.div>
  );
}

// Celda de la lista (estados listFormed/organizing/completed).
function ListCell({
  index,
  value,
  settled,
  landing,
}: {
  index: number;
  value: number;
  settled: boolean;
  landing: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className="relative grid place-items-center rounded-2xl border font-mono font-bold"
        style={{
          width: CELL,
          height: CELL,
          fontSize: 24,
          color: settled ? INDIGO : "rgb(148 158 165)",
          borderColor: settled
            ? "rgb(129 140 248 / 0.65)"
            : "rgb(255 255 255 / 0.1)",
          background: settled ? INDIGO_SOFT : "rgb(255 255 255 / 0.02)",
          boxShadow: settled ? `0 0 16px ${INDIGO_GLOW_SOFT}` : "none",
        }}
        initial={false}
        // Reordenamiento (10.2): la pieza recién colocada se asienta con un
        // único pulso de escala, sin rebote.
        animate={{ scale: landing ? [1, 1.1, 1] : 1 }}
        transition={landing ? { duration: 0.4, ease: "easeOut" } : transition.fade}
      >
        <motion.span
          // El número que cambia hace un fade corto al actualizarse.
          key={value}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition.fade}
        >
          {value}
        </motion.span>
      </motion.div>
      {/* Índice de la lista (refuerza que cada valor tiene una posición) */}
      <span
        className="font-mono text-[11px]"
        style={{ color: settled ? INDIGO_DEEP : "rgb(148 158 165 / 0.7)" }}
      >
        {index}
      </span>
    </div>
  );
}
