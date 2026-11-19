# web-3d-agency — Landing hiperrealista de la hamburguesa

Landing inmersiva (Next.js 16 · React 19 · R3F v9 · GSAP + Lenis · Tailwind v4) construida con la metodología de
`Manuales/MANUAL_V2_WEB_HIPERREALISTA.md` y gestionada con el tablero de `Manuales/FLUJO_TRELLO_WEB_HIPERREALISTA.md`.

## La experiencia (qué ve el usuario al hacer scroll)

| # | Sección | Qué pasa | Componente / tarjeta |
| :-: | :--- | :--- | :--- |
| 1 | **Hero** | Titular y propuesta de valor sobre el fondo fluido (shader). El `<h1>` es el LCP. | `src/app/page.tsx` · DEV-18 |
| 2 | **Secuencia de la hamburguesa** | La sección se fija (pin) y el scroll controla el video, frame a frame: la hamburguesa se separa capa por capa. En ciertos tramos aparece la ficha de cada ingrediente. | `ImageSequenceCanvas` (DEV-09) + `IngredientCallouts` (DEV-19) |
| 3 | **Packaging** | Al terminar la secuencia entra el packaging en 3D (gira con el scroll y el mouse) junto a la ficha técnica. | `HeroArtifactMesh` (DEV-11) + `PackagingSection` (DEV-19) |
| 4 | **Conversión** | Llamado a la acción (WhatsApp / delivery / tienda). | DEV-25 |

Mientras faltan los archivos, **todo funciona con fallbacks procedurales** (anillos que se separan en lugar del video,
una caja genérica en lugar del packaging). No hay errores: solo 404 esperados en la consola.

## Puesta en marcha

```bash
git lfs install          # una sola vez por equipo
npm install              # el postinstall copia Draco/Basis/benchmarks a /public
npm run dev              # http://localhost:3000
```

| Script | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run frames -- <video>` | Convierte el video master en las secuencias WebP desktop/mobile (requiere ffmpeg) |

---

## 📦 ARCHIVOS QUE NECESITAMOS

> Los nombres y rutas son **fijos** (contrato de `CLAUDE.md` §2). Si un archivo cambia después del primer deploy,
> va con nombre o carpeta nueva (la caché es `immutable`). **Cada archivo se registra en `LICENCIAS.md`.**

### A. Del cliente (branding y contenido)

| # | Qué | Formato | Dónde se usa | Prioridad |
| :-: | :--- | :--- | :--- | :-: |
| A1 | **Logo** (versión horizontal + isotipo, en positivo y negativo) | SVG | Header, favicon, OG image | P0 |
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
| B1 | **Video master de la hamburguesa separándose** | (no va a `/public`; se convierte con `npm run frames`) | Ver especificación abajo | ART-08/09 | P0 |
| B2 | Frames desktop | `public/sequences/hero_explode/desktop/frame_0001.webp … frame_0120.webp` | 1600 px de ancho · generados por el script | ART-10 | P0 |
| B3 | Frames mobile | `public/sequences/hero_explode/mobile/frame_0001.webp … frame_0120.webp` | 800 px · **mismo número de frames** que desktop | ART-10 | P0 |
| B4 | **Modelo 3D del packaging** | `public/models/hero_artifact.glb` | Ver especificación abajo | ART-13 / DEV-03 | P0 |
| B5 | Póster de fallback (equipos sin WebGL / gama baja) | `public/fallback/hero_poster.webp` | 1600 px, la hamburguesa armada o el packaging | ART-12 | P1 |
| B6 | Imagen para compartir en redes (OG) | `public/og-image.jpg` | 1200 × 630 px, < 300 KB | ART-12 | P1 |
| B7 | HDRI de estudio (reflejos del packaging) | `public/hdri/studio_dark_01.hdr` | < 1 MB, luz coherente con el video | ART-14 | P2 |
| B8 | Sonido ambiente (opcional) | `public/audio/ambient_drone.webm` + `.m4a` | Loop sin cortes, < 400 KB | ART-15 | P2 |
| B9 | Sonido de hover (opcional) | `public/audio/ui_hover_tick.webm` + `.m4a` | < 80 ms | ART-15 | P2 |

#### B1 · Especificación del video de la hamburguesa (lo más importante)

- **Resolución:** mínimo 1920 × 1080 (ideal 4K para recortar). Formato MP4 (H.264 alta calidad) o MOV ProRes.
- **Duración:** 5 a 6 s. El script lo convierte a **120 frames** (cambiable con `--frames`).
- **Cámara fija**, sin cortes ni cambios de lente: el scroll avanza y retrocede, así que debe verse bien en reversa.
- **Fondo liso oscuro** (ideal `#0A0A0A` o el color de fondo de la marca) para que se funda con la página.
- **Hamburguesa centrada** dejando ~30 % libre a cada lado: ahí aparecen las fichas de ingredientes. En móvil
  (vertical) el video se recorta a los lados, así que nada importante fuera del 40 % central del ancho.
- **Arco:** 0-10 % hamburguesa armada y quieta → las capas se separan verticalmente → último 10 % todas las capas
  separadas y quietas (ahí termina la secuencia y entra el packaging).
- **Orden de separación** = orden de las fichas en `src/content/producto.ts`. Pasar los **segundos aproximados** en que
  cada ingrediente queda bien visible: con eso se ajusta el `rango` de cada ficha.
- Iluminación coherente con el packaging (misma temperatura de color) para que el paso de una sección a otra sea continuo.

Conversión:

```bash
winget install Gyan.FFmpeg                                   # una sola vez (Windows)
npm run frames -- ruta/al/hamburguesa_master.mp4             # 120 frames por defecto
npm run frames -- ruta/al/hamburguesa_master.mp4 --frames 144
```

Si el número de frames cambia, actualizar `totalFrames` en `src/config/gpu-policy.ts`.
**Budget orientativo:** ≤ 25 MB la secuencia desktop y ≤ 8 MB la mobile (ajustar `--quality`).

#### B4 · Especificación del modelo 3D del packaging

- `.glb` único, **≤ 3 MB** después de compresión (Draco o Meshopt; texturas KTX2 ≤ 2048 px). DEV-03 hace la compresión.
- Origen en el centro de la caja, escala ~2 unidades de ancho, eje Y hacia arriba, sin luces ni cámaras en el archivo.
- Materiales PBR (base color, roughness, normal); el arte del packaging (logo, gráfica) va en la textura.
- Si no hay modelo 3D, alternativas: (a) fotos del packaging en 6 vistas para modelarlo, o (b) un render/foto de alta
  calidad y se reemplaza la escena 3D por una imagen.

### C. Ya resuelto en el repo (no hace falta entregar)

`public/draco/`, `public/basis/` y `public/benchmarks/` se generan solos en `npm install`.

---

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
| :--- | :--- |
| Textos, ingredientes, specs del packaging, CTA | `src/content/producto.ts` |
| En qué parte del scroll aparece cada ingrediente | `rango` y `ancla` de cada ingrediente en `src/content/producto.ts` |
| Colores y fuentes | `src/app/globals.css` (`@theme`) · DEV-08 |
| Rutas de los assets y número de frames | `src/config/gpu-policy.ts` (`ASSET_MANIFEST`) |
| Duración del scroll de la secuencia | `scrollDistance` en `src/app/page.tsx` |

## Ramas (ver guía de gobernanza)

`main` (producción) ← PR ← `develop` (integración) ← PR ← `feat/<id-trello>-<tarea>` · `fix/<bug>` · `assets/<tipo>`.
Nadie hace push directo a `main` ni a `develop`. Cada PR indica la tarjeta de Trello (`DEV-XX`) que resuelve.
Los assets entran por ramas `assets/<tipo>` (p. ej. `assets/secuencia-hamburguesa`) con Git LFS.

## Documentos clave

- `CLAUDE.md` — especificación de código (Parte II del Manual v2) para humanos y agentes.
- `LICENCIAS.md` — registro obligatorio de licencias.
- `Manuales/` — manual técnico, flujo Trello (estado actual en §0) y gobernanza Git/GitHub.
