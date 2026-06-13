"use client";

// ============================================================================
// CodeEditor - editor simple (textarea mejorado). Sin Monaco/CodeMirror.
// Rediseñado como entorno interactivo de aprendizaje (Brilliant/LeetCode):
//   - Estado vacío atractivo: overlay con prompt e indicación contextual.
//   - Placeholder contextual por nivel (prop `hint`).
//   - Feedback visual por estado: idle / valid / invalid / completed
//     (borde, glow sutil y chip de estado en la barra de título).
//   - Indicador de reto completado (check en la barra).
// Sin syntax highlighting complejo. Solo numeración, mono y estados.
// ============================================================================

import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { transition } from "@/lib/motion";

/** Estado visual del editor según la última ejecución. */
export type EditorStatus = "idle" | "valid" | "invalid" | "completed";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  /** Indicación contextual del nivel (estado vacío / placeholder). */
  hint?: string;
  /** Feedback visual de la última ejecución. */
  status?: EditorStatus;
}

// Estilos de borde/sombra por estado (feedback inmediato, sin estridencia).
const FRAME: Record<EditorStatus, string> = {
  idle: "border-border focus-within:border-accent/60 focus-within:shadow-[0_0_0_1px_rgb(var(--accent)/0.3)]",
  valid:
    "border-accent/60 shadow-[0_0_0_1px_rgb(var(--accent)/0.3),0_0_18px_rgb(var(--accent)/0.12)]",
  invalid:
    "border-danger/50 shadow-[0_0_0_1px_rgb(var(--danger)/0.25)] focus-within:border-danger/70",
  completed:
    "border-accent/70 shadow-[0_0_0_1px_rgb(var(--accent)/0.4),0_0_22px_rgb(var(--accent)/0.16)]",
};

// Contenido del chip de estado en la barra de título.
const CHIP: Record<
  Exclude<EditorStatus, "idle">,
  { label: string; tone: "ok" | "bad" }
> = {
  valid: { label: "Código válido", tone: "ok" },
  invalid: { label: "Revisa el código", tone: "bad" },
  completed: { label: "Reto completado", tone: "ok" },
};

export default function CodeEditor({
  value,
  onChange,
  language = "python",
  readOnly = false,
  hint,
  status = "idle",
}: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(
    () => Math.max(value.split("\n").length, 1),
    [value]
  );
  const isEmpty = value.trim().length === 0;

  // Sincroniza el scroll del textarea con la numeración.
  const handleScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  // Soporte de tabulación (inserta 4 espacios).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + "    " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-code-bg transition-[border-color,box-shadow] duration-200 ${status === "idle" ? "elevation-md " : ""}${FRAME[status]}`}
    >
      {/* Barra de título del editor (estilo VS Code minimal) */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="font-mono text-xs text-muted">
            main.{language === "python" ? "py" : language === "csharp" ? "cs" : "java"}
          </span>
        </div>

        {/* Chip de estado (feedback inmediato) */}
        <AnimatePresence mode="wait">
          {status !== "idle" ? (
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={transition.fade}
              role="status"
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                CHIP[status].tone === "ok"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-danger/40 bg-danger/10 text-danger",
              ].join(" ")}
            >
              {CHIP[status].tone === "ok" ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-danger" />
              )}
              {CHIP[status].label}
            </motion.span>
          ) : (
            <motion.span
              key="lang"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fade}
              className="font-mono text-xs text-muted"
            >
              {language}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Cuerpo: gutter + textarea + estado vacío */}
      <div className="relative flex max-h-[320px] min-h-[200px]">
        <div
          ref={gutterRef}
          aria-hidden
          className="select-none overflow-hidden border-r border-border bg-code-bg px-3 py-3 text-right font-mono text-sm leading-6 text-muted/60"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Editor de código"
          className="w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-6 text-text outline-none"
          style={{ tabSize: 4 }}
        />

        {/* Estado vacío: invitación contextual (no bloquea el cursor) */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              key="empty"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fade}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
            >
              <span className="font-mono text-lg text-accent/60">&gt;_</span>
              <p className="text-sm text-muted">
                {hint ?? "Escribe tu código aquí."}
              </p>
              <p className="font-mono text-[11px] text-muted/60">
                Tu primera línea empieza aquí
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
