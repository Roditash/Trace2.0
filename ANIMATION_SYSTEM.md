# Trace — Animation System

Fuente oficial de verdad para todas las animaciones del proyecto Trace.

Este documento es normativo. Cualquier animación que se implemente en Trace debe
derivarse de las definiciones, tokens y especificaciones que aquí se describen.
Un desarrollador debe poder implementar cualquier animación del proyecto leyendo
únicamente este documento, sin tomar decisiones adicionales.

Stack objetivo: React, Next.js, TypeScript, Tailwind, Framer Motion.

Restricción: Trace es exclusivamente frontend. No hay backend, APIs, bases de
datos, autenticación, usuarios, servidores, Docker ni Kubernetes. Ninguna
animación puede depender de recursos de red.

Regla de marca: sin emojis en producto ni en componentes. Prioridad absoluta a
UX, aprendizaje y simplicidad.

---

## Índice

1. Filosofía de animación
2. Principios
3. Duraciones
4. Easing (tabla oficial)
5. Animaciones base
6. Motion Tokens
7. Comportamiento de componentes
8. Transiciones de pantalla
9. Sistema de feedback
10. Animaciones para minijuegos
11. Accesibilidad y rendimiento
12. Prohibiciones
13. Referencias y checklist

---

## 1. Filosofía de animación

En Trace las animaciones no son decoración. Son parte del sistema de aprendizaje.
Una animación correcta reduce la carga cognitiva; una incorrecta la aumenta.

Toda animación en Trace debe cumplir al menos una de estas cuatro funciones:

1. Guiar la atención hacia el elemento relevante en el momento correcto.
2. Comunicar un estado o un cambio de estado (carga, éxito, error, bloqueo).
3. Explicar una relación espacial o causal (de dónde viene algo, a dónde va).
4. Confirmar una acción del usuario con feedback inmediato.

Si una animación no cumple ninguna de estas funciones, no se implementa.

### Cuándo animar

- Cuando un elemento aparece, desaparece o cambia de posición y el usuario
  necesita entender el cambio.
- Cuando el usuario realiza una acción y necesita confirmación inmediata
  (pulsar, enviar, seleccionar).
- Cuando cambia un estado importante para el aprendizaje (respuesta correcta o
  incorrecta, nivel completado, nivel desbloqueado, pista revelada).
- Cuando se navega entre pantallas y conviene preservar la continuidad espacial.
- Cuando un proceso ocurre en el tiempo (progreso, compilación, evaluación).

### Cuándo NO animar

- Cuando el usuario está leyendo o escribiendo código: el contenido textual no
  se anima nunca durante la edición.
- Cuando la animación retrasaría una acción que el usuario espera instantánea.
- Cuando se repite con muy alta frecuencia (cada pulsación de tecla, cada scroll).
- Cuando el usuario activó "reducir movimiento" (ver sección 11).
- Cuando varios elementos compiten por la atención al mismo tiempo: solo el
  elemento más relevante se anima.

### Qué debe comunicar una animación

- Origen y destino: de dónde aparece y hacia dónde se va un elemento.
- Jerarquía: lo importante entra primero y con más presencia.
- Causa y efecto: la acción del usuario produce visiblemente el resultado.
- Estado del sistema: si algo está cargando, validándose, completado o bloqueado.

### Qué debe evitarse

- Movimiento sin significado.
- Duraciones largas que obliguen a esperar.
- Rebotes, sobretiros exagerados y estética de videojuego arcade.
- Animar muchos elementos a la vez sin jerarquía.
- Efectos que dificulten leer texto o código.

---

## 2. Principios

Cinco principios rectores. Toda decisión de animación se valida contra ellos.

### 2.1 Motion with purpose

Cada animación debe justificar su existencia con una de las cuatro funciones de
la sección 1. Si no se puede justificar, se elimina.

### 2.2 Smooth over flashy

Preferimos transiciones suaves y sobrias antes que efectos llamativos. Trace
debe sentirse como una herramienta profesional (Linear, Raycast, Arc), no como
una landing de marketing.

### 2.3 Fast feedback

El feedback a una acción directa del usuario debe percibirse instantáneo.
El inicio visible de la respuesta ocurre en menos de 100 ms.

### 2.4 Consistent timing

Las mismas categorías de interacción usan las mismas duraciones y curvas en toda
la aplicación. No se inventan tiempos puntuales; se usan los tokens.

### 2.5 Minimal distraction

El movimiento nunca compite con el contenido de aprendizaje. En pantallas donde
el usuario lee o resuelve, el movimiento ambiental se reduce al mínimo.

---

## 3. Duraciones

Tres categorías oficiales. Cada animación debe usar una de ellas.

| Categoría | Token              | Duración | Uso principal                                              |
|-----------|--------------------|----------|------------------------------------------------------------|
| Micro     | `duration.micro`   | 120 ms   | Feedback inmediato: hover, press, focus, cambios pequeños. |
| Normal    | `duration.normal`  | 220 ms   | Transiciones estándar: fade, slide, scale, modales, tooltips. |
| Large     | `duration.large`   | 360 ms   | Cambios de contexto amplios: page transitions, reveals grandes. |

Reglas:

- Ninguna animación de interfaz debe superar los 360 ms.
- Excepción única: animaciones de celebración de nivel completado, que pueden
  llegar hasta 600 ms (`duration.celebrate`) por ser un momento emocional clave,
  nunca bloqueante.
- Las animaciones de salida (exit) usan una duración igual o ligeramente menor
  que la de entrada para que cerrar se sienta más rápido que abrir.
- Valores intermedios no permitidos: solo se usan los tokens definidos.

Tabla de valores en milisegundos (referencia para `transition.duration` en segundos):

| Token                | ms  | segundos |
|----------------------|-----|----------|
| `duration.instant`   | 0   | 0        |
| `duration.micro`     | 120 | 0.12     |
| `duration.normal`    | 220 | 0.22     |
| `duration.large`     | 360 | 0.36     |
| `duration.celebrate` | 600 | 0.60     |

---

## 4. Easing (tabla oficial)

Las curvas se expresan como `cubic-bezier` (para CSS/Framer `ease`) o como
configuración de spring (para Framer `type: "spring"`).

| Token            | Tipo   | Definición                          | Uso                                                        |
|------------------|--------|-------------------------------------|------------------------------------------------------------|
| `ease.standard`  | bezier | `cubic-bezier(0.2, 0, 0, 1)`        | Movimiento general entrada/salida. Curva por defecto.      |
| `ease.out`       | bezier | `cubic-bezier(0.0, 0, 0.2, 1)`      | Entradas: el elemento llega y desacelera. Sensación rápida.|
| `ease.in`        | bezier | `cubic-bezier(0.4, 0, 1, 1)`        | Salidas: el elemento acelera al irse.                      |
| `ease.inOut`     | bezier | `cubic-bezier(0.4, 0, 0.2, 1)`      | Movimientos que empiezan y terminan en pantalla.           |
| `ease.emphasis`  | bezier | `cubic-bezier(0.2, 0, 0, 1)`        | Reveals importantes, level complete. Igual a standard.     |
| `spring.subtle`  | spring | `stiffness 300, damping 30, mass 1` | Microinteracciones, toggles, pills de navegación.          |
| `spring.smooth`  | spring | `stiffness 220, damping 28, mass 1` | Modales, cards, paneles. Asentamiento suave sin rebote.    |
| `spring.snappy`  | spring | `stiffness 420, damping 32, mass 1` | Press, checks, feedback rápido. Respuesta nítida.          |

Reglas de easing:

- Curva por defecto: `ease.standard`.
- Entradas con `ease.out`; salidas con `ease.in`; recorridos internos con `ease.inOut`.
- Springs siempre con `damping` suficiente para que no haya rebote visible
  (overshoot perceptible prohibido). Ninguna spring debe oscilar más de una vez.
- No se permiten curvas con sobretiro tipo `back` o `elastic`.

---

## 5. Animaciones base

Especificación de cada primitiva. Cada una indica propiedades animadas, estado
inicial, estado final, duración y easing. Estas primitivas son la base de todo
lo demás.

Notación: `opacity`, `y`, `x`, `scale` son propiedades de Framer Motion.
Las distancias se expresan en px y se definen como tokens en la sección 6.

### 5.1 Fade

- Propiedad: `opacity`.
- Entrada: `opacity 0 -> 1`. Salida: `opacity 1 -> 0`.
- Duración: `normal`. Easing: `ease.out` (entrada), `ease.in` (salida).
- Uso: aparición de contenido sin desplazamiento, overlays, fondos de modal.

### 5.2 Slide

- Propiedades: `opacity` + `y` (o `x`).
- Entrada: `y: distance.sm (8) -> 0`, `opacity 0 -> 1`.
- Salida: `y: 0 -> distance.sm`, `opacity 1 -> 0`.
- Dirección por defecto: vertical, desde abajo hacia su posición.
- Duración: `normal`. Easing: `ease.out` (entrada), `ease.in` (salida).
- Uso: aparición de listas, secciones, tarjetas en flujo.

### 5.3 Scale

- Propiedades: `scale` + `opacity`.
- Entrada: `scale 0.98 -> 1`, `opacity 0 -> 1`.
- Salida: `scale 1 -> 0.98`, `opacity 1 -> 0`.
- Rango de escala permitido: 0.96 a 1.02. Nunca menor a 0.96 ni mayor a 1.02.
- Duración: `normal`. Easing: `spring.smooth` o `ease.out`.
- Uso: modales, popovers, elementos que aparecen "in place".

### 5.4 Spring

- Tipo: `spring` según token (`subtle`, `smooth`, `snappy`).
- Sin rebote visible. Una sola aproximación al valor final.
- Uso: cuando el movimiento debe sentirse físico pero contenido (toggles,
  indicadores activos, checks).

### 5.5 Hover

- Propiedades: `scale` y/o `y` y/o color/borde.
- Valores: `scale 1 -> 1.02` o `y: 0 -> -2`. Nunca ambos a la vez de forma fuerte.
- Duración: `micro`. Easing: `ease.standard`.
- Solo en dispositivos con puntero fino (`hover: hover`). En táctil no aplica.

### 5.6 Press

- Propiedad: `scale`.
- Valor: `scale 1 -> 0.98` mientras se mantiene presionado; vuelve a 1 al soltar.
- Duración: `micro`. Easing: `spring.snappy`.
- Aplica a todo elemento accionable (botones, cards clicables, opciones).

### 5.7 Success

- Propiedades: color/borde + un check con `scale` y `pathLength`.
- Borde/halo transita al color de acento de éxito; check dibuja `pathLength 0 -> 1`.
- Duración: `normal`. Easing: `spring.snappy` para el check.
- Sin partículas. Sin confeti en interacciones cotidianas (ver sección 9).

### 5.8 Error

- Propiedades: color/borde + un shake horizontal mínimo.
- Shake: `x: 0 -> -4 -> 4 -> -2 -> 0` una sola vez.
- Amplitud máxima: 4 px. Repeticiones: 1. Duración total: `normal`.
- Easing: `ease.inOut`. Nunca se repite en bucle.

### 5.9 Focus

- Propiedades: anillo de foco (`box-shadow`/`ring`) con `opacity` y `scale` del anillo.
- Anillo aparece con `opacity 0 -> 1` en `micro`, `ease.out`.
- Siempre visible y de alto contraste; el foco nunca depende solo del color.

### 5.10 Reveal

- Propiedades: `opacity` + `y` con stagger entre hijos.
- Cada hijo: slide básico. Stagger: `stagger.normal` (40 ms) entre elementos.
- Duración por elemento: `normal`. Easing: `ease.out`.
- Máximo recomendado de elementos con stagger simultáneo: 8. Si hay más, se
  agrupa o se usa un único fade del contenedor.

### 5.11 Page Transition

- Saliente: `opacity 1 -> 0`, `y: 0 -> -8`. Entrante: `opacity 0 -> 1`, `y: 8 -> 0`.
- Duración: `large`. Easing: `ease.standard`.
- La entrante empieza cuando la saliente está casi terminada (sin solapamiento largo).

### 5.12 Modal Open

- Overlay: fade `normal`. Panel: scale `0.98 -> 1` + `opacity 0 -> 1`, `spring.smooth`.
- El panel aparece desde el centro (o desde abajo en móvil con `y: 16 -> 0`).
- Foco se mueve al primer elemento del modal al abrir.

### 5.13 Modal Close

- Panel: `scale 1 -> 0.98` + `opacity 1 -> 0`. Overlay: fade out.
- Duración: ligeramente menor que open (usar `micro`-`normal`). Easing: `ease.in`.
- Cerrar siempre se siente más rápido que abrir.

### 5.14 Tooltip

- Propiedades: `opacity` + `y/x` pequeño (4 px) hacia el elemento de anclaje.
- Aparece con retardo de `delay.tooltip` (300 ms) para evitar parpadeos.
- Entrada: `micro`-`normal`, `ease.out`. Salida: `micro`, `ease.in`, sin retardo.

### 5.15 Card Hover

- Ver 5.5. `y: 0 -> -2` o `scale 1 -> 1.02`, sombra sutil incrementa.
- Duración: `micro`. Easing: `ease.standard`. Solo con puntero fino.

### 5.16 Button Hover

- Cambio de fondo/borde + opcional `scale 1.01`. Duración `micro`, `ease.standard`.

### 5.17 Button Press

- Ver 5.6. `scale 0.98`, `spring.snappy`, duración `micro`.

### 5.18 Progress Update

- Propiedad: `width` o `scaleX` de la barra de progreso.
- Transición del valor anterior al nuevo. Duración: `normal`. Easing: `ease.out`.
- El número asociado, si existe, interpola en la misma duración. Nunca salta.

### 5.19 Hint Reveal

- La pista aparece con slide básico (`y: 8 -> 0`, `opacity 0 -> 1`).
- Duración: `normal`. Easing: `ease.out`.
- Si hay varias pistas, se revelan de una en una, no todas a la vez.

### 5.20 Level Complete

- Secuencia contenida: borde/halo de éxito + check (5.7) + ascenso del panel de
  resumen con slide. Duración total hasta `celebrate` (600 ms).
- Sin confeti por defecto; ver sección 9 para la regla de celebración.

### 5.21 Level Unlock

- El nodo/tarjeta de nivel pasa de estado bloqueado a desbloqueado:
  `opacity 0.5 -> 1`, candado se desvanece (fade out), borde transita a activo.
- Duración: `normal`-`large`. Easing: `ease.out`. Un solo pulso de énfasis, sin loop.

---

## 6. Motion Tokens

Conjunto único de tokens. Toda animación futura debe construirse con ellos.
Se expresan aquí como contrato; su implementación vivirá en un único archivo de
tokens del proyecto (por ejemplo `src/lib/motion.ts`), pendiente de fases futuras.

### 6.1 Tokens de duración (segundos)

```
duration.instant   = 0
duration.micro     = 0.12
duration.normal    = 0.22
duration.large     = 0.36
duration.celebrate = 0.60
```

### 6.2 Tokens de easing

```
ease.standard = [0.2, 0, 0, 1]
ease.out      = [0.0, 0, 0.2, 1]
ease.in       = [0.4, 0, 1, 1]
ease.inOut    = [0.4, 0, 0.2, 1]
ease.emphasis = [0.2, 0, 0, 1]
```

### 6.3 Tokens de spring

```
spring.subtle = { type: "spring", stiffness: 300, damping: 30, mass: 1 }
spring.smooth = { type: "spring", stiffness: 220, damping: 28, mass: 1 }
spring.snappy = { type: "spring", stiffness: 420, damping: 32, mass: 1 }
```

### 6.4 Tokens de distancia (px)

```
distance.xs = 4
distance.sm = 8
distance.md = 16
distance.lg = 24
```

### 6.5 Tokens de escala

```
scale.pressed = 0.98
scale.in      = 0.98
scale.hover   = 1.02
```

### 6.6 Tokens de stagger y retardo (segundos)

```
stagger.fast   = 0.03
stagger.normal = 0.04
stagger.slow   = 0.06
delay.tooltip  = 0.30
delay.none     = 0
```

### 6.7 Tokens semánticos (transition presets)

Combinaciones listas para usar. Son la interfaz preferida; los componentes
deben consumir presets, no valores sueltos.

```
transition.micro     = { duration: duration.micro,  ease: ease.standard }
transition.fade      = { duration: duration.normal, ease: ease.out }
transition.slide     = { duration: duration.normal, ease: ease.out }
transition.scale     = spring.smooth
transition.press     = spring.snappy
transition.page      = { duration: duration.large,  ease: ease.standard }
transition.modal     = spring.smooth
transition.tooltip   = { duration: duration.normal, ease: ease.out, delay: delay.tooltip }
transition.progress  = { duration: duration.normal, ease: ease.out }
transition.celebrate = { duration: duration.celebrate, ease: ease.emphasis }
```

### 6.8 Variants reutilizables (contrato)

Variants estándar que los componentes reutilizan. Definición conceptual:

```
fadeVariants   = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
slideVariants  = { hidden: { opacity: 0, y: distance.sm }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: distance.sm } }
scaleVariants  = { hidden: { opacity: 0, scale: scale.in }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: scale.in } }
revealParent   = { visible: { transition: { staggerChildren: stagger.normal } } }
```

Regla: no se crean variants nuevas si una existente cubre el caso. Las nuevas
variants se añaden a este documento antes de usarse.

---

## 7. Comportamiento de componentes

Cada componente especifica: estados, animaciones por estado y tokens usados.

### 7.1 Button

- Estados: rest, hover, press, focus, loading, disabled.
- Hover: `scale.hover` ligero o cambio de fondo; `transition.micro`.
- Press: `scale.pressed`; `transition.press`.
- Focus: anillo de foco visible; aparición `micro`, `ease.out`.
- Loading: el contenido se sustituye por un indicador con fade `normal`; el ancho
  del botón no debe saltar (reservar espacio).
- Disabled: sin animaciones de hover/press; opacidad reducida sin transición de movimiento.

### 7.2 Card

- Estados: rest, hover, press (si es clicable), selected.
- Hover: `y: -2` o `scale.hover` + sombra sutil; `transition.micro`. Solo puntero fino.
- Press: `scale.pressed`; `transition.press`.
- Selected: borde de acento que transita en `micro`; el estado se mantiene sin loop.
- Aparición en lista: `slideVariants` con stagger del contenedor.

### 7.3 Input

- Estados: rest, focus, valid, invalid, disabled.
- Focus: anillo/borde de acento con `transition.micro`, `ease.out`.
- Valid: borde a color de éxito con transición de color `normal`; sin movimiento.
- Invalid: borde a color de error + shake de error (5.8) una sola vez.
- Nunca se anima el texto que el usuario escribe.

### 7.4 Modal

- Open: overlay fade `transition.fade`; panel `scaleVariants` con `transition.modal`.
  En móvil, panel entra con `y: distance.md -> 0`.
- Close: panel `scale.in` + fade out con `ease.in`, más rápido que open; overlay fade out.
- Foco atrapado dentro del modal mientras está abierto.
- Cerrar con tecla de escape usa la misma animación de close.

### 7.5 Tooltip

- Aparece tras `delay.tooltip`; `transition.tooltip`; desplazamiento de 4 px hacia el ancla.
- Desaparece de inmediato (sin retardo) con fade `micro`, `ease.in`.
- No anima si el usuario ya está en movimiento rápido entre elementos (evitar parpadeo).

### 7.6 Progress Bar

- Actualización de valor: `transition.progress` sobre `scaleX`/`width`.
- Estado indeterminado (p. ej. evaluando código): movimiento lineal continuo y
  sobrio del indicador; sin destellos. Se detiene en cuanto hay resultado.
- Al completarse: la barra llega a 100 por ciento y, si corresponde, dispara el
  feedback de la sección 9.

### 7.7 Hint Card

- Aparición: slide (5.19), `transition.slide`. Revelado secuencial si hay varias.
- Cada pista mantiene su estado abierto sin animación de fondo.
- Cerrar pista: fade + slide de salida `micro`-`normal`, `ease.in`.

### 7.8 Level Card

- Estados: locked, available, in-progress, completed.
- Locked: sin hover de elevación; icono de candado estable; opacidad reducida.
- Available: hover de card (7.2) habilitado.
- In-progress: indicador de progreso animado con `transition.progress`.
- Completed: marca de éxito persistente; al transicionar a completed se usa 5.20.
- Unlock (locked -> available): animación 5.21, un solo pulso.

### 7.9 Navigation

- Indicador de sección activa: pill que se desplaza entre items con `spring.subtle`
  (técnica de layout compartido). Sin rebote.
- Items: hover de color `micro`; sin desplazamiento que mueva el layout.
- En móvil, la barra es fija; los cambios de item solo animan color del indicador.

---

## 8. Transiciones de pantalla

Todas las pantallas usan `transition.page` (large, `ease.standard`) salvo
indicación contraria. La entrante comienza al final de la saliente.

### 8.1 Home

- Entrada: contenido principal con `reveal` (stagger del contenedor).
- El movimiento ambiental es mínimo; nada se mueve en bucle.

### 8.2 World Selection (selección de mundo/tema)

- Las tarjetas de mundo entran con `slideVariants` + stagger `stagger.normal`.
- Al elegir un mundo, la tarjeta seleccionada hace énfasis breve (scale a 1.02 y
  vuelta) y luego se ejecuta la page transition hacia la pantalla de juego.
- Continuidad espacial: si es viable, el color/acento del mundo persiste en la
  pantalla siguiente para reforzar el origen.

### 8.3 Game Screen

- Entrada: el área de reto aparece primero (slide), los controles secundarios
  después con un stagger corto. El editor/área de trabajo aparece con fade simple,
  sin desplazamiento que distraiga.
- Durante el juego, el movimiento ambiental se reduce al mínimo (principio 2.5).
- Salida hacia resultados o siguiente nivel: page transition estándar.

### 8.4 Settings

- Entrada: fade + slide del panel. Las secciones internas no escalonan en exceso
  (máximo el stagger normal).
- Cambios de ajuste (toggles) usan `spring.subtle`.

### 8.5 Profile

- Entrada: reveal del resumen (estadísticas, progreso) con stagger.
- Las barras de progreso animan su valor al entrar con `transition.progress`,
  una sola vez por carga de pantalla.

---

## 9. Sistema de feedback

El feedback es la categoría más importante de Trace porque comunica el resultado
del aprendizaje. Debe ser claro, inmediato y sobrio.

Principio transversal: el feedback nunca usa partículas ni confeti en las
interacciones cotidianas. La única excepción posible es la celebración de un hito
mayor (sección 9.3), y aun así de forma contenida y desactivable.

### 9.1 Respuesta correcta

- El elemento de respuesta transita su borde/fondo al color de éxito (`normal`).
- Aparece un check dibujado con `pathLength 0 -> 1`, `spring.snappy`.
- Sin sonido obligatorio, sin rebote, sin desplazamiento del layout.
- Duración total perceptible: en torno a `normal`.

### 9.2 Respuesta incorrecta

- El elemento transita su borde/fondo al color de error (`normal`).
- Shake horizontal de amplitud 4 px, una sola vez (5.8).
- No se oculta la respuesta del usuario; se acompaña de la indicación de qué revisar.
- Nunca se penaliza con animaciones largas o intrusivas.

### 9.3 Nivel completado

- Secuencia 5.20: halo/borde de éxito, check, y panel de resumen que asciende.
- Duración hasta `celebrate` (600 ms), no bloqueante: el usuario puede continuar.
- Celebración opcional: un único pulso de énfasis en el título del nivel. Sin
  confeti por defecto; si se habilita en una fase futura, debe ser discreto,
  breve y respetar "reducir movimiento".

### 9.4 Nivel desbloqueado

- Animación 5.21 en la tarjeta/nodo: candado se desvanece, borde a estado activo,
  opacidad sube a 1. Un solo pulso, sin loop.

### 9.5 Pista utilizada

- La pista aparece con 5.19 (slide). El botón de pista pasa a estado "usada" con
  cambio de color en `micro`.
- Si las pistas tienen coste en la mecánica, el indicador de coste actualiza su
  valor con `transition.progress` (interpolado, sin salto).

### 9.6 Error de compilación

- El área de mensajes muestra el error con fade + slide (`normal`).
- El borde del editor transita a color de error (color, sin shake del editor para
  no dificultar la lectura del código).
- El mensaje permanece estable y legible; nada parpadea ni se desplaza en bucle.

### 9.7 Código válido

- Indicación discreta de estado válido: el borde del editor o un indicador de
  estado transita a color de éxito con cambio de color en `normal`, sin movimiento.
- No se interrumpe la escritura del usuario con animaciones.

---

## 10. Animaciones para minijuegos

No se diseñan minijuegos en esta fase. Aquí se fijan únicamente las reglas de
comportamiento visual que todo minijuego de Trace deberá cumplir.

### 10.1 Reglas generales

1. Coherencia: los minijuegos usan los mismos tokens (duraciones, easing, springs)
   que el resto de la aplicación. No tienen un lenguaje de animación propio.
2. Propósito: cada animación de un minijuego debe explicar la mecánica, guiar la
   atención o confirmar una acción. Nunca es mero adorno.
3. Sobriedad: prohibidos los efectos arcade, las partículas, los rebotes y los
   destellos. La estética se mantiene en la línea Linear/Raycast/Arc.
4. Legibilidad primero: durante la resolución de un reto, el movimiento ambiental
   se reduce al mínimo; nada que distraiga del problema.
5. Feedback unificado: acierto, error y avance usan el sistema de feedback de la
   sección 9, no animaciones nuevas.
6. Estado claro: el minijuego comunica siempre con animación su estado actual
   (en espera, activo, resuelto, fallido) mediante transiciones de color y
   primitivas base, no con efectos especiales.
7. Rendimiento: solo se animan propiedades baratas (`transform`, `opacity`).
   Ninguna animación de minijuego debe degradar la fluidez por debajo de 60 fps.
8. Reversibilidad: las animaciones de los elementos manipulables (arrastrar,
   ordenar, conectar) deben dejar claro el origen y destino, y al soltar deben
   asentarse con `spring.smooth`, sin rebote.
9. Duración acotada: ninguna animación de minijuego supera `large` (360 ms),
   salvo la celebración de resolución, que comparte la regla de la sección 9.3.
10. Accesibilidad: con "reducir movimiento" activo, los minijuegos sustituyen el
    movimiento por cambios de estado instantáneos o fades muy breves.

### 10.2 Patrones de movimiento permitidos en minijuegos

- Aparición/desaparición de piezas: fade o slide básico.
- Selección de pieza: borde de acento (color) + `scale.hover` discreto.
- Colocación correcta: feedback de éxito (9.1) sobre la pieza/celda.
- Colocación incorrecta: feedback de error (9.2), shake de 4 px una vez.
- Conexión/relación entre elementos: el trazo o línea aparece con `pathLength 0 -> 1`
  en `normal`, `ease.out`, para explicar la relación.
- Reordenamiento: transiciones de layout con `spring.smooth`.

---

## 11. Accesibilidad y rendimiento

### 11.1 Reducir movimiento

- Trace respeta `prefers-reduced-motion: reduce`.
- Con esta preferencia activa: se desactivan desplazamientos, escalados y springs;
  se mantienen solo fades muy breves (`micro`) o cambios de estado instantáneos.
- Ningún contenido o funcionalidad puede depender exclusivamente de una animación;
  siempre existe un estado final accesible sin movimiento.

### 11.2 Rendimiento

- Solo se animan `transform` (`x`, `y`, `scale`) y `opacity`. Evitar animar
  `width`, `height`, `top`, `left` salvo casos justificados (p. ej. barra de
  progreso, que puede usar `scaleX`).
- No hay animaciones en bucle infinito en pantallas de aprendizaje.
- Los indicadores continuos (carga/evaluación) se detienen en cuanto hay resultado.
- El stagger se limita (máximo 8 elementos simultáneos) para no encarecer el render.

### 11.3 Foco y navegación por teclado

- El estado de foco siempre es visible y de alto contraste (5.9).
- Las animaciones nunca atrapan el foco ni retrasan la navegación por teclado.

---

## 12. Prohibiciones

Lista normativa de lo que no se permite en Trace.

- Animaciones exageradas o llamativas por sí mismas.
- Rebotes y sobretiros perceptibles (curvas `back`/`elastic`, springs que oscilan).
- Estética de videojuego arcade.
- Partículas y confeti en interacciones cotidianas.
- Efectos distractores o decorativos sin propósito.
- Animaciones lentas: nada por encima de 360 ms (salvo `celebrate` a 600 ms).
- Animaciones en bucle infinito en zonas de lectura o resolución.
- Transiciones que dificulten leer texto o código.
- Animar el texto/código mientras el usuario escribe.
- Inventar duraciones, curvas o distancias fuera de los tokens definidos.
- Mover el layout en hover de forma que desplace contenido vecino.
- Emojis en producto (regla de marca).

---

## 13. Referencias y checklist

### 13.1 Referencias de sensación

Las animaciones de Trace deben sentirse como: Linear, Framer, Raycast, Arc Browser.
Sobrias, rápidas, precisas, con propósito.

No deben sentirse como: landing pages de marketing, sitios llenos de efectos,
dashboards corporativos, juegos móviles casuales.

### 13.2 Checklist de aprobación de una animación

Antes de implementar cualquier animación, debe responder "sí" a todo lo siguiente:

1. Tiene un propósito de la sección 1 (atención, estado, relación o confirmación).
2. Usa exclusivamente tokens de la sección 6.
3. Su duración es micro, normal o large (o celebrate si es hito mayor).
4. Su easing está en la tabla de la sección 4 y no produce rebote.
5. Solo anima `transform` y `opacity` (excepción justificada para progreso).
6. Respeta `prefers-reduced-motion`.
7. No distrae del contenido de aprendizaje ni dificulta leer código.
8. No incumple ninguna prohibición de la sección 12.

Si alguna respuesta es "no", la animación se rediseña o se descarta.

---

Fin del documento. Cualquier cambio a este sistema debe registrarse aquí antes de
implementarse en código.
