// ============================================================================
// Trace - Secret Door (Fase 7) — Condicionales
// Validación MÍNIMA y específica del nivel 2. No es un intérprete, parser ni
// compilador. Solo reconoce patrones de Python básico con regex simples:
//
//   1) `key = True` o `key = False`        -> variable booleana
//   2) `if key:`                            -> condicional sobre la variable
//   3) `print("OPEN")`                      -> acción dentro del if
//
// La filosofía es idéntica a crystalCounter.ts: validaciones ligeras y helpers
// pequeños. No se añaden abstracciones para otros niveles.
// ============================================================================

export interface DoorResult {
  /** True si existe `key = True` o `key = False`. */
  hasKey: boolean;
  /** Valor booleano asignado a key (null si no se reconoce). */
  keyValue: boolean | null;
  /** True si existe `if key:`. */
  hasIf: boolean;
  /** True si existe `print("OPEN")` (comillas simples o dobles). */
  hasOpen: boolean;
  /** True si el reto está bien formado (key booleana + if + print OPEN). */
  wellFormed: boolean;
  /** Resultado lógico: si la puerta debe abrirse (condición verdadera). */
  opens: boolean;
}

// `key = True` / `key = False` (admite comentario al final).
const KEY_RE = /(?:^|\n)\s*key\s*=\s*(True|False)\s*(?:#.*)?$/m;

// `if key:` (admite espacios).
const IF_RE = /(?:^|\n)\s*if\s+key\s*:\s*$/m;

// `print("OPEN")` o `print('OPEN')` (admite espacios internos).
const OPEN_RE = /print\s*\(\s*(?:"OPEN"|'OPEN')\s*\)/;

/** Analiza el código del editor para el nivel Secret Door. */
export function evaluateDoorCode(code: string): DoorResult {
  const keyMatch = code.match(KEY_RE);
  const keyValue =
    keyMatch == null ? null : keyMatch[1] === "True";
  const hasKey = keyValue !== null;
  const hasIf = IF_RE.test(code);
  const hasOpen = OPEN_RE.test(code);

  // El reto está bien formado cuando hay variable booleana, un if y la acción.
  const wellFormed = hasKey && hasIf && hasOpen;

  // La puerta se abre solo si el código es válido y la condición es verdadera.
  const opens = wellFormed && keyValue === true;

  return { hasKey, keyValue, hasIf, hasOpen, wellFormed, opens };
}

/** Alias semántico de la spec (Fase 7). Equivale a evaluateDoorCode. */
export const validateSecretDoor = evaluateDoorCode;
