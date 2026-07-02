// ============================================================================
// Trace - Robot Path (Fase 9) — Funciones
// Validación MÍNIMA y específica del nivel 4. No es un intérprete, parser ni
// compilador. Solo reconoce patrones de Python básico con regex simples:
//
//   1) `def move():`           -> se crea la función (la "habilidad" del robot)
//   2) `print("MOVE")`         -> la acción que contiene la función
//   3) `move()` (x N)          -> cada llamada usa la habilidad una vez
//
// El concepto que enseña: una función es una acción reutilizable. Se define
// UNA vez y se usa MUCHAS. Por eso aquí lo importante es CONTAR las llamadas:
// con 3 o más, el robot llega a la meta.
//
// La filosofía es idéntica a crystalCounter.ts, secretDoor.ts y treasureLoop.ts:
// validaciones ligeras y helpers pequeños. Sin abstracciones para otros niveles.
// ============================================================================

export interface RobotResult {
  /** True si existe la definición `def move():`. */
  hasFunction: boolean;
  /** True si dentro (o en cualquier sitio) hay `print("MOVE")`. */
  hasMove: boolean;
  /** Número de llamadas `move()` (sin contar la definición `def move():`). */
  callCount: number;
  /** True si el reto está bien formado (def + print MOVE + al menos 3 llamadas). */
  wellFormed: boolean;
  /** Resultado lógico: si el robot llega a la meta. */
  reaches: boolean;
}

// Número mínimo de llamadas para que el robot llegue a la meta.
export const REQUIRED_CALLS = 3;

// `def move():` (admite espacios internos y comentario al final).
const DEF_MOVE_RE = /(?:^|\n)\s*def\s+move\s*\(\s*\)\s*:\s*(?:#.*)?$/m;

// `print("MOVE")` o `print('MOVE')` (admite espacios internos).
const PRINT_MOVE_RE = /print\s*\(\s*(?:"MOVE"|'MOVE')\s*\)/;

// Llamada `move()` en su propia línea. Global para poder CONTAR.
// La definición empieza con `def `, así que ese caso no coincide con esta regex
// (aquí move() no va precedido de `def`).
const CALL_MOVE_RE = /(?:^|\n)[ \t]*move\s*\(\s*\)\s*(?:#.*)?(?=\n|$)/g;

/** Cuenta las llamadas `move()` (excluye la línea `def move():`). */
function countCalls(code: string): number {
  const matches = code.match(CALL_MOVE_RE);
  return matches ? matches.length : 0;
}

/** Analiza el código del editor para el nivel Robot Path. */
export function evaluateRobotCode(code: string): RobotResult {
  const hasFunction = DEF_MOVE_RE.test(code);
  const hasMove = PRINT_MOVE_RE.test(code);
  const callCount = countCalls(code);

  // Bien formado: existe la función, imprime MOVE y se llama al menos 3 veces.
  const wellFormed = hasFunction && hasMove && callCount >= REQUIRED_CALLS;

  // El robot llega a la meta cuando el reto está completo.
  const reaches = wellFormed;

  return {
    hasFunction,
    hasMove,
    callCount,
    wellFormed,
    reaches,
  };
}

