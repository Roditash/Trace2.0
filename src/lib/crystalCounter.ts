// ============================================================================
// Trace - Crystal Counter (Fase 6)
// Validación MÍNIMA y específica de este único nivel. No es un intérprete,
// ni un parser, ni un compilador. Solo reconoce dos patrones de Python básico
// con expresiones regulares simples:
//
//   1) Una variable llamada `crystals` con un valor numérico.   -> crystals = 10
//   2) Una instrucción `print(crystals)`.                       -> print(crystals)
//
// No se añade soporte para otros niveles, lenguajes ni casos. Simplicidad total.
// ============================================================================

export interface CrystalResult {
  /** True si existe `crystals = <número entero>`. */
  hasVariable: boolean;
  /** Valor numérico asignado a crystals (null si no se reconoce). */
  value: number | null;
  /** True si existe `print(crystals)`. */
  hasPrint: boolean;
  /** True si el reto está resuelto (variable numérica + print). */
  solved: boolean;
}

// `crystals = 10` (admite espacios alrededor del =). Solo enteros no negativos.
const VARIABLE_RE = /(?:^|\n)\s*crystals\s*=\s*(\d+)\s*(?:#.*)?$/m;

// `print(crystals)` (admite espacios internos).
const PRINT_RE = /(?:^|\n)\s*print\s*\(\s*crystals\s*\)\s*$/m;

/** Analiza el código del editor para el nivel Crystal Counter. */
export function evaluateCrystalCode(code: string): CrystalResult {
  const varMatch = code.match(VARIABLE_RE);
  const value = varMatch ? parseInt(varMatch[1], 10) : null;
  const hasVariable = value !== null && !Number.isNaN(value);
  const hasPrint = PRINT_RE.test(code);

  return {
    hasVariable,
    value: hasVariable ? value : null,
    hasPrint,
    solved: hasVariable && hasPrint,
  };
}

/** Número de cristales a dibujar (acotado para una visualización limpia). */
export function clampCrystals(value: number | null): number {
  if (value === null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(value, 30));
}
