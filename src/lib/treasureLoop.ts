// ============================================================================
// Trace - Treasure Loop (Fase 8) — Bucles
// Validación MÍNIMA y específica del nivel 3. No es un intérprete, parser ni
// compilador. Solo reconoce patrones de Python básico con regex simples:
//
//   1) `coins = 5`                 -> variable con la cantidad de monedas
//   2) `while ...:`                -> bucle que repite la acción
//   3) `coins = coins - 1`         -> la acción que se repite (recoger 1 moneda)
//   4) `print("TREASURE")`         -> recompensa al terminar el bucle
//
// La filosofía es idéntica a crystalCounter.ts y secretDoor.ts: validaciones
// ligeras y helpers pequeños. No se añaden abstracciones para otros niveles.
// ============================================================================

export interface LoopResult {
  /** True si existe `coins = <número>`. */
  hasCoins: boolean;
  /** Valor numérico asignado a coins (null si no se reconoce). */
  coinsValue: number | null;
  /** True si existe un bucle `while`. */
  hasWhile: boolean;
  /** True si dentro se reduce coins: `coins = coins - 1`. */
  hasDecrement: boolean;
  /** True si existe `print("TREASURE")` (comillas simples o dobles). */
  hasTreasure: boolean;
  /** True si el reto está bien formado (coins + while + decremento + TREASURE). */
  wellFormed: boolean;
  /** Resultado lógico: si el cofre debe abrirse. */
  opens: boolean;
}

// `coins = 5` (cualquier entero, admite comentario al final).
const COINS_RE = /(?:^|\n)\s*coins\s*=\s*(\d+)\s*(?:#.*)?$/m;

// `while ...:` (cualquier condición, admite espacios).
const WHILE_RE = /(?:^|\n)\s*while\s+.+:\s*$/m;

// `coins = coins - 1` (admite espacios internos).
const DECREMENT_RE = /coins\s*=\s*coins\s*-\s*1/;

// `print("TREASURE")` o `print('TREASURE')` (admite espacios internos).
const TREASURE_RE = /print\s*\(\s*(?:"TREASURE"|'TREASURE')\s*\)/;

/** Analiza el código del editor para el nivel Treasure Loop. */
export function evaluateLoopCode(code: string): LoopResult {
  const coinsMatch = code.match(COINS_RE);
  const coinsValue =
    coinsMatch == null ? null : Number.parseInt(coinsMatch[1], 10);
  const hasCoins = coinsValue !== null;
  const hasWhile = WHILE_RE.test(code);
  const hasDecrement = DECREMENT_RE.test(code);
  const hasTreasure = TREASURE_RE.test(code);

  // El reto está bien formado cuando hay variable, bucle, decremento y la
  // recompensa final.
  const wellFormed = hasCoins && hasWhile && hasDecrement && hasTreasure;

  // El cofre se abre cuando el bucle está completo y bien formado.
  const opens = wellFormed;

  return {
    hasCoins,
    coinsValue,
    hasWhile,
    hasDecrement,
    hasTreasure,
    wellFormed,
    opens,
  };
}

/** Alias semántico de la spec (Fase 8). Equivale a evaluateLoopCode. */
export const validateTreasureLoop = evaluateLoopCode;
