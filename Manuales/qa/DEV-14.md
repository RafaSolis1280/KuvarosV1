# DEV-14 · Partículas sobre el fondo

**Fecha:** 22-11-2026 · **Rama:** `feat/dev-14-particulas` (sobre `feat/dev-13-preloader`)
**Scripts:** `Manuales/qa/scripts/particulas.cjs` (draw calls, cantidad por tier, reduced motion) y `fondo-fx.cjs` (FPS)

## Qué se hizo

- **`ParticleField`** (`src/components/canvas/`) dentro del único Canvas: se dibuja después del shader de fondo y
  queda por detrás de las secuencias, que son canvas 2D del DOM, más arriba.
- **Un solo draw call:** `THREE.Points` con un `ShaderMaterial` (`shaders/particles.ts`). El movimiento lo calcula el
  vertex shader: subida lenta por profundidad, un leve vaivén, parallax con el puntero y con el scroll, y un parpadeo
  suave. La CPU solo actualiza 4 uniforms por frame, amortiguados con `damp()` y leídos con `getState()`.
- **Cantidad** = `gpuPolicy.maxParticles` (T3 8 000 · T2 2 500 · T1 500). Si el PerformanceMonitor baja de tier, se
  recrea con la cantidad nueva y la anterior se libera.
- **Reduced motion:** el tiempo no avanza y no hay parallax. Quedan quietas.
- **Semillas deterministas** (`lib/particles.ts`): la misma nube en cada visita. Un tier con menos partículas usa las
  primeras de la misma lista.
- **Contraste:** cada punto se mezcla con el fondo hacia **#584B30**, el tope de brillo contra el que DEV-29 calculó el
  peor contraste del texto. Como es una mezcla, nunca lo supera. El tope (`BACKGROUND_MAX_ACCENT`) pasó a
  `config/scene.ts` y lo comparten el shader de fondo y las partículas.
- **Peso:** va dentro del chunk diferido del Canvas. El JS inicial no cambia (248.0 KB gzip).

## Verificación

| Criterio | Prueba | Resultado |
| :--- | :--- | :--- |
| 1. En el único Canvas, encima del fondo y detrás de las secuencias | Draw calls del Canvas WebGL por frame | 2 por frame: el fondo (`elements:6`, el quad) y las partículas. Las secuencias son otro canvas, del DOM ✅ |
| 2. Cantidad = `maxParticles`; quietas con reduced motion | `?tier=3/2/1` (DEV-27) | `points:8000` / `points:2500` / `points:500` ✅ |
| | Reduced motion: 2 capturas con 1.5 s de diferencia | Idénticas ✅ |
| 3. Un solo draw call | Igual que arriba | Un `drawArrays(POINTS)` por frame ✅ |
| 4. FPS: ≥ 55 desktop, ≥ 50 Android gama media | Producción, GPU integrada, 6 s de scroll | Desktop ✅ (abajo). Android ⏳ |
| 5. Liberar geometría y material al desmontar | Test unitario: `dispose` emite el evento `dispose` de los dos | ✅ El efecto los libera al desmontar o al cambiar de tier |

**Rendimiento** (producción, Intel UHD, 6 s de scroll):

| DPR | Antes (DEV-13) | Con partículas (T3, 8 000) |
| :-: | :-: | :-: |
| 1 | 156–158 FPS · p95 6.2 ms | **157–159 FPS · p95 6.2 ms** |
| 2 | 157–159 FPS · p95 6.2 ms | **159 FPS · p95 6.2 ms** |

**Lighthouse móvil ×2:** 100 / 99, LCP 0.9 s, CLS 0, TBT 70–100 ms.

**Brillo máximo del fondo en el hero:** #433822, por debajo del tope #584B30.

**Video:** su huella de píxeles no cambia.

## Capturas (desktop, 1440×900)

| T3 (8 000) | T2 (2 500) | T1 (500) |
| :-: | :-: | :-: |
| ![T3](./DEV-14/DEV-14-T3.webp) | ![T2](./DEV-14/DEV-14-T2.webp) | ![T1](./DEV-14/DEV-14-T1.webp) |

Las partículas son sutiles a propósito: polvo fino que da profundidad sin competir con los videos. La intensidad se
ajusta en `PARTICLES` (`config/scene.ts`) si DIR pide otra cosa en la revisión de arte (DIR-07, G5).

## Observación para Rafael (no se cambió)

Los shaders propios (fondo y partículas) escriben el color tal cual, sin pasar de lineal a sRGB. Por eso el fondo WebGL
se ve más oscuro que los hex de la marca: `#303030` se ve como ~`#080808`. No se cambió, porque es el aspecto aprobado
del fondo (DEV-10). Si se quisiera el gris exacto de la marca, habría que añadir `#include <colorspace_fragment>` al
shader de fondo y repetir el contraste de DEV-29. Las partículas ya usan los valores tal como se ven en pantalla.

## Pendiente

- ≥ 50 FPS en un Android de gama media (criterio 4).
- La tarjeta depende de G5: aprobación visual de DIR (DIR-07).
