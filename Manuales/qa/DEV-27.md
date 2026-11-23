# DEV-27 · Prueba de tiers y fallbacks

**Fecha:** 22-11-2026 · **Rama:** `feat/dev-27-override-tiers` (sobre `fix/bug-01-ancla-directa`)
**Entorno:** `npm run dev` (el override solo existe en desarrollo) · Chrome 157 headless con SwiftShader, 1280×800 y
`devicePixelRatio = 2` (para ver el tope de `dpr` de cada tier) · **Script:** `Manuales/qa/scripts/tiers.cjs`

## Modo de desarrollo

| URL | Efecto |
| :--- | :--- |
| `/?tier=1`, `/?tier=2`, `/?tier=3` | Fija la política de GPU (`pinGPUTier`). Ni `detect-gpu` ni el `PerformanceMonitor` la cambian: el monitor no se monta con un tier forzado. |
| `/?nowebgl` | `getContext("webgl" \| "webgl2")` devuelve `null` (el 2D sigue funcionando). Corre la detección **real**: `detect-gpu` da tier 0 → `webglAvailable = false` → no se monta el Canvas. |

Código: `src/lib/dev-overrides.ts` (con tests) y `SmoothScrollProvider` → `applyGPUPolicy()`.

**En producción no existe.** `DEV_OVERRIDES_ENABLED` vale `false` en el build y el bundler elimina el código. En el
build de producción, `/?tier=3&nowebgl` da lo mismo que `/`: 1 canvas WebGL, la política detectada (T1 en headless,
canvas de 1280×800, frames `mobile`) y ningún log del override. Ningún chunk de producción contiene `nowebgl` ni el mensaje del override.

## Resultados (los 5 escenarios)

| Medida | T3 | T2 | T1 | Sin WebGL | Reduced motion |
| :--- | :-: | :-: | :-: | :-: | :-: |
| Canvas WebGL | 1 | 1 | 1 | **0** | 1 |
| Canvas de la secuencia (px) | 2560×1600 (dpr 2) | 1920×1200 (dpr 1.5) | 1280×800 (dpr 1) | 1280×800 | 1280×800 |
| Variante de frames pedida | `desktop` | `mobile` | `mobile` | `mobile` | `mobile` |
| Máx. de ImageBitmaps vivos (2R+1) | **71** (R 35) | **37** (R 18) | **17** (R 8) | 17 | 17 |
| Lenis | sí | sí | sí | sí | **no** |
| El fondo se mueve | sí | sí | sí | — (no hay) | **no** (quieto) |
| Recorrido completo hasta el final | ✅ | ✅ | ✅ | ✅ | ✅ |
| CTA «Pedir ahora» → contacto (borde a 72 px, bajo la cabecera) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Frames con error | 0 | 0 | 0 | 0 | 0 |
| Errores de consola | 0 | 0 | 0 | 0 | 0 |

Cada fila coincide con `GPU_STRICT_POLICIES` (`src/config/gpu-policy.ts`): `dpr`, variante y radio de la ventana
cambian con el tier. Reduced motion usó el tier detectado (T1 en SwiftShader).

## Capturas

El hero muestra el fondo WebGL (o su ausencia). La mitad de la historia muestra el video, que se ve igual en todos los
escenarios porque es un canvas 2D, independiente de WebGL.

| Escenario | Hero | Historia |
| :--- | :-: | :-: |
| T3 | ![T3 hero](./DEV-27/DEV-27-T3-hero.webp) | ![T3 historia](./DEV-27/DEV-27-T3-historia.webp) |
| T2 | ![T2 hero](./DEV-27/DEV-27-T2-hero.webp) | ![T2 historia](./DEV-27/DEV-27-T2-historia.webp) |
| T1 | ![T1 hero](./DEV-27/DEV-27-T1-hero.webp) | ![T1 historia](./DEV-27/DEV-27-T1-historia.webp) |
| Sin WebGL | ![Sin WebGL hero](./DEV-27/DEV-27-sin-webgl-hero.webp) | ![Sin WebGL historia](./DEV-27/DEV-27-sin-webgl-historia.webp) |
| Reduced motion | ![Reduced motion hero](./DEV-27/DEV-27-reduced-motion-hero.webp) | ![Reduced motion historia](./DEV-27/DEV-27-reduced-motion-historia.webp) |

Sin WebGL, el hero queda sobre el color de fondo de la marca, sin el shader. El texto, el CTA y los videos funcionan igual.

## Observaciones

- **Póster del fallback:** el Manual (Paso 23) sugiere mostrar un póster cuando no hay WebGL. Hoy no hace falta, porque
  el fondo WebGL es decorativo y el contenido principal (los videos) es 2D. `ASSET_MANIFEST.heroPoster` sigue sin usarse.
  Es un pendiente de ART-12 y no afecta a esta tarjeta.
- **Pendiente:** repetir los escenarios en dispositivos reales cuando haya Preview URL (Vercel), sobre todo T2 en un
  Android de gama media. Esta prueba fija la política por URL; no mide FPS.
