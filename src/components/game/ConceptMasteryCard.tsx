"use client";

// ============================================================================
// ConceptMasteryCard - momento educativo de "concepto dominado" (PART 3).
// No celebra: ENSEÑA. Completa la frase "Has aprendido a ___" usando la
// identidad única del concepto (src/lib/concepts.ts). Reutilizado por todas
// las pantallas de victoria para que el cierre de cada nivel deje claro QUÉ
// habilidad de pensamiento se acaba de desbloquear.
//
// Filosofía Problema → Acción → Resultado: aquí mostramos el RESULTADO en
// términos de capacidad ("ahora puedes ___"), no de sintaxis.
// Sin emojis (regla de marca). Animaciones derivadas de los tokens.
// ============================================================================

import { motion } from "framer-motion";
import { slideVariants, transition, spring } from "@/lib/motion";
import ConceptIcon from "@/components/ui/ConceptIcon";
import { getConcept } from "@/lib/concepts";

interface ConceptMasteryCardProps {
  /** Id del nivel cuyo concepto se ha dominado. */
  levelId: number;
  /** Texto de respaldo si el nivel no tiene identidad de concepto rica. */
  fallbackConcept: string;
  hintsUsed: number;
  /** Contenido adicional opcional (p. ej. explicación visual del if). */
  children?: React.ReactNode;
}

export default function ConceptMasteryCard({
  levelId,
  fallbackConcept,
  hintsUsed,
  children,
}: ConceptMasteryCardProps) {
  const concept = getConcept(levelId);
  const title = concept?.title ?? fallbackConcept;

  return (
    <motion.div
      variants={slideVariants}
      transition={transition.slide}
      className="glass-elevated mt-6 w-full overflow-hidden rounded-2xl border border-accent/20 p-5 text-left elevation-lg"
    >
      <div className="flex items-start gap-3">
        {/* Icono del concepto en una ficha con énfasis discreto. */}
        <motion.span
          aria-hidden
          variants={slideVariants}
          transition={spring.smooth}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20"
        >
          <ConceptIcon name={concept?.icon ?? "variable"} className="h-5 w-5" />
        </motion.span>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Concepto dominado
          </p>
          <p className="mt-0.5 text-lg font-semibold leading-tight text-text">
            {title}
          </p>
        </div>
      </div>

      {/* Frase que ENSEÑA: "Has aprendido a ___". */}
      {concept && (
        <p className="mt-4 text-[15px] leading-relaxed text-text/90">
          Has aprendido a{" "}
          <span className="font-medium text-text">{concept.teaches}</span>
        </p>
      )}

      {/* Contenido visual específico del nivel (opcional). */}
      {children && <div className="mt-4">{children}</div>}

      {/* Lo que esto resuelve, en lenguaje del problema. */}
      {concept && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2/60 p-3 text-sm text-muted ring-1 ring-inset ring-border/60">
          <span aria-hidden className="mt-0.5 text-accent">
            →
          </span>
          <span className="leading-relaxed">{concept.resolves}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-muted">Pistas usadas: {hintsUsed}</p>
    </motion.div>
  );
}
