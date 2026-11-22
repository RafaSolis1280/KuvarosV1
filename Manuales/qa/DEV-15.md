# DEV-15 · Acabado del fondo: bloom suave + grano

**Fecha:** 22-11-2026 · **Rama:** `feat/dev-15-postprocesado` (sobre `feat/dev-27-override-tiers`)
**Medición:** build de producción local y `npm run dev` con `?tier=` (DEV-27). Chrome 157 headless con la **GPU real**
del equipo (ANGLE D3D11, Intel UHD Graphics integrada), viewport de 1440×900. **Script:** `Manuales/qa/scripts/fondo-fx.cjs`

## Qué se hizo y por qué así

- **Bloom suave**, dentro del shader del fondo (`FluidBackgroundMaterial`, macro `POSTFX`). La veta se calcula también
  con una transición mucho más ancha, que es su versión desenfocada, y se toma el **máximo** de las dos (no la suma). Así
  la luz se derrama alrededor de la veta sin aclarar su centro.
- **Grano de película**, en el mismo shader (macro `GRAIN`): un ruido por píxel que cambia cada frame (queda fijo con
  reduced motion). Además disimula el *banding* del degradado oscuro. Un `min()` impide que el grano supere el brillo
  máximo que ya podía tener el fondo.
- **Sin `EffectComposer`** (no se reinstalan `postprocessing` ni `@react-three/postprocessing`). El único contenido
  WebGL es un quad a pantalla completa: una pasada aparte sumaría render targets, memoria de GPU y dos dependencias para
  hacer lo mismo. Además, el Bloom de la librería con umbral > 1 (Manual Paso 15) no encendería nada en este fondo, que
  no tiene colores HDR.
- **Por tier** (`BACKGROUND_FX` en `src/config/scene.ts`, con test): T3 bloom 0.75 + grano 0.045, T2 «bloom ligero» 0.5
  + grano 0.035 y **T1 sin nada** (`enablePostProcessing = false`: el programa se compila sin los bloques).
- **El grano solo a DPR ≤ 1** (`GRAIN_MAX_DPR`). Ver la medición de abajo: a mayor densidad costaba FPS y casi no se percibe.

## Resultados

### 1. Solo en el canvas del fondo y solo en T2/T3

Shaders compilados (se capturan con `shaderSource`):

| Escenario | Canvas del fondo | Bloque `POSTFX` (bloom) | Bloque `GRAIN` |
| :--- | :-: | :-: | :-: |
| T1 (`?tier=1`) | 1 | **no existe** | **no existe** |
| T2, DPR 1 | 1 | sí | sí |
| T2, DPR 1.5 | 1 | sí | no |
| T3 (detectado en producción), DPR 1 | 1 | sí | sí |
| T3, DPR 1.5 y 2 | 1 | sí | no |

### 2. El video y el texto no cambian

- **Video:** es un canvas 2D aparte y opaco. Su huella de píxeles en 3 puntos de la historia (con scroll nativo exacto)
  es **idéntica** antes y después a DPR 1: `fb1d8b2a · b39eaa4 · d1b6548e`, en dos corridas de cada build. A DPR 2
  la huella varía entre corridas del **mismo** build, porque depende de qué frame terminó de decodificarse. No sirve
  para comparar, pero el shader no tiene acceso a ese canvas.
- **Contraste:** el brillo máximo posible del fondo **no cambia**. El bloom usa `max()` sin superar el centro de la
  veta, y el grano está acotado con `min()` al mismo tope (`MAX_ACCENT` = 23 % de mostaza, `#584B30`). Es el tope
  contra el que DEV-29 calculó todos los contrastes del texto sobre el fondo. El pico observado en el hero pasó de
  `#271f16` a `#2a2216` (3 niveles), muy por debajo de ese tope.

### 3. Rendimiento (desktop, GPU integrada; producción; 6 s de scroll continuo)

| DPR | Antes (sin efecto) | Primera versión (grano siempre) | **Versión final** |
| :-: | :-: | :-: | :-: |
| 1 | 156–160 FPS · p95 6.2 ms | 156–158 · 6.2 ms | **156–158 FPS · p95 6.2 ms** (bloom + grano) |
| 1.5 | — | — | **160 FPS · p95 6.2 ms** (bloom) |
| 2 | 157–161 FPS · p95 6.2 ms | **64–94 FPS · p95 24 ms** ❌ | **157–159 FPS · p95 6.2 ms** (bloom) |

La primera versión ponía grano en cualquier DPR. A DPR 2, un ruido distinto en cada píxel y cada frame impide que la
GPU comprima la imagen, y el ancho de banda de una GPU integrada no alcanza. Una capa de grano en CSS dio lo mismo
(~65 FPS), así que se descartó. Con el grano en 0, el bloom solo rinde igual que sin efecto (158–160), así que el coste
era todo del grano. Por eso el grano queda solo para pantallas de densidad 1, donde no cuesta nada.

En headless no hay vsync: los FPS miden capacidad (cuántos frames por segundo puede hacer la GPU), no lo que se ve en
pantalla. En una pantalla de 60 Hz, ≥ 150 FPS de capacidad deja mucho margen.

## Pendiente

- **≥ 50 FPS en un Android de gama media** (criterio 4, segunda mitad). Requiere un dispositivo real o la Preview URL de
  Vercel. En móvil (T2, DPR ≥ 1.5) solo corre el bloom, que no tuvo coste medible aquí.
