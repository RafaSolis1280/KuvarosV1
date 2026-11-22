# web-3d-agency — Landing hiperrealista de la hamburguesa

Landing inmersiva **100 % video hiperrealista** (sin modelos 3D) · Next.js 16 · React 19 · GSAP + Lenis · Tailwind v4 · construida con la metodología de
`Manuales/MANUAL_V2_WEB_HIPERREALISTA.md` y gestionada con el tablero de `Manuales/FLUJO_TRELLO_WEB_HIPERREALISTA.md`.

## La experiencia (qué ve el usuario al hacer scroll)

| # | Sección | Qué pasa | Componente / tarjeta |
| :-: | :--- | :--- | :--- |
| 1 | **Hero** | Titular y propuesta de valor sobre un fondo animado sutil. El `<h1>` es el LCP. | `HeroSection` · DEV-18 |
| 2-3 | **La historia en video · hamburguesa → bolsa** | UNA sola sección fijada (DEV-40): la hamburguesa se separa capa por capa con la ficha de cada ingrediente (una a la vez), se vuelve a armar y entra a la bolsa mientras se completa la ficha del packaging; cierra con la bolsa y el logo solos. Arriba, el capítulo actual; abajo, una barra de progreso. El scroll se reparte por **beats** según lo que pasa en pantalla (`PRODUCT_STORY` en `config/sequences.ts`). | `ProductStorySection` = `SequenceSection` (DEV-09) + `IngredientCallouts` (DEV-19) + `PackagingSpecs` (DEV-37) + `StoryProgress` (DEV-40) |
| 4 | **Primer bocado** | Fotos reales de la marca. | `ExperienceSection` · DEV-19 / ART-12 |
| 5 | **Conversión** | Llamado a la acción (hoy Instagram; WhatsApp / delivery cuando DIR-01 lo defina). | `ContactSection` · DEV-25 |

Mientras faltan los archivos, **todo funciona con fallbacks procedurales** (anillos que se separan en lugar de cada video). No hay errores: solo 404 esperados en la consola.

## Puesta en marcha

```bash
git lfs install          # una sola vez por equipo
npm install              # el postinstall copia los benchmarks de detect-gpu a /public
npm run dev              # http://localhost:3000
```

| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run budget` | Tras `npm run build`: JS inicial de `/` en gzip contra el Performance Budget (DEV-01, `src/config/budget.ts`); falla si se pasa |
| `npm run analyze -- --output` | Analizador de bundle de Next (Turbopack), sin dependencias; resumen con `Manuales/qa/scripts/bundle-inicial.py` (DEV-28) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Tests unitarios (Vitest): lógica de secuencias, aparición de fichas, configuración y contenido |
| `npm run frames -- <video> [--out carpeta]` | Convierte un video master en las secuencias WebP desktop/mobile (requiere ffmpeg) |

**Probar cada tier (DEV-27, solo en `npm run dev`):** `/?tier=1`, `/?tier=2` o `/?tier=3` fijan la política de GPU
(y apagan el PerformanceMonitor para que no la cambie); `/?nowebgl` simula un navegador sin WebGL (camino real:
detect-gpu → tier 0 → sin Canvas). En el build de producción la URL no cambia nada. Informe y capturas en
`Manuales/qa/DEV-27.md`; el script `Manuales/qa/scripts/tiers.cjs` repite la prueba.

## 🧱 Arquitectura del código

`src/app/page.tsx` solo **compone secciones**. Cada cosa tiene un lugar único:

| Carpeta | Qué hay | Cuándo tocarla |
| :--- | :--- | :--- |
| `src/content/` | `producto.ts`: **todo el texto del producto** (copy, SEO, CTA, textos de accesibilidad) · `sitio.ts`: textos del sitio (navegación, footer, formulario) y datos del negocio para el JSON-LD · `types.ts`: su forma | Cambiar un texto, un enlace o una ficha |
| `src/config/` | `gpu-policy.ts` (tiers y manifiesto de assets) · `sequences.ts` (`PRODUCT_STORY`: clips y beats de la historia, encuadre) · `motion.ts` (Lenis, suavizado — `DAMPING.overlays` es la duración de los fundidos —, mezcla de frames y entrada de los videos, puntos de aparición) · `scene.ts` (Canvas WebGL) · `site.ts` (URL, idioma, anclas) · `brand.ts` (colores para canvas/shader) | Ajustar comportamiento sin tocar componentes |
| `src/components/sections/` | Una sección por archivo (Hero, Ingredientes, Packaging, Primer bocado, Contacto) | Cambiar la maqueta de una sección |
| `src/components/sequence/` | `SequenceSection` (video fijado + bordes + overlays) e `ImageSequenceCanvas` | Agregar un video: entrada en `config/sequences.ts` + una sección con `SequenceSection` |
| `src/components/ui/` | Piezas reutilizables: `CtaLink`, `Eyebrow`, `GlassPanel` | Estilos compartidos (afectan a todo el sitio) |
| `src/components/layout/` | `SiteHeader` (cabecera fija con el CTA) + `StickyHeader`, `SiteFooter`, `SkipLink` | Navegación y accesibilidad global |
| `src/components/seo/` | `JsonLd` (datos estructurados del negocio) | — |
| `src/components/dom/` | Proveedor de scroll, overlays de las secuencias, `Wordmark`, `HeroTitle` (titular cinético), `ContactForm`, `CustomCursor` | — |
| `src/components/canvas/` | El único Canvas WebGL y el shader de fondo | — |
| `src/lib/` | Lógica sin React: `sequence/` (caché de frames con ventana deslizante, dibujo, rutas, `timeline.ts`: beats → frame), `reveal.ts` (qué overlay está activo, exclusión y cascada), `DampedValues.ts` (fundidos en el tiempo), `math.ts`, `gsap.ts` (registra ScrollTrigger, SplitText y CustomEase una vez), `seo.ts` (metadatos, JSON-LD, sitemap y robots), `contact/` (validación compartida navegador/servidor, límite de envíos, envío), `color.ts`, `cx.ts` | — |
| `src/hooks/` | `useSequenceProgress` (overlays sincronizados con un video, sin re-renders) | — |
| `src/store/` | Store transiente (Zustand) | — |

Las capas de apilamiento (`z-index`) están definidas una sola vez en `src/app/globals.css` como utilidades `stack-canvas`, `stack-content`, `stack-section`, `stack-nav` y `stack-top`: no usar `z-[n]` sueltos. Los tests viven junto a cada módulo (`*.test.ts`).

**Cabeceras HTTP (DEV-34).** Seguridad (CSP, HSTS, etc.) y caché de `/public` en `src/config/http-headers.ts`, aplicadas
por `next.config.ts`. Si el sitio empieza a cargar algo de otro dominio (analítica, un servicio externo), hay que sumarlo a la
CSP ahí. Toda carpeta nueva de `/public` debe clasificarse como versionada (`immutable`) o no (se revalida): lo exige un test.

**Variables de entorno (Vercel).** La URL pública (canónica, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD) se resuelve
en `src/config/site.ts`: `NEXT_PUBLIC_SITE_URL` (dominio oficial, DEV-34) → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL`
(las dos últimas las define Vercel solo, así que las Preview URLs ya salen bien) → `http://localhost:3000`.
El formulario de contacto (DEV-25) envía por `src/lib/contact/delivery.ts` según `CONTACTO_ENVIO`: sin definir, en desarrollo
el envío se simula (log del servidor) y en producción **el formulario no se muestra** (queda el CTA a Instagram);
`CONTACTO_ENVIO=simulado` lo activa en una Preview para probarlo. El servicio real (email o WhatsApp) y su clave los
define Rafael en Vercel: se agrega un caso en `getContactDelivery` (las claves nunca van al repo).

**CSS.** `next.config.ts` pasa todo `*.css` por el loader de Tailwind, así que los CSS modules **no** funcionan (pierden el
hash de sus clases): para estilos propios de un componente, usar una hoja global con un selector de atributo
(ej. `src/components/dom/HeroTitle.css` con `[data-hero-title]`).

---

## 📦 ARCHIVOS QUE NECESITAMOS

> Los nombres y rutas son **fijos** (contrato de `CLAUDE.md` §2). Si un archivo cambia después del primer deploy,
> va con nombre o carpeta nueva (la caché es `immutable`). **Cada archivo se registra en `LICENCIAS.md`.**

### A. Del cliente (branding y contenido)

| # | Qué | Formato | Dónde se usa | Prioridad |
| :-: | :--- | :--- | :--- | :-: |
| A1 | **Logo** (versión horizontal + isotipo, en positivo y negativo) | SVG | Header, favicon, OG image | P0 |
| A1b | **Arte del packaging** (dieline / mockup / fotos del packaging real) | PDF, AI o fotos | Referencia para generar el video del packaging | P0 |
| A2 | **Paleta de colores** (primario, acento, fondo, texto) | Códigos HEX | `src/app/globals.css` (`@theme`) · DEV-08 | P0 |
| A3 | **Tipografías** con licencia web (titulares + texto) | `.woff2` + comprobante de licencia | `public/fonts/` · DEV-08 | P0 |
| A4 | **Manual de marca** (si existe) | PDF | Referencia de diseño | P1 |
| A5 | **Nombre del producto, titular y bajada** | Texto | Hero | P0 |
| A6 | **Ficha de cada ingrediente**: nombre, descripción corta (1-2 frases), dato destacado (peso, origen, maduración…) — **en el mismo orden en que se separan en el video** | Texto | Callouts de la secuencia | P0 |
| A7 | **Ficha técnica del packaging**: material, medidas, peso, conservación, sostenibilidad, certificaciones + descripción | Texto | Sección packaging | P0 |
| A8 | **Acción de conversión**: número de WhatsApp, link de delivery o tienda | URL / número | CTA | P0 |
| A9 | Información legal: alérgenos / tabla nutricional (si corresponde) | Texto | Sección packaging o footer | P1 |
| A10 | Título y descripción para buscadores (SEO) | Texto (60 y 155 caracteres) | `layout.tsx` · DEV-30 | P1 |

👉 Todo el texto (A5-A9) se carga en **un solo archivo**: `src/content/producto.ts`. Hoy tiene copy de ejemplo.

### B. Producción audiovisual (arte)

| # | Archivo | Ruta final | Especificación | Tarjeta | Prioridad |
| :-: | :--- | :--- | :--- | :-: | :-: |
| B1 | **Video 1 · hamburguesa separándose** (master) | (no va a `/public`; se convierte con `npm run frames`) | Ver especificación abajo | ART-08/09 | P0 |
| B2 | Frames desktop del video 1 | `public/sequences/hero_explode/desktop/frame_0001.webp … frame_0120.webp` | 1600 px de ancho · generados por el script | ART-10 | P0 |
| B3 | Frames mobile del video 1 | `public/sequences/hero_explode/mobile/frame_0001.webp … frame_0120.webp` | 800 px · **mismo número de frames** que desktop | ART-10 | P0 |
| B4 | **Video 2 · packaging** (master) | (se convierte con `npm run frames -- … --out public/sequences/packaging_reveal`) | Ver especificación abajo | ART-08/09 | P0 |
| B5 | Frames desktop del video 2 | `public/sequences/packaging_reveal/desktop/frame_0001.webp … frame_0120.webp` | 1600 px | ART-10 | P0 |
| B6 | Frames mobile del video 2 | `public/sequences/packaging_reveal/mobile/frame_0001.webp … frame_0120.webp` | 800 px · mismo conteo | ART-10 | P0 |
| B7 | Póster de fallback (equipos de gama baja / sin JavaScript) | `public/fallback/hero_poster.webp` | 1600 px, la hamburguesa armada | ART-12 | P1 |
| B8 | Imagen para compartir en redes (OG) | `public/og-image.jpg` | 1200 × 630 px, < 300 KB | ART-12 | P1 |
| B8b | Fotos de marca (lifestyle / producto real) | `public/photos/<nombre>.webp` | 1000 px de ancho, WebP, **sin EXIF/GPS** | ART-12 | P1 |
| B9 | Sonido ambiente (opcional) | `public/audio/ambient_drone.webm` + `.m4a` | Loop sin cortes, < 400 KB | ART-15 | P2 |
| B10 | Sonido de hover (opcional) | `public/audio/ui_hover_tick.webm` + `.m4a` | < 80 ms | ART-15 | P2 |

> **No se necesitan** modelos 3D (`.glb`), HDRI ni texturas: el proyecto es solo video (decisión del cliente, DEV-37).

#### Especificación común a los dos videos

- **Resolución:** mínimo 1920 × 1080 (ideal 4K para recortar). Formato MP4 (H.264 alta calidad) o MOV ProRes.
- **Cámara fija o movimiento muy suave y continuo**, sin cortes: el scroll avanza y retrocede, así que debe verse bien en reversa.
- **Fondo liso oscuro** (ideal `#0A0A0A` o el color de fondo de la marca) para que se funda con la página.
- **Misma luz y temperatura de color** en los dos videos: el paso de uno a otro tiene que sentirse continuo.
- **Último frame del video 1 ≈ primer frame del video 2** (mismo fondo y encuadre) para que el corte no se note.

#### B1 · Video 1: la hamburguesa (lo más importante)

- **Duración:** 5 a 6 s. El script lo convierte a **120 frames** (cambiable con `--frames`).
- **Hamburguesa centrada** dejando ~30 % libre a cada lado: ahí aparecen las fichas de ingredientes. En móvil
  (vertical) el video se recorta a los lados, así que nada importante fuera del 40 % central del ancho.
- **Arco:** 0-10 % hamburguesa armada y quieta → las capas se separan verticalmente → último 10 % todas las capas
  separadas y quietas (ahí termina la secuencia y entra el packaging).
- **Orden de separación** = orden de las fichas en `src/content/producto.ts`. Pasar los **segundos aproximados** en que
  cada ingrediente queda bien visible: con eso se ajusta el `rango` de cada ficha.

Conversión:

```bash
winget install Gyan.FFmpeg                                   # una sola vez (Windows)
npm run frames -- ruta/al/hamburguesa_master.mp4             # 120 frames por defecto
npm run frames -- ruta/al/hamburguesa_master.mp4 --frames 144
npm run frames -- ruta/al/packaging_master.mp4 --out public/sequences/packaging_reveal
```

Si el número de frames cambia, actualizar `totalFrames` de esa secuencia en `src/config/gpu-policy.ts`.
**Budget orientativo por video:** ≤ 25 MB la secuencia desktop y ≤ 8 MB la mobile (ajustar `--quality`).

**Un solo master para las dos secuencias** (`--start` / `--end` en segundos) y **frames nativos** (`--frames native`,
sin cuadros duplicados). El script nunca agranda: si el master mide menos de 1600 px, desktop queda en su ancho nativo.

#### Entrega actual (ART-10 · 20-11-2026)

El cliente entregó **un único video** (`Marca/Video.mp4`, 1292 × 696, 24 fps, 8.8 s, fuera de Git) que cuenta las
dos historias. Se cortó en 2.25 s, donde la hamburguesa termina de volver a juntarse y entran las papas:

```bash
npm run frames -- Marca/Video.mp4 --frames native --start 0 --end 2.25 --quality 88 --out public/sequences/hero_explode
npm run frames -- Marca/Video.mp4 --frames native --start 2.25 --quality 88 --out public/sequences/packaging_reveal
```

| Secuencia | Tramo | Frames | Desktop (1292 px) | Mobile (800 px) |
| :--- | :--- | :-: | :-: | :-: |
| `hero_explode` | 0 – 2.25 s · armada → 5 capas separadas → se vuelve a juntar | 54 | 1.29 MB | 0.73 MB |
| `packaging_reveal` | 2.25 – 8.79 s · papas y hamburguesa entran a la bolsa → bolsa cerrada con el logo | 157 | 3.50 MB | 1.94 MB |

⏳ **Pendiente para la versión final:** master de ≥ 1600 px de ancho (idealmente 1920) para pantallas grandes/retina.

#### Póster, OG y fotos (ART-12 · 20-11-2026)

| Archivo | Origen | Tamaño |
| :--- | :--- | :-: |
| `public/fallback/hero_poster.webp` | frame de `Marca/Video.mp4` a 1.25 s (capas separadas), 1292 px | 27 KB |
| `public/og-image.jpg` | mismo frame, 1200 × 630 | 33 KB |
| `public/photos/kuvaros_bolsa_mano.webp` | `Marca/DSC05620.jpg` (Sony A7 III), 1000 px | 78 KB |
| `public/photos/kuvaros_papas_banca.webp` | `Marca/papas.jpg` (Sony A7 III), 1000 px | 108 KB |

Las fotos originales traen **coordenadas GPS en el EXIF**: las versiones web se exportan con ffmpeg, que no copia
metadatos. Comprobar siempre que ningún archivo de `/public` conserve EXIF.

#### B4 · Video 2: el packaging

- **Duración:** 4 a 5 s (120 frames por defecto).
- **Arco:** el packaging entra o aparece (desde la oscuridad, girando o abriéndose) → giro lento de presentación
  mostrando el frente con el logo → termina quieto en su mejor ángulo.
- **Packaging a la derecha del encuadre** (o centrado con aire a la izquierda): en desktop la ficha técnica ocupa el
  ~35 % izquierdo de la pantalla. En móvil la ficha va abajo, así que el packaging conviene en la mitad superior.
- La ficha técnica se va completando entre el 25 % y el 80 % del video: ese tramo es ideal para el giro de presentación.
- Si existe el packaging físico, conviene usar fotos o un video real como referencia para la generación con IA, así la
  gráfica y el logo salen fieles.

### C. Ya resuelto en el repo (no hace falta entregar)

`public/benchmarks/` se genera solo en `npm install`.

---

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
| :--- | :--- |
| Textos, ingredientes, specs del packaging, CTA | `src/content/producto.ts` |
| En qué parte del video del packaging entra la ficha | `entrada` y `tramoSpecs` de `PackagingSpecs` en `src/app/page.tsx` |
| En qué parte del scroll aparece cada ingrediente | `rango` y `ancla` de cada ingrediente en `src/content/producto.ts` |
| Colores y fuentes | `src/app/globals.css` (`@theme`) · DEV-08 |
| Rutas de los assets y número de frames | `src/config/gpu-policy.ts` (`ASSET_MANIFEST`) |
| Cuánto scroll dura cada video | `scrollDistance` de cada `ImageSequenceCanvas` en `src/app/page.tsx` |

## Ramas (ver guía de gobernanza)

`main` (producción) ← PR ← `develop` (integración) ← PR ← `feat/<id-trello>-<tarea>` · `fix/<bug>` · `assets/<tipo>`.
Nadie hace push directo a `main` ni a `develop`. Cada PR indica la tarjeta de Trello (`DEV-XX`) que resuelve.
Los assets entran por ramas `assets/<tipo>` (p. ej. `assets/secuencia-hamburguesa`) con Git LFS.

## Documentos clave

- `CLAUDE.md` — especificación de código (Parte II del Manual v2) para humanos y agentes.
- `LICENCIAS.md` — registro obligatorio de licencias.
- `Manuales/` — manual técnico, flujo Trello (estado actual en §0) y gobernanza Git/GitHub.
