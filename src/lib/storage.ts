// ============================================================================
// Trace - Persistencia de progreso (Fase 4-5)
// Guarda: mundo actual, nivel actual, niveles completados y estrellas.
// LocalStorage. Sin backend. Sin cuentas. Nada más.
// ============================================================================

const KEY = "trace.progress.v1";

export interface SavedProgress {
  /** Id del mundo en el que está el usuario. */
  currentWorldId: string | null;
  /** Id del nivel activo (disponible o en curso). */
  currentLevelId: number | null;
  /** Ids de todos los niveles completados. */
  completedLevelIds: number[];
  /** Estrellas obtenidas por nivel (1-3). Clave: levelId. */
  starsByLevel: Record<number, number>;
}

const EMPTY: SavedProgress = {
  currentWorldId: null,
  currentLevelId: null,
  completedLevelIds: [],
  starsByLevel: {},
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadProgress(): SavedProgress {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      currentWorldId: parsed.currentWorldId ?? null,
      currentLevelId: parsed.currentLevelId ?? null,
      completedLevelIds: Array.isArray(parsed.completedLevelIds)
        ? parsed.completedLevelIds
        : [],
      starsByLevel:
        parsed.starsByLevel && typeof parsed.starsByLevel === "object"
          ? parsed.starsByLevel
          : {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(progress: SavedProgress): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Cuota llena o almacenamiento deshabilitado.
  }
}

export function clearProgress(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
}

/** Estrellas según pistas usadas: 0 pistas = 3, 1-2 = 2, 3+ = 1. */
export function starsForHints(hintsUsed: number): number {
  if (hintsUsed <= 0) return 3;
  if (hintsUsed <= 2) return 2;
  return 1;
}
