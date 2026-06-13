// ============================================================================
// Trace - Contenido de retos (Fase 5)
// Pistas y soluciones COMPLETAMENTE MANUALES. Sin IA. Sin generación.
// Diseñadas a mano. Una pista se revela cada vez (progresión).
// ============================================================================

export interface Challenge {
  /** Id del nivel (coincide con Level.id de progression.ts). */
  levelId: number;
  /** Historia breve para la intro del nivel. */
  story: string;
  /** Objetivo del reto, claro y conciso. */
  objective: string;
  /** Enunciado mostrado en la pantalla de juego. */
  prompt: string;
  /** 4 pistas progresivas (de más sutil a más concreta). */
  hints: [string, string, string, string];
  /** Solución de referencia. */
  solution: string;
  /** Código inicial que aparece en el editor. */
  starterCode: string;
  /** Lenguaje para resaltado básico. */
  language: "python" | "csharp" | "java";
}

// Helper para reducir verbosidad.
function c(data: Challenge): Challenge {
  return data;
}

export const CHALLENGES: Challenge[] = [
  // ----- Python -----
  c({
    levelId: 1,
    language: "python",
    story:
      "Eres un explorador en una cueva de cristales. Para avanzar necesitas registrar cuántos cristales has recogido.",
    objective:
      "Guarda la cantidad de cristales en una variable llamada crystals y muéstrala en pantalla.",
    prompt:
      "Has encontrado varios cristales. Crea una variable llamada crystals con la cantidad y muéstrala con print(crystals).",
    hints: [
      "Necesitas guardar un número.",
      "Las variables sirven para almacenar información.",
      "Prueba crear una variable llamada crystals.",
      "Asigna un valor a crystals.",
    ],
    solution: "crystals = 10\nprint(crystals)",
    starterCode: "",
  }),
  c({
    levelId: 2,
    language: "python",
    story:
      "Has encontrado una antigua puerta mágica. La puerta analiza una condición antes de permitir el paso. Tu misión es convencerla de que te deje entrar.",
    objective:
      "Crea una llave (key) verdadera y, con un if, ordena mostrar OPEN para abrir la puerta.",
    prompt:
      "La puerta busca una variable key. Si la condición if key se cumple, debes mostrar OPEN. Prueba también qué pasa si key es False.",
    hints: [
      "La puerta busca una variable llamada key.",
      "Las condiciones usan True o False.",
      "Necesitas una instrucción if.",
      "Dentro del if debes mostrar OPEN.",
    ],
    solution: 'key = True\n\nif key:\n    print("OPEN")',
    starterCode: "",
  }),
  c({
    levelId: 3,
    language: "python",
    story:
      "Encuentras un cofre del tesoro rodeado por cinco monedas mágicas. Para abrirlo debes recoger todas las monedas, una por una. La computadora puede repetir la misma acción varias veces.",
    objective:
      "Recoge las cinco monedas con un bucle while y, al terminar, abre el cofre mostrando TREASURE.",
    prompt:
      "Hay 5 monedas. Usa un bucle while para recogerlas una a una hasta que no quede ninguna. Cuando el bucle termine, muestra TREASURE para abrir el cofre.",
    hints: [
      "Necesitas una variable llamada coins.",
      "Debes usar while.",
      "Dentro del while reduce coins.",
      "Cuando termines muestra TREASURE.",
    ],
    solution:
      'coins = 5\n\nwhile coins > 0:\n    coins = coins - 1\n\nprint("TREASURE")',
    starterCode: "",
  }),
  c({
    levelId: 4,
    language: "python",
    story:
      "Un pequeño robot explorador debe llegar a una estación de energía. El camino es largo y moverlo paso a paso sería tedioso. La solución es crear una habilidad que el robot pueda usar cuando quiera.",
    objective:
      "Crea una función move que haga avanzar al robot y úsala varias veces para llegar a la estación.",
    prompt:
      "Crea una función llamada move que muestre MOVE. Después llámala varias veces (al menos tres) para que el robot avance casilla a casilla hasta la estación de energía.",
    hints: [
      "Necesitas una función llamada move.",
      "Las funciones se crean usando def.",
      "Dentro de move muestra MOVE.",
      "Debes llamar la función varias veces.",
    ],
    solution: 'def move():\n    print("MOVE")\n\nmove()\nmove()\nmove()',
    starterCode: "",
  }),
  c({
    levelId: 5,
    language: "python",
    story:
      "Encuentras cuatro piezas desordenadas: 3, 1, 4 y 2. Para resolver el rompecabezas de memoria debes guardarlas todas juntas en una lista y organizarlas de menor a mayor.",
    objective:
      "Guarda las piezas en una lista llamada pieces y deja la lista ordenada de menor a mayor.",
    prompt:
      "Las piezas están desordenadas: 3, 1, 4, 2. Reúnelas en una lista llamada pieces y organízalas de menor a mayor. Hay varias formas válidas de lograrlo.",
    hints: [
      "Una lista guarda varios valores juntos, entre corchetes: [ ].",
      "Puedes escribir las piezas ya ordenadas, o escribirlas desordenadas y ordenarlas después.",
      "Para ordenar una lista puedes usar pieces.sort() o sorted(pieces).",
      "El objetivo es que pieces quede como [1, 2, 3, 4].",
    ],
    // Solución de referencia (una de varias válidas: ver hints y memoryPuzzle.ts).
    solution: "pieces = [3, 1, 4, 2]\npieces.sort()",
    // Vacío: el CodeEditor muestra el estado vacío contextual del nivel.
    starterCode: "",
  }),

  // ----- C# -----
  c({
    levelId: 6,
    language: "csharp",
    story:
      "Tu nave escanea el espacio. Necesitas declarar dónde guardar la lectura.",
    objective: "Declara una variable con tipo.",
    prompt: "Declara una variable int llamada signals con valor 3.",
    hints: [
      "En C# las variables tienen un tipo.",
      "Para números enteros se usa int.",
      "int signals declara la variable.",
      "Asígnale el valor con = 3;",
    ],
    solution: "int signals = 3;",
    starterCode: "// Declara la variable de señales\n",
  }),
  c({
    levelId: 7,
    language: "csharp",
    story: "El puesto de seguridad solo deja pasar credenciales válidas.",
    objective: "Valida un acceso con un condicional.",
    prompt:
      "Si access es true, imprime \"acceso\"; si no, imprime \"denegado\".",
    hints: [
      "Debes comprobar una condición booleana.",
      "Usa if y else.",
      "if (access) { ... } else { ... }",
      "Imprime con Console.WriteLine(...).",
    ],
    solution:
      'bool access = true;\nif (access) {\n    Console.WriteLine("acceso");\n} else {\n    Console.WriteLine("denegado");\n}',
    starterCode: "bool access = true;\n// Valida el acceso\n",
  }),
  c({
    levelId: 8,
    language: "csharp",
    story: "Un dron patrulla una zona dividida en sectores numerados.",
    objective: "Recorre un rango con un bucle.",
    prompt: "Imprime los números del 0 al 4 con un bucle for.",
    hints: [
      "Repetir se hace con un bucle.",
      "El bucle for tiene inicio, condición y paso.",
      "for (int i = 0; i < 5; i++)",
      "Dentro, usa Console.WriteLine(i);",
    ],
    solution:
      "for (int i = 0; i < 5; i++) {\n    Console.WriteLine(i);\n}",
    starterCode: "// Patrulla los 5 sectores\n",
  }),
  c({
    levelId: 9,
    language: "csharp",
    story: "La fábrica necesita un controlador con instrucciones reutilizables.",
    objective: "Crea un método.",
    prompt: 'Define un método Run() que imprima "produciendo" y llámalo.',
    hints: [
      "Agrupar lógica se hace con métodos.",
      "Un método tiene tipo de retorno, nombre y cuerpo.",
      "void Run() { ... } define el método.",
      "Llámalo escribiendo Run();",
    ],
    solution:
      'void Run() {\n    Console.WriteLine("produciendo");\n}\n\nRun();',
    starterCode: "// Define y usa el método Run\n",
  }),
  c({
    levelId: 10,
    language: "csharp",
    story: "El carguero debe registrar varios contenedores.",
    objective: "Usa una colección.",
    prompt:
      "Crea una lista de strings llamada cargo con dos elementos y muestra cuántos hay.",
    hints: [
      "Necesitas almacenar varios valores.",
      "List<string> guarda textos.",
      'var cargo = new List<string> { "a", "b" };',
      "El total es cargo.Count.",
    ],
    solution:
      'var cargo = new List<string> { "a", "b" };\nConsole.WriteLine(cargo.Count);',
    starterCode: "// Registra los contenedores\n",
  }),

  // ----- Java -----
  c({
    levelId: 11,
    language: "java",
    story: "Recibes una señal y debes guardar su intensidad.",
    objective: "Declara y opera con variables.",
    prompt: "Declara un int signal con valor 7 e imprímelo.",
    hints: [
      "Las variables en Java tienen tipo.",
      "Para enteros se usa int.",
      "int signal = 7;",
      "Imprime con System.out.println(signal);",
    ],
    solution: "int signal = 7;\nSystem.out.println(signal);",
    starterCode: "// Guarda la intensidad de la señal\n",
  }),
  c({
    levelId: 12,
    language: "java",
    story: "Las compuertas de energía se activan con lógica booleana.",
    objective: "Combina condiciones booleanas.",
    prompt:
      "Si a y b son true, imprime \"activado\". Usa el operador &&.",
    hints: [
      "Necesitas que dos condiciones se cumplan.",
      "El operador AND es &&.",
      "if (a && b) { ... }",
      "Imprime con System.out.println(...).",
    ],
    solution:
      'boolean a = true, b = true;\nif (a && b) {\n    System.out.println("activado");\n}',
    starterCode: "boolean a = true, b = true;\n// Activa la compuerta\n",
  }),
  c({
    levelId: 13,
    language: "java",
    story: "Debes repetir una secuencia temporal un número exacto de veces.",
    objective: "Usa un bucle controlado.",
    prompt: "Imprime \"tick\" tres veces usando un bucle.",
    hints: [
      "Repetir N veces es un bucle.",
      "El for controla las repeticiones.",
      "for (int i = 0; i < 3; i++)",
      'Dentro, usa System.out.println("tick");',
    ],
    solution:
      'for (int i = 0; i < 3; i++) {\n    System.out.println("tick");\n}',
    starterCode: "// Repite el tick 3 veces\n",
  }),
  c({
    levelId: 14,
    language: "java",
    story: "La red de energía se modela como objetos conectados.",
    objective: "Crea una clase simple.",
    prompt:
      "Define una clase Node con un campo int id. Crea un objeto y asigna id = 1.",
    hints: [
      "Los objetos se basan en clases.",
      "Una clase agrupa datos y comportamiento.",
      "class Node { int id; }",
      "Node n = new Node(); n.id = 1;",
    ],
    solution:
      "class Node {\n    int id;\n}\n\nNode n = new Node();\nn.id = 1;",
    starterCode: "// Modela un nodo de la red\n",
  }),
  c({
    levelId: 15,
    language: "java",
    story: "El sistema debe rastrear recursos a través de un contrato común.",
    objective: "Define una interfaz y úsala.",
    prompt:
      "Define una interfaz Tracker con un método track(). Implementa una clase que la cumpla.",
    hints: [
      "Un contrato común se define con una interfaz.",
      "interface declara métodos sin cuerpo.",
      "interface Tracker { void track(); }",
      "class R implements Tracker { public void track() {} }",
    ],
    solution:
      "interface Tracker {\n    void track();\n}\n\nclass R implements Tracker {\n    public void track() {\n        System.out.println(\"rastreando\");\n    }\n}",
    starterCode: "// Define el contrato Tracker\n",
  }),
];

export function getChallenge(levelId: number): Challenge | undefined {
  return CHALLENGES.find((ch) => ch.levelId === levelId);
}
