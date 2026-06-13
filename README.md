# Trace

Aprende a pensar como programador.

Plataforma de aprendizaje basada en retos visuales y minijuegos.
**Fase Final MVP + Pulido Premium**: mundo Python completo (5 niveles, 5
minijuegos), revisión visual y de animaciones, accesibilidad, responsive y
lenguaje visual de cristal (glassmorphism contenido, estilo iOS/Linear).

> 100% frontend. Sin backend, API, base de datos, autenticación, usuarios,
> servidores, Docker ni servicios cloud. Todo funciona en el navegador.

---

## Stack

- Next.js 14 (App Router, exportación estática `output: "export"`)
- React 18 / TypeScript
- Tailwind CSS
- Framer Motion

---

## Cómo ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera /out (sitio estático puro, desplegable en cualquier host)
```

---

## Fases completadas

| Fase | Contenido |
|------|-----------|
| 1 | Configuración base del proyecto |
| 2 | `ANIMATION_SYSTEM.md` — fuente de verdad de animaciones |
| 3 | Estructura navegable (Home, Worlds, Profile, Settings, 404) |
| 4 | Sistema de progresión: 15 niveles, 3 mundos, localStorage |
| 5 | Experiencia de juego: Game Screen, pistas manuales, estrellas, intro, victoria |
| 6 | Primer minijuego funcional: Crystal Counter (validación real, escena de cristales) |
| 7 | Segundo minijuego: Secret Door (condicionales, puerta mágica con feedback True/False) |
| 8 | Tercer minijuego: Treasure Loop (bucles, cofre rodeado de monedas que se recogen una a una con while) |
| 9 | Cuarto minijuego: Robot Path (funciones, un robot explorador cruza el camino usando una habilidad creada con def) |
| Final MVP | Quinto minijuego: Memory Puzzle (listas). Revisión visual global, animaciones depuradas (sin partículas de celebración), soluciones flexibles, accesibilidad y responsive. |
| Pulido Premium | Lenguaje de cristal (`.glass` / `.glass-bar`): cards, paneles y barras translúcidas con blur, bordes `--glass-edge`, fondo ambiental con gradientes. Crystal Counter visualiza el PROBLEMA en estado vacío. Focus ring en el editor. "Reducir animaciones" también neutraliza animaciones CSS puras. |
| Entorno interactivo | CodeEditor rediseñado (estado vacío contextual, chip de feedback válido/inválido/completado, marco reactivo). Tira PROBLEMA → ACCIÓN → RESULTADO sobre cada minijuego (`ProblemFlow`). Perfil convertido en pantalla de logros (`ProgressDashboard`: anillos de niveles/estrellas/mundos + insignias de conceptos). Microinteracciones premium en Button. |

---

## Experiencia de juego (Fase 5)

### Flujo educativo

```
/worlds/[id]/[level]
  └── Intro  →  Juego  →  Completado
```

1. **Level Intro** — historia corta, objetivo y concepto a aprender.
   Botón "Comenzar" lleva al reto.

2. **Game Screen** — pantalla principal:
   - **Zona superior**: nombre del nivel, concepto (pill monospace), barra de
     progreso del mundo, estrellas guardadas, botón volver al mapa.
   - **Zona central**: `Visualization` — representación conceptual con nodos
     y glow teal. Foco absoluto, mucho espacio.
   - **Tira educativa**: `ProblemFlow` — PROBLEMA → ACCIÓN → RESULTADO sobre la
     escena; el paso activo se ilumina según el estado real del minijuego
     (lenguaje del problema, nunca código interno).
   - **Zona inferior**: `CodeEditor` — textarea mejorado con gutter de líneas,
     Tab→4 espacios, fuente mono, barra de título estilo editor. Estado vacío
     contextual por nivel, chip de feedback (Código válido / Revisa el código /
     Reto completado) y marco que reacciona al veredicto.
   - **Panel de pistas**: siempre visible a la derecha (lateral en desktop).
     Botón "Comprobar" completa el nivel (simulado en esta fase).

3. **Level Complete** — estrellas obtenidas animadas, concepto aprendido,
   pistas usadas, botón siguiente nivel o volver al mapa.

### Sistema de pistas (manual, sin IA)

Cada nivel tiene **4 pistas + solución**, escritas a mano en `src/lib/challenges.ts`.

- Se revelan **de una en una** al pulsar el botón. Nunca todas de golpe.
- Tras las 4 pistas aparece el botón "Ver solución".
- El contador `X / 4` siempre visible.

### Sistema de estrellas

| Estrellas | Condición |
|-----------|-----------|
| 3 | Sin pistas usadas |
| 2 | 1 o 2 pistas usadas |
| 1 | 3 o más pistas usadas, o solución revelada |

- Se guarda el **mejor resultado** por nivel (no se pierde si replays).
- Ver la solución cuenta como usar todas las pistas (mínimo 1 estrella).
- Las estrellas se muestran en el mapa de niveles sobre cada nodo completado.

### Tema visual

Acento neón teal (`--accent: 46 229 157`) inspirado en el estilo developer-dark
de AlgoMaster. Utilidades `.glow-accent` y `.text-glow` en globals.css.
Token `--star: 250 204 21` para estrellas amarillas.

**Lenguaje de cristal (Pulido Premium).** Inspiración iOS/visionOS/Linear/Arc:

| Utilidad | Uso | Composición |
|----------|-----|-------------|
| `.glass` | Cards, paneles (HintPanel, victoria, enunciado, intro) | `rgb(var(--surface) / 0.55)` + `backdrop-blur(14px) saturate(1.4)` + reflejo superior `--glass-edge / 0.06` + sombra suave |
| `.glass-bar` | Header y barra de navegación móvil | `rgb(var(--bg) / 0.65)` + `blur(18px) saturate(1.5)` |
| `border-glass/10` | Borde de cristal (token `--glass-edge`: blanco en oscuro, tinta en claro) | `rgb(var(--glass-edge) / 0.1)` |

Reglas: solo en superficies de UI estáticas — **nunca** dentro de escenas de
minijuego ni en elementos con animación continua (rendimiento). Fallback
`@supports not (backdrop-filter)` → superficies casi opacas (legibilidad
garantizada). El fondo del body lleva dos gradientes radiales ambientales que
alimentan el blur sin coste de render relevante.

### Importante

Los niveles 6-15 completan de forma **simulada** ("Comprobar"). Los niveles 1
(Crystal Counter), 2 (Secret Door), 3 (Treasure Loop), 4 (Robot Path) y 5
(Memory Puzzle) tienen validación real mínima por regex y escenas propias
(mundo Python completo). Sin IA, sin
backend, sin compiladores, sin motor de ejecución. El editor es un textarea
mejorado (sin Monaco/CodeMirror).

---

## Minijuego Crystal Counter (Fase 6)

Primer minijuego completamente funcional. Nivel 1, mundo Python, concepto
**variables**.

### Flujo

1. El jugador lee la historia y entra al reto.
2. Escribe código Python básico en el editor.
3. Pulsa **Ejecutar código**:
   - Al detectar `crystals = N` → aparecen N cristales (Crystal Spawn) y un
     contador (Crystal Count Reveal).
   - Al detectar `print(crystals)` → una tarjeta elegante muestra la salida
     (no una consola técnica).
4. Cuando ambos están presentes, el nivel se completa, otorga estrellas y
   desbloquea el siguiente. El progreso se guarda en localStorage.

### Validación (mínima, sin intérprete)

En `src/lib/crystalCounter.ts`, solo dos comprobaciones por regex:

| Requisito | Patrón |
|-----------|--------|
| Variable numérica | `crystals = <entero>` |
| Mostrar el valor | `print(crystals)` |

No hay parser, compilador ni intérprete. Solución de referencia:

```python
crystals = 10
print(crystals)
```

### Animaciones añadidas (solo tokens de ANIMATION_SYSTEM)

| Animación | Base | Token |
|-----------|------|-------|
| Crystal Spawn | 5.3 Scale + 5.2 Slide + 5.10 stagger | `spring.smooth`, `stagger.fast` |
| Crystal Count Reveal | 5.2 Slide | `transition.slide` |
| Result Card | 5.3 Scale | `spring.smooth` |
| Success Transition / Level Complete | 5.20 / 9.3 | `transition.celebrate` |

> El minijuego resuelve **únicamente** Crystal Counter. No hay abstracciones
> genéricas para otros lenguajes ni futuros minijuegos (simplicidad absoluta).

---

## Minijuego Secret Door (Fase 7)

Segundo minijuego. Nivel 2, mundo Python, concepto **condicionales**.
El jugador convence a una puerta mágica usando una decisión lógica.

### Experiencia

Una puerta imponente (piedra, runas, glow teal, partículas) reacciona al
código mediante una **secuencia de estados** (`SecretDoorScene`):

| Estado | Qué ocurre |
|--------|-----------|
| `idle` | La puerta espera, cerrada. |
| `keyDetected` | Se detectó `key = ...`; la llave aparece flotando ("Llave detectada"). |
| `checking` | Se detectó `if key:`; runas recorren el marco ("Comprobando condición..."). |
| `granted` | Condición verdadera: la puerta se abre, luz y partículas ("ACCESO PERMITIDO"). |
| `denied` | Condición falsa: puerta cerrada, glow rojo, sacudida leve ("ACCESO DENEGADO"). |

Entre `checking` y el veredicto se muestra el **razonamiento visual**:

```
key  ->  True/False  ->  CONDICIÓN VERDADERA / FALSA
```

### Validación (mínima, sin intérprete)

En `src/lib/secretDoor.ts`, tres comprobaciones por regex:

| Requisito | Patrón |
|-----------|--------|
| Llave booleana | `key = True` / `key = False` |
| Condición | `if key:` |
| Acción | `print("OPEN")` |

La puerta se abre solo si el código está bien formado **y** la condición es
verdadera. Si `key = False`, el reto demuestra que un condicional puede fallar.
Solución de referencia:

```python
key = True

if key:
    print("OPEN")
```

### Victoria propia

`ConditionalCompleteScreen` refuerza el concepto con una explicación visual
del `if` antes de las estrellas:

```
if condición:
    ejecutar
```
> "La computadora ejecuta código solamente cuando la condición es verdadera."

---

## Minijuego Treasure Loop (Fase 8)

Tercer minijuego. Nivel 3, mundo Python, concepto **bucles**.
El jugador descubre que la computadora puede **repetir** una acción: un cofre
rodeado de 5 monedas mágicas que hay que recoger una a una.

### Experiencia

Un cofre central rodeado de cinco monedas doradas (glow dorado, anillo de bucle
giratorio, partículas). La escena `TreasureLoopScene` reacciona al código
mediante una **secuencia de estados**, sin completarse al instante:

| Estado | Qué ocurre |
|--------|-----------|
| `idle` | El cofre espera, cerrado, sin monedas. |
| `coinsFound` | Se detectó `coins = 5`; aparecen 5 monedas con animación escalonada ("5 monedas encontradas"). |
| `looping` | Se detectó `while`; el anillo del bucle gira ("Iniciando repetición..."). Las monedas desaparecen **una a una**, mostrando "Iteración 1", "Iteración 2", … "Iteración 5". |
| `completed` | El bucle terminó ("Bucle completado"): el cofre se abre, explosión de luz y partículas doradas ("TESORO DESBLOQUEADO"). |

El jugador VE el patrón de repetición:

```
acción ↓ acción ↓ acción ↓ acción ↓ acción
```

### Validación (mínima, sin intérprete)

En `src/lib/treasureLoop.ts`, cuatro comprobaciones por regex:

| Requisito | Patrón |
|-----------|--------|
| Monedas | `coins = <entero>` |
| Bucle | `while ...:` |
| Acción repetida | `coins = coins - 1` |
| Recompensa | `print("TREASURE")` |

No hay parser, compilador ni intérprete. El cofre se abre cuando el código está
bien formado (las cuatro piezas presentes). Solución de referencia:

```python
coins = 5

while coins > 0:
    coins = coins - 1

print("TREASURE")
```

### Victoria propia

`LoopCompleteScreen` refuerza el concepto como **recompensa** (texto mínimo,
tema dorado), con una explicación visual del `while`:

```
while condición:
    repetir
```
> "Repetir acciones hasta que la condición deje de cumplirse."

---

## Minijuego Robot Path (Fase 9)

Cuarto minijuego. Nivel 4, mundo Python, concepto **funciones**.
Un pequeño robot explorador debe cruzar un camino de casillas hasta una
estación de energía. Moverlo paso a paso sería tedioso: el jugador crea una
**habilidad reutilizable** (la función `move`) y la usa varias veces.

### Experiencia

Un robot adorable estilo sci-fi al inicio de un camino de casillas, con una
estación de energía brillante como meta (glow teal, partículas, obstáculos
decorativos). La escena `RobotPathScene` reacciona al código mediante una
**secuencia de estados**, sin completarse al instante:

| Estado | Qué ocurre |
|--------|-----------|
| `idle` | El robot espera al inicio del camino, sin habilidad. |
| `skillCreated` | Se detectó `def move():`; energía entra al robot, glow y chispas ("Nueva habilidad creada"). |
| `moving` | Cada llamada `move()` hace avanzar al robot una casilla. Se muestra el momento educativo `move() → MOVE → avanza`, paso a paso. |
| `completed` | El robot llegó a la estación: destello, partículas y celebración ("OBJETIVO ALCANZADO"). |

El jugador VE la reutilización: la habilidad se **crea una vez** y se **usa muchas**.

```
Función creada ↓ Función utilizada ↓ Función utilizada ↓ Función utilizada
```

### Validación (mínima, sin intérprete)

En `src/lib/robotPath.ts`, tres comprobaciones por regex (`validateRobotPath`):

| Requisito | Patrón |
|-----------|--------|
| Función | `def move():` |
| Acción | `print("MOVE")` |
| Uso | al menos 3 llamadas `move()` (se cuentan, sin contar la definición) |

No hay parser, compilador ni intérprete. El robot llega a la meta cuando el
código está bien formado y la función se usa al menos tres veces. Solución de
referencia:

```python
def move():
    print("MOVE")

move()
move()
move()
```

### Victoria propia

`FunctionCompleteScreen` refuerza el concepto como **recompensa** (texto mínimo,
tema teal), con una explicación visual de la función:

```
def move():
    print("MOVE")
```
> "Las funciones permiten guardar acciones y reutilizarlas cuando las necesites."

---

## Minijuego Memory Puzzle (Fase Final MVP)

Quinto minijuego. Nivel 5, mundo Python, concepto **listas**.
El jugador encuentra cuatro piezas desordenadas `[3] [1] [4] [2]` y debe
organizarlas en una lista hasta dejarla como `[1, 2, 3, 4]`. Visualiza el
PROBLEMA (ordenar), no la sintaxis. Tema índigo, sin partículas.

### Experiencia

La escena `MemoryPuzzleScene` reacciona al código mediante una secuencia de
estados:

| Estado | Qué ocurre |
|--------|-----------|
| `idle` | Las cuatro piezas flotan desordenadas. |
| `listFormed` | Se detectó una lista; las piezas entran en el riel ordenado. |
| `organizing` | Las piezas se reordenan una a una hasta `[1, 2, 3, 4]`. |
| `completed` | Rompecabezas resuelto: pulso de halo contenido y victoria. |

### Validación flexible (soluciones múltiples)

En `src/lib/memoryPuzzle.ts` (`validateMemoryPuzzle`). Se aceptan **tres formas
válidas** — se prioriza la comprensión sobre una línea exacta:

| Forma | Ejemplo |
|-------|---------|
| Literal ya ordenada | `pieces = [1, 2, 3, 4]` |
| Método `.sort()` | `pieces = [3, 1, 4, 2]` + `pieces.sort()` |
| Función `sorted()` | `pieces = sorted([3, 1, 4, 2])` |

No hay parser ni intérprete: se comprueba que exista una lista y que el
resultado quede en orden ascendente. Solución de referencia:

```python
pieces = [3, 1, 4, 2]
pieces.sort()
```

### Victoria propia

`ListCompleteScreen` (tema índigo) muestra las cuatro piezas ordenadas y
refuerza el concepto de lista antes de las estrellas.

---

## Sistema de progresión (Fase 4)

### Mundos y niveles

| # | Mundo | Nivel | Concepto |
|---|-------|-------|----------|
| 1 | Python | Crystal Counter | Variables y asignación |
| 2 | Python | Secret Door | Condicionales |
| 3 | Python | Treasure Loop | Bucles |
| 4 | Python | Robot Path | Funciones |
| 5 | Python | Memory Puzzle | Listas |
| 6 | C# | Space Scanner | Tipos y declaraciones |
| 7 | C# | Security Checkpoint | Condicionales avanzados |
| 8 | C# | Drone Patrol | Bucles y arrays |
| 9 | C# | Factory Controller | Métodos y clases |
| 10 | C# | Cargo Manager | Colecciones |
| 11 | Java | Signal Decoder | Operadores y tipos |
| 12 | Java | Power Gates | Lógica booleana |
| 13 | Java | Time Repeater | Bucles y control de flujo |
| 14 | Java | Energy Network | Clases y objetos |
| 15 | Java | Resource Tracker | Interfaces y abstracción |

### Regla de desbloqueo

Completar el nivel N desbloquea el N+1. Sin monedas, sin economía.

### Estados de nivel

- `locked` — bloqueado, no accesible.
- `available` — desbloqueado, listo para jugar.
- `completed` — superado.
- `mastered` — superado con maestría (futuras fases).

### Persistencia

Clave localStorage: `trace.progress.v1`

```ts
interface SavedProgress {
  currentWorldId: string | null;
  currentLevelId: number | null;
  completedLevelIds: number[];
  starsByLevel: Record<number, number>; // mejor resultado por nivel
}
```

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home con progreso real y botón Continuar |
| `/worlds` | Selección de mundos con barras de progreso |
| `/worlds/[id]` | Mapa de niveles con estados, desbloqueo y estrellas |
| `/worlds/[id]/[level]` | Game Screen: intro → reto → victoria |
| `/worlds/python/1` | Crystal Counter (variables) |
| `/worlds/python/2` | Secret Door (condicionales, True/False) |
| `/worlds/python/3` | Treasure Loop (bucles, monedas recogidas con while) |
| `/worlds/python/4` | Robot Path (funciones, robot que avanza con move()) |
| `/worlds/python/5` | Memory Puzzle (listas, piezas que se ordenan) |
| `/profile` | Pantalla de logros: anillos (niveles/estrellas/mundos), insignias de conceptos, progreso por mundo |
| `/settings` | Tema oscuro y reducir animaciones |
| (otras) | 404 |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                    # Home
│   ├── not-found.tsx               # 404
│   ├── worlds/
│   │   ├── page.tsx                # World Selection
│   │   └── [id]/
│   │       ├── page.tsx            # generateStaticParams (mundos)
│   │       ├── view.tsx            # Mapa de niveles → navega al juego
│   │       └── [level]/
│   │           ├── page.tsx        # generateStaticParams (15 niveles)
│   │           └── view.tsx        # GameView: flujo intro/juego/victoria
│   ├── profile/page.tsx            # Perfil con progreso real
│   └── settings/page.tsx           # Ajustes
├── components/
│   ├── AppFrame.tsx                # Layout + page transition
│   ├── Header.tsx                  # Navegación responsive
│   ├── MotionRoot.tsx              # MotionConfig
│   ├── game/
│   │   ├── Visualization.tsx       # Zona central genérica (niveles 3-15)
│   │   ├── CrystalScene.tsx        # Visualización del minijuego (nivel 1)
│   │   ├── SecretDoorScene.tsx     # Puerta mágica de condicionales (nivel 2)
│   │   ├── ConditionalCompleteScreen.tsx # Victoria propia del nivel 2
│   │   ├── TreasureLoopScene.tsx    # Cofre y monedas de bucles (nivel 3)
│   │   ├── LoopCompleteScreen.tsx   # Victoria propia del nivel 3
│   │   ├── RobotPathScene.tsx       # Robot explorador de funciones (nivel 4)
│   │   ├── FunctionCompleteScreen.tsx # Victoria propia del nivel 4
│   │   ├── MemoryPuzzleScene.tsx    # Piezas y riel de listas (nivel 5)
│   │   ├── ListCompleteScreen.tsx   # Victoria propia del nivel 5
│   │   ├── CodeEditor.tsx          # Editor interactivo (estados valid/invalid/completed)
│   │   ├── ProblemFlow.tsx         # Tira PROBLEMA -> ACCIÓN -> RESULTADO
│   │   ├── HintPanel.tsx           # Pistas progresivas + solución
│   │   ├── StarRating.tsx          # Estrellas animadas (star reward)
│   │   ├── LevelIntro.tsx          # Pantalla previa (historia/objetivo)
│   │   └── LevelCompleteScreen.tsx # Pantalla de victoria
│   ├── progression/
│   │   ├── LevelNode.tsx           # Nodo de nivel (estados + estrellas)
│   │   ├── ProgressDashboard.tsx   # Pantalla de logros (anillos + insignias)
│   │   └── WorldCard.tsx           # Tarjeta de mundo con progreso
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Logo.tsx
│       ├── ProgressBar.tsx
│       ├── Reveal.tsx
│       └── Toggle.tsx
├── context/
│   ├── SettingsContext.tsx         # Tema + reducir animaciones
│   └── ProgressContext.tsx         # Estado global + estrellas
└── lib/
    ├── motion.ts                   # Motion tokens (ANIMATION_SYSTEM sec. 6)
    ├── progression.ts              # Mundos, niveles, reglas de desbloqueo
    ├── challenges.ts               # Retos: pistas y soluciones MANUALES
    ├── crystalCounter.ts           # Validación mínima del minijuego (nivel 1)
    ├── secretDoor.ts               # Validación mínima del minijuego (nivel 2)
    ├── treasureLoop.ts             # Validación mínima del minijuego (nivel 3)
    ├── robotPath.ts                # Validación mínima del minijuego (nivel 4)
    ├── memoryPuzzle.ts             # Validación flexible del minijuego (nivel 5)
    └── storage.ts                  # Persistencia localStorage + estrellas
```

---

## Documentación del proyecto

- `README.md`
- `ANIMATION_SYSTEM.md`

---

## Pendiente (fases posteriores)

- Minijuegos funcionales para los niveles 6-15 (mundos C# y Java)
- Visualizaciones avanzadas por concepto (grafos, árboles, flujos)
- Estado `mastered` con criterios diferenciados
- Más variedad de tipos de reto (drag-and-drop, completar huecos, etc.)
