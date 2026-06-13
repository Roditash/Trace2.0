"use client";

// ============================================================================
// Trace - Contexto de progreso (Fase 4)
// Estado global de avance del usuario. Persiste en localStorage.
// Sin backend, sin usuarios, sin cuentas. Todo en el navegador.
// ============================================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loadProgress,
  saveProgress,
  clearProgress,
  starsForHints,
  type SavedProgress,
} from "@/lib/storage";
import {
  WORLDS,
  activeLevel,
  computeLevelStatuses,
  worldProgress,
  totalProgress,
  type LevelStatus,
  type World,
  type Level,
} from "@/lib/progression";

// ---------------------------------------------------------------------------
// Tipos del contexto
// ---------------------------------------------------------------------------

interface ProgressContextValue {
  /** True una vez que se cargó el estado desde localStorage. */
  ready: boolean;
  /** Set de ids de niveles completados. */
  completedIds: Set<number>;
  /** Id del mundo actual (null si no ha empezado). */
  currentWorldId: string | null;
  /** Id del nivel activo (null si no ha empezado). */
  currentLevelId: number | null;
  /** Progreso global 0-100. */
  globalProgress: number;
  /** Marca un nivel como completado y desbloquea el siguiente. */
  completeLevel: (levelId: number, worldId: string) => void;
  /**
   * Registra la finalización de un nivel con las pistas usadas.
   * Calcula y guarda estrellas (conserva el mejor resultado).
   * Devuelve las estrellas obtenidas en este intento.
   */
  recordCompletion: (
    levelId: number,
    worldId: string,
    hintsUsed: number
  ) => number;
  /** Estrellas guardadas de un nivel (0 si no completado). */
  getStars: (levelId: number) => number;
  /** Total de estrellas obtenidas. */
  totalStars: number;
  /** Establece el contexto de navegación (qué mundo/nivel está viendo). */
  setCurrentContext: (worldId: string, levelId: number) => void;
  /** Reinicia todo el progreso. */
  resetProgress: () => void;
  /** Estado calculado de un nivel concreto. */
  getLevelStatus: (levelId: number, worldId: string) => LevelStatus;
  /** Progreso de un mundo concreto (0-100). */
  getWorldProgress: (world: World) => number;
  /** Nivel activo: el primero disponible en el orden de mundos. */
  nextLevel: { world: World; level: Level } | null;
  /** Mundos completados al 100%. */
  completedWorldCount: number;
}

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedProgress>({
    currentWorldId: null,
    currentLevelId: null,
    completedLevelIds: [],
    starsByLevel: {},
  });
  const [ready, setReady] = useState(false);

  // Carga inicial.
  useEffect(() => {
    setSaved(loadProgress());
    setReady(true);
  }, []);

  // Persistencia automática.
  useEffect(() => {
    if (ready) saveProgress(saved);
  }, [saved, ready]);

  // ---------------------------------------------------------------------------
  // Derivados memoizados
  // ---------------------------------------------------------------------------

  const completedIds = useMemo(
    () => new Set(saved.completedLevelIds),
    [saved.completedLevelIds]
  );

  const globalProgress = useMemo(
    () => totalProgress(completedIds),
    [completedIds]
  );

  const nextLevel = useMemo(
    () => activeLevel(completedIds),
    [completedIds]
  );

  const completedWorldCount = useMemo(
    () =>
      WORLDS.filter((w) =>
        w.levelIds.every((id) => completedIds.has(id))
      ).length,
    [completedIds]
  );

  const totalStars = useMemo(
    () =>
      Object.values(saved.starsByLevel).reduce(
        (sum, s) => sum + (s || 0),
        0
      ),
    [saved.starsByLevel]
  );

  // ---------------------------------------------------------------------------
  // Acciones
  // ---------------------------------------------------------------------------

  const completeLevel = useCallback(
    (levelId: number, worldId: string) => {
      setSaved((prev) => {
        const alreadyDone = prev.completedLevelIds.includes(levelId);
        if (alreadyDone) return prev;
        return {
          ...prev,
          completedLevelIds: [...prev.completedLevelIds, levelId],
          currentWorldId: worldId,
          currentLevelId: levelId,
        };
      });
    },
    []
  );

  const recordCompletion = useCallback(
    (levelId: number, worldId: string, hintsUsed: number): number => {
      const earned = starsForHints(hintsUsed);
      setSaved((prev) => {
        const prevStars = prev.starsByLevel[levelId] ?? 0;
        // Conserva el mejor resultado.
        const bestStars = Math.max(prevStars, earned);
        const completed = prev.completedLevelIds.includes(levelId)
          ? prev.completedLevelIds
          : [...prev.completedLevelIds, levelId];
        return {
          ...prev,
          completedLevelIds: completed,
          currentWorldId: worldId,
          currentLevelId: levelId,
          starsByLevel: { ...prev.starsByLevel, [levelId]: bestStars },
        };
      });
      return earned;
    },
    []
  );

  const getStars = useCallback(
    (levelId: number): number => saved.starsByLevel[levelId] ?? 0,
    [saved.starsByLevel]
  );

  const setCurrentContext = useCallback(
    (worldId: string, levelId: number) => {
      setSaved((prev) => ({
        ...prev,
        currentWorldId: worldId,
        currentLevelId: levelId,
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    clearProgress();
    setSaved({
      currentWorldId: null,
      currentLevelId: null,
      completedLevelIds: [],
      starsByLevel: {},
    });
  }, []);

  const getLevelStatus = useCallback(
    (levelId: number, worldId: string): LevelStatus => {
      const world = WORLDS.find((w) => w.id === worldId);
      if (!world) return "locked";
      const statuses = computeLevelStatuses(world, completedIds, WORLDS);
      return statuses[levelId] ?? "locked";
    },
    [completedIds]
  );

  const getWorldProgress = useCallback(
    (world: World): number => worldProgress(world, completedIds),
    [completedIds]
  );

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  return (
    <ProgressContext.Provider
      value={{
        ready,
        completedIds,
        currentWorldId: saved.currentWorldId,
        currentLevelId: saved.currentLevelId,
        globalProgress,
        completeLevel,
        recordCompletion,
        getStars,
        totalStars,
        setCurrentContext,
        resetProgress,
        getLevelStatus,
        getWorldProgress,
        nextLevel,
        completedWorldCount,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error("useProgress debe usarse dentro de <ProgressProvider>");
  return ctx;
}
