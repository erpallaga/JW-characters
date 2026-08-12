# Diseño: Responsividad para tablet y móvil (JW-characters)

## Propósito

La app (`index.html`, componente único con estilos inline generados en JS vía el runtime `dc-runtime`) fue construida y probada solo en escritorio. El objetivo de este cambio es que las dos vistas (Una por una / Cuadrícula) sean usables en tablet y móvil, sin romper el comportamiento actual en escritorio.

## Alcance

- Ajustar el layout de `index.html` para que funcione bien en tres rangos de ancho:
  - Escritorio: ≥900px (comportamiento actual, sin cambios).
  - Tablet: 640–899px.
  - Móvil: <640px.
- No se toca el modelo de datos, el modo repaso (quiz), el shuffle, ni el mecanismo de arrastre para reposicionar retratos — solo su presentación en pantallas angostas.
- No se añaden dependencias ni build step; sigue siendo un único `index.html` con CSS/JS inline.

### Fuera de alcance

- Rediseño visual (paleta, tipografía, iconos).
- Cambios al dataset de personajes o a las eras.
- Tests automatizados (la app no los tiene; se sigue validando a mano).

## Arquitectura del cambio

El HTML se genera por una plantilla (`x-dc` + `sc-if`/`sc-for`) que resuelve atributos `style="{{ objeto.js }}"` contra objetos de estilo construidos en `renderVals()`. El atributo `class` en un elemento DOM plano se compila a `className` normal de React (confirmado en `support.js`), así que se pueden añadir clases estáticas a los divs de la plantilla sin tocar el motor.

Estrategia híbrida:

1. **Valores fluidos sin breakpoint**: donde un valor fijo (padding, tamaño de fuente, ancho máximo de tarjeta) puede volverse fluido con `clamp()`/`min()`/`vw` directamente en el string de estilo (ya sea literal en el HTML o en los objetos JS de `renderVals()`), se cambia ahí mismo. No requiere lógica nueva.
2. **Cambios estructurales (row → column)**: donde el layout necesita cambiar de fila a columna en pantallas angostas (tarjeta individual: retrato+texto, reverso: barra lateral+contenido), se añade una clase estática a esos divs y se define la regla en el `<style>` del `<helmet>` con `@media` + `!important` (necesario para vencer el `style` inline que pone el JS, ya que no hay lógica de breakpoint en JS ni se quiere añadir un listener de `resize`).

No se introduce estado de React/`resize` listener: todo el trabajo estructural se resuelve con CSS puro, que es más barato y no repinta en cada resize.

## Cambios por sección

### 1. Header, chips de era, barra de línea de tiempo

- Ya usan `flex-wrap` y scroll horizontal — sin cambio estructural.
- `padding` del contenedor principal y `font-size` del `<h1>` pasan a `clamp()` para reducirse en pantallas angostas en vez de quedar fijos en 48px/44px.

### 2. Vista "Una por una" (tarjeta individual)

- El contenedor con `perspective` tiene hoy `width:720px;height:460px` fijos. Pasa a `width:min(720px, 100%)`; la altura se define por breakpoint (mayor en móvil porque el contenido se apila verticalmente) usando una clase + `@media`.
- Cara frontal (`SINGLE_FRONT_FACE_INNER_STYLE`, retrato 380px fijo + texto): en móvil (<640px) cambia `flex-direction:row → column` vía clase, el retrato pasa de 380px fijo a 100% de ancho con una altura fija menor (~180px), el texto queda debajo a ancho completo.
- Cara trasera (`SINGLE_BACK_FACE_INNER_STYLE`, barra lateral 230px fijo + contenido): mismo patrón — en móvil se apila, la barra lateral (nombre, mapa, "dónde vivió") pasa a 100% de ancho arriba, el contenido con `knownFor`/pasajes/timeline queda debajo. El scroll interno ya existente (`overflow-y:auto`) sigue absorbiendo el contenido que no quepa.
- En tablet (640–899px) se mantiene el layout en fila pero con anchos de retrato/barra lateral reducidos y `clamp()` para que quepan sin desbordar.
- Botones ← / →: se reducen de tamaño en móvil (44px → ~32px) y se les fija `flex-shrink:0` para que nunca empujen la tarjeta fuera de la pantalla; la tarjeta usa `flex:1;min-width:0` para ocupar el espacio restante.

### 3. Vista "Cuadrícula"

- `grid-template-columns:repeat(auto-fill,minmax(230px,1fr))` baja el mínimo a un valor menor en móvil (vía `clamp()` o `@media`) para lograr 2 columnas en un teléfono típico (~375–414px) en vez de una sola columna forzada.
- Altura fija de la tarjeta (340px) se ajusta con `clamp()` para no quedar excesivamente alta en columnas angostas.

### 4. Arrastre de retratos (drag-to-reposition)

- Ya usa `onPointerDown`/`pointermove`/`pointerup` (Pointer Events, funcionan en touch) y `touchAction:'none'` en el elemento arrastrable — no requiere cambios de lógica. Se revalida manualmente en móvil tras los cambios de layout, porque el tamaño/posición del contenedor arrastrable cambia.

## Manejo de errores

No aplica — es un ajuste de presentación (CSS/layout), sin nuevas fuentes de datos ni fallos de red que manejar.

## Pruebas / validación

- Validación manual (la app no tiene tests automatizados, igual que el resto del proyecto):
  - Servir `index.html` localmente y revisar a tres anchos de viewport: 375px (móvil), 768px (tablet), 1280px (escritorio).
  - Confirmar en cada ancho: sin scroll horizontal no intencional, texto no cortado, botones con área táctil razonable (~44px en escritorio/tablet, ~32–44px en móvil), retrato y mapa visibles, arrastre de retrato sigue funcionando.
  - Repetir en ambas vistas (Una por una / Cuadrícula) y con el modo repaso activado (layout distinto en la cara trasera).
