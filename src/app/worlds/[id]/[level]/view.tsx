"use client";

// ============================================================================
// GameView - la pantalla más importante del producto.
// Orquesta el flujo educativo: Intro -> Juego -> Completado.
//
// Minijuegos con identidad propia:
//   - Nivel 1 Crystal Counter (variables): escena de cristales + print.
//   - Nivel 2 Secret Door (condicionales): puerta mágica que reacciona a un if,
//     con secuencia visual (llave -> condición -> acceso permitido/denegado).
//   - Nivel 3 Treasure Loop (bucles): cofre rodeado de monedas que se recogen
//     una a una con un while; el jugador VE la repetición y el cofre se abre.
//   - Nivel 4 Robot Path (funciones): un robot explorador cruza un camino de
//     casillas hacia una estación de energía. El jugador crea la habilidad move
//     UNA vez (def) y la USA varias (move()); cada llamada avanza una casilla.
//   - Nivel 5 Memory Puzzle (listas): cuatro piezas desordenadas [3,1,4,2] que
//     el jugador organiza en una lista hasta obtener [1,2,3,4]. Tres formas
//     válidas: literal ordenado, .sort(), o sorted().
// Los niveles 6-15 mantienen el flujo de Fase 5 (completado simulado).
//
// Validaciones MÍNIMAS por regex (sin parser/intérprete). Animaciones de los
// tokens del sistema (ANIMATION_SYSTEM).
// ============================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import {
  getWorld,
  getLevel,
  getLevelsForWorld,
  type Level,
} from "@/lib/progression";
import { getChallenge } from "@/lib/challenges";
import { starsForHints } from "@/lib/storage";
import {
  evaluateCrystalCode,
  clampCrystals,
  type CrystalResult,
} from "@/lib/crystalCounter";
import { evaluateDoorCode, type DoorResult } from "@/lib/secretDoor";
import { evaluateLoopCode, type LoopResult } from "@/lib/treasureLoop";
import {
  evaluateRobotCode,
  REQUIRED_CALLS,
  type RobotResult,
} from "@/lib/robotPath";
import {
  evaluateMemoryCode,
  PUZZLE_PIECES,
  PUZZLE_SOLVED,
  type MemoryResult,
} from "@/lib/memoryPuzzle";
import { fadeVariants, transition } from "@/lib/motion";
import Visualization from "@/components/game/Visualization";
import CrystalScene from "@/components/game/CrystalScene";
import SecretDoorScene, {
  type DoorState,
} from "@/components/game/SecretDoorScene";
import TreasureLoopScene, {
  type LoopState,
} from "@/components/game/TreasureLoopScene";
import RobotPathScene, {
  type RobotState,
} from "@/components/game/RobotPathScene";
import MemoryPuzzleScene, {
  type MemoryState,
} from "@/components/game/MemoryPuzzleScene";
import CodeEditor, { type EditorStatus } from "@/components/game/CodeEditor";
import ProblemFlow, { type FlowStage } from "@/components/game/ProblemFlow";
import HintPanel from "@/components/game/HintPanel";
import LevelIntro from "@/components/game/LevelIntro";
import LevelCompleteScreen from "@/components/game/LevelCompleteScreen";
import ConditionalCompleteScreen from "@/components/game/ConditionalCompleteScreen";
import LoopCompleteScreen from "@/components/game/LoopCompleteScreen";
import FunctionCompleteScreen from "@/components/game/FunctionCompleteScreen";
import ListCompleteScreen from "@/components/game/ListCompleteScreen";
import StarRating from "@/components/game/StarRating";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

type Phase = "intro" | "game" | "complete";

// ----------------------------------------------------------------------------
// Sistema de feedback educativo (FASE PREMIUM).
// Cuatro estados: correcto (chip/victoria del editor), parcialmente correcto,
// error conceptual y error de sintaxis básica. El feedback debe sentirse como
// un mentor, no como un compilador: reconoce el avance, guía el siguiente
// paso y nunca regala la solución.
// ----------------------------------------------------------------------------
type FeedbackKind = "partial" | "conceptual" | "syntax";

interface Feedback {
  kind: FeedbackKind;
  message: string;
}

// Estilo visual por tipo de feedback: jerarquía clara sin alarmismo.
const FEEDBACK_STYLE: Record<
  FeedbackKind,
  { label: string; box: string; tag: string }
> = {
  // Parcialmente correcto: tono del acento. "Vas bien, sigue."
  partial: {
    label: "Vas bien",
    box: "border-accent/30 bg-accent/5 text-text",
    tag: "text-accent",
  },
  // Error conceptual: tono informativo (índigo). "Piensa en la idea."
  conceptual: {
    label: "Piensa en el concepto",
    box: "border-[#818cf8]/30 bg-[#818cf8]/5 text-text",
    tag: "text-[#818cf8]",
  },
  // Error de sintaxis básica: tono de peligro suave. "Revisa la escritura."
  syntax: {
    label: "Revisa la sintaxis",
    box: "border-danger/30 bg-danger/5 text-text",
    tag: "text-danger",
  },
};

// Detección mínima de sintaxis básica (sin parser): paréntesis sin cerrar
// o comillas sin pareja. Devuelve un mensaje de mentor o null.
function detectBasicSyntaxIssue(code: string): string | null {
  let parens = 0;
  let brackets = 0;
  let doubles = 0;
  let singles = 0;
  for (const ch of code) {
    if (ch === "(") parens++;
    else if (ch === ")") parens--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
    else if (ch === '"') doubles++;
    else if (ch === "'") singles++;
  }
  if (parens > 0)
    return "Hay un paréntesis abierto que nunca se cierra. Revisa que cada ( tenga su ).";
  if (parens < 0)
    return "Hay un paréntesis de cierre de más. Revisa que cada ) tenga su ( correspondiente.";
  if (brackets > 0)
    return "Hay un corchete abierto que nunca se cierra. Revisa que cada [ tenga su ].";
  if (brackets < 0)
    return "Hay un corchete de cierre de más. Revisa que cada ] tenga su [ correspondiente.";
  if (doubles % 2 !== 0)
    return 'Hay una comilla doble sin pareja. Cada texto necesita abrirse y cerrarse con ".';
  if (singles % 2 !== 0)
    return "Hay una comilla simple sin pareja. Cada texto necesita abrirse y cerrarse con '.";
  return null;
}

const CRYSTAL_COUNTER_ID = 1;
const SECRET_DOOR_ID = 2;
const TREASURE_LOOP_ID = 3;
const ROBOT_PATH_ID = 4;
const MEMORY_PUZZLE_ID = 5;

// Total de monedas del nivel Treasure Loop (la solución usa coins = 5).
const TREASURE_COINS = 5;

// Casillas del camino del nivel Robot Path (= llamadas esperadas, 3 = meta).
const ROBOT_TILES = REQUIRED_CALLS;

// Secuencia conceptual para la visualización genérica (niveles 3-15).
function sequenceFor(concept: string): string[] {
  const c = concept.toLowerCase();
  if (c.includes("variable") || c.includes("tipo") || c.includes("operador"))
    return ["x", "=", "5"];
  if (c.includes("condicional") || c.includes("boole"))
    return ["if", "?", "then", "else"];
  if (c.includes("bucle") || c.includes("flujo"))
    return ["1", "2", "3", "4", "5"];
  if (c.includes("func") || c.includes("método"))
    return ["call", "->", "body", "->", "return"];
  if (c.includes("lista") || c.includes("colec") || c.includes("array"))
    return ["a", "b", "c"];
  if (c.includes("clase") || c.includes("objeto")) return ["new", "->", "obj"];
  if (c.includes("interfaz") || c.includes("abstrac"))
    return ["contract", "->", "impl"];
  return ["?"];
}

export default function GameView({
  worldId,
  levelId,
}: {
  worldId: string;
  levelId: number;
}) {
  const router = useRouter();
  const world = getWorld(worldId);
  const level = getLevel(levelId);
  const challenge = getChallenge(levelId);

  if (!world || !level || !challenge || level.worldId !== worldId) {
    notFound();
  }

  const { recordCompletion, getStars } = useProgress();
  const isCrystalCounter = levelId === CRYSTAL_COUNTER_ID;
  const isSecretDoor = levelId === SECRET_DOOR_ID;
  const isTreasureLoop = levelId === TREASURE_LOOP_ID;
  const isRobotPath = levelId === ROBOT_PATH_ID;
  const isMemoryPuzzle = levelId === MEMORY_PUZZLE_ID;
  const isMinigame =
    isCrystalCounter ||
    isSecretDoor ||
    isTreasureLoop ||
    isRobotPath ||
    isMemoryPuzzle;

  // ---- Estado del flujo ----
  const [phase, setPhase] = useState<Phase>("intro");
  const [code, setCode] = useState(challenge.starterCode);
  const [revealed, setRevealed] = useState(0); // pistas reveladas (0-4)
  const [solutionShown, setSolutionShown] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [usedHints, setUsedHints] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Helpers de mentor: clasifican el mensaje según lo que enseña.
  const partial = (message: string) =>
    setFeedback({ kind: "partial", message });
  const conceptual = (message: string) =>
    setFeedback({ kind: "conceptual", message });
  const syntaxIssue = (message: string) =>
    setFeedback({ kind: "syntax", message });
  const clearFeedback = () => setFeedback(null);

  // ---- Estado de Crystal Counter ----
  const [run, setRun] = useState<CrystalResult>({
    hasVariable: false,
    value: null,
    hasPrint: false,
    solved: false,
  });

  // ---- Estado de Secret Door ----
  const [doorState, setDoorState] = useState<DoorState>("idle");
  const [doorKey, setDoorKey] = useState<boolean | null>(null);

  // ---- Estado de Treasure Loop ----
  const [loopState, setLoopState] = useState<LoopState>("idle");
  const [loopTotal, setLoopTotal] = useState<number>(TREASURE_COINS);
  const [loopIteration, setLoopIteration] = useState<number>(0);

  // ---- Estado de Robot Path ----
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [robotTiles, setRobotTiles] = useState<number>(ROBOT_TILES);
  const [robotStep, setRobotStep] = useState<number>(0);

  // ---- Estado de Memory Puzzle ----
  const [memoryState, setMemoryState] = useState<MemoryState>("idle");
  const [memoryPlaced, setMemoryPlaced] = useState<number>(0);

  // ---- Feedback visual del editor (idle/valid/invalid/completed) ----
  const [editorStatus, setEditorStatus] = useState<EditorStatus>("idle");

  // Timers para secuencias animadas (se limpian al desmontar).
  const timers = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);
  const after = (ms: number, fn: () => void) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };

  // Cualquier feedback no resuelto marca el editor como inválido (feedback
  // inmediato en el marco/chip del CodeEditor).
  useEffect(() => {
    if (feedback) setEditorStatus("invalid");
  }, [feedback]);

  // Pistas usadas a efectos de estrellas.
  const effectiveHints = solutionShown ? challenge.hints.length : revealed;
  const previewStars = useMemo(
    () => starsForHints(effectiveHints),
    [effectiveHints]
  );

  // Navegación entre niveles del mismo mundo.
  const worldLevels = getLevelsForWorld(worldId);
  const indexInWorld = worldLevels.findIndex((l) => l.id === levelId);
  const nextLevel: Level | undefined = worldLevels[indexInWorld + 1];
  const orderInWorld = indexInWorld + 1;

  // ---- Acciones de pistas ----
  const revealHint = () =>
    setRevealed((r) => Math.min(r + 1, challenge.hints.length));
  const revealSolution = () => setSolutionShown(true);

  // ---- Completar nivel (común) ----
  const finishLevel = () => {
    const earned = recordCompletion(levelId, worldId, effectiveHints);
    setEarnedStars(earned);
    setUsedHints(effectiveHints);
    setPhase("complete");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Ejecutar: Crystal Counter ----
  const runCrystal = () => {
    const result = evaluateCrystalCode(code);
    setRun(result);
    if (result.solved) {
      clearFeedback();
      setEditorStatus("completed");
      after(900, finishLevel);
      return;
    }
    if (!result.hasVariable) {
      conceptual(
        "Los cristales siguen sin contarse porque nada los recuerda. Una variable guarda ese número: crystals = 10"
      );
    } else if (!result.hasPrint) {
      partial(
        "Ya guardaste la cantidad en crystals. Ahora falta hacerla visible: print(crystals) la muestra en pantalla."
      );
    } else {
      clearFeedback();
    }
  };

  // ---- Ejecutar: Secret Door (secuencia visual por estados) ----
  const runDoor = () => {
    // Limpia cualquier secuencia previa en curso.
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const result: DoorResult = evaluateDoorCode(code);
    clearFeedback();
    setDoorState("idle");
    setDoorKey(result.keyValue);

    // Sin llave: pista clara, la puerta no reacciona.
    if (!result.hasKey) {
      conceptual(
        "La puerta no reacciona porque aún no existe una llave que comprobar. Créala con una variable: key = True"
      );
      return;
    }

    // ETAPA 1 (~800ms): la llave aparece flotando -> "Llave detectada".
    after(150, () => setDoorState("keyDetected"));

    // Sin if: la llave existe, pero no hay condición que evaluar.
    if (!result.hasIf) {
      after(800, () =>
        partial(
          "La llave ya existe. Ahora la puerta necesita una decisión: if key: comprueba si la llave es verdadera."
        )
      );
      return;
    }

    // ETAPA 2 (~1000ms): "Comprobando condición..." (runas + partículas).
    after(800, () => setDoorState("checking"));

    // El código está bien formado: la secuencia avanza (feedback válido).
    setEditorStatus("valid");

    // ETAPA 3 y 4 (tras los 1000ms de comprobación): razonamiento + veredicto.
    after(1800, () => {
      if (result.opens) {
        // ETAPA 4: ACCESO PERMITIDO. Celebración antes de la victoria.
        setDoorState("granted");
        setEditorStatus("completed");
        after(1700, finishLevel);
      } else {
        // Condición falsa (o falta print OPEN): ACCESO DENEGADO.
        setDoorState("denied");
        if (!result.hasOpen) {
          partial(
            'Tu solución está cerca: la condición se evaluó, pero aún falta indicar qué ocurre cuando es verdadera. Dentro del if, muestra OPEN con print("OPEN").'
          );
        } else if (result.keyValue === false) {
          conceptual(
            "La puerta leyó la condición y fue falsa: con key = False el if nunca entra. Observa qué cambia con key = True."
          );
        }
      }
    });
  };

  // ---- Ejecutar: Treasure Loop (secuencia visual por iteraciones) ----
  const runTreasure = () => {
    // Limpia cualquier secuencia previa en curso.
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const result: LoopResult = evaluateLoopCode(code);
    clearFeedback();
    setLoopState("idle");
    setLoopIteration(0);

    // Sin variable coins: el cofre no reacciona.
    if (!result.hasCoins) {
      conceptual(
        "Para repetir una acción primero hay que saber cuántas veces: guarda las monedas en una variable con coins = 5"
      );
      return;
    }

    // Cantidad de monedas a animar (lo que el jugador escribió).
    const total = Math.max(1, result.coinsValue ?? TREASURE_COINS);
    setLoopTotal(total);

    // ETAPA 1 (~150ms): aparecen las monedas -> "N monedas encontradas".
    after(150, () => setLoopState("coinsFound"));

    // Sin while: hay monedas, pero nada que repita la acción.
    if (!result.hasWhile) {
      after(900, () =>
        partial(
          "Las monedas ya están contadas. Ahora falta la repetición: un while coins > 0: recoge una moneda cada vuelta."
        )
      );
      return;
    }

    // Sin decremento: el bucle nunca terminaría (no se recoge ninguna moneda).
    if (!result.hasDecrement) {
      after(900, () => setLoopState("looping"));
      after(1500, () =>
        conceptual(
          "El bucle empezó, pero nunca terminaría: coins no cambia y la condición siempre es verdadera. Reduce el contador dentro del while: coins = coins - 1"
        )
      );
      return;
    }

    // ETAPA 2 (~900ms): "Iniciando repetición..." + anillo girando.
    after(900, () => setLoopState("looping"));

    // ETAPA 3: una iteración cada ~700ms; cada una recoge una moneda.
    const STEP = 700;
    const START = 1500;
    for (let i = 1; i <= total; i++) {
      after(START + (i - 1) * STEP, () => setLoopIteration(i));
    }

    const loopEnd = START + total * STEP;

    // Sin TREASURE: el bucle termina pero el cofre no se abre.
    if (!result.hasTreasure) {
      after(loopEnd, () =>
        partial(
          'Recogiste todas las monedas: el bucle funciona. Solo falta el paso final tras el while: abre el cofre con print("TREASURE").'
        )
      );
      return;
    }

    // El código está bien formado: la secuencia avanza (feedback válido).
    setEditorStatus("valid");

    // CIERRE: "Bucle completado" -> cofre se abre -> celebración -> victoria.
    after(loopEnd + 200, () => {
      setLoopState("completed");
      setEditorStatus("completed");
    });
    after(loopEnd + 1900, finishLevel);
  };

  // ---- Ejecutar: Robot Path (secuencia visual por llamadas) ----
  const runRobot = () => {
    // Limpia cualquier secuencia previa en curso.
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const result: RobotResult = evaluateRobotCode(code);
    clearFeedback();
    setRobotState("idle");
    setRobotStep(0);

    // El camino tiene tantas casillas como pasos necesita el robot (mínimo 3).
    const tiles = Math.max(ROBOT_TILES, REQUIRED_CALLS);
    setRobotTiles(tiles);

    // Sin la función: el robot no tiene ninguna habilidad que usar.
    if (!result.hasFunction) {
      conceptual(
        "El robot recibió instrucciones, pero aún no sabe qué función ejecutar. Enséñale la habilidad una sola vez con: def move():"
      );
      return;
    }

    // ETAPA 1 (~150ms): energía entra al robot -> "Nueva habilidad creada".
    after(150, () => setRobotState("skillCreated"));

    // La función existe pero no muestra MOVE (no contiene la acción).
    if (!result.hasMove) {
      after(1100, () =>
        partial(
          'La habilidad existe, pero por dentro está vacía: el robot no sabe qué hacer al usarla. Dentro de move, muestra la acción con print("MOVE").'
        )
      );
      return;
    }

    // La habilidad está completa pero falta usarla las veces suficientes.
    if (result.callCount < REQUIRED_CALLS) {
      after(1100, () =>
        partial(
          `La habilidad está completa: definir fue el primer paso. Ahora úsala: cada move() avanza una casilla y el camino necesita ${REQUIRED_CALLS}.`
        )
      );
      return;
    }

    // ETAPA 2 (~1300ms): cada llamada move() avanza al robot una casilla.
    // Mostramos: move() -> MOVE -> el robot se mueve, paso a paso.
    const STEP = 850;
    const START = 1300;
    after(START - 250, () => setRobotState("moving"));
    for (let i = 1; i <= tiles; i++) {
      after(START + (i - 1) * STEP, () => setRobotStep(i));
    }

    const pathEnd = START + tiles * STEP;

    // El código está bien formado: la secuencia avanza (feedback válido).
    setEditorStatus("valid");

    // FINAL: el robot llega a la estación -> celebración -> victoria.
    after(pathEnd + 200, () => {
      setRobotState("completed");
      setEditorStatus("completed");
    });
    after(pathEnd + 2000, finishLevel);
  };

  // ---- Ejecutar: Memory Puzzle (secuencia visual por colocaciones) ----
  const runMemory = () => {
    // Limpia cualquier secuencia previa en curso.
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const result: MemoryResult = evaluateMemoryCode(code);
    clearFeedback();
    setMemoryState("idle");
    setMemoryPlaced(0);

    // Sin lista: las piezas siguen sueltas, no hay dónde guardarlas.
    if (!result.hasList) {
      conceptual(
        "Las piezas siguen sueltas porque nada las agrupa. Una lista las reúne en un solo lugar: pieces = [3, 1, 4, 2]"
      );
      return;
    }

    // ETAPA 1 (~150ms): las piezas entran en la lista -> "Lista creada".
    after(150, () => setMemoryState("listFormed"));

    // Hay lista, pero aún no queda ordenada de menor a mayor.
    if (!result.isOrdered) {
      after(900, () =>
        partial(
          "La lista ya agrupa las piezas: buen avance. Solo queda ordenarlas de menor a mayor con pieces.sort() o sorted(pieces)."
        )
      );
      return;
    }

    // ETAPA 2 (~900ms): cada pieza cae en su posición correcta, una a una.
    const STEP = 600;
    const START = 1100;
    const total = PUZZLE_SOLVED.length;
    after(START - 250, () => setMemoryState("organizing"));
    for (let i = 1; i <= total; i++) {
      after(START + (i - 1) * STEP, () => setMemoryPlaced(i));
    }

    const sortEnd = START + total * STEP;

    // El código está bien formado: la secuencia avanza (feedback válido).
    setEditorStatus("valid");

    // FINAL: la lista queda ordenada -> celebración contenida -> victoria.
    after(sortEnd + 200, () => {
      setMemoryState("completed");
      setEditorStatus("completed");
    });
    after(sortEnd + 1800, finishLevel);
  };

  const runCode = () => {
    // Sintaxis básica primero: si hay un paréntesis o comilla sin pareja,
    // ningún validador conceptual ayudará. Mentor: señala dónde mirar.
    if (isMinigame) {
      const issue = detectBasicSyntaxIssue(code);
      if (issue) {
        syntaxIssue(issue);
        return;
      }
    }
    if (isCrystalCounter) runCrystal();
    else if (isSecretDoor) runDoor();
    else if (isTreasureLoop) runTreasure();
    else if (isRobotPath) runRobot();
    else if (isMemoryPuzzle) runMemory();
    else finishLevel();
  };

  const resetCode = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setCode(challenge.starterCode);
    clearFeedback();
    setRun({ hasVariable: false, value: null, hasPrint: false, solved: false });
    setDoorState("idle");
    setDoorKey(null);
    setLoopState("idle");
    setLoopTotal(TREASURE_COINS);
    setLoopIteration(0);
    setRobotState("idle");
    setRobotTiles(ROBOT_TILES);
    setRobotStep(0);
    setMemoryState("idle");
    setMemoryPlaced(0);
    setEditorStatus("idle");
  };

  // --------------------------------------------------------------------------
  // PROBLEMA -> ACCIÓN -> RESULTADO
  // Tira visual sobre la escena (ProblemFlow). El paso activo se deriva del
  // estado real del minijuego — el jugador entiende qué resuelve sin leer.
  // Lenguaje del problema, nunca código interno.
  // --------------------------------------------------------------------------
  const flowLabels = isCrystalCounter
    ? {
        problem: "Cristales sin contar",
        action: "Guardar la cantidad",
        result: "Cantidad visible",
      }
    : isSecretDoor
      ? {
          problem: "Puerta cerrada",
          action: "Tomar una decisión",
          result: "Puerta abierta",
        }
      : isTreasureLoop
        ? {
            problem: "Monedas dispersas",
            action: "Repetir la recogida",
            result: "Cofre abierto",
          }
        : isRobotPath
          ? {
              problem: "Robot sin energía",
              action: "Crear y usar la habilidad",
              result: "Estación alcanzada",
            }
          : {
              problem: "Piezas desordenadas",
              action: "Organizar la lista",
              result: "Rompecabezas resuelto",
            };

  const flowStage: FlowStage = isCrystalCounter
    ? run.solved
      ? "result"
      : run.hasVariable
        ? "action"
        : "problem"
    : isSecretDoor
      ? doorState === "granted"
        ? "result"
        : doorState === "idle"
          ? "problem"
          : "action"
      : isTreasureLoop
        ? loopState === "completed"
          ? "result"
          : loopState === "idle"
            ? "problem"
            : "action"
        : isRobotPath
          ? robotState === "completed"
            ? "result"
            : robotState === "idle"
              ? "problem"
              : "action"
          : memoryState === "completed"
            ? "result"
            : memoryState === "idle"
              ? "problem"
              : "action";

  // Indicación contextual del estado vacío del editor, por nivel.
  const editorHint = isCrystalCounter
    ? "Guarda cuántos cristales hay y muéstralos."
    : isSecretDoor
      ? "Crea la llave y decide con un if."
      : isTreasureLoop
        ? "Cuenta las monedas y recógelas con un while."
        : isRobotPath
          ? "Crea la habilidad move y úsala varias veces."
          : isMemoryPuzzle
            ? "Reúne las piezas en una lista y ordénalas."
            : undefined;

  const goToMap = () => router.push(`/worlds/${worldId}`);
  const goToNext = () => {
    if (nextLevel) router.push(`/worlds/${worldId}/${nextLevel.id}`);
    else goToMap();
  };

  // ---------------------------------------------------------------------------
  // Render por fase
  // ---------------------------------------------------------------------------

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase === "intro" && (
        <motion.div
          key="intro"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition.fade}
        >
          <LevelIntro
            levelName={level.name}
            concept={level.concept}
            story={challenge.story}
            objective={challenge.objective}
            onStart={() => setPhase("game")}
          />
        </motion.div>
      )}

      {phase === "complete" && (
        <motion.div
          key="complete"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition.fade}
        >
          {isSecretDoor ? (
            <ConditionalCompleteScreen
              levelName={level.name}
              stars={earnedStars}
              hintsUsed={usedHints}
              hasNext={!!nextLevel}
              onNext={goToNext}
              onBackToMap={goToMap}
            />
          ) : isTreasureLoop ? (
            <LoopCompleteScreen
              levelName={level.name}
              stars={earnedStars}
              hintsUsed={usedHints}
              hasNext={!!nextLevel}
              onNext={goToNext}
              onBackToMap={goToMap}
            />
          ) : isRobotPath ? (
            <FunctionCompleteScreen
              levelName={level.name}
              stars={earnedStars}
              hintsUsed={usedHints}
              hasNext={!!nextLevel}
              onNext={goToNext}
              onBackToMap={goToMap}
            />
          ) : isMemoryPuzzle ? (
            <ListCompleteScreen
              levelName={level.name}
              stars={earnedStars}
              hintsUsed={usedHints}
              hasNext={!!nextLevel}
              onNext={goToNext}
              onBackToMap={goToMap}
            />
          ) : (
            <LevelCompleteScreen
              levelName={level.name}
              concept={level.concept}
              stars={earnedStars}
              hintsUsed={usedHints}
              hasNext={!!nextLevel}
              onNext={goToNext}
              onBackToMap={goToMap}
            />
          )}
        </motion.div>
      )}

      {phase === "game" && (
        <motion.div
          key="game"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition.fade}
        >
          {/* ===================== ZONA SUPERIOR ===================== */}
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <button
                onClick={goToMap}
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
                aria-label="Volver al mapa del mundo"
              >
                <span aria-hidden>&larr;</span>
                {world.name}
              </button>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {level.name}
              </h1>
              <span className="mt-1 inline-block rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest text-muted">
                {level.concept}
              </span>
            </div>

            <div className="w-44 shrink-0">
              <div className="mb-2 flex items-center justify-end">
                <StarRating value={getStars(levelId)} size={18} />
              </div>
              <ProgressBar
                value={Math.round((orderInWorld / worldLevels.length) * 100)}
                label={`Nivel ${orderInWorld}/${worldLevels.length}`}
              />
            </div>
          </header>

          {/* ============ ZONA CENTRAL + PANEL DE PISTAS ============ */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-6">
              {/* PROBLEMA -> ACCIÓN -> RESULTADO (solo minijuegos) */}
              {isMinigame && (
                <ProblemFlow
                  problem={flowLabels.problem}
                  action={flowLabels.action}
                  result={flowLabels.result}
                  stage={flowStage}
                />
              )}

              {/* Visualización principal según el nivel */}
              {isCrystalCounter ? (
                <section aria-label="Visualización de cristales">
                  <CrystalScene
                    count={clampCrystals(run.value)}
                    printed={run.hasPrint && run.hasVariable}
                    printedValue={run.hasPrint ? run.value : null}
                  />
                </section>
              ) : isSecretDoor ? (
                <section aria-label="Puerta secreta">
                  <SecretDoorScene state={doorState} keyValue={doorKey} />
                </section>
              ) : isTreasureLoop ? (
                <section aria-label="Cofre del tesoro">
                  <TreasureLoopScene
                    state={loopState}
                    totalCoins={loopTotal}
                    iteration={loopIteration}
                  />
                </section>
              ) : isRobotPath ? (
                <section aria-label="Robot explorador">
                  <RobotPathScene
                    state={robotState}
                    totalTiles={robotTiles}
                    step={robotStep}
                  />
                </section>
              ) : isMemoryPuzzle ? (
                <section aria-label="Rompecabezas de memoria">
                  <MemoryPuzzleScene
                    state={memoryState}
                    pieces={PUZZLE_PIECES}
                    placed={memoryPlaced}
                    solved={PUZZLE_SOLVED}
                  />
                </section>
              ) : (
                <section
                  aria-label="Visualización"
                  className="min-h-[260px] rounded-2xl border border-border bg-surface"
                >
                  <Visualization
                    concept={level.concept}
                    sequence={sequenceFor(level.concept)}
                    solved={solutionShown}
                  />
                </section>
              )}

              {/* Enunciado del reto */}
              <section
                aria-label="Enunciado"
                className="glass rounded-2xl border border-glass/10 p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Reto
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text">
                  {challenge.prompt}
                </p>
              </section>

              {/* ===================== ZONA INFERIOR (EDITOR) ===================== */}
              <section aria-label="Editor de código">
                <CodeEditor
                  value={code}
                  onChange={(v) => {
                    setCode(v);
                    if (feedback) clearFeedback();
                    // Editar tras un veredicto vuelve al estado neutro.
                    if (editorStatus !== "idle" && editorStatus !== "completed") {
                      setEditorStatus("idle");
                    }
                  }}
                  language={challenge.language}
                  hint={editorHint}
                  status={isMinigame ? editorStatus : "idle"}
                />

                {/* Feedback educativo diferenciado: parcial / conceptual / sintaxis.
                    Mentor, no compilador: reconoce el avance y guía el paso. */}
                <AnimatePresence mode="wait">
                  {isMinigame && feedback && (
                    <motion.div
                      key={`${feedback.kind}-${feedback.message}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={transition.slide}
                      className={[
                        "mt-3 rounded-xl border px-3.5 py-3 text-sm",
                        FEEDBACK_STYLE[feedback.kind].box,
                      ].join(" ")}
                      role="alert"
                    >
                      <p
                        className={[
                          "mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest",
                          FEEDBACK_STYLE[feedback.kind].tag,
                        ].join(" ")}
                      >
                        {FEEDBACK_STYLE[feedback.kind].label}
                      </p>
                      <p className="leading-relaxed">{feedback.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controles */}
                {isMinigame ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      size="lg"
                      onClick={runCode}
                      aria-label="Ejecutar código"
                    >
                      Ejecutar código
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={resetCode}
                      aria-label="Reiniciar el código"
                    >
                      Reiniciar
                    </Button>
                    <span className="text-xs text-muted">
                      Obtendrás <StarsInline value={previewStars} /> con las
                      pistas usadas.
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      size="lg"
                      onClick={finishLevel}
                      aria-label="Comprobar y completar el nivel"
                    >
                      Comprobar
                    </Button>
                    <span className="text-xs text-muted">
                      Obtendrás <StarsInline value={previewStars} /> con las
                      pistas usadas hasta ahora.
                    </span>
                  </div>
                )}
              </section>
            </div>

            {/* Panel de pistas: visible y accesible (lateral en desktop) */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <HintPanel
                hints={challenge.hints}
                solution={challenge.solution}
                revealed={revealed}
                solutionShown={solutionShown}
                onRevealHint={revealHint}
                onRevealSolution={revealSolution}
              />
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Pequeño indicador textual de estrellas previstas (inline, accesible).
function StarsInline({ value }: { value: number }) {
  return (
    <strong
      className="font-semibold text-star"
      aria-label={`${value} estrellas`}
    >
      {value} {value === 1 ? "estrella" : "estrellas"}
    </strong>
  );
}
