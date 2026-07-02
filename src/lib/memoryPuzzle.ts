// ============================================================================
// Trace - Memory Puzzle (nivel 5) — Listas
// Validación MÍNIMA y específica del nivel 5. No es un intérprete, parser ni
// compilador. Solo reconoce patrones de Python básico con regex simples.
//
// El PROBLEMA que se visualiza: hay cuatro piezas desordenadas [3] [1] [4] [2].
// El objetivo es ORGANIZARLAS usando una lista, de menor a mayor: [1, 2, 3, 4].
//
// SOLUCIONES FLEXIBLES (requisito de la fase): no se obliga a escribir una línea
// exacta. Se aceptan varias formas razonables de resolverlo, porque lo que
// importa es comprender qué es una lista y que se puede ordenar, no la sintaxis:
//
//   A) Lista literal ya ordenada:        pieces = [1, 2, 3, 4]
//   B) Lista + método .sort():           pieces = [3, 1, 4, 2]
//                                        pieces.sort()
//   C) Lista + función sorted():         pieces = sorted([3, 1, 4, 2])
//
// La filosofía es idéntica a crystalCounter.ts, secretDoor.ts, treasureLoop.ts
// y robotPath.ts: validaciones ligeras y helpers pequeños. Sin abstracciones.
// ============================================================================

export interface MemoryResult {
  /** True si existe alguna lista (literal entre corchetes con varios valores). */
  hasList: boolean;
  /** Números detectados dentro de la primera lista literal, en su orden escrito. */
  literal: number[] | null;
  /** True si se usa una operación de ordenado: .sort() o sorted(). */
  hasSortOp: boolean;
  /** Resultado final tras aplicar el ordenado si lo hay (lo que el jugador "logra"). */
  resolved: number[] | null;
  /** True si el resultado queda correctamente ordenado de menor a mayor. */
  isOrdered: boolean;
  /** True si el reto está bien formado (hay lista y queda ordenada). */
  wellFormed: boolean;
  /** Resultado lógico: si el rompecabezas se resuelve. */
  solved: boolean;
}

// Las cuatro piezas desordenadas del rompecabezas (lo que el jugador debe ordenar).
export const PUZZLE_PIECES = [3, 1, 4, 2];
// La solución organizada de menor a mayor.
export const PUZZLE_SOLVED = [1, 2, 3, 4];

// Primera lista literal `[ ... ]` con contenido. Captura lo de dentro.
const LIST_LITERAL_RE = /\[\s*([^\]]*?)\s*\]/;

// Operación de ordenado por método: `algo.sort()`.
const SORT_METHOD_RE = /\.\s*sort\s*\(\s*\)/;

// Operación de ordenado por función: `sorted( ... )`.
const SORTED_FN_RE = /\bsorted\s*\(/;

/** Extrae los enteros de un contenido de lista "3, 1, 4, 2" -> [3,1,4,2]. */
function parseNumbers(inner: string): number[] | null {
  const trimmed = inner.trim();
  if (trimmed.length === 0) return null;
  const parts = trimmed.split(",");
  const nums: number[] = [];
  for (const part of parts) {
    const p = part.trim();
    if (p.length === 0) continue; // tolera coma final: [1, 2, 3,]
    if (!/^-?\d+$/.test(p)) return null; // solo enteros (mantiene el reto simple)
    nums.push(Number.parseInt(p, 10));
  }
  return nums.length > 0 ? nums : null;
}

/** True si la lista está ordenada de menor a mayor (orden no estricto). */
function isAscending(nums: number[]): boolean {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) return false;
  }
  return true;
}

/** Analiza el código del editor para el nivel Memory Puzzle. */
export function evaluateMemoryCode(code: string): MemoryResult {
  const match = code.match(LIST_LITERAL_RE);
  const literal = match ? parseNumbers(match[1]) : null;
  const hasList = literal !== null;

  const hasSortOp = SORT_METHOD_RE.test(code) || SORTED_FN_RE.test(code);

  // Lo que el jugador "logra": si hay una operación de ordenado, el resultado
  // queda ordenado; si no, el resultado es la lista tal y como la escribió.
  let resolved: number[] | null = null;
  if (literal) {
    resolved = hasSortOp ? [...literal].sort((a, b) => a - b) : literal;
  }

  const isOrdered = resolved !== null && isAscending(resolved);

  // Bien formado: existe una lista y, tras lo que haya hecho, queda ordenada.
  // Esto admite las tres formas (literal ya ordenado, .sort(), sorted()).
  const wellFormed = hasList && isOrdered;
  const solved = wellFormed;

  return {
    hasList,
    literal,
    hasSortOp,
    resolved,
    isOrdered,
    wellFormed,
    solved,
  };
}

