# web-3d-agency — Landing hiperrealista de la hamburguesa

Landing inmersiva **100 % video hiperrealista** (sin modelos 3D) · Next.js 16 · React 19 · GSAP + Lenis · Tailwind v4 · construida con la metodología de
`Manuales/MANUAL_V2_WEB_HIPERREALISTA.md` y gestionada con el tablero de `Manuales/FLUJO_TRELLO_WEB_HIPERREALISTA.md`.

## La experiencia (qué ve el usuario al hacer scroll)

| # | Sección | Qué pasa | Componente / tarjeta |
| :-: | :--- | :--- | :--- |
| 1 | **Hero** | Titular y propuesta de valor sobre un fondo animado sutil. El `<h1>` es el LCP. | `src/app/page.tsx` · DEV-18 |
| 2 | **Video 1 · La hamburguesa** | La sección se fija (pin) y el scroll controla el video frame a frame: la hamburguesa se separa capa por capa. En ciertos tramos aparece la ficha de cada ingrediente. | `ImageSequenceCanvas` (DEV-09) + `IngredientCallouts` (DEV-19) |
| 3 | **Video 2 · El packaging** | Al terminar la hamburguesa entra el video del packaging, también controlado por el scroll, y la ficha técnica se va completando especificación por especificación. | `ImageSequenceCanvas` + `PackagingSpecs` (DEV-37) |
| 4 | **Conversión** | Llamado a la acción (WhatsApp / delivery / tienda). | DEV-25 |

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
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run frames -- <video> [--out carpeta]` | Convierte un video master en las secuencias WebP desktop/mobile (requiere ffmpeg) |

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
