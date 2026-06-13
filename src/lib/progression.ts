// ============================================================================
// Trace - Sistema de progresión (Fase 4)
// Fuente de verdad de mundos, niveles y reglas de desbloqueo.
// Sin backend. Sin economía. Sin monedas. Simplicidad absoluta.
// ============================================================================

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type LevelStatus = "locked" | "available" | "completed" | "mastered";

export interface Level {
  /** Identificador único global (1-15). */
  id: number;
  /** Id del mundo al que pertenece. */
  worldId: string;
  /** Nombre del nivel. */
  name: string;
  /** Descripción corta del reto. */
  description: string;
  /** Concepto principal de programación que trabaja el nivel. */
  concept: string;
  /** Orden dentro del mundo (1-5). */
  order: number;
}

export interface World {
  id: string;
  name: string;
  tagline: string;
  /** Etiqueta corta (sin emojis). */
  badge: string;
  /** Ids de niveles de este mundo, en orden. */
  levelIds: number[];
}

// ---------------------------------------------------------------------------
// Niveles — 15 en total, 5 por mundo
// ---------------------------------------------------------------------------

export const LEVELS: Level[] = [
  // Python (ids 1-5)
  {
    id: 1,
    worldId: "python",
    name: "Crystal Counter",
    description: "Aprende a contar y acumular valores con variables.",
    concept: "Variables y asignación",
    order: 1,
  },
  {
    id: 2,
    worldId: "python",
    name: "Secret Door",
    description: "Decide qué camino tomar según una condición.",
    concept: "Condicionales",
    order: 2,
  },
  {
    id: 3,
    worldId: "python",
    name: "Treasure Loop",
    description: "Repite acciones hasta encontrar el tesoro.",
    concept: "Bucles",
    order: 3,
  },
  {
    id: 4,
    worldId: "python",
    name: "Robot Path",
    description: "Define instrucciones reutilizables para guiar al robot.",
    concept: "Funciones",
    order: 4,
  },
  {
    id: 5,
    worldId: "python",
    name: "Memory Puzzle",
    description: "Organiza y accede a colecciones de datos.",
    concept: "Listas",
    order: 5,
  },

  // C# (ids 6-10)
  {
    id: 6,
    worldId: "csharp",
    name: "Space Scanner",
    description: "Lee el entorno y clasifica lo que encuentras.",
    concept: "Tipos y declaraciones",
    order: 1,
  },
  {
    id: 7,
    worldId: "csharp",
    name: "Security Checkpoint",
    description: "Verifica accesos con reglas de validación estrictas.",
    concept: "Condicionales avanzados",
    order: 2,
  },
  {
    id: 8,
    worldId: "csharp",
    name: "Drone Patrol",
    description: "Controla el patrullaje automático de un dron.",
    concept: "Bucles y arrays",
    order: 3,
  },
  {
    id: 9,
    worldId: "csharp",
    name: "Factory Controller",
    description: "Construye un controlador modular para la fábrica.",
    concept: "Métodos y clases",
    order: 4,
  },
  {
    id: 10,
    worldId: "csharp",
    name: "Cargo Manager",
    description: "Gestiona el inventario de carga de la nave.",
    concept: "Colecciones",
    order: 5,
  },

  // Java (ids 11-15)
  {
    id: 11,
    worldId: "java",
    name: "Signal Decoder",
    description: "Interpreta señales binarias y conviértelas en mensajes.",
    concept: "Operadores y tipos",
    order: 1,
  },
  {
    id: 12,
    worldId: "java",
    name: "Power Gates",
    description: "Activa las compuertas de energía con lógica booleana.",
    concept: "Lógica booleana",
    order: 2,
  },
  {
    id: 13,
    worldId: "java",
    name: "Time Repeater",
    description: "Reproduce secuencias temporales de forma precisa.",
    concept: "Bucles y control de flujo",
    order: 3,
  },
  {
    id: 14,
    worldId: "java",
    name: "Energy Network",
    description: "Modela la red de energía de la estación.",
    concept: "Clases y objetos",
    order: 4,
  },
  {
    id: 15,
    worldId: "java",
    name: "Resource Tracker",
    description: "Rastrea y balancea los recursos del sistema.",
    concept: "Interfaces y abstracción",
    order: 5,
  },
];

// ---------------------------------------------------------------------------
// Mundos
// ---------------------------------------------------------------------------

export const WORLDS: World[] = [
  {
    id: "python",
    name: "Python",
    tagline: "Fundamentos y lógica con una sintaxis clara.",
    badge: "PY",
    levelIds: [1, 2, 3, 4, 5],
  },
  {
    id: "csharp",
    name: "C#",
    tagline: "Tipado y estructura para construir con solidez.",
    badge: "C#",
    levelIds: [6, 7, 8, 9, 10],
  },
  {
    id: "java",
    name: "Java",
    tagline: "Pensamiento orientado a objetos paso a paso.",
    badge: "JV",
    levelIds: [11, 12, 13, 14, 15],
  },
];

// ---------------------------------------------------------------------------
// Reglas de desbloqueo
// ---------------------------------------------------------------------------

/**
 * Retorna los niveles de un mundo con el estado calculado a partir del
 * conjunto de niveles completados.
 *
 * Regla simple:
 *   - El nivel 1 de cada mundo está disponible si el mundo anterior está
 *     completado en su totalidad (o si es el primer mundo).
 *   - Dentro de un mundo: completar el nivel N desbloquea el N+1.
 *   - Un nivel completado puede pasar a "mastered" en fases futuras;
 *     por ahora "completed" y "mastered" son equivalentes visualmente.
 */
export function computeLevelStatuses(
  world: World,
  completedIds: Set<number>,
  allWorlds: World[]
): Record<number, LevelStatus> {
  const result: Record<number, LevelStatus> = {};

  // Determinar si el mundo anterior está completo.
  const worldIndex = allWorlds.findIndex((w) => w.id === world.id);
  const prevWorldUnlocked =
    worldIndex === 0
      ? true
      : allWorlds[worldIndex - 1].levelIds.every((id) =>
          completedIds.has(id)
        );

  for (let i = 0; i < world.levelIds.length; i++) {
    const id = world.levelIds[i];
    const isDone = completedIds.has(id);

    if (isDone) {
      result[id] = "completed";
      continue;
    }

    const isFirst = i === 0;
    const prevDone = isFirst ? prevWorldUnlocked : completedIds.has(world.levelIds[i - 1]);

    result[id] = prevDone ? "available" : "locked";
  }

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelsForWorld(worldId: string): Level[] {
  return LEVELS.filter((l) => l.worldId === worldId).sort(
    (a, b) => a.order - b.order
  );
}

/** Porcentaje de completado de un mundo (0-100). */
export function worldProgress(
  world: World,
  completedIds: Set<number>
): number {
  const done = world.levelIds.filter((id) => completedIds.has(id)).length;
  return Math.round((done / world.levelIds.length) * 100);
}

/** Progreso total global (0-100). */
export function totalProgress(completedIds: Set<number>): number {
  return Math.round((completedIds.size / LEVELS.length) * 100);
}

/** Retorna el nivel activo (el primero disponible o el más reciente). */
export function activeLevel(
  completedIds: Set<number>
): { world: World; level: Level } | null {
  for (const world of WORLDS) {
    const statuses = computeLevelStatuses(world, completedIds, WORLDS);
    for (const id of world.levelIds) {
      if (statuses[id] === "available") {
        const level = getLevel(id)!;
        return { world, level };
      }
    }
  }
  return null;
}
