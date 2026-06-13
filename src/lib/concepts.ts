// ============================================================================
// Trace - Identidad de conceptos (fase Premium)
// Fuente ÚNICA de verdad de la identidad de cada concepto fundamental.
// Reutilizada por: Home (habilidades desbloqueables), World Preview, pantallas
// de victoria (momentos de "concepto dominado") y el perfil.
//
// No es lógica de juego: solo lenguaje, una frase que ENSEÑA y un icono SVG
// sobrio (sin emojis, regla de marca). Mapea por levelId de progression.ts.
// Sin backend, sin datos remotos. Simplicidad absoluta.
// ============================================================================

export type ConceptIconName =
  | "variable"
  | "conditional"
  | "loop"
  | "function"
  | "list";

export interface ConceptMeta {
  /** Id del nivel que enseña este concepto (coincide con Level.id). */
  levelId: number;
  /** Nombre corto del concepto (titular). */
  title: string;
  /** La habilidad de pensamiento que se desbloquea (verbo + objeto). */
  skill: string;
  /**
   * Frase que ENSEÑA, no que celebra. Se muestra al dominar el concepto y en
   * la home como promesa. Debe completar: "Has aprendido a ___".
   */
  teaches: string;
  /** Una línea de "qué resuelve" en lenguaje del problema (home/preview). */
  resolves: string;
  /** Icono conceptual (clave para <ConceptIcon />). */
  icon: ConceptIconName;
}

// Conceptos del Mundo Python (los cinco fundamentales que el producto enseña).
export const PYTHON_CONCEPTS: ConceptMeta[] = [
  {
    levelId: 1,
    title: "Variables",
    skill: "Guardar información",
    teaches: "almacenar información para usarla cuando la necesites.",
    resolves: "Recordar un valor que antes se perdía.",
    icon: "variable",
  },
  {
    levelId: 2,
    title: "Condicionales",
    skill: "Tomar decisiones",
    teaches: "tomar decisiones según lo que ocurre.",
    resolves: "Elegir un camino entre varios posibles.",
    icon: "conditional",
  },
  {
    levelId: 3,
    title: "Bucles",
    skill: "Automatizar lo repetitivo",
    teaches: "automatizar acciones que se repiten.",
    resolves: "Hacer muchas veces algo sin reescribirlo.",
    icon: "loop",
  },
  {
    levelId: 4,
    title: "Funciones",
    skill: "Reutilizar acciones",
    teaches: "guardar acciones y reutilizarlas cuando quieras.",
    resolves: "Crear una habilidad una vez y usarla siempre.",
    icon: "function",
  },
  {
    levelId: 5,
    title: "Listas",
    skill: "Organizar colecciones",
    teaches: "agrupar y organizar varios valores juntos.",
    resolves: "Manejar muchos datos como un solo conjunto.",
    icon: "list",
  },
];

/** Devuelve la identidad del concepto que enseña un nivel, si existe. */
export function getConcept(levelId: number): ConceptMeta | undefined {
  return PYTHON_CONCEPTS.find((c) => c.levelId === levelId);
}

// ----------------------------------------------------------------------------
// Vista previa de conceptos por mundo (World Preview, PART 2)
// ----------------------------------------------------------------------------

/**
 * Resumen ligero de un concepto para mostrar en la vista previa de un mundo,
 * sin abrirlo. Para Python usa la identidad rica (icono + frase). Para C#/Java
 * deriva el título y un icono aproximado a partir del concepto del nivel, de
 * modo que cada World Card transmita identidad y curiosidad de forma coherente.
 */
export interface ConceptPreview {
  levelId: number;
  /** Título corto del concepto (p. ej. "Variables", "Condicionales"). */
  title: string;
  /** Icono conceptual reutilizable. */
  icon: ConceptIconName;
}

/**
 * Heurística sobria para mapear el `concept` libre de un nivel (C#/Java) a uno
 * de los iconos conceptuales existentes. No inventa iconos nuevos: reutiliza
 * la familia de cinco. Si nada coincide, cae en "variable" como neutro.
 */
export function iconForConcept(concept: string): ConceptIconName {
  const c = concept.toLowerCase();
  if (/(condicional|booleana|lógica|validaci|decision)/.test(c)) return "conditional";
  if (/(bucle|loop|repeti|temporal|patrull)/.test(c)) return "loop";
  if (/(función|funcion|método|metodo|clase|objeto|modular|interfaz|abstrac)/.test(c)) return "function";
  if (/(lista|colecci|array|inventario|recurso|red)/.test(c)) return "list";
  return "variable";
}

/**
 * Título corto del concepto a partir del `concept` de un nivel: toma la primera
 * palabra significativa con mayúscula inicial. Mantiene textos cortos para la
 * vista previa (p. ej. "Tipos y declaraciones" -> "Tipos").
 */
function shortConceptTitle(concept: string): string {
  const first = concept.split(/\s+y\s+|,|\s+/)[0] ?? concept;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/**
 * Construye la vista previa de conceptos de un mundo a partir de sus niveles.
 * Recibe la lista de niveles ya ordenada (de getLevelsForWorld) para no acoplar
 * este módulo a la lógica de progresión.
 */
export function conceptPreviewForWorld(
  worldId: string,
  levels: { id: number; concept: string }[]
): ConceptPreview[] {
  if (worldId === "python") {
    return PYTHON_CONCEPTS.map((c) => ({
      levelId: c.levelId,
      title: c.title,
      icon: c.icon,
    }));
  }
  return levels.map((l) => ({
    levelId: l.id,
    title: shortConceptTitle(l.concept),
    icon: iconForConcept(l.concept),
  }));
}
