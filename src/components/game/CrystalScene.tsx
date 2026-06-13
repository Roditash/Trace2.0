"use client";

// ============================================================================
// CrystalScene - visualización del minijuego Crystal Counter (Fase 6).
//
// Estados:
//   - vacío: aún no hay variable; se muestra una pista visual sobria.
//   - cristales: al detectar `crystals = N`, aparecen N cristales con
//     "Crystal Spawn" (slide + scale escalonado) y un contador (Count Reveal).
//   - resultado: al detectar `print(crystals)`, una tarjeta elegante muestra
//     el valor impreso (NO una consola técnica).
//
// Animaciones derivadas EXCLUSIVAMENTE de ANIMATION_SYSTEM:
//   Crystal Spawn       -> 5.3 Scale + 5.2 Slide, stagger 5.10, spring.smooth
//   Crystal Count Reveal-> 5.2 Slide del contador, transition.slide
//   Result Card         -> 5.3 Scale, transition.scale (spring.smooth)
//
// Los cristales usan violeta como identidad del minijuego; el resto de la
// interfaz mantiene los tokens del sistema de diseño. Solo se anima
// transform/opacity (rendimiento, sección 11.2).
// ============================================================================

import { AnimatePresence, motion } from "framer-motion";
import { transition, spring, stagger } from "@/lib/motion";

interface CrystalSceneProps {
  /** Número de cristales a mostrar (0 = ninguno). */
  count: number;
  /** Si la instrucción print(crystals) está presente. */
  printed: boolean;
  /** Valor que imprimiría print(crystals), si lo hay. */
  printedValue: number | null;
}

// Un cristal facetado dibujado en SVG (sin imágenes de red).
function Crystal({ index }: { index: number }) {
  return (
    <motion.div
      // Crystal Spawn: aparece con scale (5.3) + leve slide (5.2),
      // asentándose con spring.smooth, escalonado por el contenedor.
      variants={{
        hidden: { opacity: 0, scale: 0.96, y: 8 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      transition={spring.smooth}
      className="relative"
      aria-hidden
    >
      <svg
        viewBox="0 0 40 56"
        width={40}
        height={56}
        className="drop-shadow-[0_0_10px_rgba(167,139,250,0.55)]"
      >
        <defs>
          <linearGradient
            id={`crystal-grad-${index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="45%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {/* Cuerpo del cristal (hexágono alargado, facetado) */}
        <polygon
          points="20,2 34,16 28,54 12,54 6,16"
          fill={`url(#crystal-grad-${index})`}
          stroke="#a78bfa"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Faceta central para dar volumen */}
        <polygon
          points="20,2 20,54 12,54 6,16"
          fill="#ffffff"
          opacity="0.18"
        />
        <line
          x1="20"
          y1="2"
          x2="20"
          y2="54"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="0.75"
        />
      </svg>
    </motion.div>
  );
}

export default function CrystalScene({
  count,
  printed,
  printedValue,
}: CrystalSceneProps) {
  const crystals = Array.from({ length: count });

  return (
    <div
      className="scene-dark relative flex min-h-[420px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-border p-6"
      style={{
        // Mismo lienzo oscuro que las demás escenas (contraste garantizado
        // del texto violeta #c4b5fd en ambos temas).
        background:
          "radial-gradient(120% 120% at 50% 0%, rgba(124,58,237,0.18), transparent 60%), linear-gradient(180deg, #0c0f12 0%, #0a0c0e 100%)",
      }}
    >
      {/* Estado vacío: aún no hay cristales */}
      <AnimatePresence mode="wait">
        {count === 0 ? (
          // PROBLEMA visible: hay cristales en la cueva, pero sin contar
          // (siluetas atenuadas + contador desconocido). Filosofía
          // Problema -> Acción -> Resultado, igual que los demás niveles.
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fade}
            className="flex flex-col items-center gap-5"
          >
            <div
              aria-hidden
              className="flex items-end justify-center gap-3 opacity-30 saturate-50"
            >
              {[0, 1, 2].map((i) => (
                <Crystal key={i} index={i} />
              ))}
            </div>
            <div className="rounded-xl border border-[#7c3aed]/25 bg-[#7c3aed]/5 px-4 py-2 text-center">
              <span className="font-mono text-sm text-muted">crystals = </span>
              <span className="font-mono text-base font-semibold text-[#c4b5fd]">
                ?
              </span>
            </div>
            <p className="text-center font-mono text-xs text-muted">
              Hay cristales sin contar. Guarda la cantidad en{" "}
              <span className="text-[#c4b5fd]">crystals</span>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`crystals-${count}`}
            className="flex w-full flex-col items-center gap-5"
            initial="hidden"
            animate="visible"
          >
            {/* Cristales con spawn escalonado (Crystal Spawn) */}
            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: stagger.fast },
                },
              }}
              className="flex max-w-md flex-wrap items-end justify-center gap-3"
            >
              {crystals.map((_, i) => (
                <Crystal key={i} index={i} />
              ))}
            </motion.div>

            {/* Contador (Crystal Count Reveal) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={transition.slide}
              className="rounded-xl border border-[#7c3aed]/40 bg-[#7c3aed]/10 px-4 py-2 text-center"
            >
              <span className="font-mono text-sm text-muted">crystals = </span>
              <span className="font-mono text-base font-semibold text-[#c4b5fd]">
                {count}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjeta de resultado de print(crystals) — elegante, no consola */}
      <AnimatePresence>
        {printed && printedValue !== null && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={spring.smooth}
            className="w-full max-w-xs rounded-2xl border border-border bg-surface p-4 text-center shadow-sm"
            role="status"
            aria-label={`La salida del programa es ${printedValue}`}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Salida
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-[#c4b5fd]">
              {printedValue}
            </p>
            <p className="mt-1 text-xs text-muted">print(crystals)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
