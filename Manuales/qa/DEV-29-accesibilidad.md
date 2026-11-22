# DEV-29 · Informe de accesibilidad (WCAG 2.2 AA)

**Fecha:** 21-11-2026 · **Rama:** `feat/dev-29-accesibilidad` (código de `main` `2d442b7` + DEV-38/39/40/17/18/30/25/24)
**Build:** producción local (`next build` + `next start`, puerto 3102) · **Navegadores:** Chrome 157 (headless y panel integrado)

## Resumen

| Criterio de la tarjeta | Resultado |
| :--- | :--- |
| Recorrido completo con Tab, skip link primero, foco visible, orden lógico | ✅ (verificado el 21-11 y repetido con la cabecera fija y el formulario) |
| `aria-label` en controles de icono y canvas; `aria-hidden` en la capa WebGL | ✅ |
| Contraste ≥ 4.5:1 (texto normal) y ≥ 3:1 (texto grande) | ✅ tras los cambios de esta rama (detalle abajo) |
| Lighthouse accesibilidad ≥ 95 | ✅ **100** en móvil y en escritorio (antes: 98, por el orden de encabezados) |
| Repetir con el diseño definitivo antes de G6 | ⏳ el diseño final depende de ART-04/ART-05 |

## 1. Contraste

El texto del sitio está sobre tres tipos de fondo. Cada uno se midió con el método que le corresponde.

### 1.1 Fondos sólidos y el shader de fondo (cálculo exacto)

El shader mezcla, como máximo, un **23 %** de mostaza sobre el negro de la marca. Ese 23 % sale de la suma de la veta
(0.08 + 0.35 × 0.25 con el scroll más rápido) y el brillo del puntero (0.18 × 0.35): el peor fondo posible es `#584B30`.
Contrastes WCAG 2.x calculados con la fórmula de luminancia relativa:

| Texto | Fondo | Antes | Ahora | Mínimo |
| :--- | :--- | :-: | :-: | :-: |
| Hero · bajada (muted, 16-18 px) | shader en el peor caso | **3.16** ❌ | 4.71 (velo 95 %) | 4.5 |
| Hero · antetítulo (mostaza, 12 px) | shader en el peor caso | **3.90** ❌ | 5.69 (velo, esquina) | 4.5 |
| Hero · indicación de scroll (12 px) | shader + degradado | muted ❌ | 5.61 (ink) | 4.5 |
| Hero · `<h1>` ink / mostaza (texto grande) | shader en el peor caso | 5.61 / 3.90 | igual | 3 |
| Cabecera · logo (24 px, grande) | shader en el peor caso | 3.90 | igual | 3 |
| Botones CTA (`on-accent` sobre mostaza) | sólido | 6.06 | igual | 4.5 |
| Primer bocado · muted | `surface` | 4.91 | igual | 4.5 |
| Contacto · muted | `surface-deep/90` + shader | 5.48 | igual | 4.5 |
| Formulario · errores (`red-300`) | panel | — | 7.99 | 4.5 |
| Footer · muted | `surface-deep` | 5.77 | igual | 4.5 |

**Cambio en el hero:** detrás del bloque de texto hay un velo `bg-surface/95` desenfocado (`blur-2xl`), 4 rem más
grande que el texto por cada lado: en el borde del texto el velo cubre ≥ 85 % (Φ(64/40) por lado) y el shader sigue
viéndose alrededor. La indicación «Desliza…» pasa a `ink`.

### 1.2 Texto sobre el video (medición con los píxeles reales)

`Manuales/qa/scripts/contraste-video.cjs` recorre la historia en 100 pasos en Chrome headless. En cada paso, para cada
texto visible (opacidad efectiva ≥ 0.99), lee los píxeles del canvas de la secuencia bajo el texto y elige el bloque
más claro. Si el texto está dentro de un panel de vidrio, promedia por bloques del tamaño del desenfoque y lo compone
con el color del panel. Guarda el peor contraste de cada texto.

| Ancho | Antes: textos / fallos | Peor caso antes | Ahora: textos / fallos | Peor caso ahora |
| :-: | :-: | :--- | :-: | :--- |
| 1440 | 29 / **6** | título de capítulo sobre la bolsa blanca **1.01** | 31 / 0 | etiqueta «Papas» 5.09 |
| 768 | 29 / **6** | etiquetas del packaging sobre la bolsa **2.98** | 31 / 0 | etiqueta «Bolsa» 4.78 |
| 375 | 29 / 0 | — | 31 / 0 | descripción de ficha 5.98 |

**Cambios:**
- `GlassPanel` (fichas y ficha del packaging): opacidad 75 % → **92 %**. Con 75 %, el blanco de la bolsa atravesaba el panel. Con 92 %, el texto muted queda ≥ 4.6:1 aunque detrás haya blanco puro, y el desenfoque sigue dejando ver el video.
- Títulos de capítulo (`StoryProgress`): ahora van en una píldora oscura propia (`surface-deep/92` con desenfoque) y en `ink`. Antes eran `ink/70` sin fondo y quedaban a 1.0–1.3:1 cuando pasaba el pan o la bolsa por detrás.

## 2. Lighthouse

| Ejecución | Accesibilidad | Notas |
| :--- | :-: | :--- |
| Línea base (antes de DEV-17) | 98 | Falla `heading-order`: las fichas (`<h3>`) venían después del `<h1>` sin un `<h2>` |
| Esta rama, móvil (×3) | **100** | Se agregó un `<h2>` solo para lectores de pantalla («Ingredientes») que además nombra la lista |
| Esta rama, escritorio | **100** | — |

> El puntaje de **rendimiento** de esas tres corridas (73-80) no es comparable. El índice de CPU de Lighthouse
> (`benchmarkIndex`) bajó de ~4400 a ~1580 porque había otras aplicaciones pesadas abiertas en el equipo, y todos los
> tiempos del hilo principal se triplicaron por igual. Los cambios de esta rama son solo CSS y un `<h2>`. Con el
> equipo libre, la misma página daba 100 (DEV-18/DEV-24).

## 3. Teclado y lectores de pantalla (repaso)

- Orden de Tab: «Saltar al contenido» → logo → «Pedir ahora» → (contenido) → «Pedir por Instagram» → campos del formulario → «Enviar mensaje» → Instagram del footer. Todos con `:focus-visible` y contorno visible.
- Formulario: `<label>` en cada campo, `aria-invalid` + `aria-describedby` en los errores, foco al primer campo con error y región `aria-live` con el resumen (ver DEV-25).
- Canvas de la secuencia con `role="img"` y `aria-label` descriptivo; la capa WebGL y los elementos decorativos con `aria-hidden`; el cursor personalizado también lleva `aria-hidden` y no cambia el foco.
- `prefers-reduced-motion`: sin Lenis, sin animación del titular, sin desplazamientos en las fichas y sin cursor personalizado.

## 4. Pendiente

- Repetir esta auditoría con el diseño definitivo (fuente real de ART-04, wireframes de ART-05) antes de G6.
- Si el cliente entrega un master del video con fondos más claros, volver a correr `contraste-video.cjs`.
