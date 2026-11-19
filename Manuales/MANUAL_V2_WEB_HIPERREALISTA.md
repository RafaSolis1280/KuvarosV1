# MANUAL PROFESIONAL DE DESARROLLO WEB HIPERREALISTA — v2.0 (UNIFICADO Y CORREGIDO)
## Metodología de Ingeniería Creativa para Experiencias Digitales Inmersivas

**Versión:** 2.1 · **Fecha:** 19-11-2026 · **Estado:** Documento maestro del estudio (v2.1: correcciones detectadas en el primer proyecto, ver Anexo A #36-40, y Anexo B)
**Reemplaza a:** `# MANUAL PROFESIONAL DE DESARROLLO.txt` (v0), `manual_profesional_de_desarrollo_web_hiperrealista.md` (v1) y `especificaci_n_t_cnica_de_c_digo_para_agente_de_ia.md` (spec v1).
**Flujo operativo asociado:** `FLUJO_TRELLO_WEB_HIPERREALISTA.md`

**Inspiración visual y técnica:** Lusion, Active Theory, Resn, Igloo Inc. y estudios ganadores de Awwwards SOTD/SOTY.

**Objetivo:** construir páginas web hiperrealistas, interactivas y técnicamente blindadas, que corran a 60 FPS en escritorio y a 50-60 FPS estables en gama media. Para lograrlo se combinan dirección de arte cinematográfica, IA generativa, 3D en tiempo real (WebGL), física de inercia, diseño sonoro reactivo y desarrollo web moderno, **sin sacrificar conversión, accesibilidad ni SEO**.

> **Cómo leer este manual**
> - **Parte I:** metodología para todo el equipo (DIR, ART, DEV).
> - **Parte II:** especificación de código para el agente de IA (Claude Code). Puede copiarse como `CLAUDE.md` del proyecto.
> - **Parte III:** checklists de lanzamiento.
> - **Anexo A:** registro de cambios v1 → v2 (y v2.1), con cada corrección técnica y su motivo.
> - **Anexo B:** adaptación del proyecto en curso (landing de la hamburguesa, 100 % video).
> - Los bloques **⚠️ Corrección v2** marcan dónde la versión anterior tenía un error.

---

## FÓRMULA DEL ESTUDIO

$$\text{Experiencia Nivel Lusion} = \text{Dirección de Arte Coherente} + \text{Híbrido (3D Real-Time + Secuencias IA)} + \text{Física de Inercia } (\Delta t) + \text{Gestión Estricta de GPU}$$

> El hiperrealismo no consiste en sobrecargar la GPU del usuario. Consiste en una **ilusión óptica orquestada**, donde el cine pre-renderizado, la geometría en tiempo real, el sonido y la tipografía se funden en una sola pieza. Y esa pieza tiene que vender, informar y ser accesible: está al servicio de la comunicación, nunca al revés.

**Orden profesional del proceso:** Conceptualizar → Diseñar → Producir → Optimizar → Arquitectar → Desarrollar → Integrar → Optimizar → Publicar → Perfeccionar.

---

# PARTE I — METODOLOGÍA

## FASE 0. BRIEF, ALCANCE Y PRESUPUESTOS (nuevo en v2)

Ninguna fase creativa empieza sin estos acuerdos firmados por el cliente:

1. **Objetivo de negocio medible.** Ejemplos: "+30 % de reservas", "lanzar producto X", "captar leads B2B". La experiencia se diseña para ese KPI.
2. **Público y dispositivos.** Sacar de la analítica actual del cliente qué % del tráfico es móvil y qué % es iOS. Esto define el peso del Tier 1/2.
3. **Alcance cerrado.** Número de secciones, idiomas, si hay e-commerce o CMS, y cuántas rondas de revisión (recomendado: 2 por gate).
4. **Presupuesto de rendimiento (Performance Budget):**

| Métrica | Desktop | Mobile |
| :--- | :--- | :--- |
| JS inicial (gzip) | ≤ 350 KB | ≤ 250 KB |
| Peso crítico hasta primer impacto (Hero) | ≤ 4 MB | ≤ 2 MB |
| Peso total de la página (con streaming) | ≤ 25 MB | ≤ 12 MB |
| Modelo `.glb` principal | ≤ 3 MB | ≤ 1.5 MB |
| Secuencia de imágenes (cada una) | ≤ 8 MB | ≤ 4 MB |
| LCP / CLS / INP | < 2.5 s / < 0.1 / < 200 ms | ídem |
| FPS sostenidos | 60 | ≥ 50 |

5. **Licencias y derechos.** Fuentes, modelos comprados, música/SFX y **términos de uso comercial de cada herramienta de IA** (Midjourney, Higgsfield, Kling, Veo, etc.). Se registra todo en un `LICENCIAS.md` del proyecto.

**Entregable:** Brief firmado + Performance Budget + Registro de licencias.

---

## FASE 1. CONCEPTUALIZACIÓN Y DIRECCIÓN DE ARTE

Antes de abrir un motor 3D se define el lenguaje sensorial: atmósfera, física propia y narrativa visual.

### Paso 1. Concepto y física de la experiencia

1. **Identidad y arquetipo:** nombre, personalidad, valores y propuesta de valor diferencial.
2. **Dirección estética:** industrial oscura, futurismo orgánico, minimalismo editorial, lujo cinemático, brutalismo técnico…
3. **Paleta cromática y lumínica:** colores base, acentos (neón, metálicos) y comportamiento de la luz (reflectividad, rugosidad, absorción). **Fija los hex exactos**, por ejemplo fondo `#0A0A0A` y acento `#FFD645`.
4. **Sistema tipográfico:** una display de alto impacto (idealmente *variable font*) y una técnica legible para lectura y metadatos.
   > ⚠️ **Corrección v2:** "Roboto Slab / Mono" no es una familia: Roboto Slab es serif y Roboto Mono es monoespaciada. Hay que elegir una. Y fuentes como *Integral CF* son **comerciales**: hay que comprar la licencia web antes de usarlas.
5. **Física de interacción:** ¿pesada como fluido denso, elástica como resorte o precisa como relojería? Se traduce luego a valores de `lambda` (ver Paso 11).
6. **Experiencia de usuario:** qué debe descubrir, sentir y **hacer** el visitante (la acción de conversión).
7. **Narrativa espacial (storyboard):** guion cuadro por cuadro desde el *Preloader* hasta el CTA final.

### Paso 2. Moodboard técnico y artístico

Un tablero dividido en **Estética Visual** y **Motion References**:

- [Awwwards](https://www.awwwards.com/) / [FWA](https://thefwa.com/): transiciones de cámara, shaders, cursores.
- [Behance](https://www.behance.net/) / [Pinterest](https://www.pinterest.com/): fotografía, iluminación de estudio, texturas, composición tipográfica.
- [Midjourney](https://www.midjourney.com/) / Krea AI: exploración de materiales, luz volumétrica y concepto.
- [Figma](https://www.figma.com/): grilla, componentes UI, estados interactivos y user flow.

**Entregable Fase 1:** Documento de Dirección Creativa + Storyboard donde **cada sección declara su técnica**: Video/Secuencia Scrubbing, 3D Real-Time, Shader 2D o UI tipográfica. También declara su **fallback Tier 1**: qué ve un móvil de gama baja o un navegador sin WebGL.

---

## FASE 2. PRODUCCIÓN DE ASSETS HIPERREALISTAS Y PIPELINE DE IA

**Regla de decisión:** lo orgánico complejo (líquidos, fuego, piel, telas, comida húmeda) se **pre-renderiza** como secuencia. Lo rígido (envases, dispositivos, arquitectura, partículas, tipografía 3D) va en **tiempo real**.

### Paso 3. Key Visuals y consistencia visual

- **Herramientas:** Blender (Cycles), Cinema 4D + Redshift/Octane, Substance 3D Painter, Midjourney y Photoshop.
- **Tipos de asset posibles:** productos, arquitectura, personajes, paisajes, texturas, abstractos y composiciones publicitarias.
- **Regla de oro de iluminación:** todos los assets (imágenes, secuencias IA y escena WebGL) comparten temperatura de color, dirección de *Key Light* y *Rim Light*.

> ⚠️ **Corrección v2 (coherencia de fondo):** la v1 decía "web con fondo `#0A0A0A`, renders sobre negro puro". Eso deja una **costura visible**, porque `#000000` ≠ `#0A0A0A`. Los renders se hacen **sobre el mismo hex del DOM** (`#0A0A0A`) o con **canal alfa**. Además, los videos H.264 usan rango YUV *limitado* y pueden "levantar" los negros. Siempre hay que probar el borde del asset contra el fondo real del sitio en el navegador antes de aprobar.

### Paso 4. Animaciones cinematográficas con IA (Higgsfield / Kling / Veo)

Se usa generación de video controlada por **fotograma inicial y final** (*first/last frame*) para transiciones imposibles de calcular en una GPU móvil.

1. **Keyframes:** se genera o renderiza el Fotograma Inicial (producto cerrado) y el Final (*exploded view*) con **idéntica relación de aspecto, lente y altura de cámara**.
2. **Generación controlada:** se cargan ambos fotogramas en el modo de interpolación inicio→fin de la herramienta, se define el movimiento de cámara (*orbit*, *dolly in*, *macro pan*) y la física (vapor, chispas, gotas en cámara lenta).
   > ⚠️ **Corrección v2:** los nombres de menús y modos de estas plataformas (p. ej. "Cinema Studio", "First Frame to Final Shot") cambian con frecuencia. Antes de cada proyecto, **verificar el flujo vigente** en la documentación de la herramienta. El manual describe la técnica, no la interfaz.
3. **Control de calidad IA:** se itera hasta que no haya *morphing* (deformación), cambios de identidad, logotipos alterados ni movimientos antinaturales. **Criterio de rechazo:** si un frame deforma el logo o la geometría, se descarta el clip.
4. **Upscaling y limpieza:** se escala a 2K/4K a FPS constantes con Topaz Video o DaVinci Resolve, y se corrige el color con la LUT del proyecto.
5. **Registro:** se guarda prompt, seed, herramienta, versión y fecha de cada clip aprobado (trazabilidad y licencia).

### Paso 5. Conversión a secuencias de imágenes (WebP/AVIF)

Para que el usuario "controle" la película con el scroll a 60 FPS, el video se convierte en fotogramas con [FFmpeg](https://ffmpeg.org/).

> ⚠️ **Corrección v2 (crítica):** la v1 exportaba desktop a **24 fps** y mobile a **20 fps**. Desde el mismo master eso produce **distinto número de frames** por variante, mientras el código asumía 120 en ambas, así que el mobile se quedaba sin los últimos frames o fallaba. **Regla v2: ambas variantes usan el mismo `fps`**, y solo cambia la resolución y la calidad. Si se quiere menos frames en mobile, se declara `totalFrames` por variante en `ASSET_MANIFEST` (Parte II §4).

#### Opción A — Secuencia WebP (recomendada; máxima fluidez en Canvas 2D)

Ideal entre 60 y 150 frames. Mejor 90 frames bien optimizados que 200 pesados.

```bash
# Desktop: 1600 px de ancho, 24 fps
ffmpeg -i animation_master.mp4 \
  -vf "fps=24,scale=1600:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -compression_level 6 -quality 78 \
  public/sequences/hero_explode/desktop/frame_%04d.webp

# Mobile: MISMO fps (24), 800 px de ancho (≈ 75 % menos de memoria por frame)
ffmpeg -i animation_master.mp4 \
  -vf "fps=24,scale=800:-2:flags=lanczos" \
  -c:v libwebp -lossless 0 -compression_level 6 -quality 72 \
  public/sequences/hero_explode/mobile/frame_%04d.webp

# Verificación obligatoria: ambas carpetas deben tener el mismo número de archivos
ls public/sequences/hero_explode/desktop | wc -l
ls public/sequences/hero_explode/mobile  | wc -l
```

- Si la secuencia necesita transparencia, se usa un master con alfa (ProRes 4444 / PNG). libwebp conserva el alfa.
- AVIF es alternativa válida (≈ 20-30 % más liviana) cuando el pipeline lo soporte. Su decodificación es más lenta en móviles de gama baja, así que hay que medir antes.
- Se revisa el peso total contra el Performance Budget.

#### Opción B — MP4 *All-Intra* (solo secuencias largas en desktop)

Un MP4 normal se traba al hacer *scrub*, porque solo trae un keyframe cada varios segundos. Hay que forzar **cada fotograma como keyframe**:

```bash
ffmpeg -i animation_master.mp4 \
  -vf "fps=30,scale=1600:-2" \
  -c:v libx264 -preset slow -crf 20 -g 1 \
  -pix_fmt yuv420p -movflags +faststart -an \
  public/videos/scrub_ready.mp4
```

> ⚠️ **Corrección v2:** controlar `video.currentTime` con el scroll es **poco fiable en iOS Safari** (saltos y latencia), y los archivos *all-intra* pesan mucho. Uso recomendado: **solo desktop**. En móvil se usa la Opción A o, en Tier 1, una imagen estática o un video corto en autoplay *muted* sin scrub.

---

## FASE 3. MODELADO 3D Y OPTIMIZACIÓN GPU REAL-TIME

> **Fase opcional.** Solo aplica si el proyecto incluye objetos 3D en tiempo real. En un proyecto *solo video* (p. ej. el actual, Anexo B) se omite completa: el producto se presenta con secuencias de la Fase 2.

### Paso 6. Obtener los modelos

- Producción propia en [Blender](https://www.blender.org/).
- Bibliotecas: [Sketchfab](https://sketchfab.com/), [Poly Pizza](https://poly.pizza/) y [CGTrader](https://www.cgtrader.com/). **Siempre se verifica una licencia compatible con uso comercial.**
- Formato de entrega web: **`.glb`** (glTF 2.0 binario). `.fbx`/`.obj` solo como intercambio de trabajo.

### Paso 7. Preparación técnica en Blender

1. **Limpieza:** eliminar geometría oculta, unificar nombres (`hero_body`, `hero_cap`…) y aplicar transformaciones.
2. **Presupuesto poligonal:** 15 000-80 000 triángulos por modelo principal en desktop, **< 30 000 en móvil**.
3. **UV y baking:** maximizar el espacio de las islas UV y hornear el detalle high-poly en un *Normal Map*.
4. **Estrategia de iluminación dual** (no confundirlas):
   - **Baked Lighting:** para entornos estáticos (sombras suaves en *Lightmap*/AO). Coste de GPU casi cero, pero **no sirve para objetos que se mueven libremente**.
   - **PBR dinámico + HDRI:** para objetos que rotan frente a cámara (`BaseColor`, `Roughness`, `Metalness`, `Normal`) más un `.hdr` de estudio < 1 MB.
5. **Prueba real-time:** se abre el `.glb` en [gltf.report](https://gltf.report/) o en el visor de three.js antes de entregarlo.

### Paso 8. Compresión de geometría y texturas (`.glb` + KTX2)

Un PNG/JPG dentro del `.glb` se **descomprime completo en VRAM**: una textura 4K RGBA ocupa ≈ 64 MB (≈ 85 MB con mipmaps), aunque en disco pese 3 MB. **KTX2 (Basis Universal)** permanece comprimido dentro de la GPU.

**Requisitos:** `npm install --global @gltf-transform/cli` **y** tener instalado [KTX-Software](https://github.com/KhronosGroup/KTX-Software/releases) ≥ 4.3 (binario `ktx`/`toktx` en el PATH). Sin KTX-Software, los comandos `uastc`/`etc1s` fallan.

> ⚠️ **Corrección v2 (crítica):** la v1 ejecutaba `uastc` y luego `etc1s` **sin `--slots`**. El primer comando comprimía *todas* las texturas a UASTC y el segundo intentaba recomprimirlas a ETC1S, así que se perdía la separación por tipo de textura. También aplicaba Meshopt y luego Draco al mismo modelo. **Se elige uno de los dos compresores de geometría, nunca ambos.**

```bash
# 0. Limpieza + deduplicado + redimensionado máximo de texturas (2K)
gltf-transform dedup raw_model.glb step0.glb
gltf-transform prune step0.glb step0.glb
gltf-transform resize step0.glb step0.glb --width 2048 --height 2048

# 1. UASTC (alta precisión) SOLO para datos: normal, ORM (occlusion/metallicRoughness)
gltf-transform uastc step0.glb step1.glb \
  --slots "{normalTexture,occlusionTexture,metallicRoughnessTexture}" \
  --level 4 --rdo --zstd 18

# 2. ETC1S (máxima compresión) SOLO para color: baseColor y emissive
gltf-transform etc1s step1.glb step2.glb \
  --slots "{baseColorTexture,emissiveTexture}" --quality 255

# 3. Geometría: elegir UNO
gltf-transform draco   step2.glb public/models/hero_artifact.glb   # opción A: menor peso de red
# gltf-transform meshopt step2.glb public/models/hero_artifact.glb # opción B: decodificación rápida / morph targets

# Verificar resultado
gltf-transform inspect public/models/hero_artifact.glb
```

> Las opciones exactas (`--rdo`, `--zstd`, `--level`) cambian entre versiones. Antes de automatizar hay que confirmarlas con `gltf-transform uastc --help`.

| Tecnología | Qué comprime | Cuándo |
| :--- | :--- | :--- |
| **Draco** | Geometría (descarga mínima) | Mallas estáticas complejas; pequeño coste de CPU al decodificar |
| **Meshopt** | Geometría (decodificación ultrarrápida) | Animaciones, *morph targets*, muchos modelos |
| **KTX2 UASTC** | Texturas de datos (normal/ORM) | Precisión alta, más peso |
| **KTX2 ETC1S** | Texturas de color | Peso mínimo, VRAM hasta −80 % |

---

## FASE 4. ARQUITECTURA DEL PROYECTO (PATRÓN SINGLE-CANVAS)

### Paso 9. Stack tecnológico (versiones de referencia, noviembre 2026)

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| Core | **Next.js 16 (App Router) + React 19 + TypeScript** | SSR/SSG, SEO, tipado estricto. Turbopack es el bundler por defecto |
| 3D | **Three.js + React Three Fiber v9 + Drei** | Grafo de escena declarativo, cargadores, helpers |
| Puente DOM-WebGL | **Drei `<View>`** o `@14islands/r3f-scroll-rig` | Sincronizar `<div>` HTML con mallas en un solo canvas |
| Shaders / Post | **GLSL (vía `ShaderMaterial`) + `@react-three/postprocessing`** | Distorsión, Bloom selectivo, grano |
| Scroll / Timelines | **Lenis + GSAP (ScrollTrigger, SplitText, Flip)** | Scroll inercial y líneas de tiempo |
| Física / Estado | **`maath` + `zustand`** | `damp` y estado transiente sin re-renders |
| UI | **Tailwind CSS v4 + shadcn/ui + Motion** (+ Rive opcional) | Interfaz accesible y micro-interacciones |
| Audio | **Howler.js / Web Audio API** | Sonido espacial y filtros reactivos |
| Calidad | **Sentry + analítica (Vercel Analytics / GA4)** | Errores WebGL en producción y conversión |

> ⚠️ **Correcciones v2:**
> - React Three Fiber v9 **requiere React 19**. No mezclar con R3F v8.
> - Tailwind v4 se configura **en CSS** (`@import "tailwindcss"; @theme {...}`), ya no en `tailwind.config.js`.
> - **GSAP es gratuito con todos sus plugins** (incluidos SplitText y MorphSVG). Se usa SplitText para la tipografía cinética en vez de partir texto a mano.
> - No se instala todo por defecto: cada librería debe justificar su peso en el bundle.

### Paso 10. Arquitectura de capas y Single-Canvas

Los navegadores limitan los contextos WebGL activos (≈ 8-16), y cada contexto multiplica el consumo de GPU y batería. Las tres capas conceptuales son:

| Capa | Contenido | Tecnología |
| :--- | :--- | :--- |
| **1. Escenario visual** | Fondos dinámicos, 3D, partículas, iluminación | **Un único `<Canvas>` R3F global** |
| **2. Experiencia y movimiento** | Secuencias de imágenes, transiciones, efectos de scroll | GSAP + ScrollTrigger + Canvas 2D |
| **3. Interfaz y contenido** | Nav, textos, botones, formularios, carrito | HTML semántico + React + Tailwind |

**Reglas del patrón:**
1. Hay **un único `<Canvas>` fijo** (`position: fixed; inset: 0; pointer-events: none; z-index: 1`) en el layout raíz. No se destruye al navegar.
2. El HTML fluye encima (`z-index ≥ 10`) y los elementos interactivos llevan `pointer-events: auto`.
3. Cuando una sección necesita 3D, se pone un `<div ref={trackRef}>` y se dibuja con `<View track={trackRef}>`.
4. **Regla de oro de estado:** **jamás** se guarda scroll ni puntero en `useState`, porque eso provoca ~60 re-renders por segundo. Se usa `useRef` o el store de Zustand leído con `getState()` dentro de `useFrame`.
5. **Principio funcional:** la capa visual nunca bloquea la funcional. Botones, enlaces y formularios funcionan aunque falle WebGL.
6. El **Canvas 2D de secuencias** (capa 2) es un elemento aparte, no un segundo contexto WebGL, así que no viola la regla Single-Canvas.

### Paso 11. Estructura de carpetas

```text
PROJECT_ROOT/
├── public/
│   ├── draco/            # Decodificadores Draco (copiados de three, ver Parte II §3)
│   ├── basis/            # Transcoder Basis/KTX2 (copiado de three)
│   ├── benchmarks/       # Benchmarks de detect-gpu auto-hospedados
│   ├── models/           # .glb optimizados (Draco/Meshopt + KTX2)
│   ├── sequences/<nombre>/{desktop,mobile}/frame_0001.webp …
│   ├── hdri/             # .hdr < 1 MB
│   ├── audio/            # .webm + .m4a/.mp3 (fallback Safari)
│   ├── fonts/            # .woff2 con licencia
│   └── fallback/         # Pósters estáticos Tier 1 / sin WebGL
├── scripts/
│   └── copy-decoders.mjs
├── src/
│   ├── app/              # layout.tsx, page.tsx, globals.css, sitemap.ts, robots.ts
│   ├── config/           # gpu-policy.ts (políticas + ASSET_MANIFEST)
│   ├── store/            # useExperienceStore.ts
│   ├── lib/              # math.ts, gsap-config.ts
│   ├── hooks/            # useMediaQuery.ts, useReducedMotion.ts
│   └── components/
│       ├── canvas/       # GlobalCanvas, HeroArtifactMesh, PostProcessing, models/, particles/, shaders/
│       ├── sequence/     # ImageSequenceCanvas.tsx
│       ├── dom/          # SmoothScrollProvider, Preloader, CustomCursor, Navbar, sections/
│       └── audio/        # SoundController.tsx
├── LICENCIAS.md
├── CLAUDE.md             # = Parte II de este manual
└── package.json
```

---

## FASE 5. INGENIERÍA DE LA EXPERIENCIA INMERSIVA

### Paso 12. Inercia independiente de FPS

Nunca se asigna puntero o scroll directamente a una cámara. La interpolación clásica $x_{t+1} = x_t + (\text{target} - x_t)\cdot\alpha$ con $\alpha$ fijo **depende del framerate**: se siente distinta a 60, 120 o 240 Hz.

Se usa la **amortiguación exponencial con $\Delta t$** (`THREE.MathUtils.damp`, `maath/easing` o `damp()` propio):

$$x(t + \Delta t) = \text{target} + (x(t) - \text{target}) \cdot e^{-\lambda \Delta t}$$

**Traducción de la "física" de la Fase 1 a $\lambda$:** fluido denso ≈ 2-4 · natural ≈ 5-7 · mecanismo preciso ≈ 10-14.

### Paso 13. Motor de scroll (Lenis + GSAP + Zustand)

Un único reloj: el `gsap.ticker` maneja Lenis, que actualiza ScrollTrigger y escribe de forma transiente en el store. La implementación completa está en la Parte II §6.

> ⚠️ **Correcciones v2:**
> - Se declara `autoRaf: false` en Lenis, porque el RAF lo maneja GSAP. Así no hay doble bucle.
> - Si el usuario tiene `prefers-reduced-motion: reduce`, **no se activa Lenis** (scroll nativo) y se desactivan las rotaciones de cámara. **No** se baja la calidad gráfica: accesibilidad y rendimiento son ejes distintos.
> - El scroll no debe sentirse artificialmente lento: natural, preciso y cómodo.

### Paso 14. Secuencias controladas por scroll (`ImageSequenceCanvas`)

El componente debe:
1. Cargar progresivamente con una **ventana deslizante de VRAM**: solo `[f − R, f + R]` decodificados, y `ImageBitmap.close()` para el resto.
2. Dibujar con proporción *cover* y `devicePixelRatio` limitado por política.
3. Dibujar el **frame disponible más cercano** mientras el exacto se decodifica (nunca un canvas en blanco).
4. Activar el fallback procedural **solo** si el primer frame no existe; un 404 aislado no debe tumbar la secuencia.
5. Liberar todo al desmontar.

La duración del scroll se adapta a la animación: no todas las secciones necesitan 400 vh.

> ⚠️ **Corrección v2:** la v1 del manual llamaba "sliding window" a un componente que **precargaba todos los frames en memoria**. La implementación oficial única es la de la Parte II §7.

### Paso 15. Escenas 3D, GPGPU y shaders

1. **Inercia:** dentro de `useFrame((state, delta) => …)` se usa `easing.dampE` para la rotación por puntero y `easing.damp3` para la cámara por sección.
2. **Partículas:** nunca 5 000 `<mesh>`. Se usa `<instancedMesh>` (un draw call), o una FBO/GPGPU con posiciones en textura RGB y *curl noise* para humo o chispas.
3. **Post-procesado sutil:** `<EffectComposer multisampling={0}>` solo con lo esencial: `Bloom` (umbral > 1 → solo materiales HDR con `toneMapped={false}` brillan) y `Noise` (≈ 0.03, unifica y evita *banding*).
4. **Efectos disponibles** (cada uno justifica su coste; no todos a la vez): Environment Maps, AO, reflejos, Bloom, DoF, Motion Blur, shaders de fluido, humo, ondulación y distorsión reactiva.

### Paso 16. Diseño sonoro reactivo

- **Opt-in obligatorio:** el audio arranca **solo tras un gesto del usuario** (por política de autoplay de los navegadores). Botón "Entrar con sonido" en el preloader y Mute/Unmute visible en la nav.
- **Modulación por velocidad:** filtro *low-pass* (`BiquadFilterNode`) sobre el loop ambiental. En reposo ≈ 400 Hz; con scroll rápido (`|velocity| > 5`) se abre suavemente hasta ≈ 2 500 Hz.
- **Micro-SFX** < 80 ms en hover de botones principales y en cambios de sección.
- Se pausa con `visibilitychange`.

> ⚠️ **Corrección v2:** el soporte de WebM/Opus en Safari es irregular. Siempre se entrega un **fallback** (`src: ["/audio/ambient_drone.webm", "/audio/ambient_drone.m4a"]` en Howler).

---

## FASE 6. UI/UX Y TRANSICIONES ESPACIALES

### Paso 17. Interfaz y composición no competitiva

- **Elementos:** header/nav, hero, secciones narrativas, galerías, tarjetas, CTAs, formularios y footer.
- **Grilla suiza asimétrica:** 12 columnas con márgenes amplios. Si el foco 3D está a la derecha, el texto va a la izquierda.
- **Tipografía cinética:** GSAP SplitText divide en líneas/palabras dentro de `overflow: hidden` y emergen con `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Contraste y legibilidad:** `backdrop-blur-md bg-black/40 border-white/10` **solo** en tarjetas de compra, menús y modales.
- **Principios:** jerarquía clara, espaciado consistente, contraste **WCAG 2.2 AA** (4.5:1 en texto normal), animaciones con propósito, navegación intuitiva.

### Paso 18. Hero Section cinematográfica

Debe comunicar en los primeros 3 segundos **qué es, qué ofrece y qué puede hacer el visitante**. Puede incluir modelo 3D central, composición cinematográfica, título de gran formato, animación de entrada y un CTA visible.

> ⚠️ **Corrección v2 (LCP):** el elemento LCP **debe ser el `<h1>` o una `<img>` del DOM**, nunca el canvas WebGL ni una secuencia. Si no, el LCP se dispara por encima de 2.5 s. El titular se renderiza en SSR y es visible antes de que cargue el 3D.

### Paso 19. Transiciones continuas

- **Coreografía de cámara:** en vez de `opacity: 0`, la cámara viaja a un macro de la textura o el objeto sale de encuadre mientras entra la siguiente sección.
- **Máscaras:** `clip-path` animado con GSAP o máscara de ruido en GLSL.
- Transiciones de color, cambios de escala, desplazamientos horizontales y elementos que continúan entre secciones. La navegación debe sentirse como un continuo, no como efectos aislados.

---

## FASE 7. IA COMO ARQUITECTO ASISTENTE (CLAUDE CODE + MCP)

### Paso 20. Flujo modular con Claude Code / Cursor

**Regla principal:** nunca se pide "haz toda la web". Se trabaja **por módulos y capas aisladas**, se revisa cada diff y se mantiene el control de la arquitectura. El agente lee `CLAUDE.md` (Parte II).

| # | Prompt | Cuándo |
| :--- | :--- | :--- |
| P1 | **Arquitectura:** "Actúa como Creative Technologist Senior. Siguiendo CLAUDE.md, inicializa Next.js 16 + TS con arquitectura Single-Canvas (R3F v9) y el store transiente `useExperienceStore` (scroll, velocity, progress, pointer mutable, gpuPolicy, reducedMotion). No modifiques archivos fuera del alcance." | Setup |
| P2 | **Scroll:** "Implementa SmoothScrollProvider con Lenis (`autoRaf:false`) manejado por `gsap.ticker`, ScrollTrigger sincronizado, desactivado con prefers-reduced-motion, y limpieza completa al desmontar." | Setup |
| P3 | **Secuencia:** "Implementa ImageSequenceCanvas según CLAUDE.md §7: ventana deslizante con ImageBitmap.close(), frame más cercano, fallback solo si falta el frame 1, flush al cambiar de tier." | Desarrollo |
| P4 | **Shader:** "Escribe un ShaderMaterial (drei `shaderMaterial`) de fluido con value noise sin `sin()`-hash, reactivo a `uPointer` amortiguado y `uScrollVelocity`. Uniforms: `uColorBase #0A0A0A`, `uColorAccent #FFD645`, `uTime`, `uIntensity`. Sin ramas `if`." | Desarrollo |
| P5 | **Escena 3D:** "Componente R3F que cargue `.glb` Draco + KTX2 con fallback procedural si el archivo no existe, rig de estudio (Key suave, Rim cálida, HDRI baja intensidad), rotación `damp` por puntero, flotación sinusoidal y dispose completo al desmontar." | Desarrollo |
| P6 | **Dirección visual:** "Analiza la interfaz y mejora jerarquía tipográfica, composición, espaciado, contraste y transiciones según estándares de estudio. No alteres la funcionalidad." | Pulido |
| P7 | **Auditoría VRAM/rendimiento:** "Audita `src/components/canvas` y `src/components/sequence`: dispose/kill al desmontar, cero setState en useFrame/scroll/pointermove, dpr limitado por política, sin fugas al subir y bajar 10 veces." | QA |
| P8 | **Auditoría general:** "Audita errores de consola, dependencias innecesarias, responsive, accesibilidad (teclado, foco, alt, contraste) y SEO. Propón y corrige sin romper la arquitectura." | QA |

### Paso 21. Servidores MCP (solo si aportan ventaja real)

- **Filesystem/Terminal:** que el agente ejecute `ffmpeg` y `gltf-transform` sobre `/raw-assets` y reporte pesos contra el budget.
- **Generación visual (p. ej. Higgsfield):** iterar variaciones de video y texturas desde el flujo de desarrollo.
- **Playwright:** abrir el sitio, medir FPS durante el scroll, capturar errores WebGL y validar responsive.

---

## FASE 8. PRELOADER, ESCALADO DE GPU Y MÓVIL

### Paso 22. Preloader por prioridades (*Critical Path*)

El preloader marca el tono de la marca **pero no es una barrera**.
1. **Bloqueo crítico (< 2.5 s):** solo fuentes principales, el `.glb` o los primeros 15-20 frames del Hero, y la compilación de shaders (`gl.compileAsync`).
2. **Streaming en segundo plano:** el resto se carga con `requestIdleCallback` / `IntersectionObserver`, *dynamic imports* y *code splitting*.
3. **Prioridades:** alta (HTML, fuentes, Hero) · media (siguientes secciones) · baja (modelos secundarios, videos, efectos fuera de pantalla).
4. **El HTML y el CTA son accesibles aunque el preloader no haya terminado** (p. ej. un botón "Saltar intro").

### Paso 23. Escalado adaptativo de GPU

Dos herramientas distintas que **se complementan**:
- **`detect-gpu`** (o su wrapper `useDetectGPU` de Drei): clasifica el hardware **al inicio** (tier 0-3).
- **`<PerformanceMonitor>` de Drei:** mide los **FPS reales** durante la sesión y degrada la calidad si caen.

> ⚠️ **Correcciones v2:**
> - La v1 decía que `detect-gpu` "está incluida en Drei como `<PerformanceMonitor>`". **Es falso:** son herramientas distintas.
> - `detect-gpu` descarga benchmarks desde un CDN público por defecto. Se **auto-hospedan** en `/public/benchmarks` (`benchmarksURL`), por privacidad y disponibilidad.
> - `tier 0` = sin WebGL o bloqueado → **fallback estático** (póster + HTML), sin montar el Canvas.
> - `PerformanceMonitor` se configura con `flipflops` (p. ej. 3) y `onFallback`, para que no degrade en cascada ni oscile indefinidamente.

| Tier | `dpr` | Post-procesado | Secuencias | Partículas |
| :--- | :--- | :--- | :--- | :--- |
| **3** Desktop / GPU dedicada | `[1, 2]` | Bloom + Noise | 1600 px, ventana R=35 | 8 000 |
| **2** Gama media / mobile pro | `[1, 1.5]` | Bloom ligero | 800 px, R=18 | 2 500 |
| **1** Gama baja / ahorro | `[1, 1]` | Desactivado | 800 px, R=8 o póster | 500 o 0 |
| **0** Sin WebGL | — | — | Póster estático | — |

**Móvil, además:** modelos con menos polígonos, texturas a 1K, controles táctiles, legibilidad de textos y menos efectos.

---

## FASE 9. NEGOCIO, SEO, SEGURIDAD Y DESPLIEGUE

### Paso 24. Funcionalidades reales y conversión

Una experiencia inmersiva fracasa si el cliente se maravilla pero no puede comprar o contactar **en menos de 3 clics**.
- **CTA persistente** (`z-index: 50`): catálogo, carrito, reserva o WhatsApp.
- **Funcionalidades según proyecto:** formularios, WhatsApp, catálogo, carrito, pasarela de pago, autenticación, panel admin, base de datos y reservas.
- **Headless CMS** (Sanity / Strapi / Payload): precios, stock y textos editables sin recompilar las escenas.
- **Checkout sin fricción:** al abrir carrito o formulario se pausa el render (`frameloop="demand"` o `"never"`) para que el teclado móvil responda al instante.
- **Seguridad:** validación de formularios en servidor, rate-limit o captcha, variables de entorno fuera del repo, y cabeceras CSP/HSTS.

### Paso 25. SEO técnico y accesibilidad

1. **HTML semántico espejo:** todo texto (`h1`, `h2`, descripciones, precios) existe en el DOM real. Googlebot no lee píxeles del canvas.
2. **Metadatos:** `title`, `description`, Open Graph (`og:image` de alto impacto), canónicas, `sitemap.ts` y `robots.ts` de Next.js, y JSON-LD (Organization, Product, LocalBusiness…).
3. **Accesibilidad WCAG 2.2 AA:** navegación por teclado completa, foco visible, `alt` en imágenes, `aria-label` en controles de icono (mute, menú), contraste, `prefers-reduced-motion`, y el contenido funciona sin animaciones.
4. **Privacidad:** banner de cookies/consentimiento si hay analítica o píxeles, y política de privacidad.

### Paso 26. Despliegue en edge y caché inmutable

En **Vercel**, **Netlify** o **Cloudflare Pages** se configuran: repositorio Git, variables de entorno, dominio, SSL, analítica, monitoreo de errores (Sentry), políticas de seguridad, caché y copias de seguridad.

**Caché inmutable** para assets pesados (ver `next.config.ts` en la Parte II §3). Para que sea seguro, **se versionan los nombres** (`hero_artifact.v2.glb` o carpeta `/v2/`): con `immutable`, el navegador nunca revalida.

**La última revisión se hace en producción**, no solo en local.

---

# PARTE II — ESPECIFICACIÓN DE CÓDIGO PARA EL AGENTE (`CLAUDE.md`)

**Rol del agente:** Principal Creative Technologist y Graphics Engineer. Inicializa, arquitecta y programa la aplicación siguiendo la fórmula del estudio y estas reglas.

## 0. Reglas inquebrantables (*Hard Constraints*)

1. **Prohibido `setState` de React** en `lenis.on('scroll')`, `pointermove` o `useFrame`. El estado continuo va en `useRef` o en escritura transiente de Zustand (`setState`/`getState`, o mutación de objetos del store).
2. **Single-Canvas:** un único `<Canvas>` WebGL en toda la app (`fixed; inset: 0; pointer-events: none; z-index: 1`).
3. **Inercia con $\Delta t$:** ninguna transformación de cámara, malla o uniform se asigna directamente. Todo pasa por `damp()`.
4. **Resiliencia ante assets faltantes:** si falta `.glb`, `.hdr`, `.webp` o audio, **no hay error fatal**: se renderiza un fallback procedural.
5. **`GPU_STRICT_POLICY`:** todo componente gráfico lee la política activa para `dpr`, radio de ventana VRAM, variante de secuencia y conteo de instancias.
6. **Limpieza total:** toda geometría, material, textura, `ImageBitmap`, `ScrollTrigger` y listener se libera al desmontar.
7. **Accesibilidad no negociable:** `reducedMotion` desactiva Lenis y movimientos de cámara. El HTML es usable sin WebGL.

## 1. Matriz de lenguajes por capa

| Capa | Ruta | Lenguaje | Responsabilidad |
| :--- | :--- | :--- | :--- |
| Configuración y políticas GPU | `src/config/*.ts` | TypeScript estricto | Políticas por tier, budgets y manifiesto de assets |
| Matemática y estado | `src/lib/*.ts`, `src/store/*.ts` | TypeScript puro | `damp`, `clamp`, `mapRange`, store transiente |
| Escena 3D | `src/components/canvas/**/*.tsx` | TSX + R3F | Grafo de escena, cargadores GLTF/Draco/KTX2, instancing, luces PBR |
| Shaders | `src/components/canvas/shaders/*.ts` | **GLSL compatible con `ShaderMaterial` de three** | Vertex/Fragment en template strings con uniforms tipados |
| Secuencias 2D | `src/components/sequence/*.tsx` | TSX + Canvas 2D + `ImageBitmap` | Ventana deslizante y liberación explícita de memoria |
| DOM / Layout | `src/app/**`, `src/components/dom/**` | TSX + Tailwind v4 | HTML semántico, grilla, `pointer-events: auto` |

> ⚠️ **Corrección v2:** la v1 exigía `#version 300 es`, pero el shader usaba sintaxis GLSL 1 (`varying`, `gl_FragColor`). Con `ShaderMaterial`, **three.js inyecta la versión, la precisión y las macros de compatibilidad**, así que se escribe GLSL estándar de three (`varying`, `gl_FragColor` funcionan) y **no** se declara `#version` ni `precision`. Solo con `RawShaderMaterial` se escriben a mano. También se eliminó el campo `shaderPrecision` de la política, porque no estaba conectado a nada.

## 2. Contrato de archivos de arte (`/public`)

```text
public/
├── draco/            draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js   (copiados por script)
├── basis/            basis_transcoder.wasm, basis_transcoder.js                     (copiados por script)
├── benchmarks/       (copiados de node_modules/detect-gpu/dist/benchmarks)
├── hdri/studio_dark_01.hdr                       < 1 MB
├── models/hero_artifact.glb                      Draco o Meshopt + KTX2
├── sequences/hero_explode/desktop/frame_0001.webp … frame_0120.webp   1600 px, 24 fps
├── sequences/hero_explode/mobile/frame_0001.webp  … frame_0120.webp   800 px, 24 fps (MISMO conteo)
├── audio/ambient_drone.webm + ambient_drone.m4a
├── audio/ui_hover_tick.webm + ui_hover_tick.m4a  < 80 ms
├── fallback/hero_poster.webp                     Tier 0/1
└── fonts/Display-Bold.woff2, Tech-Regular.woff2  (con licencia web)
```

## 3. Inicialización del proyecto

```bash
# 1. Next.js 16 (App Router, TS, Tailwind v4, ESLint, src/, alias @/*)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Núcleo 3D (R3F v9 requiere React 19)
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing

# 3. Animación, scroll, estado, GPU, audio
npm install gsap lenis zustand maath detect-gpu howler

# 4. Tipos
npm install -D @types/three @types/howler
```

> ⚠️ **Corrección v2:** se eliminaron `glslify-loader` y `raw-loader`. `raw-loader` está deprecado en webpack 5, y **Next.js 16 usa Turbopack por defecto**, que ignora el bloque `webpack()` de la config. Los shaders se escriben como **template strings** en `.ts`. Si hiciera falta importar `.glsl`, se usa `turbopack.rules` (ver abajo).

### `scripts/copy-decoders.mjs` (nuevo en v2)

```js
import { cpSync, mkdirSync } from "node:fs";

const copies = [
  ["node_modules/three/examples/jsm/libs/draco/gltf", "public/draco"],
  ["node_modules/three/examples/jsm/libs/basis", "public/basis"],
  ["node_modules/detect-gpu/dist/benchmarks", "public/benchmarks"],
];

for (const [from, to] of copies) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-decoders] ${from} → ${to}`);
}
```

En `package.json`: `"scripts": { "postinstall": "node scripts/copy-decoders.mjs", ... }`

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Solo si se importan archivos .glsl externos (por defecto: template strings, no hace falta)
  // turbopack: {
  //   rules: { "*.{glsl,vert,frag}": { loaders: ["raw-loader"], as: "*.js" } },
  // },
  async headers() {
    return [
      {
        source: "/:dir(models|sequences|hdri|draco|basis|benchmarks|audio|fonts|fallback)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
```

> Recordatorio: con `immutable`, cada cambio de un asset requiere **nombre o carpeta nuevos** (versionado).

## 4. Política de GPU — `src/config/gpu-policy.ts`

```ts
export type GPUTierLevel = 1 | 2 | 3;
export type SequenceVariant = "desktop" | "mobile";

export interface GPUStrictParameter {
  tier: GPUTierLevel;
  /** Rango [min, max] de devicePixelRatio para Canvas WebGL y 2D */
  dpr: [number, number];
  /** Presupuesto orientativo de memoria para secuencias (MB) */
  maxSequenceVRAM_MB: number;
  /** Radio R de la ventana deslizante: solo [f-R, f+R] decodificados */
  sequenceWindowRadius: number;
  sequenceVariant: SequenceVariant;
  maxParticles: number;
  enablePostProcessing: boolean;
  antialias: boolean;
}

export const GPU_STRICT_POLICIES: Record<GPUTierLevel, GPUStrictParameter> = {
  3: { tier: 3, dpr: [1, 2],   maxSequenceVRAM_MB: 256, sequenceWindowRadius: 35, sequenceVariant: "desktop", maxParticles: 8000, enablePostProcessing: true,  antialias: true  },
  2: { tier: 2, dpr: [1, 1.5], maxSequenceVRAM_MB: 96,  sequenceWindowRadius: 18, sequenceVariant: "mobile",  maxParticles: 2500, enablePostProcessing: true,  antialias: false },
  1: { tier: 1, dpr: [1, 1],   maxSequenceVRAM_MB: 32,  sequenceWindowRadius: 8,  sequenceVariant: "mobile",  maxParticles: 500,  enablePostProcessing: false, antialias: false },
};

export const ASSET_MANIFEST = {
  dracoPath: "/draco/",
  basisPath: "/basis/",
  benchmarksURL: "/benchmarks",
  hdri: "/hdri/studio_dark_01.hdr",
  heroModel: "/models/hero_artifact.glb",
  heroPoster: "/fallback/hero_poster.webp",
  sequences: {
    heroExplode: {
      basePath: "/sequences/hero_explode",
      // Conteo POR VARIANTE (deben coincidir si se exportan al mismo fps)
      totalFrames: { desktop: 120, mobile: 120 } satisfies Record<SequenceVariant, number>,
    },
  },
  audio: {
    ambient: ["/audio/ambient_drone.webm", "/audio/ambient_drone.m4a"],
    hover: ["/audio/ui_hover_tick.webm", "/audio/ui_hover_tick.m4a"],
  },
} as const;
```

## 5. Matemática y store transiente

### `src/lib/math.ts`

```ts
/** Amortiguación exponencial independiente de FPS: target + (x - target)·e^(−λ·Δt) */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return target + (current - target) * Math.exp(-lambda * delta);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}
```

### `src/store/useExperienceStore.ts`

```ts
import { create } from "zustand";
import { GPUTierLevel, GPUStrictParameter, GPU_STRICT_POLICIES } from "@/config/gpu-policy";

interface ExperienceState {
  // Hardware y accesibilidad (cambian rara vez → pueden leerse con hooks)
  gpuPolicy: GPUStrictParameter;
  webglAvailable: boolean;
  reducedMotion: boolean;
  isCanvasPaused: boolean;
  preloadProgress: number;
  isPreloaded: boolean;

  // Transiente (leer SIEMPRE con getState() en useFrame / RAF; nunca con hooks)
  scrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  /** Objeto MUTABLE: se modifica in situ para no generar basura en cada pointermove */
  pointerNDC: { x: number; y: number };

  setGPUTier: (tier: GPUTierLevel) => void;
  downgradeGPUTier: () => void;
  setWebGLAvailable: (ok: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setCanvasPaused: (paused: boolean) => void;
  setPreloadProgress: (progress: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  gpuPolicy: GPU_STRICT_POLICIES[2], // Tier 2 seguro hasta que detect-gpu resuelva
  webglAvailable: true,
  reducedMotion: false,
  isCanvasPaused: false,
  preloadProgress: 0,
  isPreloaded: false,

  scrollY: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  pointerNDC: { x: 0, y: 0 },

  setGPUTier: (tier) => set({ gpuPolicy: GPU_STRICT_POLICIES[tier] }),
  downgradeGPUTier: () => {
    const current = get().gpuPolicy.tier;
    if (current > 1) {
      const next = (current - 1) as GPUTierLevel;
      console.warn(`[GPU_STRICT_GUARD] Tier ${current} → ${next}`);
      set({ gpuPolicy: GPU_STRICT_POLICIES[next] });
    }
  },
  setWebGLAvailable: (ok) => set({ webglAvailable: ok }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setCanvasPaused: (paused) => set({ isCanvasPaused: paused }),
  setPreloadProgress: (progress) => set({ preloadProgress: progress, isPreloaded: progress >= 100 }),
}));
```

## 6. Detector de hardware + motor de scroll — `src/components/dom/SmoothScrollProvider.tsx`

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getGPUTier } from "detect-gpu";
import { useExperienceStore } from "@/store/useExperienceStore";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const store = useExperienceStore.getState();
    const cleanups: Array<() => void> = [];

    // 1. Accesibilidad (eje independiente del rendimiento)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    store.setReducedMotion(reducedMotion);

    // 2. Clasificación de GPU con benchmarks auto-hospedados
    getGPUTier({ benchmarksURL: ASSET_MANIFEST.benchmarksURL })
      .then((gpu) => {
        if (gpu.tier === 0) {
          store.setWebGLAvailable(false); // sin WebGL → fallback estático
          store.setGPUTier(1);
        } else if (gpu.tier === 1) {
          store.setGPUTier(1);
        } else if (gpu.tier === 2 || gpu.isMobile) {
          store.setGPUTier(2);
        } else {
          store.setGPUTier(3);
        }
      })
      .catch(() => store.setGPUTier(2)); // si falla la detección, Tier 2 seguro

    // 3. Lenis manejado por el ticker de GSAP (un solo reloj). Sin Lenis si reduced motion.
    let lenis: Lenis | null = null;
    const update = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", (e: Lenis) => {
        ScrollTrigger.update();
        useExperienceStore.setState({
          scrollY: e.scroll,
          scrollVelocity: e.velocity,
          scrollProgress: e.progress,
        });
      });

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    } else {
      // Scroll nativo: igual alimentamos el store para shaders/sequencias
      const onNativeScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        useExperienceStore.setState({
          scrollY: window.scrollY,
          scrollVelocity: 0,
          scrollProgress: max > 0 ? window.scrollY / max : 0,
        });
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onNativeScroll));
    }

    // 4. Puntero normalizado [-1, 1] mutando el objeto (sin re-renders ni basura)
    const pointer = useExperienceStore.getState().pointerNDC;
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // 5. Pausar GPU con la pestaña oculta
    const onVisibilityChange = () => store.setCanvasPaused(document.hidden);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(update);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

## 7. Motor 2D con ventana deslizante — `src/components/sequence/ImageSequenceCanvas.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceStore } from "@/store/useExperienceStore";
import type { SequenceVariant } from "@/config/gpu-policy";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  sequenceFolder: string;                              // "/sequences/hero_explode"
  totalFrames: Record<SequenceVariant, number>;        // conteo por variante
  scrollDistance?: number;
  accentColor?: string;
  ariaLabel: string;                                    // descripción accesible de la animación
}

export default function ImageSequenceCanvas({
  sequenceFolder, totalFrames, scrollDistance = 2600, accentColor = "#FFD645", ariaLabel,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const getPolicy = () => useExperienceStore.getState().gpuPolicy;
    let variant = getPolicy().sequenceVariant;
    let count = totalFrames[variant];

    let bitmaps: (ImageBitmap | null)[] = new Array(count).fill(null);
    let loading: boolean[] = new Array(count).fill(false);
    let generation = 0;             // invalida cargas en vuelo al cambiar de variante
    let fallback = false;
    let probed = false;             // no se piden frames hasta saber si existe el frame 1 (v2.1)
    let drawn = -1;
    const playhead = { progress: 0 };

    const frameUrl = (i: number) => `${sequenceFolder}/${variant}/frame_${String(i + 1).padStart(4, "0")}.webp`;
    const currentIndex = () => Math.round(playhead.progress * (count - 1));

    const drawFallback = (i: number) => {
      const { width: w, height: h } = canvas;
      const p = i / Math.max(1, count - 1);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 5; k++) {
        const off = (k - 2) * p * h * 0.12;
        ctx.strokeStyle = k === 2 ? accentColor : "rgba(255,255,255,0.22)";
        ctx.lineWidth = k === 2 ? 3 : 1.5;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + off, w * 0.16, h * 0.045, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = accentColor;
      ctx.font = `bold ${Math.max(14, Math.floor(w * 0.012))}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`[FALLBACK] FRAME ${i + 1}/${count}`, w / 2, h * 0.88);
    };

    const drawCover = (bmp: ImageBitmap) => {
      const { width: cw, height: ch } = canvas;
      const s = Math.max(cw / bmp.width, ch / bmp.height);
      ctx.drawImage(bmp, (cw - bmp.width * s) / 2, (ch - bmp.height * s) / 2, bmp.width * s, bmp.height * s);
    };

    /** Busca el bitmap decodificado más cercano al índice pedido (evita canvas en blanco) */
    const nearestLoaded = (i: number): number => {
      for (let d = 0; d < count; d++) {
        if (bitmaps[i - d]) return i - d;
        if (bitmaps[i + d]) return i + d;
      }
      return -1;
    };

    const syncWindow = (center: number) => {
      if (fallback || !probed) return;
      const R = getPolicy().sequenceWindowRadius;
      const min = Math.max(0, center - R);
      const max = Math.min(count - 1, center + R);

      for (let i = 0; i < count; i++) {
        if ((i < min || i > max) && bitmaps[i]) { bitmaps[i]!.close(); bitmaps[i] = null; }
      }

      for (let i = min; i <= max; i++) {
        if (bitmaps[i] || loading[i]) continue;
        loading[i] = true;
        const gen = generation;
        fetch(frameUrl(i))
          .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
          .then((b) => createImageBitmap(b))
          .then((bmp) => {
            const c = currentIndex();
            if (gen !== generation || Math.abs(i - c) > getPolicy().sequenceWindowRadius) { bmp.close(); return; }
            bitmaps[i] = bmp;
            if (Math.abs(i - c) <= 1) { drawn = -1; render(); }
          })
          .catch(() => { /* frame aislado faltante: se usa el más cercano */ })
          .finally(() => { if (gen === generation) loading[i] = false; });
      }
    };

    const render = () => {
      const i = currentIndex();
      syncWindow(i);
      if (fallback) { drawFallback(i); drawn = i; return; }
      if (i === drawn) return;
      const n = bitmaps[i] ? i : nearestLoaded(i);
      if (n >= 0) { drawCover(bitmaps[n]!); if (n === i) drawn = i; }
    };

    const resetCache = () => {
      generation++;
      bitmaps.forEach((b) => b?.close());
      variant = getPolicy().sequenceVariant;
      count = totalFrames[variant];
      bitmaps = new Array(count).fill(null);
      loading = new Array(count).fill(false);
      drawn = -1;
    };

    // Fallback SOLO si el primer frame no existe
    fetch(frameUrl(0), { method: "HEAD" })
      .then((r) => { if (!r.ok) fallback = true; })
      .catch(() => { fallback = true; })
      .finally(() => { probed = true; drawn = -1; render(); });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, getPolicy().dpr[1]);
      canvas.width = Math.round(container.clientWidth * dpr);
      canvas.height = Math.round(container.clientHeight * dpr);
      drawn = -1;
      render();
    };
    resize();
    window.addEventListener("resize", resize);

    // Al cambiar de tier/variante se vacía la caché y se recarga la ventana
    const unsubscribe = useExperienceStore.subscribe((s, prev) => {
      if (s.gpuPolicy !== prev.gpuPolicy) { resetCache(); resize(); }
    });

    const tween = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: { trigger: container, start: "top top", end: `+=${scrollDistance}`, scrub: 0.35, pin: true },
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
      generation++;
      bitmaps.forEach((b) => b?.close());
      bitmaps = [];
    };
  }, [sequenceFolder, totalFrames, scrollDistance, accentColor]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={ariaLabel} />
    </section>
  );
}
```

> **Cambios respecto a la spec v1:** el playhead pasa a ser un `progress` 0-1, así funciona con cualquier `count` por variante. El fallback se activa solo si falta el frame 1. Se dibuja el frame más cercano mientras se decodifica. Se vacía la caché al cambiar de tier. El tamaño del canvas usa el contenedor (no `window`). Se agregó `aria-label`. `totalFrames` debe pasarse como referencia estable (constante del manifiesto) para no reiniciar el efecto.

## 8. Shader y escena 3D

### `src/components/canvas/shaders/FluidBackgroundMaterial.ts`

```ts
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const FluidBackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollVelocity: 0,
    uIntensity: 1,
    uPointer: new THREE.Vector2(0, 0),
    uColorBase: new THREE.Color("#0A0A0A"),
    uColorAccent: new THREE.Color("#FFD645"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0); // quad a pantalla completa (plane 2x2)
    }
  `,
  /* glsl */ `
    // Sin #version ni precision: three.js los inyecta en ShaderMaterial
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uIntensity;
    uniform vec2  uPointer;
    uniform vec3  uColorBase;
    uniform vec3  uColorAccent;

    // Hash sin sin() (Dave Hoskins): estable en GPUs móviles con precisión media
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float valueNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i),               hash12(i + vec2(1.0, 0.0)), u.x),
                 mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2  mouseUV = uPointer * 0.5 + 0.5;
      float dist    = distance(vUv, mouseUV);
      float warp    = clamp(abs(uScrollVelocity) * 0.015, 0.0, 0.35);
      float n       = valueNoise(vUv * 4.5 + vec2(uTime * 0.12, uTime * 0.08 + warp));
      float glow    = smoothstep(0.42, 0.0, dist) * 0.18;
      float vein    = smoothstep(0.62, 0.68, n + glow) * (0.08 + warp * 0.25);
      vec3  color   = mix(uColorBase, uColorAccent, (vein + glow * 0.35) * uIntensity);
      gl_FragColor  = vec4(color, 1.0);
    }
  `
);

extend({ FluidBackgroundMaterial });

// Tipado JSX para R3F v9 (evita @ts-expect-error)
declare module "@react-three/fiber" {
  interface ThreeElements {
    fluidBackgroundMaterial: import("@react-three/fiber").ThreeElement<typeof FluidBackgroundMaterial>;
  }
}
```

### `src/components/canvas/HeroArtifactMesh.tsx`

> **Opcional según el proyecto.** Si el cliente pide solo video (sin modelos 3D), este componente, el HDRI y el pipeline `.glb` (Fase 3) no se usan: el producto se cuenta con secuencias (§7). Ver Anexo B del Manual.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => { if (v instanceof THREE.Texture) v.dispose(); });
      m.dispose();
    });
  });
}

export default function HeroArtifactMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let mounted = true;
    let loaded: THREE.Group | null = null;

    const draco = new DRACOLoader().setDecoderPath(ASSET_MANIFEST.dracoPath);
    const ktx2 = new KTX2Loader().setTranscoderPath(ASSET_MANIFEST.basisPath).detectSupport(gl);
    const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      ASSET_MANIFEST.heroModel,
      (gltf) => {
        loaded = gltf.scene;
        if (mounted) setScene(gltf.scene);
        else disposeObject(gltf.scene);
      },
      undefined,
      () => { /* asset aún no entregado → se mantiene el fallback procedural */ }
    );

    return () => {
      mounted = false;
      if (loaded) disposeObject(loaded);
      draco.dispose();
      ktx2.dispose();
    };
  }, [gl]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const { pointerNDC, scrollProgress, scrollVelocity, reducedMotion } = useExperienceStore.getState();
    const motion = reducedMotion ? 0 : 1;

    const targetRotY = (pointerNDC.x * 0.65 + scrollProgress * Math.PI * 2) * motion;
    const targetRotX = (-pointerNDC.y * 0.35 + scrollVelocity * 0.004) * motion;
    g.rotation.y = damp(g.rotation.y, targetRotY, 5.5, delta);
    g.rotation.x = damp(g.rotation.x, targetRotX, 5.5, delta);

    const targetY = (Math.sin(state.clock.elapsedTime * 1.4) * 0.12) * motion + scrollProgress * 1.5;
    g.position.y = damp(g.position.y, targetY, 4.0, delta);
  });

  return (
    <group ref={groupRef}>
      {scene ? (
        <primitive object={scene} scale={1.4} />
      ) : (
        <group>
          <mesh>
            <octahedronGeometry args={[1.25, 2]} />
            <meshStandardMaterial color="#141414" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh scale={1.015}>
            <octahedronGeometry args={[1.25, 2]} />
            <meshBasicMaterial color="#FFD645" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      )}
    </group>
  );
}
```

> **Cambios v2:** se libera la escena cargada al desmontar (antes quedaba en VRAM). Se quitó `castShadow`/`receiveShadow`, porque las sombras no estaban habilitadas. Se soporta Meshopt además de Draco. Las mallas del fallback ya no van anidadas dentro de otra malla. Se respeta `reducedMotion`.

### `src/components/canvas/GlobalCanvas.tsx`

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";
import HeroArtifactMesh from "./HeroArtifactMesh";
// Import con efecto (v2.1): registra el material con extend(). Si solo se usara como tipo,
// TypeScript eliminaría el import y R3F no encontraría <fluidBackgroundMaterial>.
import "./shaders/FluidBackgroundMaterial";
import type { FluidBackgroundMaterial } from "./shaders/FluidBackgroundMaterial";

type FluidMat = InstanceType<typeof FluidBackgroundMaterial> & {
  uTime: number; uScrollVelocity: number; uPointer: THREE.Vector2;
};

function BackgroundShaderQuad() {
  const mat = useRef<FluidMat>(null);
  const smoothed = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const { pointerNDC, scrollVelocity } = useExperienceStore.getState();
    smoothed.current.set(
      damp(smoothed.current.x, pointerNDC.x, 6, delta),
      damp(smoothed.current.y, pointerNDC.y, 6, delta)
    );
    m.uTime = state.clock.elapsedTime;
    m.uPointer.copy(smoothed.current);
    m.uScrollVelocity = damp(m.uScrollVelocity, scrollVelocity, 8, delta);
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <fluidBackgroundMaterial ref={mat} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export default function GlobalCanvas() {
  // Selectores de baja frecuencia (cambian pocas veces por sesión): OK usar hooks aquí
  const gpuPolicy = useExperienceStore((s) => s.gpuPolicy);
  const isCanvasPaused = useExperienceStore((s) => s.isCanvasPaused);
  const webglAvailable = useExperienceStore((s) => s.webglAvailable);

  if (!webglAvailable) return null; // el DOM muestra el póster estático

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] h-dvh w-screen overflow-hidden" aria-hidden="true">
      <Canvas
        dpr={gpuPolicy.dpr}
        frameloop={isCanvasPaused ? "never" : "always"}
        gl={{ powerPreference: "high-performance", antialias: gpuPolicy.antialias, stencil: false }}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => useExperienceStore.getState().downgradeGPUTier()}
          onFallback={() => useExperienceStore.getState().setGPUTier(1)}
        />

        <BackgroundShaderQuad />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFF8E7" />
        <spotLight position={[-4, -2, -2]} intensity={4.5} color="#FFD645" angle={0.6} />

        <HeroArtifactMesh />

        {gpuPolicy.enablePostProcessing && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1.05} mipmapBlur intensity={0.45} />
            <Noise opacity={0.032} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
```

> Nota: `antialias` solo se lee al crear el contexto WebGL. Si el tier cambia en vivo, el cambio de `antialias` no se aplica hasta recargar, y eso es aceptable. No se fuerza la recreación del Canvas, porque violaría la regla Single-Canvas.

## 9. Layout y página — `src/app`

### `layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";

export const metadata: Metadata = {
  title: "Nombre de Marca | Propuesta de valor en una línea",
  description: "Descripción real orientada a búsqueda (150-160 caracteres).",
  openGraph: { images: ["/og-image.jpg"] },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-[#0A0A0A] text-white antialiased">
      <body className="selection:bg-[#FFD645] selection:text-black">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
          Saltar al contenido
        </a>
        <SmoothScrollProvider>
          <GlobalCanvas />
          <main id="contenido" className="relative z-[10]">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

### `page.tsx`

```tsx
import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

const hero = ASSET_MANIFEST.sequences.heroExplode;

export default function HomePage() {
  return (
    <>
      {/* SECCIÓN 1: HERO — el <h1> es el elemento LCP (SSR, visible antes del 3D) */}
      <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-between px-6 py-12 md:px-16">
        <header className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFD645]">MARCA</span>
          <a href="#catalogo" className="pointer-events-auto rounded-full border border-white/15 bg-black/50 px-5 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-md transition hover:border-[#FFD645] hover:text-[#FFD645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD645]">
            Explorar catálogo
          </a>
        </header>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl">
            Titular <span className="text-[#FFD645]">de impacto</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-zinc-400 md:text-base">Propuesta de valor clara en una o dos frases.</p>
        </div>
      </section>

      {/* SECCIÓN 2: STORYTELLING POR SECUENCIA */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          sequenceFolder={hero.basePath}
          totalFrames={hero.totalFrames}
          scrollDistance={2800}
          ariaLabel="Animación del producto desarmándose en sus componentes"
        />
      </div>

      {/* SECCIÓN 3: CONVERSIÓN */}
      <section id="catalogo" className="relative z-[15] flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0A]/90 px-6 text-center backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">Llamado a la acción</h2>
        <a href="https://wa.me/XXXXXXXXXXX" className="mt-8 rounded-full bg-[#FFD645] px-8 py-4 font-bold uppercase text-black">
          Contactar
        </a>
      </section>
    </>
  );
}
```

## 10. Protocolo de verificación del agente

Antes de dar una tarea por terminada:
1. `npx tsc --noEmit` y `npm run build`: **cero errores**.
2. `grep -rn "useState" src/components/canvas src/components/sequence`: cada uso se revisa; ninguno puede escribirse por frame, scroll o pointer.
3. `GPU_STRICT_POLICIES` está conectado al `dpr` del `<Canvas>`, a la ventana `close()` de `ImageSequenceCanvas` y a `maxParticles`.
4. Con `/public` vacío, el sitio carga sin errores fatales (fallbacks visibles).
5. Playwright o DevTools: scroll de arriba a abajo 10 veces; la memoria JS y GPU vuelve a su nivel (sin fugas).
6. Lighthouse móvil: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; accesibilidad ≥ 95.

---

# PARTE III — CHECKLIST DE LANZAMIENTO

**DIRECCIÓN DE ARTE Y EXPERIENCIA**
- [ ] Identidad visual coherente; coherencia lumínica entre renders, secuencias IA y 3D real-time.
- [ ] Sin costuras de color entre assets y fondo del DOM (probado en navegador).
- [ ] Cero frames con *morphing* o logotipos deformados en las secuencias IA.
- [ ] Animaciones con inercia (`damp`), con propósito, sin cortes bruscos.
- [ ] Audio opt-in, Mute visible, pausa con `visibilitychange`, fallback `.m4a`.

**INGENIERÍA WEBGL Y RENDIMIENTO**
- [ ] Un único contexto WebGL que no se recrea al navegar.
- [ ] `.glb` con Draco **o** Meshopt + texturas KTX2 separadas por slot (UASTC datos / ETC1S color).
- [ ] Secuencias desktop y mobile con el mismo número de frames (o `totalFrames` por variante).
- [ ] Cero `setState` en `useFrame`, scroll de Lenis o `pointermove`.
- [ ] Memoria estable tras scroll repetido; todos los recursos se liberan al desmontar.
- [ ] 60 FPS en desktop y ≥ 50 FPS en gama media (PerformanceMonitor sin oscilaciones).
- [ ] Tier 0 (sin WebGL) muestra póster y la página sigue siendo funcional.
- [ ] Performance Budget cumplido (tabla Fase 0).

**NEGOCIO, ACCESIBILIDAD, SEO Y PUBLICACIÓN**
- [ ] Botones, enlaces y carrito clickeables (`pointer-events: auto`), sin capas que los bloqueen.
- [ ] Flujo de compra/contacto/WhatsApp probado de punta a punta en iOS Safari y Android Chrome.
- [ ] Core Web Vitals en verde; el LCP es texto o imagen DOM.
- [ ] WCAG 2.2 AA: teclado, foco visible, `alt`, contraste, `prefers-reduced-motion`.
- [ ] Title, meta, OG, canónica, sitemap, robots y JSON-LD configurados.
- [ ] Dominio, SSL, analítica, Sentry, cookies/privacidad y backups activos.
- [ ] `LICENCIAS.md` completo (fuentes, modelos, audio, IA).
- [ ] Revisión final hecha **en producción**.

---

# ANEXO A — REGISTRO DE CAMBIOS v1 → v2

| # | Ubicación v1 | Problema | Corrección v2 |
| :-: | :--- | :--- | :--- |
| 1 | Manual Paso 5 / Spec §2 | Desktop 24 fps y mobile 20 fps desde el mismo master dan distinto número de frames; el código asumía 120 en ambos | Mismo fps en ambas variantes, `totalFrames` por variante y playhead en progreso 0-1 |
| 2 | Manual Paso 7 | `uastc` → `etc1s` sin `--slots` recomprime todas las texturas | `--slots` por tipo (UASTC: normal/ORM; ETC1S: color) |
| 3 | Manual Paso 7 | Meshopt y Draco aplicados al mismo modelo | Elegir uno |
| 4 | Manual Paso 7 | No mencionaba la dependencia KTX-Software | Requisito explícito ≥ 4.3 |
| 5 | Manual Paso 21 | "detect-gpu incluida en Drei como PerformanceMonitor" | Herramientas distintas y complementarias (`useDetectGPU` vs PerformanceMonitor) |
| 6 | Spec §6 | detect-gpu descarga benchmarks de un CDN de terceros | `benchmarksURL` auto-hospedado |
| 7 | Spec §3 | `raw-loader`/`glslify-loader` y bloque `webpack()`: deprecado e ignorado por Turbopack (Next 16) | Shaders en template strings; `turbopack.rules` opcional; `next.config.ts` |
| 8 | Spec §3 | `transpilePackages: ["three"]` innecesario | Eliminado |
| 9 | Spec §2 | No explicaba cómo obtener los binarios Draco/Basis | Script `copy-decoders.mjs` en `postinstall` |
| 10 | Spec §1 | Exigía `#version 300 es`, pero el shader usaba sintaxis GLSL 1 | GLSL de `ShaderMaterial`; three inyecta versión y precisión |
| 11 | Spec §4 | `shaderPrecision` en la política sin conectar a nada | Eliminado; agregado `antialias` por tier |
| 12 | Spec §8 | Hash `fract(sin(...))` con artefactos en GPUs móviles | Hash de Dave Hoskins sin seno |
| 13 | Spec §7 | Un solo 404 activaba el fallback de toda la secuencia | Fallback solo si falta el frame 1 (HEAD) |
| 14 | Spec §7 | Canvas en blanco mientras se decodifica el frame exacto | Dibuja el frame disponible más cercano |
| 15 | Spec §7 | El cambio de tier no vaciaba la caché ni cambiaba de variante | `subscribe` al store, con `resetCache` y generación |
| 16 | Manual Paso 13 | Llamado "sliding window", pero precargaba todos los frames | Implementación única corregida (Parte II §7) |
| 17 | Spec §6 | `prefers-reduced-motion` forzaba Tier 1 (mezclaba accesibilidad y rendimiento) | Flag `reducedMotion` separado: sin Lenis ni rotaciones, calidad intacta |
| 18 | Spec §6 | `tier 0` (sin WebGL) tratado como Tier 1 | `webglAvailable=false`: no se monta el Canvas y se muestra un póster |
| 19 | Spec §8 | `PerformanceMonitor onDecline` podía degradar en cascada | `flipflops={3}` + `onFallback` |
| 20 | Spec §6 | `pointerNDC` creaba un objeto nuevo en cada `pointermove` | Mutación in situ |
| 21 | Spec §8 | HeroArtifactMesh no liberaba la escena cargada; `castShadow` sin sombras; mallas anidadas | `disposeObject`, se quitan las sombras, grupo plano y soporte Meshopt |
| 22 | Spec §8 | `@ts-expect-error` en el material custom | Tipado `ThreeElements` de R3F v9 |
| 23 | Spec §6 | Lenis sin `autoRaf:false` explícito | Declarado (el RAF lo maneja GSAP) |
| 24 | Manual Paso 3 | Fondo `#0A0A0A` vs renders sobre "negro puro" | Mismo hex o alfa; prueba de rango YUV |
| 25 | Manual Paso 5B | Scrubbing de `<video>` presentado como universal | Solo desktop; iOS usa secuencia |
| 26 | Spec §2 / Paso 15 | Audio solo `.webm` (Safari irregular) | Fallback `.m4a` en Howler; arranque tras gesto del usuario |
| 27 | Manual Paso 17 | Sin regla de LCP con hero en canvas | El LCP debe ser `<h1>` o `<img>` en SSR |
| 28 | Spec §2 | "Roboto Slab / Mono" contradictorio; Integral CF comercial | Elegir una familia; verificar licencia web |
| 29 | Manual Paso 16 | Tipografía cinética partida a mano | GSAP SplitText (GSAP es gratuito con todos sus plugins) |
| 30 | Manual Paso 4 | Nombres de menús de herramientas IA presentados como fijos | Describir la técnica; verificar el flujo vigente |
| 31 | Manual Paso 24 | Caché `immutable` sin versionado | Versionar nombres o carpetas de assets |
| 32 | Spec §7 | Canvas dimensionado con `window` en lugar del contenedor | `container.clientWidth/Height` |
| 33 | v0 (.txt) | Etiquetas `<Link>` no estándar | Enlaces Markdown |
| 34 | Todos | Faltaban Fase 0 (brief/budget), licencias IA, WCAG 2.2, Sentry, cookies, seguridad de formularios, fallback sin WebGL y matriz de dispositivos | Agregados en Fase 0, Pasos 24-26 y Parte III |
| 35 | Spec §9 | Página demo sin enlace de salto, foco visible ni CTA real | Skip link, `focus-visible`, `aria-label` y CTA funcional |
| 36 | Spec §8 (v2.1) | `GlobalCanvas` importaba `FluidBackgroundMaterial` solo como tipo → TypeScript elimina el import, `extend()` no corre y R3F lanza *"not part of the THREE namespace"* (el canvas cae al fallback) | Import con efecto `import "./shaders/FluidBackgroundMaterial"` + `import type` |
| 37 | Spec §7 (v2.1) | Sin assets, la ventana pedía ~2R frames antes de que el HEAD del frame 1 respondiera (ráfaga de 404) | Flag `probed`: no se sincroniza la ventana hasta resolver el sondeo |
| 38 | DEV-08 / tokens (v2.1) | Un color de `@theme` llamado `base` choca con la utilidad de tamaño `text-base` de Tailwind v4 y pinta el texto del color del fondo | No usar nombres de tamaños (`base`, `sm`, `lg`, `xl`…) como nombres de color; usar `surface`, `ink`, `accent`… |
| 39 | Spec §5/§7 (v2.1) | Un solo `sequenceProgress` numérico no sirve con dos o más secuencias en la página | `sequenceProgress: Record<id, number>` y prop `sequenceId` en `ImageSequenceCanvas`; los overlays se suscriben por id |
| 40 | Paso 5 (v2.1) | Conversión video → frames manual y propensa a conteos distintos por variante | Script `scripts/video-to-frames.mjs` (`npm run frames`): fps calculado para un conteo exacto y mismo número de frames en desktop/mobile |

---

# ANEXO B — ADAPTACIÓN DEL PROYECTO EN CURSO (landing de la hamburguesa)

> Registro de decisiones de alcance de este proyecto. No cambia la metodología general; indica qué partes se aplican.

| Tema | Decisión | Fecha / origen | Consecuencia |
| :--- | :--- | :--- | :--- |
| Formato visual | **100 % video hiperrealista, sin modelos 3D** | 19-11-2026 · cliente | Fase 3 completa omitida; sin `.glb`, HDRI, Draco ni KTX2; `HeroArtifactMesh` no se implementa. Tarjetas ART-13, ART-14, DEV-03 y DEV-11 descartadas; DEV-37 la reemplaza |
| Narrativa | Hero → **video 1:** la hamburguesa se separa por capas con fichas de ingredientes por tramos → **video 2:** el packaging con su ficha técnica → CTA | Brief del cliente | Dos secuencias: `/sequences/hero_explode` y `/sequences/packaging_reveal` (120 frames, desktop 1600 px / mobile 800 px) |
| WebGL | Se conserva el único `<Canvas>` solo para el shader de fondo (DEV-10) | DEV | Puede retirarse si DIR lo pide; las secuencias son Canvas 2D y funcionan sin WebGL |
| Contenido | Todo el copy en `src/content/producto.ts` (provisional hasta recibir branding y ficha técnica) | DEV | DIR-05 / DEV-08 solo editan ese archivo y `@theme` |
| Assets requeridos | Lista oficial y especificación de los dos videos en el `README.md` del repo | DEV | ART-08/09/10 cubren ambos videos |

---

**Fuentes de verificación (noviembre 2026):** [Next.js — Turbopack config](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack) · [Lenis README (`autoRaf`)](https://unpkg.com/lenis@1.3.25/README.md) · [R3F — Scaling performance (PerformanceMonitor)](https://r3f.docs.pmnd.rs/advanced/scaling-performance) · [glTF Transform CLI](https://www.npmjs.com/package/@gltf-transform/cli) · [KTX-Software](https://github.com/KhronosGroup/KTX-Software/wiki)
