# FLUJO DE TRABAJO EN TRELLO — PRODUCCIÓN DE WEB HIPERREALISTA
## Tablero operativo del estudio (equipo de 2 a 4 personas)

**Versión:** 1.0 · **Fecha:** 19-11-2026 · **Documento técnico de referencia:** `MANUAL_V2_WEB_HIPERREALISTA.md` (se cita como **M§**, p. ej. *M Fase 2 Paso 5*)
**Alcance de referencia:** landing inmersiva de 4-6 secciones con un Hero 3D, una secuencia cinematográfica IA y una sección de conversión. **Duración:** 8 semanas.

> **Directiva de Dirección:** este tablero es la única fuente de verdad del proyecto. Si algo no está en una tarjeta, no existe; si una tarjeta no tiene criterio de aceptación, no puede pasar a *Done*. **Ninguna tarjeta salta un Gate.**

---

## 0. ESTADO ACTUAL DEL TABLERO (registro vivo)

> **Obligatorio:** cada rama que empieza, avanza o cierra una tarjeta actualiza esta sección **en la misma rama/PR** (ver Guía de gobernanza GitHub §4). Si no está aquí, el equipo no sabe que existe.
> **Última actualización:** 22-11-2026 (BUG-01: enlace directo a una sección; DEV-26: informe de memoria (5/5); DEV-29: contraste y Lighthouse accesibilidad 100; DEV-24: cursor personalizado; DEV-25: formulario de contacto y footer; DEV-30: SEO técnico; DEV-18: titular cinético; DEV-17: cabecera fija con CTA; verificación de criterios: DEV-09 → Hecho, 9 criterios marcados; DEV-40: historia continua y aparición de las fichas; DEV-39: fluidez de los videos; DEV-38: refactor modular, nueva estructura en §0.5; verificación de `main` `2d442b7` contra los criterios de Trello; PR #17 integrado) · **Sprint:** 1 · **Actualizado por:** DEV (Claude Code, cuenta GitHub `Gomezinho`)

### 0.1 Tarjetas activas

> **Todo el trabajo está fusionado en `main`** (PR #3 a #17, último merge `2d442b7`). Las tarjetas de abajo tienen el código o los assets en `main`, pero su checklist de criterios aún no está completo, así que siguen en revisión.

| Tarjeta | Estado (lista) | Responsable | Rama | PR / base | Falta para cerrar |
| :--- | :--- | :-: | :--- | :--- | :--- |
| DEV-04 · Repo, Next.js 16 y CLAUDE.md | 🔍 Revisión Interna / QA | Rafael | fusionada en `main` | — | Conectar Vercel (Preview URL) con Git LFS activado |
| DEV-06 · SmoothScrollProvider + detect-gpu | 🔍 Revisión Interna / QA | Javier verifica | fusionada en `main` | — | ✅ Tier y bajada de tier comprobados en navegador (21-11). Falta: fluidez con la pestaña visible en desktop y en un móvil real |
| DEV-08 · Tokens de diseño y fuentes (marca Kuvaro's) | 🔍 Revisión Interna / QA | Rafael | fusionada en `main` (PR #16) | — | ⏳ Fuente primaria real (ART-04); hoy Bree Serif provisional |
| DEV-10 · Shader de fondo (fluido) | 🔍 Revisión Interna / QA | Javier verifica | fusionada en `main` | — | Probar en Android de gama media (artefactos de precisión) |
| DEV-19 · Contenido real de la marca (Kuvaro's) | 🔍 Revisión Interna / QA | Rafael | fusionada en `main` (PR #13) | — | ⏳ DIR-05: el cliente debe validar el copy y la ficha del packaging (criterio desmarcado el 21-11: aún no está validado); responsive según ART-05; Lighthouse |
| ART-10 · Export WebP desktop/mobile (video de marca) | 🔍 Revisión Interna / QA | Rafael | fusionada en `main` (PR #15) | — | ⏳ Master del cliente ≥ 1600 px (hoy 1292 px) |
| ART-12 · Pósters de fallback, OG y fotos de marca | 🔍 Revisión Interna / QA | Rafael | fusionada en `main` (PR #14) | — | Póster de `packaging_reveal` (y usar `heroPoster` en algún componente); budget de DEV-01; ⏳ cesión de derechos de las fotos (DIR-03) |
| DOCS · Sincronización + criterios de aceptación + reparto | 🔍 Revisión Interna / QA | Javier (fusiona Rafael) | `docs/criterios-aceptacion` (incluye `docs/sync-estado-repo-y-limpieza`) | PR → `develop` tras sincronizarla (o → `main`, como #3-#16, si Rafael lo prefiere antes) | Revisión y merge de Rafael |
| DEV-38 · Refactor: arquitectura modular, componentes reutilizables y configuración centralizada | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `chore/dev-38-refactor-modular` (apilada sobre `docs/criterios-aceptacion`) | PR → `docs/criterios-aceptacion` (o a `main` cuando esta se fusione) | Revisión y aprobación de Rafael |
| DEV-39 · Fluidez y calidad visual de los videos (hamburguesa y bolsa) | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-39-fluidez-secuencias` (apilada sobre `chore/dev-38-refactor-modular`) | PR → `chore/dev-38-refactor-modular` (o a `main` cuando se fusionen las anteriores) | Prueba a FPS reales con la pestaña visible y en un móvil real; revisión de Rafael |
| DEV-40 · Historia continua: hamburguesa → bolsa y aparición de las fichas | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-40-historia-continua` (apilada sobre `feat/dev-39-fluidez-secuencias`) | PR → `feat/dev-39-fluidez-secuencias` (o a `main` cuando se fusionen las anteriores) | Probarlo en un móvil real (táctil) y con la animación de Windows activada; revisión de Rafael |
| DEV-17 · Navbar + CTA persistente | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-17-navbar-cta` (apilada sobre `docs/verificacion-criterios-21-11`) | PR → `docs/verificacion-criterios-21-11` (o a `main` cuando se fusionen las anteriores) | Criterios 4/4. Falta la revisión de Rafael (toca 3 líneas de archivos suyos: `globals.css`, `StoryProgress`, `layout.tsx`) |
| DEV-18 · Hero UI (tipografía cinética) | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-18-hero-titular` (apilada sobre `feat/dev-17-navbar-cta`) | PR → `feat/dev-17-navbar-cta` (o a `main` cuando se fusionen las anteriores) | Criterios 4/4. Falta la revisión de Rafael (registra SplitText y CustomEase en `lib/gsap.ts` y añade `HERO_TITLE` a `config/motion.ts`) |
| DEV-30 · SEO técnico | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-30-seo-tecnico` (apilada sobre `feat/dev-18-hero-titular`) | PR → `feat/dev-18-hero-titular` (o a `main` cuando se fusionen las anteriores) | Criterios 4/4. Falta: revisión de Rafael; con el dominio oficial (DEV-34) solo hay que definir `NEXT_PUBLIC_SITE_URL`; ⏳ DIR-01: teléfono y rango de precios (campos opcionales del JSON-LD) |
| DEV-25 · Footer + formulario de contacto | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-25-footer-formulario` (apilada sobre `feat/dev-30-seo-tecnico`) | PR → `feat/dev-30-seo-tecnico` (o a `main` cuando se fusionen las anteriores) | Criterios 3/5. ⏳ **Rafael:** elegir el servicio de envío (email/WhatsApp), cargar su clave en Vercel y agregar el caso en `lib/contact/delivery.ts`; ⏳ **cliente (DIR-01):** email o WhatsApp que recibe los mensajes; ⏳ **DIR-08:** textos legales para los enlaces del footer |
| DEV-24 · Cursor personalizado | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-24-cursor` (apilada sobre `feat/dev-25-footer-formulario`) | PR → `feat/dev-25-footer-formulario` (o a `main` cuando se fusionen las anteriores) | Criterios 4/4. Falta la revisión de Rafael (añade `CUSTOM_CURSOR` a `config/motion.ts`) |
| DEV-29 · Accesibilidad WCAG 2.2 AA | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `feat/dev-29-accesibilidad` (apilada sobre `feat/dev-24-cursor`) | PR → `feat/dev-24-cursor` (o a `main` cuando se fusionen las anteriores) | Criterios 4/5. ⏳ Repetir con el diseño definitivo antes de G6 (ART-04/ART-05). Revisión de Rafael: toca `GlassPanel` (compartido), `StoryProgress` e `IngredientCallouts` |
| DEV-26 · Auditoría VRAM y fugas | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `docs/dev-26-informe-memoria` (apilada sobre `feat/dev-29-accesibilidad`) | PR → `feat/dev-29-accesibilidad` (o a `main` cuando se fusionen las anteriores) | Criterios 5/5. Falta que otra persona lo verifique (fusión del PR) |
| BUG-01 · Un enlace directo a /#contacto cae en mitad del video | 🔍 Revisión Interna / QA | Javier (revisa Rafael) | `fix/bug-01-ancla-directa` (apilada sobre `docs/dev-26-informe-memoria`) | PR → `docs/dev-26-informe-memoria` (o a `main` cuando se fusionen las anteriores) | Criterios 3/3. Falta la revisión de Rafael (toca `SmoothScrollProvider` y `config/motion.ts`) |

### 0.2 Bitácora de trabajo realizado

> Cada tarjeta se anota aquí al hacer commit. La columna *Estado* pasa a ✅ Hecho cuando su PR se fusiona en `develop`.

| Fecha | Tarjeta | Qué se hizo | Commit / rama | Estado |
| :--- | :--- | :--- | :--- | :-: |
| 19-11-2026 | DEV-04 | Dependencias fijadas (three, R3F v9, drei, gsap, lenis, zustand, maath, detect-gpu, howler); `copy-decoders.mjs` en `postinstall`; `next.config.ts` con caché `immutable`; `CLAUDE.md` (Parte II del manual); contrato de carpetas `/public`; `LICENCIAS.md` plantilla; se eliminó el boilerplate; CI con typecheck | `75068d8` · `feat/dev-04-setup-base` | 🔍 PR abierto |
| 19-11-2026 | DEV-05 | `gpu-policy.ts` (políticas por tier + `ASSET_MANIFEST`), `math.ts` (`damp`, `clamp`, `mapRange`), `useExperienceStore.ts` | `47f5df7` · `feat/dev-05-gpu-policy-store` | 🔍 PR abierto |
| 19-11-2026 | DEV-06 | `SmoothScrollProvider`: Lenis (`autoRaf:false`) con `gsap.ticker`, sin Lenis con reduced motion, detect-gpu con benchmarks propios, puntero mutable, pausa con `visibilitychange`; montado en el layout | `07737d6` · `feat/dev-06-smooth-scroll` | 🔍 PR abierto |
| 19-11-2026 | DOCS | §0 de este archivo, regla de actualización obligatoria en la guía de GitHub y en `CLAUDE.md`, plantilla de PR | `9f7d539` · `docs/trello-registro-avance` | 🔍 PR abierto |
| 19-11-2026 | DEV-07 | `GlobalCanvas`: un solo `<Canvas>` fijo con `dpr` y `antialias` según la política, `frameloop` en pausa con la pestaña oculta, `PerformanceMonitor` (`flipflops={3}`, `onDecline` baja un tier, `onFallback` → Tier 1), no se monta sin WebGL, barrera de errores que retira el canvas si WebGL falla; carga diferida con `next/dynamic` (`ssr:false`) para proteger el LCP | `feat/dev-07-global-canvas` | 🔍 PR abierto |
| 19-11-2026 | DEV-09 | `ImageSequenceCanvas`: ventana deslizante de `ImageBitmap` (radio por tier), `close()` fuera de ventana, frame más cercano mientras decodifica, flush al cambiar de tier, fallback solo si falta el frame 1, `aria-label`, capa DOM pinneada para overlays y `sequenceProgress` transiente en el store; montada en la página | `feat/dev-09-image-sequence` | 🔍 PR abierto |
| 19-11-2026 | DEV-10 | `FluidBackgroundMaterial` (GLSL de three, hash sin `sin()`) + `BackgroundShaderQuad` con uniforms por `damp()`, lectura transiente del store y tiempo congelado con reduced motion; montado en `GlobalCanvas` | `feat/dev-10-fluid-shader` | 🔍 PR abierto |
| 19-11-2026 | DEV-11 | `HeroArtifactMesh` = packaging 3D: GLTF + Draco/Meshopt/KTX2, caja procedural sin `.glb`, dispose al desmontar, revelado por `packagingReveal` (store transiente) con `damp()`, pose fija con reduced motion. `LightingRig`: luces PBR + HDRI opcional (sin HDRI → solo luces) | `feat/dev-11-packaging-mesh` | 🔍 PR abierto |
| 19-11-2026 | DEV-10/11 | Fix: el import del material se eliminaba (solo se usaba como tipo) y R3F no encontraba `<fluidBackgroundMaterial>` → import con efecto. Ajuste de escala y tono del packaging procedural | `feat/dev-10-fluid-shader`, `feat/dev-11-packaging-mesh` | 🔍 PR abierto |
| 19-11-2026 | DEV-19 | Página de la hamburguesa: hero → secuencia pinneada con 6 callouts de ingredientes sincronizados por `sequenceProgress` (sin setState) → sección packaging con ficha técnica (`<dl>`) y revelado del modelo 3D por ScrollTrigger → CTA. Todo el texto en `src/content/producto.ts`. Probado en Chrome headless 1440×900 y 390×844: 2 canvas (WebGL + 2D), sin errores, solo 404 esperados de assets faltantes | `feat/dev-19-ingredientes-packaging` | 🔍 PR abierto |
| 19-11-2026 | DOCS | `README.md`: experiencia por secciones, **lista de archivos necesarios** (branding, contenido, video, frames, `.glb`, pósters, audio) con especificación del video de la hamburguesa y del modelo del packaging; `scripts/video-to-frames.mjs` (`npm run frames`) genera desktop 1600 px / mobile 800 px con el mismo conteo | `docs/readme-assets-hamburguesa` | 🔍 PR abierto |
| 19-11-2026 | DEV-37 | **Decisión del cliente: solo video hiperrealista, sin modelos 3D.** Se eliminan `HeroArtifactMesh`, `LightingRig` y `PackagingSection`; el packaging pasa a ser la secuencia `packaging_reveal` con `PackagingSpecs` (panel + specs que aparecen por tramos). `sequenceProgress` pasa a ser por id (varias secuencias). Fuera del manifiesto: `.glb`, HDRI, Draco/Basis (ya no se copian en `postinstall`). El GlobalCanvas queda solo con el shader de fondo | `feat/dev-37-packaging-video` | 🔍 PR abierto |
| 19-11-2026 | DEV-37 (fix) | Bug de DEV-04: el color `--color-base` chocaba con la utilidad `text-base` y pintaba textos del color del fondo (bajada del hero y ficha del packaging invisibles en desktop) → token renombrado a `surface`. `ImageSequenceCanvas` ya no pide frames antes de comprobar el frame 1 (de 20 a 2 peticiones 404 sin assets). Probado en Chrome headless 1440×900 y 390×844 | `feat/dev-37-packaging-video` | 🔍 PR abierto |
| 19-11-2026 | MERGE | PR #3 a #12 fusionados en **`main`** (no en `develop`): DEV-04…07, DEV-09, DEV-10, DEV-11 (retirada por DEV-37), DEV-19, DEV-37 y los 3 DOCS. Estado real: ✅ en `main`; DEV-05, DEV-07 y los DOCS pasan a Hecho, el resto queda en revisión (ver §0.1) | `ab344d8` · `main` | ✅ En `main` |
| 19-11-2026 | DOCS | Sincronización: §0 al estado real, README sin la mención a Draco/Basis, `.gitignore` explica las carpetas legado. Repo local vinculado a la cuenta del proyecto (Javier Gómez / `Gomezinho`) | `docs/sync-estado-repo-y-limpieza` | 🔍 PR abierto |
| 20-11-2026 | DOCS | **Criterios como checklist:** en Trello cada historia tiene el checklist «✔ Criterios de aceptación» (gates: «✔ Criterios de salida»), con los ítems ya cumplidos marcados; criterios breves o ambiguos reescritos como frases verificables (quién aprueba, dónde queda la evidencia, cómo se mide), sin cambiar el alcance. §5 usa el mismo checklist | `docs/criterios-aceptacion` | 🔍 PR abierto |
| 20-11-2026 | DOCS | **Criterios de aceptación:** todas las historias de §5 con línea *Como… quiero… para…* y criterios numerados y verificables (✅/⏳ en las ya implementadas, sin cambiar su funcionalidad). Completados los que faltaban (DEV-37, ART-11, GATE-G3, DIR-11, DEV-36, DIR-12); DEV-14/15 reescritas sobre el shader de fondo; peso por video; nuevo §3.7 con umbrales. Mismo texto en las tarjetas de Trello | `docs/criterios-aceptacion` | 🔍 PR abierto |
| 19-11-2026 | DOCS | Manual → **v2.1**: Fase 3 y `HeroArtifactMesh` marcados como opcionales, Anexo A #36-40 (import con efecto de `extend()`, sondeo antes de pedir frames, token `base` vs `text-base`, progreso por secuencia, script de frames) y **Anexo B** (decisiones del proyecto: 100 % video). Código de la Parte II corregido también en `CLAUDE.md`. Guía de GitHub: `git lfs track` con `*.webp`, `*.m4a`, `*.mp4`, `*.mov` | `docs/manuales-solo-video` | 🔍 PR abierto |
| 20-11-2026 | DEV-08 | Tokens de marca desde `Marca/manual_integral_de_especificaciones_kuvaro_s.md` §6.3-6.4: `@theme` con surface `#303030`, ink `#DDD1B7`, accent `#DDA730` (+ `surface-deep`, `muted`, `on-accent` derivados, contraste AA verificado); `src/config/brand.ts` para shader y canvas 2D; League Spartan (secundaria oficial) y Bree Serif (display provisional) con `next/font/google` autoalojadas; paneles y titulares con los tokens | `feat/dev-08-tokens-marca-kuvaros` | 🔍 PR abierto |
| 20-11-2026 | ART-10 | `video-to-frames.mjs`: `--start/--end` (un master → varias secuencias), `--frames native`, no agranda, quita el audio, informa el peso. Se exportó `Marca/Video.mp4` (1292 px, 24 fps): `hero_explode` 0-2.25 s → 54 frames; `packaging_reveal` 2.25-8.79 s → 157 frames; calidad 88; `totalFrames` actualizado en el manifiesto; README y `LICENCIAS.md` | `assets/art-10-frames-video-kuvaros` | 🔍 PR abierto |
| 20-11-2026 | ART-12 | Póster de fallback y OG 1200×630 desde el frame de 1.25 s del video; fotos de `Marca/` a WebP 1000 px **sin EXIF** (los originales tenían GPS); nueva carpeta `public/photos/` en el contrato (README, `CLAUDE.md`) y en la caché `immutable` de `next.config.ts`; `LICENCIAS.md` | `assets/art-12-poster-og-fotos` | 🔍 PR abierto |
| 20-11-2026 | DEV-19 | `src/content/producto.ts` con la marca real (voz del manual §7, PVU §3.2, packaging §8; sin cifras inventadas). 5 ingredientes = 5 capas del video (pan brioche, salsa de la casa, cheddar, doble smash, base) con `rango` y `ancla` ajustados a los 54 frames. `Wordmark` tipográfico, sección «Primer bocado» con las fotos (`next/image`), CTA a @Kuvaros_burger, metadatos + Open Graph. Ficha del packaging a la derecha en desktop; en pantallas verticales `ImageSequenceCanvas` muestra el 72 % central del master horizontal (antes recortaba la hamburguesa). Manual de marca versionado en `Manuales/MANUAL_MARCA_KUVAROS.md`; `/Marca/` fuera de Git. Probado en Chrome headless 1440×900 y 390×844: 0 errores, 0 404, 3 canvas (1 WebGL + 2 secuencias) | `feat/dev-19-contenido-marca-kuvaros` | 🔍 PR abierto |
| 20-11-2026 | MERGE | PR #13 a #16 fusionados en **`main`** (DEV-08, ART-10, ART-12, DEV-19). Verificado en `main` (`db88ce1`): `npm run lint`, `typecheck` y `build` sin errores. Quedan en revisión hasta completar su checklist (ver §0.1) | `db88ce1` · `main` | ✅ En `main` |
| 20-11-2026 | DOCS | **Reparto del equipo** (§0.5) entre Rafael (experiencia, contenido, assets, rendimiento y repo) y Javier (interfaz DOM, SEO y QA), con propiedad de archivos para trabajar en paralelo sin conflictos, reglas de convivencia y dependencias con quién las provee. En Trello: el responsable es el miembro asignado de cada tarjeta; tarjetas del sprint en «1er spring» agrupadas por persona; tarjeta «📌 Reparto del equipo» | `docs/criterios-aceptacion` | 🔍 PR abierto |
| 20-11-2026 | CHORE | Auditoría: se quitan 4 dependencias sin ningún import (`@react-three/postprocessing`, `postprocessing`, `maath`, `howler` + `@types/howler`; se reinstalan cuando se hagan DEV-15 o ART-15), 2 `.gitkeep` en carpetas con archivos, reglas LFS de `.glb/.hdr/.ktx2`, entradas de ignore de Draco/Basis y la sección de modelos 3D de `LICENCIAS.md` | `chore/limpieza-proyecto` | ✅ En `main` (PR #17) |
| 20-11-2026 | MERGE | PR #17 (CHORE, Rafael) fusionado en **`main`** (`2d442b7`) | `2d442b7` · `main` | ✅ En `main` |
| 21-11-2026 | QA | **Verificación de `main` `2d442b7` contra los criterios de Trello** (Javier, con Claude Code): `npm ci` + lint/typecheck/build OK; build de producción recorrido en el navegador: 0 errores, 0 404, 1 canvas WebGL + 2 de secuencia, callouts y specs por tramos, PerformanceMonitor T3→T2, ventana de ImageBitmaps medida = 2R+1, desktop y móvil emulado (375×812) sin overflow horizontal. **DEV-37 → Hecho.** Marcados: G4 (pesos, frames = manifiesto, fila en `LICENCIAS.md` por archivo), DIR-03 (fila por archivo), DEV-26 (0 `useState`; 2R+1 medido). **Desmarcados** por no cumplirse: DEV-19 «copy real del cliente» (pendiente DIR-05) y ART-12 «budget de DEV-01» (budget sin definir). Texto de DEV-19 corregido (5 ingredientes, no 6). §5 sincronizado con Trello. DEV-15/16: avisado que el PR #17 quitó sus dependencias | `docs/criterios-aceptacion` | 🔍 PR abierto |
| 21-11-2026 | DEV-38 | **Refactor sin cambios de comportamiento.** Configuración centralizada en `src/config` (`motion`: Lenis, damping, scrub y tramos de aparición; `sequences`: videos de la página, convención de frames y encuadre; `scene`: cámara y PerformanceMonitor; `site`: URL, idioma y anclas) y capas z en `globals.css` (`stack-*`). Componentes reutilizables: `ui/` (`CtaLink`, `Eyebrow`, `GlassPanel`), `layout/` (`SiteHeader`, `SkipLink`), `sections/` (una por sección) y `sequence/SequenceSection`; `page.tsx` solo compone. `ImageSequenceCanvas` dividido en `lib/sequence` (`FrameCache`, `draw`, `frames`); overlays con `hooks/useSequenceProgress` y `lib/reveal`; `lib/gsap` registra ScrollTrigger una vez; `tierFromGPU()` en `gpu-policy`; metadatos en `lib/seo`, fuentes en `app/fonts.ts`; URL de Instagram y textos de accesibilidad en `producto.ts`. **41 tests unitarios** (Vitest 3.2.7, `npm test`, también en CI). Verificado: lint/typecheck/test/build OK; huella del HTML del servidor idéntica salvo `z-[n]`→`stack-*` y el hash de la fuente; en navegador: callouts y specs por tramos, ventana de frames = 2R+1, móvil, fallback sin video (1 solo HEAD 404) | `chore/dev-38-refactor-modular` | 🔍 PR abierto |
| 21-11-2026 | DEV-39 | **Fluidez de los videos.** Diagnóstico: el canvas solo dibujaba frames enteros (54 frames en 3200 px → la imagen cambiaba cada ~60 px: efecto stop-motion) y escalaba con la calidad por defecto. Cambios: **mezcla de frames** (`framePosition()` + `drawFrame(ctx, img, alpha)`: entre dos frames se funden los dos según la posición exacta), escalado `imageSmoothingQuality: "high"`, `scrub` 0.35 → 0.6, **entrada de cada video** al aparecer (opacidad 0 → 1 y escala 1.08 → 1 ligadas al scroll, solo opacidad/transform; desactivada con reduced motion), `prefersReducedMotion()` compartido. Medido en navegador (diferencia media de píxeles entre pasos de scroll): hamburguesa de `4.4, 0, 0, 0, 4.4…` a ~1.1 constante (salto máximo −73 %); bolsa de `0, 0.5, 0, 0…` a ~0.2 (−53 %). 49 tests; lint/typecheck/build OK; callouts sincronizados; ventana 2R+1 intacta | `feat/dev-39-fluidez-secuencias` | 🔍 PR abierto |
| 21-11-2026 | DEV-40 | **Historia continua y fichas.** Probado con la rueda real (165 FPS, pestaña visible) antes y después. Antes: las fichas pasaban de opacidad 0 a 1 en **un frame**, dos secciones fijadas con un corte entre la hamburguesa y la bolsa, ~8000 px de scroll con tramos de video quieto, y fichas que podían quedar a medio fundir donde el usuario paraba. Cambios: **una sola sección** (`ProductStorySection`) con los dos clips unidos (el último frame de la hamburguesa y el primero de la bolsa coinciden) y el scroll repartido por **beats** (`createTimeline`): 7.25 alturas de pantalla, altura de página 10142 → 8073 px. **Fichas:** el scroll decide cuál está activa y el fundido es en el tiempo (`DampedValues`, ~0.25 s) con exclusión mutua (`exclusiveTargets`: la siguiente espera a que la anterior se vaya) y entrada/salida según el sentido del scroll. Ficha del packaging con filas en cascada (`cascadeTargets`) y salida en el beat final (plano de la bolsa con el logo solo). Títulos de capítulo + barra de progreso (`StoryProgress`). Diseño: degradado hero → video (sin línea de corte), encuadre vertical 72 % → 66 % centrado sobre las fichas, ficha del packaging compacta en móvil (descripción y nota en `sr-only`). Medido (rueda real, modo reducido y completo): cambio máximo de opacidad por frame **1.0 → 0.06**, **0** frames con dos fichas o dos títulos visibles, **0** reposos con un overlay a medio fundir (12/12), las 5 fichas llegan al 100 %. 66 tests; lint/typecheck/build OK | `feat/dev-40-historia-continua` | 🔍 PR abierto |
| 21-11-2026 | QA | **Segunda verificación contra los criterios de Trello** (Javier, con Claude Code) sobre el código actual (`main` `2d442b7` + DEV-38/39/40), con el build de producción local y la pestaña visible. **DEV-09 → Hecho** (5/5): recorrido de los 211 frames reales en 240 pasos, 0 pasos en blanco, 0 sin avance, sin saltos aislados. Marcados: DEV-12 (scroll de principio a fin sin blancos ni saltos), DEV-26 (heap 8,2 → 8,6 MB tras 10 recorridos, +4,9 %; ScrollTriggers y listeners se limpian, comprobado con StrictMode), DEV-27 (reduced motion sin Lenis, shader quieto, scroll nativo; consola sin errores), DEV-29 (orden de Tab y foco visible; `aria-label` en el canvas y `aria-hidden` en WebGL), DEV-30 (todo el texto en el HTML). **No cumplidos y con hallazgo:** DEV-29 contraste (el texto `muted` del hero baja a ~3,2:1 sobre las vetas mostaza del shader) y DEV-30 metadata (título de 70 caracteres; canónica y `og:image` a `localhost` sin `NEXT_PUBLIC_SITE_URL`; sin sitemap, robots ni JSON-LD). Evidencia en el comentario de cada tarjeta | `docs/verificacion-criterios-21-11` | 🔍 PR abierto |
| 21-11-2026 | DEV-17 | **Cabecera fija con el CTA.** `SiteHeader` sale del hero y se monta en `layout.tsx` (antes de `<main>`), con `position: fixed` y la nueva capa `stack-nav` (z-index 50, por encima de las secuencias fijadas). Solo `StickyHeader` es de cliente: marca `data-scrolled` al bajar 24 px (atributo del DOM, sin setState) y entonces gana un fondo de vidrio. Altura en un token (`--spacing-nav` → `h-nav`, `pt-nav`); el hero y los títulos de capítulo (`StoryProgress`) le dejan su sitio. El logo va sin «Smash Burguers» (11 px muted no llega a 4.5:1 sobre el video). **Bug corregido:** el logo (`<Link href="/">`) no volvía arriba en la misma página → ancla `#inicio`. Textos nuevos en `src/content/sitio.ts`. Verificado en el navegador: el CTA queda encima en 25 posiciones de scroll; 0 fichas visibles bajo la cabecera en 1440, 768 y 360 px (la más alta empieza en 84 px; la cabecera termina en 72); sin scroll horizontal en 360; CTA → `#contacto` → «Pedir por Instagram» = 2 clics, también con Lenis; Tab: saltar → logo → CTA con foco visible. lint/typecheck/test/build OK | `feat/dev-17-navbar-cta` | 🔍 PR abierto |
| 21-11-2026 | DEV-18 | **Titular cinético.** `HeroTitle` (cliente) recibe el texto del `<h1>`, que sigue en el HTML del servidor. En el navegador, SplitText lo divide en líneas (con máscara) y letras, y las letras suben desde debajo de su línea con `cubic-bezier(0.16,1,0.3,1)` (CustomEase; parámetros en `HERO_TITLE` de `config/motion.ts`); al terminar se deshace la división y el DOM vuelve a ser el del servidor. Antes de que corra JS el titular espera oculto (así no aparece, desaparece y vuelve a entrar) con una salvaguarda CSS que lo muestra a los 2.5 s si el JS no llega; con `prefers-reduced-motion` no se oculta ni se anima. `autoSplit` vuelve a dividir si cambia el ancho o termina de cargar la fuente. **Hallazgo:** los CSS modules no funcionan en este repo (la regla `*.css` de `turbopack.rules` les quita el hash): se usa una hoja global con selector `[data-hero-title]`. Verificado: SplitText divide a los ~0.4 s (24 letras, 2 líneas, `aria-label` mientras dura) y revierte a los ~2.1 s; Lighthouse móvil ×3: el `<h1>` es el elemento LCP, LCP 0.9 s, CLS 0, rendimiento 100 (línea base antes de DEV-17: 93); con throttling real de DevTools LCP 1.7 s; con reduced motion nunca se divide ni se oculta. lint/typecheck/test/build OK | `feat/dev-18-hero-titular` | 🔍 PR abierto |
| 21-11-2026 | DEV-30 | **SEO técnico.** URL pública con `resolveSiteUrl()` (`config/site.ts`): `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → localhost (en Vercel la canónica y el OG ya no apuntan a localhost aunque falte el dominio). Título de 70 → 58 caracteres (descripción: 154). `lib/seo.ts`: metadatos con `og:url` y tarjeta de Twitter, JSON-LD `Restaurant` (solo delivery: `acceptsReservations: false`, ciudad, región y país, zona de entrega, Instagram) + `WebSite`, serializado escapando `<`, y `sitemap.ts`/`robots.ts` (allow `/`, disallow `/api/`). Datos del negocio en `content/sitio.ts`, sin inventar dirección, teléfono ni horario. 8 tests nuevos (74 en total; el del escape de `<` atrapó un error real antes del commit). Verificado: `/robots.txt` y `/sitemap.xml` servidos y válidos; build con `VERCEL_URL` simulado → canónica, `og:url`, `og:image` y sitemap con esa URL; **Rich Results Test de Google: 2 elementos válidos (negocio local y organización), 0 errores** (solo faltan los opcionales `telephone` y `priceRange`); Lighthouse SEO 100. README: variables de entorno y nota de CSS modules | `feat/dev-30-seo-tecnico` | 🔍 PR abierto |
| 21-11-2026 | DEV-25 | **Formulario de contacto y footer.** Validación única en `lib/contact/validation.ts`, la misma en el navegador y en el servidor, con un mensaje por campo (textos en `content/sitio.ts`). `POST /api/contacto`: mismo origen, tamaño máximo, límite de 3 envíos por IP cada 10 min (`rateLimit.ts`, 429 + `Retry-After`), validación (422 con el error de cada campo) y campo trampa antispam. `ContactForm` (cliente): `aria-invalid` + `aria-describedby`, foco al primer campo con error (después de pintar el mensaje), región `aria-live` con el resumen y el resultado, revalidación al salir de cada campo, botón con el estilo del CTA (`ctaClassName`, sin duplicar). Envío por `lib/contact/delivery.ts`: en desarrollo simulado; en producción el formulario **solo se muestra si hay servicio** (si no, queda el CTA a Instagram, sin un formulario que falle); `CONTACTO_ENVIO=simulado` para probar una Preview. `SiteFooter` en `layout.tsx`: marca, «cocina cerrada · solo delivery · Zona Cercado», Instagram; enlaces legales cuando existan (DIR-08). 17 tests nuevos (91 en total, incluido el route handler de punta a punta). Verificado en el navegador: envío vacío → 3 errores, foco en Nombre y anuncio «Revisa 3 campos…»; email incompleto → foco en Email; envío válido → `POST 200` y log del envío simulado; 4.º envío seguido → mensaje de límite (429); `fetch` directo con datos inválidos → 422 con el error de cada campo; build de producción sin servicio → 0 `<form>`, con `simulado` → 1; Lighthouse accesibilidad 99 | `feat/dev-25-footer-formulario` | 🔍 PR abierto |
| 21-11-2026 | DEV-24 | **Cursor personalizado.** `CustomCursor` (montado en `layout.tsx`): punto mostaza que sigue al puntero y anillo que lo alcanza con `damp()`; crece sobre enlaces y botones y se encoge al hacer clic. Solo con `(hover: hover) and (pointer: fine)` y sin `prefers-reduced-motion` (se reevalúa si cambia el dispositivo de entrada); con toque en un equipo híbrido se oculta. La posición se lee de `pointerNDC` del store transiente en `gsap.ticker`, y el estado va en data-atributos: 0 `useState`/`setState`. En campos de texto se ve el cursor del sistema y el personalizado se oculta. Parámetros en `CUSTOM_CURSOR` (`config/motion.ts`); estilos en una hoja global con selectores de atributo. Verificado en el navegador (modo completo forzado solo en local y revertido): `cursor: none` en el body, el punto en la posición exacta del puntero y el anillo convergiendo (863 → 940 → 956 → 959 px hacia 960); sobre «Pedir ahora» estado `link` y escala 1.6; sobre el campo Nombre estado `text`, opacidad 0 y `cursor: auto`; en móvil emulado (táctil, `pointer: coarse`) y con reduced motion no se activa (`cursor: auto`). Lighthouse sin cambios (100/99/100/100) | `feat/dev-24-cursor` | 🔍 PR abierto |
| 21-11-2026 | DEV-29 | **Contraste y orden de encabezados.** Cálculo exacto del peor fondo del shader (23 % de mostaza, `#584B30`): la bajada del hero estaba a 3.16:1 y el antetítulo a 3.90:1 → velo `surface/95` desenfocado detrás del texto (4.71 y 5.69) e indicación de scroll en `ink`. Texto sobre el video medido con los píxeles reales (`Manuales/qa/scripts/contraste-video.cjs`, Chrome headless, 100 pasos por ancho): antes 6 fallos en 1440 y 6 en 768 (títulos de capítulo 1.01:1 sobre la bolsa blanca; etiquetas del packaging 2.98:1) → `GlassPanel` 75 % → 92 % y títulos de capítulo en una píldora oscura propia; después **0 fallos en 1440, 768 y 375** (31 textos; peor caso 4.78). `<h2>` solo para lectores de pantalla antes de las fichas (`heading-order`). **Lighthouse accesibilidad 98 → 100** (móvil y escritorio). Informe: `Manuales/qa/DEV-29-accesibilidad.md`. El rendimiento de esas corridas (73-80) no es comparable: el índice de CPU de Lighthouse bajó de ~4400 a ~1580 por otras aplicaciones abiertas en el equipo | `feat/dev-29-accesibilidad` | 🔍 PR abierto |
| 21-11-2026 | DEV-26 | **Informe de memoria** (`Manuales/qa/DEV-26-memoria.md`, gráfica `DEV-26-heap.svg`, script `Manuales/qa/scripts/memoria.cjs`): 10 recorridos completos con la rueda real en Chrome headless (Lenis activo), GC forzado tras cada uno. Heap JS: 1440×900 5.99 → 6.44 MB (**+7.6 %**), 375×812 6.10 → 6.46 MB (**+5.9 %**), ambos estables desde el recorrido 5-6 (< 0.05 MB entre los últimos cinco). Texturas de las secuencias (ImageBitmap instrumentado): máximo **17 = 2R+1** (T1 en headless) y 23.4 MB (< 32 MB de `maxSequenceVRAM_MB` de T1); creados − cerrados = vivos en todo momento (3605/3596 y 4016/4007). Búfer de los 2 canvas sin cambios (10.4 MB y 2.4 MB). Repaso de limpieza de los componentes nuevos (`StickyHeader`, `HeroTitle`, `CustomCursor`). **DEV-26 5/5** | `docs/dev-26-informe-memoria` | 🔍 PR abierto |
| 22-11-2026 | BUG-01 | **Enlace directo a una sección** (`/#contacto`): tras cada `ScrollTrigger.refresh()` se vuelve a llevar el scroll a la sección del hash (hasta que el usuario interactúa o pasan 1.5 s desde la carga). Dos causas: el pin de la historia se crea después del salto nativo del navegador, y Lenis recortaba el destino a su alto viejo (faltaba `lenis.resize()`). Destino calculado con el scroll real (`lib/hashTarget.ts`, 5 tests). Probado en Chrome headless con build de producción: `/#contacto` → contacto a 72 px (bajo la cabecera) con Lenis, con reduced motion, con CPU ×4 y en 375 px; `/#inicio` → 0; CTA y logo siguen igual; tras el enlace el usuario se desplaza libremente | `fix/bug-01-ancla-directa` | 🔍 PR pendiente |

### 0.3 Bloqueos y dependencias abiertas

- **G1 / G2 sin aprobar:** DIR-01…05 y ART-01…05 siguen en Backlog. DEV avanzó en paralelo con la base técnica, que no depende del arte (ruta crítica, §6). La paleta y las fuentes reales entran en DEV-08, después de ART-03 y ART-04.
- **Vercel:** las Preview URLs aún no están conectadas (pendiente de DEV-04).
- **DIR-03:** `LICENCIAS.md` creado como plantilla; falta completarlo.
- **⏳ Esperando cliente (actualizado 20-11-2026):** ✅ recibidos manual de marca, video y 2 fotos (`Marca/`). Faltan: **logo vectorial** (SVG) y **nombre + archivo de la fuente primaria** (ART-04); **número de WhatsApp** o canal de pedido (DIR-01); validación del copy y de la ficha del packaging (DIR-05); **cesión de derechos** del video y las fotos (DIR-03); **video master ≥ 1600 px** (ideal: una versión vertical para móvil).
- **Assets (actualizado 20-11-2026):** el cliente entregó un video master que se cortó en las dos secuencias (ART-10, en `main`); ART-08/09 (generación IA) quedan cubiertos por ese master salvo que DIR pida otro video. Póster y OG listos (ART-12). Falta: master ≥ 1600 px y póster de `packaging_reveal`. Lista completa en el `README.md`.
- **Alcance reducido (cliente, 19-11-2026):** ART-13, ART-14, DEV-03 y DEV-11 descartadas (sin 3D). ART-08/09/10 cubren ahora los dos videos.
- ~~**BUG-01**~~ **corregido el 22-11-2026** en `fix/bug-01-ancla-directa` (3/3 criterios; falta la revisión de Rafael, dueño de `SmoothScrollProvider`).
- **`develop` desincronizada:** sigue en `f9fd483` porque los PR se fusionaron en `main`. **Desbloquea:** RafaSolis1280 abre y fusiona un PR `main` → `develop`. Desde ahí, los PR de trabajo van **solo a `develop`** (Guía de gobernanza §1).
- **Ramas remotas ya fusionadas:** las 13 ramas de trabajo están 100 % en `main`. **Desbloquea:** RafaSolis1280 puede borrarlas desde GitHub (botón *Delete branch* de cada PR), o activar *Automatically delete head branches* en Settings.
- **Vercel sin conectar:** no hay Preview URLs por PR (bloquea el cierre de DEV-04, las pruebas en móviles reales y G5). **Desbloquea:** RafaSolis1280.

### 0.4 Tablero de Trello en línea

Tablero **"Kuvaros web"** (https://trello.com/b/1HQyExTM), cargado el 20-11-2026 desde §5 de este archivo: 74 tarjetas abiertas, sin duplicados. Las descartadas (DEV-03, DEV-11, ART-13, ART-14) están archivadas. Equivalencia de listas:

| Lista en Trello | Equivale a (§2.1) | Contenido hoy |
| :--- | :--- | :--- |
| spring backlog | 📥 Backlog | 📌 Guía del tablero + fases 5 a 10 sin asignar al sprint, G5-G7 y post-lanzamiento (2.º bloque ya con responsable: DEV-14, 16, 20, 23, 33) |
| 1er spring | 🗓️ Sprint actual / 🔨 En progreso | 📌 Reparto del equipo + las 12 tarjetas del sprint por persona (§0.5) + Fase 0 y Fase 1 (DIR/ART), G1 y G2 |
| 2do spring | 🗓️ Sprint siguiente | Assets y videos (ART-06…09, ART-11, ART-15), G3, G4 |
| Blockers | 🚧 Bloqueado / ⏳ Esperando cliente | `develop` desincronizada, Vercel, branding/contenido/videos del cliente (3) |
| reviews | 🔍 Revisión Interna / QA | DEV-04, 06, 08, 10, 19, 38, 39, 40, ART-10, ART-12 y los 2 DOCS (12) + la tanda del 21-11 (ramas apiladas, PR pendientes): DEV-17, 18, 30, 25, 24, 29, 26 (19 en total), con responsable de cierre |
| completados 1er spring | ✅ Hecho | DEV-05, DEV-07, DEV-09, DEV-37, CHORE (PR #17) y 3 DOCS (8) |
| completados 2do spring | ✅ Hecho (sprint 2) | — |

### 0.5 Reparto del equipo (desde el 20-11-2026)

> Objetivo: que **Rafael y Javier** trabajen **en paralelo sin conflictos de código**. En Trello, el responsable de cada tarjeta es su **miembro asignado**; el detalle está en la tarjeta «📌 Reparto del equipo» de «1er spring». Cada archivo tiene **un solo dueño**: quien necesite cambiar un archivo ajeno abre una tarjeta `BUG-XX` asignada al dueño o se lo pide en un PR pequeño. Revisado contra `main` (`db88ce1`).

| Persona | Área | Archivos que le pertenecen | Sprint (en orden) | Después |
| :--- | :--- | :--- | :--- | :--- |
| **Rafael** | Experiencia, contenido, assets, rendimiento y repo | `src/components/canvas/**`, `src/components/sequence/**` (`ImageSequenceCanvas`, `SequenceSection`, `SequenceEdges`), `src/components/sections/{ProductStorySection,ExperienceSection}.tsx`, `IngredientCallouts`, `PackagingSpecs`, `StoryProgress`, `Wordmark`, `Preloader` (nuevo), `SmoothScrollProvider.tsx`, `src/hooks/**`, `src/lib/{sequence/**,reveal,DampedValues,gsap,color,math}.ts`, `src/lib/dev-overrides.ts` (nuevo), `src/content/producto.ts`, `src/config/{gpu-policy,brand,motion,sequences,scene}.ts`, `src/store/**`, `globals.css`, `src/app/fonts.ts`, `next.config.ts`, `package.json` + lockfile (único que añade dependencias este sprint), `vitest.config.ts`, `public/**`, `scripts/**` | DEV-12 → DEV-15 → DEV-13 → DEV-27 → DEV-28 → DEV-34; cerrar DEV-04, DEV-08, DEV-19, ART-10, ART-12; corregir `BUG-XX`; desbloquear los Blockers | DEV-14, DEV-16, DEV-23 |
| **Javier** | Interfaz DOM, SEO y QA | `src/components/layout/**` (`SiteHeader`, `SkipLink`; nuevo: `SiteFooter`), `src/components/sections/{HeroSection,ContactSection}.tsx`, `src/components/ui/**` (`CtaLink`, `Eyebrow`, `GlassPanel`: compartidos, todo cambio lo revisa el otro), `HeroTitle`, `ContactForm`, `CustomCursor` (nuevos), `src/components/analytics/**`, `src/app/api/contacto/route.ts`, `src/content/sitio.ts` (nuevo), `src/config/site.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/seo/JsonLd.tsx`, informes en `Manuales/qa/` | DEV-38 (refactor, en revisión; incluye el PR 0 de DEV-17) → DEV-17 → DEV-18 → DEV-30 → DEV-25 → DEV-29 → DEV-26; verificar DEV-06, 09, 10 y 37 en dispositivos reales | DEV-20, DEV-24, DEV-33 |

**Reglas de convivencia**
1. Una rama = una tarjeta; nunca push a `main` ni a `develop`.
2. `layout.tsx` es compartido y solo monta piezas: cada uno añade su línea (Rafael: `<Preloader />`; Javier: `<JsonLd />`, cursor y analítica). Las fuentes se cambian en `src/app/fonts.ts` (Rafael) y los metadatos en `src/lib/seo.ts` (Javier).
3. `page.tsx` solo compone secciones (DEV-38): cada uno trabaja en sus componentes de `src/components/sections/` y solo toca `page.tsx` para agregar o reordenar una sección.
4. Textos del producto en `producto.ts` (Rafael); textos del sitio (nav, footer, formulario, legales, cookies) en `sitio.ts` (Javier).
5. §0 de este archivo: cada uno edita solo sus filas.
6. Antes de abrir un PR: `git merge origin/develop` (u `origin/main` mientras `develop` siga desincronizada), y `npm run lint`, `typecheck`, `test` y `build`. Cada uno mantiene los tests de sus módulos (`*.test.ts` junto al archivo).
7. Revisión cruzada: el PR de uno lo aprueba el otro (Javier verifica el código de Rafael y viceversa).

**Dependencias: qué falta y quién lo da**

| Falta | Lo da | Lo necesita |
| :--- | :--- | :--- |
| Sincronizar `develop` con `main` (28 commits detrás) | Rafael | Los dos |
| Vercel + Git LFS + Preview URLs | Rafael | DEV-04, DEV-12, pruebas en móvil, G5 |
| Dominio / `NEXT_PUBLIC_SITE_URL` | Rafael (con el cliente) | DEV-30, DEV-34 |
| Servicio de email + API key (solo en Vercel) | Rafael | DEV-25 |
| Dependencias nuevas (email, captcha, analítica) | Rafael | DEV-25, DEV-33 |
| Dominios externos para la CSP | Javier | DEV-34 |
| Número de WhatsApp | Cliente → Rafael | DEV-17, DEV-25 |
| Datos del negocio (zona, horario, teléfono) | Cliente → Rafael | DEV-30 (JSON-LD) |
| Fuente display real (`.woff2`) | Cliente / ART-04 → Rafael | DEV-08 |
| Master del video ≥ 1600 px | Cliente → Rafael | ART-10 |

**Orden de fusión recomendado:** (1) Rafael sincroniza `develop` y fusiona este PR de docs; (2) PR 0 de Javier y DEV-27 de Rafael, que son pequeños y desbloquean al resto; (3) el resto en cualquier orden, porque no comparten archivos.

**Sin responsable todavía:** las tarjetas DIR y ART (brief, storyboard, licencias, QA de dirección).

---

## 1. ROLES DEL EQUIPO (3 sombreros)

En un equipo pequeño cada persona cubre varios roles. Lo importante es que **cada tarjeta tenga un único responsable**.

| Sombrero | Código | Cubre | Decide sobre |
| :--- | :--- | :--- | :--- |
| **Dirección** | `DIR` | Dirección creativa, PM, relación con cliente, QA final, copy | Alcance, estética, aprobación de gates, prioridades |
| **Arte** | `ART` | Arte 3D (Blender), IA generativa (imagen/video), motion, color, audio | Calidad visual de los assets, coherencia lumínica |
| **Desarrollo** | `DEV` | Creative dev (R3F/GLSL/GSAP), front-end, SEO técnico, deploy | Arquitectura, rendimiento, viabilidad técnica |

**Con 2 personas:** DIR+ART y DEV. **Con 4:** DIR · ART-3D · ART-IA/Motion · DEV.

### Matriz RACI por fase
R = ejecuta · A = aprueba · C = consultado · I = informado

| Fase | DIR | ART | DEV | Cliente |
| :--- | :-: | :-: | :-: | :-: |
| 0. Brief y alcance | R/A | C | C | A |
| 1. Concepto y dirección de arte | A | R | C | A |
| 2. Producción de assets IA / render | A | R | C | I |
| 3. Modelado 3D y optimización | A | R | C | — |
| 4. Arquitectura y setup | I | I | R/A | — |
| 5-6. Desarrollo de experiencia y UI | A | C | R | I |
| 7-8. Rendimiento, QA, accesibilidad | A | C | R | — |
| 9. Contenido, SEO, negocio | R | I | R | A |
| 10. Lanzamiento | A | I | R | A |

---

## 2. ESTRUCTURA DEL TABLERO

### 2.1 Listas (de izquierda a derecha)

| # | Lista | Propósito | Límite WIP |
| :-: | :--- | :--- | :-: |
| 0 | 📌 **Guía del Tablero** | Tarjetas fijas: reglas, DoR/DoD, enlaces a M, budget, contactos | — |
| 1 | 📥 **Backlog** | Todas las tarjetas del proyecto, aún sin planificar | — |
| 2 | 🗓️ **Sprint Actual** | Lo comprometido para esta semana (cumple DoR) | 8 |
| 3 | 🔨 **En Progreso** | Trabajo activo | 2 por persona |
| 4 | 🔍 **Revisión Interna / QA** | Revisión cruzada (otro miembro del equipo) | 4 |
| 5 | 👀 **Revisión Cliente** | Esperando feedback o aprobación externa | — |
| 6 | 🚧 **Bloqueado** | Con motivo y responsable de desbloquear en un comentario | — |
| 7 | ✅ **Hecho** | Cumple DoD | — |
| 8 | 🚦 **Gates** | Una tarjeta por gate (G1-G7); se mueve a Hecho cuando se aprueba | — |
| 9 | 🚀 **Producción / Post-lanzamiento** | Monitoreo, mejoras, bugs post-launch | — |

> **¿Por qué no una lista por fase?** Las fases se marcan con etiquetas y con el campo *Fase*. Las listas representan **estado**. Así el tablero muestra los cuellos de botella (p. ej. 6 tarjetas atascadas en "Revisión Cliente"), y se filtra por fase con un clic.

### 2.2 Etiquetas

| Color | Etiqueta | Uso |
| :--- | :--- | :--- |
| 🟣 Morado | `Concepto/Arte` | Dirección creativa, moodboard, storyboard |
| 🔵 Azul | `3D` | Blender, modelado, texturas, `.glb` |
| 🩵 Celeste | `IA-Video` | Higgsfield/Kling/Veo, keyframes, secuencias |
| 🟢 Verde | `Dev-WebGL` | R3F, shaders, secuencias en canvas, GPU |
| 🟩 Verde lima | `Dev-UI` | DOM, Tailwind, tipografía, secciones |
| 🟠 Naranja | `Audio` | Diseño sonoro |
| 🟤 Marrón (negro) | `SEO/Negocio` | Contenido, CMS, conversión, legal |
| 🔴 Rojo | `P0 · Crítico` | Bloquea el gate siguiente |
| 🟡 Amarillo | `P1 · Importante` | Necesario para el lanzamiento |
| ⚪ Gris | `P2 · Deseable` | Pulido, si hay tiempo |
| ⚫ Negro | `⚠ Riesgo rendimiento` | Puede romper el Performance Budget |
| 🩷 Rosa | `⏳ Esperando cliente` | Pendiente de input externo |

### 2.3 Campos personalizados (Power-Up *Custom Fields*)

| Campo | Tipo | Valores |
| :--- | :--- | :--- |
| **ID** | Texto | `DIR-01`, `ART-07`, `DEV-12`… |
| **Fase** | Lista | 0 Brief · 1 Concepto · 2 Assets IA · 3 3D · 4 Arquitectura · 5 Experiencia · 6 UI · 7 Rendimiento · 8 QA · 9 Negocio/SEO · 10 Lanzamiento |
| **Estimación (h)** | Número | Horas |
| **Gate** | Lista | G1…G7 (el gate que desbloquea) |
| **Tier afectado** | Checkbox múltiple / texto | T3 · T2 · T1 · T0 |
| **Peso (MB)** | Número | Peso real del asset entregado (vs. budget) |
| **Ref. Manual** | Texto | Sección del Manual v2 |

### 2.4 Power-Ups recomendados
- **Custom Fields** (campos de arriba).
- **Card Repeater:** tarjetas semanales de Review y Retro.
- **Calendar / Timeline (vista nativa):** cronograma por sprint.
- **Google Drive / Dropbox:** adjuntar masters de video, `.blend` y Figma.
- **GitHub:** enlazar PRs a tarjetas `DEV-*`.
- **Figma:** previsualizar frames directamente en la tarjeta.

---

## 3. REGLAS DE FLUJO

### 3.1 Definition of Ready (DoR): para entrar en "Sprint Actual"
- [ ] Tiene ID, responsable único, fase, estimación y gate.
- [ ] La descripción dice **qué** y **para qué**.
- [ ] Tiene **criterio de aceptación medible**.
- [ ] Sus dependencias están en *Hecho* (o se acepta el riesgo explícitamente).
- [ ] Los inputs necesarios están adjuntos (referencias, keyframes, archivos fuente).

### 3.2 Definition of Done (DoD) global: para pasar a "Hecho"
- [ ] Todos los ítems del checklist completos.
- [ ] Cada criterio de aceptación numerado, verificado **por una persona distinta al responsable** (evidencia: captura, enlace o comentario).
- [ ] Entregable adjunto o enlazado (archivo, PR, URL de preview).
- [ ] Campo *Peso (MB)* completado si es un asset.
- [ ] Comentario de cierre: qué se hizo, qué quedó pendiente (→ nueva tarjeta).

### 3.3 DoD específica por tipo

| Tipo | Además del DoD global… |
| :--- | :--- |
| **Asset IA / Video** | Sin *morphing* ni logos deformados; mismo hex de fondo que el DOM (o alfa); prompt + seed + herramienta + versión registrados; licencia anotada en `LICENCIAS.md` |
| **Secuencia WebP** | Desktop y mobile con el **mismo conteo de frames**; peso dentro del budget; probada contra el fondo real en navegador |
| **Modelo 3D** | Polycount dentro de presupuesto; Draco **o** Meshopt; KTX2 separado por slot; inspeccionado en gltf.report; peso ≤ budget |
| **Componente WebGL** | `tsc` sin errores; cero `setState` por frame; dispose/kill al desmontar; respeta `gpuPolicy` y `reducedMotion`; fallback si falta el asset |
| **Sección UI** | Responsive (360 / 768 / 1440 px); teclado y foco visible; contraste AA; texto en DOM (SEO); sin CLS |
| **Bug** | Pasos de reproducción, dispositivo/navegador, causa raíz anotada y test de regresión |

### 3.4 Gates de aprobación

Cada gate es una tarjeta en la lista **🚦 Gates** con su checklist. **No se empieza trabajo de la fase siguiente hasta que DIR (y el cliente, si corresponde) aprueba el gate.**

| Gate | Nombre | Aprueba | Criterios de salida | Semana |
| :-: | :--- | :--- | :--- | :-: |
| **G1** | Brief y alcance | Cliente + DIR | Brief firmado, KPI, Performance Budget, alcance cerrado, nº de revisiones | 1 |
| **G2** | Dirección de arte + Storyboard | Cliente + DIR | Moodboard, paleta hex, tipografías con licencia, storyboard con técnica y fallback T1 por sección | 2 |
| **G3** | Key visuals + coherencia lumínica | Cliente + DIR | Keyframes aprobados; prueba de un frame sobre `#0A0A0A` en navegador sin costura | 3 |
| **G4** | Assets optimizados | DIR + DEV | Las dos secuencias, pósters y audio dentro del budget, en `/public` con nombres del contrato (`CLAUDE.md`) | 5 |
| **G5** | Vertical slice | DIR + Cliente | Hero + los dos videos + CTA en URL de preview a ≥ 55 FPS de media en desktop / ≥ 50 en gama media | 5 |
| **G6** | Beta QA | DIR | Matriz de dispositivos OK, Lighthouse móvil en verde, accesibilidad ≥ 95, cero P0 abiertos | 7 |
| **G7** | Go-live | Cliente + DIR | Checklist de lanzamiento (M Parte III) completo, revisión en producción | 8 |

### 3.5 Automatizaciones Butler (reglas sugeridas)

1. **Checklist completo → Revisión:** "cuando todos los ítems del checklist de una tarjeta se completan, mover la tarjeta a *Revisión Interna / QA* y añadir comentario `@card listo para revisión`".
2. **Bloqueo:** "cuando una tarjeta se mueve a *Bloqueado*, añadir la etiqueta ⚠ y comentar `¿Motivo y quién desbloquea?`".
3. **Esperando cliente:** "cuando una tarjeta se mueve a *Revisión Cliente*, añadir la etiqueta ⏳ y fijar el vencimiento a +2 días hábiles".
4. **Vencimiento:** "1 día antes del vencimiento, notificar al responsable".
5. **Hecho:** "cuando una tarjeta se mueve a *Hecho*, marcar el vencimiento como completado y quitar las etiquetas ⏳/⚠".
6. **Riesgo:** "cuando se añade la etiqueta ⚠ Riesgo rendimiento, añadir a DEV como miembro".
7. **Botón de tablero `Nuevo Sprint`:** mover todas las tarjetas de *Hecho* a una lista archivada `Hecho – Sprint N`.

### 3.6 Rituales
| Ritual | Cuándo | Duración | Dónde |
| :--- | :--- | :-: | :--- |
| **Daily** | Todos los días, 9:30 | 10 min | Tablero filtrado por "En Progreso" y "Bloqueado" |
| **Planning** | Lunes | 45 min | Mover del Backlog a Sprint Actual (respetando DoR y capacidad) |
| **Review con cliente** | Viernes | 30 min | URL de preview + tarjetas en "Revisión Cliente" |
| **Retro** | Viernes, tras review | 20 min | Tarjeta repetitiva `RETRO Sprint N`: qué funcionó, qué no, una acción |

### 3.7 Formato de las historias y umbrales comunes

Cada tarjeta de trabajo lleva una línea de historia (*Como… quiero… para…*) en la descripción y un **checklist de Trello «✔ Criterios de aceptación»** (en los gates, «✔ Criterios de salida»). Cada ítem es una frase completa que dice qué se entrega, cómo se comprueba y, si hace falta, quién lo aprueba. Los ítems ya cumplidos en el código vienen marcados; una tarjeta pasa a «completados» solo con el checklist al 100 % y verificado por otra persona. Este §5 refleja el mismo checklist (`- [x]` cumplido · `- [ ]` pendiente).

Umbrales que usan los criterios (acordados el 20-11-2026; DEV-01 puede ajustarlos con la analítica del cliente):

| Medida | Umbral |
| :--- | :--- |
| Peso de cada secuencia | ≤ 8 MB desktop / ≤ 4 MB mobile **por video** |
| FPS | ≥ 55 de media en desktop y ≥ 50 en Android de gama media |
| Core Web Vitals (Lighthouse móvil) | LCP < 2.5 s, CLS < 0.1, INP < 200 ms; accesibilidad ≥ 95 |
| Regresión de rendimiento | Lighthouse móvil no baja más de 5 puntos frente a `main` |
| Memoria | Tras 10 scrolls completos el heap vuelve a ±10 % del inicial; ≤ 2R+1 ImageBitmaps vivos por secuencia |
| Shader en móvil | Sin bandas ni bloques visibles (captura adjunta) |
| CLS por sección UI | 0 |

---

## 4. PLANTILLAS DE TARJETA

Crear estas tarjetas en **📌 Guía del Tablero** y marcarlas como *Plantilla* (Trello → "Convertir en plantilla").

### 🧩 PLANTILLA · Asset IA-Video
```
Título: ART-XX · Secuencia IA — <nombre>
Descripción:
  Objetivo narrativo: <qué cuenta este clip en el storyboard>
  Sección destino: <sección> · Técnica: Secuencia WebP / MP4 all-intra
  Keyframe inicial: <adjunto> · Keyframe final: <adjunto>
  Cámara: <orbit / dolly in / macro pan> · Física: <vapor, chispas…>
  Duración master: <s> · Frames destino: <n> @ 24 fps
  Ref: M Fase 2 Pasos 4-5
Checklist:
  [ ] Keyframes con misma relación de aspecto, lente y altura
  [ ] Generación + iteraciones (registrar prompt/seed/herramienta/versión)
  [ ] QC: sin morphing, logo intacto, movimiento natural
  [ ] Upscale + corrección de color con LUT del proyecto
  [ ] Export WebP desktop 1600 px y mobile 800 px al MISMO fps
  [ ] Verificar conteo de frames idéntico
  [ ] Prueba sobre fondo #0A0A0A en navegador
  [ ] Licencia anotada en LICENCIAS.md
Criterio de aceptación: DIR aprueba el clip frame a frame; peso ≤ 8 MB desktop / 4 MB mobile por video.
```

### 🧊 PLANTILLA · Modelo 3D
```
Título: ART-XX · Modelo 3D — <nombre>
Descripción: uso (interactivo 360° / fondo), polycount objetivo, iluminación (PBR+HDRI / baked)
Checklist:
  [ ] Limpieza, nombres, transformaciones aplicadas
  [ ] Polycount ≤ 80k desktop / ≤ 30k mobile
  [ ] UV + bake de normales
  [ ] Export .glb (glTF 2.0)
  [ ] gltf-transform: dedup → prune → resize 2K → uastc (slots datos) → etc1s (slots color) → draco O meshopt
  [ ] gltf-transform inspect + gltf.report
  [ ] Copiar a /public/models con nombre del contrato (versionado)
Criterio de aceptación: peso ≤ 3 MB; se ve correcto en el visor; sin texturas PNG/JPG remanentes.
```

### ⚙️ PLANTILLA · Componente WebGL
```
Título: DEV-XX · <Componente>
Descripción: comportamiento esperado, props, tier mínimo, fallback
Prompt para el agente: <prompt de M Fase 7 Paso 20>
Checklist:
  [ ] Implementado según CLAUDE.md (Manual v2 Parte II)
  [ ] Lee gpuPolicy y reducedMotion
  [ ] Fallback si falta el asset
  [ ] Cero setState por frame / scroll / pointer
  [ ] Dispose / kill / close al desmontar
  [ ] tsc --noEmit sin errores
  [ ] Probado en T3 desktop y T2 móvil
  [ ] PR enlazado
Criterio de aceptación: 60 FPS desktop / ≥ 50 gama media; memoria estable tras 10 scrolls completos.
```

### 🖼️ PLANTILLA · Sección UI
```
Título: DEV-XX · Sección <nombre>
Descripción: objetivo de la sección, copy (adjunto), técnica visual del storyboard
Checklist:
  [ ] Maquetado semántico (h2, p, botones reales)
  [ ] Grilla 12 col; texto opuesto al foco visual
  [ ] Tipografía cinética (SplitText) si aplica
  [ ] Responsive 360 / 768 / 1440
  [ ] Teclado + foco visible + contraste AA
  [ ] Transición de entrada/salida con la sección vecina
Criterio de aceptación: DIR aprueba composición; Lighthouse sin regresión; CLS 0.
```

### 🐞 PLANTILLA · Bug de rendimiento
```
Título: BUG-XX · <síntoma>
Descripción: dispositivo, navegador, tier detectado, URL, pasos para reproducir, FPS/memoria medidos, captura de Performance
Checklist:
  [ ] Reproducido
  [ ] Causa raíz identificada (anotar)
  [ ] Corrección + PR
  [ ] Verificado en el mismo dispositivo
  [ ] Prueba de regresión
Criterio de aceptación: la métrica vuelve dentro del budget.
```

---

## 5. TARJETAS DEL PROYECTO (BACKLOG INICIAL)

**Formato:** `ID · Título` — **Rol** · Etiquetas · **h** estimadas · Gate · Dependencias
Debajo: descripción breve, checklist y ✔ criterio de aceptación. La *Ref.* apunta al Manual v2.

### 📌 Lista "Guía del Tablero" (tarjetas fijas)
- **GUIA-01 · Reglas del tablero:** sección 3 de este documento (DoR, DoD, WIP, gates).
- **GUIA-02 · Manual v2 + CLAUDE.md:** adjuntar `MANUAL_V2_WEB_HIPERREALISTA.md`.
- **GUIA-03 · Performance Budget:** tabla de M Fase 0 (fijar en la portada de la tarjeta).
- **GUIA-04 · Paleta y tokens:** hex oficiales, tipografías y LUT.
- **GUIA-05 · Contactos y accesos:** cliente, dominio, hosting, CMS, repositorio (sin contraseñas: usar un gestor de contraseñas).
- **GUIA-06 a 10 · Plantillas** (sección 4).

---

### FASE 0 · BRIEF Y ALCANCE — Semana 1 → **G1**

**DIR-01 · Kickoff y brief del cliente** — DIR · `Concepto/Arte` `P0` · 4 h · G1
Reunión de descubrimiento: objetivo de negocio, público, competencia y referencias que le gustan o no al cliente.
- [ ] Cuestionario de brief enviado y respondido
- [ ] KPI de negocio definido y medible
- [ ] Acción de conversión principal (comprar / reservar / WhatsApp / lead)
- [ ] Analítica actual: % móvil, % iOS, países

_Como dirección del proyecto, quiero un brief validado con el cliente para que todo el equipo trabaje hacia el mismo objetivo de negocio._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El brief (1 página) está en Drive y enlazado en esta tarjeta, con objetivo de negocio, público, 3 referencias (qué gusta y qué no) y la acción de conversión principal.
- [ ] El brief define un KPI medible con valor objetivo y plazo (p. ej. «40 pedidos por WhatsApp al mes en 3 meses»).
- [ ] El brief incluye la analítica actual (% móvil, % iOS, países) o dice explícitamente «sin datos».
- [ ] La aprobación del cliente queda registrada en la tarjeta (email adjunto o comentario).

**DIR-02 · Alcance cerrado y cronograma** — DIR · `P0` · 3 h · G1 · ← DIR-01
- [ ] Nº de secciones, idiomas, CMS sí/no, e-commerce sí/no
- [ ] Rondas de revisión por gate (2 recomendadas)
- [ ] Cronograma de 8 semanas con fechas de gates
- [ ] Qué queda **fuera** del alcance (por escrito)

_Como dirección, quiero un alcance cerrado y un cronograma con fechas de gates para controlar cambios y plazos._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El documento de alcance indica nº de secciones, idiomas, si hay CMS, si hay e-commerce y cuántas rondas de revisión tiene cada gate.
- [ ] El documento lista por escrito lo que queda fuera del alcance, incluida la decisión «solo video, sin modelos 3D» (19-11-2026).
- [ ] El cronograma de 8 semanas fija la fecha de cada gate (G1 a G7) y esa fecha está cargada como vencimiento en cada tarjeta de gate.
- [ ] El cliente aprueba el alcance por escrito (adjunto en la tarjeta), y queda decidido si entran DEV-31 (CMS) y DEV-32 (e-commerce).

**DEV-01 · Performance Budget y matriz de dispositivos** — DEV · `Dev-WebGL` `P0` · 2 h · G1 · ← DIR-01
Ref. M Fase 0. Ajustar la tabla según la analítica del cliente.
- [ ] Budget de JS, peso crítico, peso total y secuencias WebP (proyecto sin `.glb`)
- [ ] Matriz QA: iPhone reciente, iPhone de hace 3-4 años, Android gama media, Android gama baja, MacBook, Windows con GPU integrada
- [ ] Objetivos de CWV y FPS

_Como desarrollo, quiero un Performance Budget y una matriz de dispositivos acordados para medir cada entrega contra números concretos._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] La tarjeta 📌 Guía tiene una tabla con el límite de: JS inicial, peso crítico, peso total, peso por secuencia (≤ 8 MB desktop / ≤ 4 MB mobile por video), LCP, CLS, INP y FPS.
- [ ] La matriz de QA nombra 6 dispositivos concretos (modelo y navegador): iPhone reciente, iPhone de 3-4 años, Android gama media, Android gama baja, MacBook y Windows con GPU integrada.
- [ ] Cada valor está ajustado a la analítica de DIR-01, o se explica por qué se usa el valor del manual si no hay datos.
- [ ] DIR valida el budget con un comentario en la tarjeta.

**DIR-03 · Registro de licencias** — DIR · `SEO/Negocio` `P1` · 1 h · G1
- [ ] Crear `LICENCIAS.md` (fuentes, modelos, audio, IA)
- [ ] Revisar los términos de uso comercial de cada herramienta IA del plan

_Como dirección, quiero un registro de licencias para usar comercialmente cada fuente, audio y asset IA sin riesgo legal._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] `LICENCIAS.md` tiene una fila por asset con: nombre, origen o herramienta, tipo de licencia, enlace o comprobante y si permite uso comercial.
- [ ] Para cada herramienta IA del plan se revisaron sus términos de uso comercial y se anotó el enlace en `LICENCIAS.md`.
- [x] Todos los archivos de `/public` tienen su fila en `LICENCIAS.md` (ninguno queda sin registrar).
- [ ] La tarjeta 📌 Guía enlaza a `LICENCIAS.md`.

**GATE-G1 · Brief y alcance aprobados** — DIR + Cliente

✔ **Criterios de salida** (checklist en Trello):
- [ ] DIR-01, DIR-02, DEV-01 y DIR-03 están en «completados».
- [ ] El cliente aprobó por escrito el brief y el alcance (email o comentario enlazado).
- [ ] Las fechas de G2 a G7 están cargadas como vencimiento en sus tarjetas de gate.

---

### FASE 1 · CONCEPTO Y DIRECCIÓN DE ARTE — Semanas 1-2 → **G2**

**ART-01 · Concepto y física de la experiencia** — ART · `Concepto/Arte` `P0` · 6 h · G2 · ← G1
Ref. M Fase 1 Paso 1.
- [ ] Arquetipo y dirección estética (1 párrafo)
- [ ] Física de interacción traducida a valores λ (denso 2-4 / natural 5-7 / preciso 10-14)
- [ ] 3 palabras clave sensoriales

_Como dirección creativa, quiero una ficha de concepto para que arte y desarrollo compartan la misma intención visual y de movimiento._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] La ficha de concepto (1 página) está en Drive y enlazada en esta tarjeta.
- [ ] La ficha define el arquetipo, 3 palabras clave sensoriales y un valor λ (suavizado) para cada interacción: scroll, puntero y entrada de texto.
- [ ] Cada valor λ está dentro de los rangos del manual: denso 2-4, natural 5-7 o preciso 10-14.
- [ ] DIR deja su aprobación como comentario en la tarjeta.

**ART-02 · Moodboard estético + motion** — ART · `Concepto/Arte` `P0` · 6 h · G2 · ← ART-01
Ref. M Fase 1 Paso 2.
- [ ] Tablero Estética (Behance/Pinterest/Midjourney)
- [ ] Tablero Motion (Awwwards/FWA con links a los sitios)
- [ ] 3 exploraciones de material/luz con IA

_Como arte, quiero un moodboard estético y de motion para alinear con el cliente el look y el ritmo antes de producir._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El tablero de estética tiene al menos 15 referencias y está enlazado en la tarjeta.
- [ ] El tablero de motion tiene al menos 5 sitios de referencia (con enlace) y, para cada uno, qué se toma de él.
- [ ] Hay 3 exploraciones de material y luz de la hamburguesa hechas con IA, con la herramienta usada anotada.
- [ ] DIR y el cliente aprueban el moodboard (comentario o email enlazado).

**ART-03 · Paleta, luz y LUT** — ART · `Concepto/Arte` `P0` · 3 h · G2 · ← ART-02
- [ ] Hex de fondo (`#0A0A0A` o el definido) y acentos
- [ ] Dirección de Key Light y Rim Light (diagrama)
- [ ] LUT de color para todos los assets

_Como arte, quiero una paleta, un esquema de luz y una LUT únicos para que los videos y el sitio se vean coherentes._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Los hex de fondo, superficie, acento, texto y texto secundario están publicados en la tarjeta 📌 Guía.
- [ ] El contraste entre texto y fondo es ≥ 4.5:1, con la herramienta usada y el resultado anotados.
- [ ] El diagrama de luz principal (Key Light) y de contorno (Rim Light) está adjunto.
- [ ] El archivo LUT (`.cube`) está en Drive y enlazado en la tarjeta.
- [ ] DIR deja su aprobación como comentario en la tarjeta.

**ART-04 · Sistema tipográfico con licencia** — ART/DIR · `Dev-UI` `P1` · 2 h · G2
- [ ] Display (preferible variable font) + técnica (una sola familia, no "Slab/Mono")
- [ ] Licencia web comprada o fuente open source
- [ ] Archivos `.woff2` entregados a DEV

_Como arte, quiero un sistema tipográfico con licencia web para que desarrollo lo integre sin riesgo legal ni saltos de texto._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Están elegidas una familia para titulares y otra para texto, con los pesos que se usarán (p. ej. 400 y 700).
- [ ] Los archivos `.woff2` (subconjunto latino) están entregados a DEV.
- [ ] La licencia web (comprobante de compra o licencia open source) está registrada en `LICENCIAS.md`.

**DIR-04 · Storyboard por sección** — DIR · `Concepto/Arte` `P0` · 6 h · G2 · ← ART-02
Ref. M Fase 1 entregable. Cuadro por cuadro, del preloader al CTA.
- [ ] Por cada sección: objetivo, técnica (Secuencia / 3D RT / Shader 2D / UI) y **fallback T1/T0**
- [ ] Ubicación del CTA persistente
- [ ] Transiciones entre secciones

_Como dirección, quiero un storyboard sección por sección para que arte y desarrollo sepan qué construir y con qué técnica._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El storyboard tiene un cuadro por sección, del preloader al CTA, como mínimo: preloader, Hero, Video 1 (hamburguesa), Video 2 (packaging) y conversión.
- [ ] Cada sección indica su objetivo, la técnica (secuencia de video, shader 2D o UI) y qué se ve en T1/T0 (fallback).
- [ ] El storyboard marca dónde vive el CTA persistente y cómo es la transición entre cada par de secciones vecinas.
- [ ] El cliente aprueba el storyboard (email o comentario enlazado).

**DEV-02 · Validación técnica del storyboard** — DEV · `Dev-WebGL` `P0` · 3 h · G2 · ← DIR-04
- [ ] Cada técnica es viable dentro del budget
- [ ] Riesgos marcados con ⚠
- [ ] Estimación de peso por sección

_Como desarrollo, quiero validar técnicamente el storyboard para detectar antes de producir lo que no cabe en el presupuesto._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Hay un comentario en DIR-04 con un veredicto por sección: viable, viable con riesgo ⚠ o no viable.
- [ ] Se estima el peso de cada sección y el total, y se compara con el budget de DEV-01.
- [ ] Cada riesgo ⚠ tiene su propia tarjeta nueva en el backlog.

**ART-05 · Wireframes y grilla en Figma** — ART/DIR · `Dev-UI` `P1` · 8 h · G2 · ← DIR-04
- [ ] Grilla de 12 columnas, desktop y mobile
- [ ] Wireframes de todas las secciones
- [ ] Estados de botones, nav y preloader

_Como arte y dirección, quiero wireframes en Figma sobre una grilla de 12 columnas para que desarrollo maquete sin ambigüedad._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El Figma enlazado tiene frames de 360, 768 y 1440 px para todas las secciones del storyboard.
- [ ] La grilla de 12 columnas se ve en desktop y hay una equivalente en mobile.
- [ ] Están diseñados los estados de los botones (normal, hover, foco, deshabilitado), la navegación y el preloader.
- [ ] DIR y el cliente aprueban los wireframes (comentario o email enlazado).

**DIR-05 · Copy v1** — DIR · `SEO/Negocio` `P1` · 6 h · G2 · ← DIR-04
- [ ] Titulares, textos y CTAs por sección
- [ ] Palabras clave SEO objetivo

_Como dirección, quiero el copy v1 de todas las secciones para reemplazar el texto provisional del sitio._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El documento de copy cubre todos los textos de `src/content/producto.ts`: marca, nombre, titular, bajada, ingredientes (en el orden en que se separan en el video), ficha del packaging y CTA.
- [ ] El documento incluye de 3 a 5 palabras clave SEO objetivo.
- [ ] Una segunda persona revisó la ortografía y no quedan errores pendientes.
- [ ] El cliente aprueba el copy (email o comentario enlazado).

**GATE-G2 · Dirección de arte y storyboard aprobados** — Cliente + DIR

✔ **Criterios de salida** (checklist en Trello):
- [ ] ART-01 a ART-05, DIR-04, DIR-05 y DEV-02 están en «completados».
- [ ] El cliente aprobó por escrito el moodboard, la paleta, la tipografía y el storyboard.

---

### FASE 2 · PRODUCCIÓN DE ASSETS E IA — Semanas 3-4 → **G3**

**ART-06 · Key visuals maestros** — ART · `Concepto/Arte` `P0` · 10 h · G3 · ← G2
Ref. M Fase 2 Paso 3.
- [ ] Renders/imágenes maestras por sección con la luz de ART-03
- [ ] Fondo = hex del DOM o alfa
- [ ] Prueba de borde en navegador

_Como arte, quiero imágenes maestras con la luz del proyecto para fijar el look final antes de generar video._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Hay una imagen maestra del Hero, de la hamburguesa y del packaging en Drive, con la luz de ART-03.
- [ ] El fondo de cada imagen es exactamente el hex de fondo del sitio (o transparente).
- [ ] Puesta sobre el fondo real del sitio en el navegador, no se ve borde ni costura (captura adjunta).
- [ ] DIR deja su aprobación como comentario en la tarjeta.

**ART-07 · Keyframes inicial/final para la secuencia Hero** — ART · `IA-Video` `P0` · 6 h · G3 · ← ART-06
- [ ] Mismo aspect ratio, lente y altura de cámara
- [ ] Inicial (producto cerrado) y final (exploded view)

_Como arte, quiero keyframes inicial y final de cada video para guiar la generación IA sin saltos de cámara._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Hay un par de keyframes inicial/final de la hamburguesa (cerrada → capas separadas) y otro del packaging.
- [ ] Dentro de cada par, el aspect ratio, la lente y la altura de cámara son iguales.
- [ ] Las capas de la hamburguesa siguen el mismo orden que los ingredientes del copy (DIR-05).
- [ ] DIR deja su aprobación como comentario en la tarjeta.

**GATE-G3 · Key visuals + coherencia lumínica** — Cliente + DIR · ← ART-06, ART-07

✔ **Criterios de salida** (checklist en Trello):
- [ ] ART-06 y ART-07 están en «completados».
- [ ] El cliente aprobó los keyframes de los dos videos.
- [ ] Un frame puesto sobre el fondo del sitio en el navegador no muestra costura (captura adjunta).

**ART-08 · Generación de la secuencia IA Hero** — ART · `IA-Video` `P0` · 10 h · G4 · ← G3
> 📍 En este proyecto: **dos videos** — hamburguesa separándose (`hero_explode`) y packaging (`packaging_reveal`). Especificación en el `README.md`.
*Usar la PLANTILLA Asset IA-Video.* Ref. M Fase 2 Paso 4 (verificar el flujo vigente de la herramienta).

_Como arte, quiero generar los dos videos hiperrealistas para contar el producto a medida que el visitante hace scroll._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Existen los dos clips master, hamburguesa (`hero_explode`) y packaging (`packaging_reveal`), según la especificación del `README.md`.
- [ ] Revisados frame a frame: sin morphing, con el logo intacto y con movimiento natural.
- [ ] Prompt, seed, herramienta y versión usados están anotados en la tarjeta.
- [ ] La licencia de la herramienta IA está registrada en `LICENCIAS.md`.
- [ ] DIR deja su aprobación de los dos clips como comentario en la tarjeta.

**ART-09 · Upscale y color de la secuencia** — ART · `IA-Video` `P1` · 4 h · G4 · ← ART-08
- [ ] Topaz Video / DaVinci a FPS constantes
- [ ] LUT del proyecto aplicada

_Como arte, quiero escalar y corregir el color de los videos para que coincidan con el sitio._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Los dos videos tienen FPS constante a 24, comprobado en el editor.
- [ ] La LUT de ART-03 está aplicada a los dos videos.
- [ ] Los masters finales están en Drive (nunca en Git) y enlazados en la tarjeta.

**ART-10 · Export WebP desktop/mobile** — ART · `IA-Video` `⚠` `P0` · 2 h · G4 · ← ART-09
Ref. M Fase 2 Paso 5 (corrección: **mismo fps**).
- [ ] `ffmpeg` desktop 1600 px y mobile 800 px a 24 fps
- [ ] Conteos idénticos (`ls | wc -l`)
- [ ] Peso ≤ 8 MB desktop / 4 MB mobile por video
- [ ] Copiar a `/public/sequences/hero_explode/{desktop,mobile}`

_Como arte, quiero exportar los videos a secuencias WebP para que desarrollo los controle con el scroll._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Cada video está exportado con `npm run frames` en desktop (1600 px) y mobile (800 px) a 24 fps.
- [x] Desktop y mobile tienen el mismo nº de frames, igual a `totalFrames` de `ASSET_MANIFEST` (hoy 54 en `hero_explode` y 157 en `packaging_reveal`); si cambia, DEV lo actualiza en el mismo PR.
- [x] Cada video pesa ≤ 8 MB en desktop y ≤ 4 MB en mobile.
- [x] Los frames se suben por PR desde una rama `assets/art-10-…` a `/public/sequences/{hero_explode,packaging_reveal}/{desktop,mobile}/`.
- [x] DEV confirma en el navegador que las dos secuencias cargan sin mostrar el fallback.

**ART-11 · Secuencias / imágenes de secciones secundarias** — ART · `IA-Video` `P1` · 12 h · G4 · ← G3
*Una tarjeta por asset* (duplicar desde la plantilla).

_Como arte, quiero producir los assets de las secciones secundarias para completar el storyboard._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Por cada asset extra que pida el storyboard (DIR-04) hay una tarjeta propia, creada con la plantilla Asset IA-Video y con sus criterios.
- [ ] Si el storyboard no pide secciones extra, esta tarjeta se archiva con un comentario que lo explica.

**ART-12 · Pósters de fallback T0/T1 y OG image** — ART · `Concepto/Arte` `P1` · 3 h · G4 · ← ART-06
- [ ] `hero_poster.webp` y un póster por secuencia
- [ ] `og-image.jpg` 1200×630

_Como visitante sin WebGL o con un móvil de gama baja, quiero ver una imagen fija de calidad para entender el producto igual._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] En `/public/fallback` están `hero_poster.webp` y un póster por secuencia.
- [x] En `/public` está `og-image.jpg` de 1200×630 px.
- [ ] Los pósters usan el mismo fondo y LUT que los videos y su peso entra en el budget de DEV-01.

---

### FASE 3 · MODELADO 3D Y OPTIMIZACIÓN — Semanas 3-5 → **G4**

**ART-13 · Modelo 3D Hero (Blender)** — ART · `3D` `P0` · 16 h · G4 · ← G2
> ❌ **Descartada en este proyecto** (decisión del cliente 19-11-2026: solo video hiperrealista, sin 3D). Ver DEV-37.
*Usar la PLANTILLA Modelo 3D.* Ref. M Fase 3 Pasos 6-7.
✔ Polycount dentro del presupuesto; materiales PBR correctos.

**ART-14 · HDRI de estudio** — ART · `3D` `P1` · 2 h · G4
> ❌ **Descartada en este proyecto** (decisión del cliente 19-11-2026: solo video hiperrealista, sin 3D). Ver DEV-37.
- [ ] `.hdr` < 1 MB coherente con la luz de ART-03
✔ En `/public/hdri/studio_dark_01.hdr`.

**DEV-03 · Pipeline de compresión .glb** — DEV · `3D` `Dev-WebGL` `⚠` `P0` · 4 h · G4 · ← ART-13
> ❌ **Descartada en este proyecto** (decisión del cliente 19-11-2026: solo video hiperrealista, sin 3D). Ver DEV-37.
Ref. M Fase 3 Paso 8.
- [ ] Instalar `@gltf-transform/cli` + KTX-Software ≥ 4.3
- [ ] Script `scripts/optimize-glb.sh` con `--slots` (UASTC datos / ETC1S color) y Draco **o** Meshopt
- [ ] `gltf-transform inspect` adjunto a la tarjeta
✔ `.glb` ≤ 3 MB, sin PNG/JPG internos.

**ART-15 · Diseño sonoro** — ART · `Audio` `P2` · 6 h · G4 · ← G2
Ref. M Fase 5 Paso 16.
- [ ] Loop ambiental (`.webm` + `.m4a`)
- [ ] Micro-SFX de hover < 80 ms (`.webm` + `.m4a`)
- [ ] Licencia anotada

_Como visitante, quiero un sonido ambiental opcional para que la experiencia se sienta inmersiva sin molestar._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El loop ambiental existe en `.webm` y `.m4a` y se repite sin corte audible.
- [ ] El sonido de hover dura menos de 80 ms y existe en `.webm` y `.m4a`.
- [ ] Las licencias de los audios están registradas en `LICENCIAS.md`.
- [ ] Los archivos están en `/public/audio` con los nombres del contrato (`ambient_drone`, `ui_hover_tick`).

**GATE-G4 · Assets optimizados** — DIR + DEV

✔ **Criterios de salida** (checklist en Trello):
- [ ] ART-08, ART-09, ART-10 y ART-12 están en «completados» (y ART-15, si entra en el alcance).
- [ ] Todos los archivos están en `/public` con los nombres del contrato.
- [x] Cada video pesa ≤ 8 MB en desktop y ≤ 4 MB en mobile.
- [x] `LICENCIAS.md` tiene una fila por cada archivo de `/public`.
- [x] DEV confirma que el nº de frames coincide con `ASSET_MANIFEST`.

---

### FASE 4 · ARQUITECTURA Y SETUP — Semanas 2-3 (en paralelo con Fase 2)

**DEV-04 · Repo, proyecto Next.js 16 y CLAUDE.md** — DEV · `Dev-WebGL` `P0` · 3 h · G5 · ← G2
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-04-setup-base` · ✅ todo hecho salvo el deploy de Vercel
Ref. M Parte II §3.
- [ ] `create-next-app` (TS, Tailwind v4, App Router, `src/`)
- [ ] Dependencias fijadas (R3F v9 + React 19)
- [ ] `CLAUDE.md` = Parte II del Manual v2
- [ ] `scripts/copy-decoders.mjs` + `postinstall`
- [ ] `next.config.ts` con caché inmutable
- [ ] Deploy de preview en Vercel conectado a GitHub

_Como equipo de desarrollo, quiero un repositorio base configurado para construir sobre una estructura común._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El proyecto usa Next.js 16 con TypeScript, Tailwind v4, App Router y `src/`, con dependencias fijadas (R3F v9 + React 19).
- [x] `CLAUDE.md` contiene la Parte II del Manual.
- [x] `postinstall` copia los benchmarks y `next.config.ts` sirve los assets con caché `immutable`.
- [x] `npm run lint`, `npm run typecheck` y `npm run build` terminan sin errores.
- [ ] Cada PR genera una URL de preview en Vercel.

**DEV-05 · Política de GPU, manifiesto y store** — DEV · `Dev-WebGL` `P0` · 3 h · G5 · ← DEV-04
> 📍 **Estado:** ✅ Hecho · fusionada en `main`
Ref. M Parte II §4-5. Prompt P1.

_Como desarrollo, quiero una política de GPU, un manifiesto de assets y un store transiente para que todos los componentes lean la misma configuración._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] `gpu-policy.ts` define las políticas T1-T3 y `ASSET_MANIFEST` con `totalFrames` por variante.
- [x] `damp` da el mismo resultado sin importar los FPS.
- [x] El store expone `reducedMotion` y `webglAvailable`, y los campos de scroll y puntero se leen con `getState()`.

**DEV-06 · SmoothScrollProvider + detect-gpu** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← DEV-05
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-06-smooth-scroll` · falta prueba en navegador real
*Usar la PLANTILLA Componente WebGL.* Ref. M Parte II §6. Prompt P2.
- [ ] `autoRaf:false`, un solo reloj (gsap.ticker)
- [ ] Sin Lenis con `prefers-reduced-motion`
- [ ] Benchmarks auto-hospedados
- [ ] Puntero mutable

_Como visitante, quiero un scroll suave y una calidad visual adaptada a mi dispositivo._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Lenis funciona con `autoRaf:false` y lo mueve `gsap.ticker` (un solo reloj).
- [x] Con `prefers-reduced-motion` activo no se crea Lenis.
- [x] detect-gpu, con benchmarks propios, fija el tier y en desarrollo se ve en la consola.
- [x] El puntero se guarda en un objeto mutable, sin re-renders de React.
- [ ] En un navegador real (desktop y móvil) el scroll es fluido y en Performance hay un solo bucle de animación.

**DEV-07 · GlobalCanvas (Single-Canvas) + PerformanceMonitor** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← DEV-06
> 📍 **Estado:** ✅ Hecho · fusionada en `main` · un solo contexto WebGL verificado
Ref. M Parte II §8. `flipflops={3}`, `onFallback`, no se monta si `webglAvailable=false`.

_Como desarrollo, quiero un único Canvas WebGL adaptado al dispositivo para no gastar memoria con varios contextos._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] En el DOM hay un solo `<canvas>` WebGL.
- [x] `dpr` y `antialias` salen de la política del tier, y el render se pausa con la pestaña oculta.
- [x] Si los FPS caen, PerformanceMonitor baja un tier.
- [x] Sin WebGL el Canvas no se monta y la página se sigue usando con normalidad.

**DEV-08 · Tokens de diseño y fuentes** — DEV · `Dev-UI` `P1` · 2 h · G5 · ← ART-03, ART-04
- [ ] `@theme` de Tailwind v4 con la paleta
- [ ] `next/font/local` con las `.woff2`

_Como visitante, quiero ver la marca con sus colores y tipografías reales, sin saltos de texto al cargar._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] La paleta de ART-03 está en el `@theme` de `globals.css` (el token de fondo se llama `surface`, no `base`).
- [ ] Las fuentes de ART-04 se cargan con `next/font/local`.
- [ ] Lighthouse no muestra CLS causado por fuentes y, con red lenta simulada, no se ve el cambio de fuente al cargar.
- [x] `npm run lint`, `npm run typecheck` y `npm run build` terminan sin errores.

---

### FASE 5 · EXPERIENCIA INMERSIVA — Semanas 4-6 → **G5**

**DEV-09 · ImageSequenceCanvas (ventana deslizante)** — DEV · `Dev-WebGL` `⚠` `P0` · 8 h · G5 · ← DEV-06
> 📍 **Estado:** ✅ Hecho · verificado el 21-11-2026 con los frames reales (211 en la historia continua), sin blancos ni saltos
*PLANTILLA Componente WebGL.* Ref. M Parte II §7. Prompt P3.
- [ ] Fallback solo si falta el frame 1
- [ ] Dibuja el frame más cercano
- [ ] Flush al cambiar de tier
- [ ] `aria-label`

_Como visitante, quiero ver el video de la hamburguesa avanzar y retroceder con mi scroll, sin cortes._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Con `/public` vacío se ve la animación de respaldo, sin errores fatales.
- [x] Solo se mantienen en memoria los frames cercanos al actual [f-R, f+R] (como máximo 2R+1).
- [x] Al cambiar de tier se vacía la caché de frames.
- [x] El canvas tiene `aria-label` que describe la animación.
- [x] Con los frames reales (ART-10), se recorre toda la secuencia sin frames en blanco ni saltos.

**DEV-10 · Shader de fondo (fluido)** — DEV · `Dev-WebGL` `P1` · 6 h · G5 · ← DEV-07
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-10-fluid-shader`
Ref. M Parte II §8. Prompt P4. Hash sin `sin()`.

_Como visitante, quiero un fondo vivo que reaccione a mi puntero y al scroll para que la página se sienta inmersiva._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El shader usa un hash sin `sin()` y todos sus uniforms pasan por `damp()`.
- [x] Con `prefers-reduced-motion` activo el fondo queda quieto.
- [ ] En un Android de gama media el fondo va a ≥ 50 FPS y no muestra bandas ni bloques (captura adjunta).

**DEV-11 · HeroArtifactMesh + rig de iluminación** — DEV · `Dev-WebGL` `3D` `P0` · 8 h · G5 · ← DEV-07 (y DEV-03 para el asset real)
> ❌ **Descartada en este proyecto** (decisión del cliente 19-11-2026: solo video hiperrealista, sin 3D). Ver DEV-37.
Ref. M Parte II §8. Prompt P5.
✔ Fallback procedural sin `.glb`; con el `.glb`, dispose verificado al desmontar.

**DEV-37 · Packaging como video (proyecto 100 % video, sin `.glb`)** — DEV · `Dev-WebGL` `P0` · G5 · ← DEV-09 · reemplaza a DEV-11
> 📍 **Estado:** ✅ Hecho · verificado el 21-11-2026 con el video real (157 frames) en desktop y móvil emulado
Segunda secuencia `packaging_reveal` con `PackagingSpecs` (ficha técnica que aparece por tramos). Fuera del manifiesto: `.glb`, HDRI y Draco/Basis.

_Como visitante, quiero ver el packaging en un video hiperrealista con su ficha técnica para conocer el envase._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El packaging es una segunda secuencia (`packaging_reveal`) controlada por el scroll, con su propio id de progreso.
- [x] Las especificaciones del packaging aparecen por tramos según avanza el video.
- [x] El código y el manifiesto no usan `.glb`, HDRI ni Draco/KTX2.
- [x] Con `/public` vacío se ve el fallback sin errores y no se piden frames antes de comprobar que existe el frame 1.
- [x] Con el video real (ART-08 / ART-10), se recorre la secuencia sin frames en blanco.

**DEV-38 · Refactor: arquitectura modular, componentes reutilizables y configuración centralizada** — DEV · `Dev-UI` `P1` · G5 · sin cambios de comportamiento
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `chore/dev-38-refactor-modular` · falta la revisión de Rafael
Configuración en `src/config`, componentes en `ui/`, `layout/`, `sections/` y `sequence/`, lógica de secuencias en `src/lib/sequence` y tests unitarios con Vitest.

_Como equipo, queremos un código sin valores fijos dispersos, con componentes reutilizables y módulos pequeños, para que el proyecto pueda crecer sin volverse difícil de mantener._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Sin regresiones visibles: el HTML que genera el servidor tiene los mismos textos, enlaces y atributos de accesibilidad que antes del refactor (comparación adjunta).
- [x] Ningún componente tiene textos de contenido ni parámetros de animación, scroll o reproducción escritos dentro: viven en `src/content` y `src/config`.
- [x] Botones de CTA, eyebrows, paneles y secciones de video son componentes reutilizables (sin estilos duplicados), y `page.tsx` solo compone secciones.
- [x] `ImageSequenceCanvas` queda separado en módulos (caché de frames, dibujo, rutas) con tests unitarios, y los overlays comparten un hook de progreso.
- [x] `npm run lint`, `typecheck`, `test` y `build` terminan sin errores, y el CI ejecuta los tests.
- [x] Recorrido en el navegador sin regresiones: 0 errores y 0 404; callouts y especificaciones aparecen por tramos; ventana de frames = 2R+1; desktop y móvil.
- [x] El FLUJO §0 (bitácora y reparto de archivos) y el README describen la nueva estructura.
- [ ] Rafael revisa y aprueba el PR.

**DEV-39 · Fluidez y calidad visual de los videos (hamburguesa y bolsa)** — DEV · `Dev-WebGL` `P1` · G6 · ← DEV-38
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-39-fluidez-secuencias`
Mezcla de frames según la posición exacta del scroll, escalado de alta calidad, scrub con más inercia y entrada de cada video al aparecer.

_Como visitante, quiero que la hamburguesa aparezca y se meta en la bolsa con un movimiento continuo y suave, para que la experiencia se sienta profesional y no a saltos._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Entre dos frames del video la imagen avanza de forma continua (mezcla de frames): medido en el navegador, ningún paso de scroll queda sin cambio y el salto máximo baja al menos un 50 % en los dos videos.
- [x] Los frames se escalan con calidad alta (`imageSmoothingQuality: "high"`) también después de redimensionar.
- [x] Cada video entra al aparecer en pantalla (opacidad y escala ligadas al scroll, solo propiedades que compone la GPU) y queda en su tamaño real al fijarse.
- [x] Con `prefers-reduced-motion` no hay animación de entrada y el video se ve completo.
- [x] Los callouts y la ficha del packaging siguen sincronizados con el video, y la ventana de frames sigue siendo 2R+1.
- [x] `npm run lint`, `typecheck`, `test` (con tests de la mezcla) y `build` sin errores.
- [ ] Con la pestaña visible: ≥ 55 FPS de media en desktop y ≥ 50 en un Android de gama media durante los dos videos.
- [ ] Otra persona lo prueba y aprueba el PR.

**DEV-40 · Historia continua: hamburguesa → bolsa y aparición de las fichas** — DEV · `Dev-WebGL` `P1` · G6 · ← DEV-39
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-40-historia-continua`
Una sola sección fijada con los dos clips y el scroll repartido por beats; fichas que aparecen de a una con fundidos en el tiempo; capítulos y barra de progreso.

_Como visitante, quiero que la historia de la hamburguesa a la bolsa se vea como un solo video fluido, con cada dato apareciendo de forma natural y sin tener que desplazarme de más, para disfrutarla y leerla sin esfuerzo._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] La hamburguesa y la bolsa son una sola sección fijada, sin corte entre los dos clips; el scroll total de la historia baja (página 10142 → 8073 px) y los tramos de video quieto se comprimen.
- [x] Nunca hay dos fichas (ni dos títulos de capítulo) visibles a la vez: medido con la rueda real, 0 frames.
- [x] Las fichas aparecen y se van con un fundido suave (cambio máximo de opacidad ≤ 0.1 por frame a 165 FPS; antes 1.0) y, donde el usuario deja de desplazarse, quedan enteras o no están (0 de 12 reposos a medio fundir).
- [x] Al subir, todo se recorre al revés (las fichas entran desde arriba) y la ficha del packaging vuelve con sus filas.
- [x] El cierre de la historia es la bolsa con el logo sin overlays.
- [x] Con `prefers-reduced-motion`: sin Lenis ni desplazamientos, se mantiene el fundido de opacidad; el texto de las fichas sigue en el DOM (lectores de pantalla).
- [x] Móvil 375×812: el producto queda centrado sobre las fichas y la ficha del packaging no tapa la bolsa.
- [x] `npm run lint`, `typecheck`, `test` (66, con tests de `timeline`, `DampedValues` y `reveal`) y `build` sin errores.
- [ ] Probado en un móvil real (táctil) y con la animación de Windows activada.
- [ ] Otra persona lo prueba y aprueba el PR.

**DEV-12 · Integrar assets reales en la vertical slice** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← G4, DEV-09, DEV-37 (los dos videos)

_Como cliente, quiero ver la vertical slice con los videos y textos definitivos para aprobar el rumbo antes del pulido._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Los dos videos reales cargan en la preview sin mostrar el fallback.
- [ ] El copy definitivo de DIR-05 está cargado en `src/content/producto.ts`.
- [x] Se puede hacer scroll de principio a fin sin frames en blanco ni saltos.
- [ ] El rendimiento en Lighthouse móvil no baja más de 5 puntos frente a `main`.
- [ ] La URL de preview está enlazada en la tarjeta.

**DEV-13 · Preloader por prioridades** — DEV · `Dev-UI` `P1` · 6 h · G5 · ← DEV-12
Ref. M Fase 8 Paso 22.
- [ ] Bloqueo crítico < 2.5 s (fuentes, 15-20 primeros frames de cada secuencia, `compileAsync` del shader)
- [ ] Streaming del resto en idle
- [ ] Botón "Entrar con sonido" / "Saltar"

_Como visitante, quiero que la primera interacción sea fluida para no ver tirones ni pantallas vacías al empezar._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] La carga crítica (fuentes, primeros 15-20 frames de cada secuencia y compilación del shader) termina en menos de 2.5 s.
- [ ] El resto de los frames se carga en segundo plano sin bloquear el scroll.
- [ ] Los botones «Entrar con sonido» y «Saltar» funcionan con ratón y con teclado.
- [ ] El `<h1>` ya está en el HTML que envía el servidor (visible antes de que cargue JavaScript).
- [ ] El primer scroll no tiene tirones (captura de Performance adjunta).

**GATE-G5 · Vertical slice** — DIR + Cliente

✔ **Criterios de salida** (checklist en Trello):
- [ ] La preview muestra Hero, los dos videos y el CTA con assets reales.
- [ ] En Performance: ≥ 55 FPS de media en desktop y ≥ 50 en Android de gama media (captura adjunta).
- [ ] El feedback del cliente está registrado y cada pedido es una tarjeta nueva.

**DEV-14 · Partículas (InstancedMesh / GPGPU)** — DEV · `Dev-WebGL` `⚠` `P2` · 8 h · G6 · ← G5
- [ ] Conteo leído de `gpuPolicy.maxParticles`
- [ ] Un solo draw call

_Como visitante, quiero partículas sutiles sobre el fondo para dar profundidad sin distraer de los videos._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Las partículas se dibujan en el único Canvas, encima del shader de fondo y por detrás de las secuencias.
- [ ] La cantidad de partículas es `gpuPolicy.maxParticles` del tier activo, y con `prefers-reduced-motion` quedan quietas.
- [ ] Todas las partículas se dibujan en un solo draw call (InstancedMesh o Points).
- [ ] Con las partículas activas: ≥ 55 FPS de media en desktop y ≥ 50 en Android de gama media.
- [ ] Al desmontar el componente se liberan su geometría y su material.

**DEV-15 · Post-procesado (Bloom + Noise)** — DEV · `Dev-WebGL` `P1` · 3 h · G6 · ← G5

_Como visitante, quiero un acabado cinematográfico en el fondo (brillo suave y grano) para que el sitio se sienta premium._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Bloom suave y grano (Noise) se aplican solo al Canvas del fondo.
- [ ] El efecto solo se monta si `gpuPolicy.enablePostProcessing` está activo (T2/T3); en T1 no existe.
- [ ] El color de las secuencias (canvas 2D aparte) y el contraste del texto no cambian.
- [ ] Con el efecto activo: ≥ 55 FPS de media en desktop y ≥ 50 en Android de gama media.

**DEV-16 · SoundController** — DEV · `Audio` `P2` · 5 h · G6 · ← ART-15, G5
Ref. M Fase 5 Paso 16.
- [ ] Opt-in tras gesto del usuario
- [ ] Low-pass 400 → 2 500 Hz según velocidad de scroll
- [ ] Mute visible con `aria-label`; pausa con `visibilitychange`
- [ ] Fallback `.m4a`

_Como visitante, quiero activar el sonido cuando yo decida para disfrutar una experiencia inmersiva sin sorpresas._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] No suena nada hasta que el usuario lo activa con un clic o toque.
- [ ] Un filtro low-pass se abre de 400 a 2 500 Hz según la velocidad del scroll.
- [ ] Hay un botón de silencio visible, con `aria-label` y estado (activado/desactivado), y el audio se pausa al ocultar la pestaña.
- [ ] En iOS Safari suena el archivo `.m4a` (probado en un iPhone real).
- [ ] Si faltan los archivos de audio, la página funciona sin errores.

---

### FASE 6 · UI/UX Y TRANSICIONES — Semanas 5-7

**DEV-17 · Navbar + CTA persistente** — DEV · `Dev-UI` `P0` · 4 h · G6 · ← DEV-08

_Como visitante, quiero un CTA siempre visible para pedir el producto desde cualquier punto de la página._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] La navbar con el CTA se ve durante todo el scroll, por encima de las secuencias fijadas (`z-index: 50`).
- [x] Desde cualquier punto de la página se llega a la conversión en 3 clics o menos.
- [x] La navbar se puede usar con teclado y el foco se ve en cada control.
- [x] En 360, 768 y 1440 px la navbar no tapa contenido importante.

**DEV-18 · Hero UI (tipografía cinética)** — DEV · `Dev-UI` `P0` · 5 h · G6 · ← DEV-12
*PLANTILLA Sección UI.* GSAP SplitText, `cubic-bezier(0.16,1,0.3,1)`.

_Como visitante, quiero un titular con una entrada animada para entender al instante qué ofrece la marca._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El titular entra animado con SplitText y la curva `cubic-bezier(0.16,1,0.3,1)`.
- [x] Lighthouse confirma que el `<h1>` sigue siendo el elemento LCP y que está en el HTML del servidor.
- [x] Con `prefers-reduced-motion` activo el titular aparece sin animación.
- [x] Lighthouse móvil: LCP < 2.5 s y CLS = 0 en la sección.

**DEV-19 a DEV-2X · Secciones narrativas** — DEV · `Dev-UI` `P1` · 6 h c/u · G6 · ← ART-05, DIR-05
*Una tarjeta por sección del storyboard* (PLANTILLA Sección UI).
> 📍 **Estado:** DEV-19 (ingredientes + packaging) en 🔍 Revisión Interna / QA · rama `feat/dev-19-ingredientes-packaging`

_Como visitante, quiero que cada sección del storyboard cuente una parte del producto para entenderlo completo._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Hay una tarjeta por sección del storyboard (DEV-19 ya cubre ingredientes + packaging); si no hay más secciones, la tarjeta genérica se archiva.
- [ ] Cada sección usa HTML semántico (h2, p, botones reales) y se ve bien en 360, 768 y 1440 px.
- [ ] Cada sección se puede usar con teclado, el foco se ve y el contraste cumple WCAG AA (≥ 4.5:1).
- [ ] Cada sección tiene CLS = 0 y no baja más de 5 puntos el rendimiento en Lighthouse móvil frente a `main`.
- [ ] DIR aprueba la composición con un comentario.

**DEV-23 · Transiciones entre secciones** — DEV · `Dev-WebGL` `Dev-UI` `P1` · 8 h · G6 · ← DEV-19…
Ref. M Fase 6 Paso 19 (coreografía de cámara, clip-path, máscara de ruido).

_Como visitante, quiero pasar de una sección a otra sin cortes para que la navegación se sienta continua._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Cada par de secciones vecinas tiene la transición que define DIR-04 (recorte animado o máscara de ruido).
- [ ] Con `prefers-reduced-motion` activo, la transición es un corte directo o un fundido simple.
- [ ] Durante las transiciones: ≥ 55 FPS de media en desktop y ≥ 50 en Android de gama media.
- [ ] DIR confirma con un comentario que la navegación se siente continua.

**DEV-24 · Cursor personalizado** — DEV · `Dev-UI` `P2` · 3 h · G6

_Como visitante en desktop, quiero un cursor personalizado que refuerce la estética sin estorbar._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El cursor personalizado solo aparece con ratón o trackpad (no en pantallas táctiles).
- [x] Con `prefers-reduced-motion` activo se usa el cursor normal del sistema.
- [x] En los campos de texto se ve el cursor normal del sistema.
- [x] El cursor lee la posición del store transiente, sin setState de React en cada movimiento.

**DEV-25 · Footer + formulario de contacto** — DEV · `Dev-UI` `SEO/Negocio` `P0` · 5 h · G6
- [ ] Validación cliente + servidor
- [ ] Rate-limit / captcha
- [ ] Mensajes de error accesibles

_Como visitante, quiero contactar a la marca desde el sitio para hacer un pedido o una consulta._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] El formulario valida los datos en el navegador y en el servidor, con un mensaje claro por cada campo con error.
- [x] Hay límite de envíos o captcha, comprobado enviando el formulario varias veces seguidas.
- [x] Los errores se anuncian a lectores de pantalla (`aria-live`) y el foco salta al primer campo con error.
- [ ] En una prueba real, el mensaje llega al email o WhatsApp del cliente.
- [ ] El footer muestra los datos de contacto y enlaces a los textos legales.

---

### FASE 7 · RENDIMIENTO — Semanas 6-7 → **G6**

**DEV-26 · Auditoría VRAM y fugas** — DEV · `Dev-WebGL` `⚠` `P0` · 4 h · G6 · ← G5
Prompt P7. Ref. M Parte II §10.
- [ ] `grep useState` en canvas/ y sequence/
- [ ] Heap y GPU Memory estables tras 10 scrolls completos
- [ ] Todos los ScrollTriggers matados al desmontar

_Como desarrollo, quiero auditar la memoria y las fugas para que el sitio no se cuelgue ni se recargue en móviles._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Revisados todos los `useState` de `canvas/` y `sequence/`: ninguno se actualiza en cada frame, scroll o movimiento del puntero.
- [x] Tras recorrer la página de arriba a abajo 10 veces, la memoria JS vuelve a ±10 % del valor inicial.
- [x] Nunca hay más de 2R+1 frames (ImageBitmaps) en memoria por secuencia, siendo R el radio del tier.
- [x] Al desmontar quedan 0 ScrollTriggers activos y se eliminan todos los listeners.
- [x] El informe con las capturas de memoria (heap y GPU) está adjunto a la tarjeta.

**DEV-27 · Prueba de tiers y fallbacks** — DEV · `Dev-WebGL` `P0` · 3 h · G6
- [ ] Forzar T1, T2 y T3 (override de desarrollo)
- [ ] Simular sin WebGL → póster + página funcional
- [ ] `prefers-reduced-motion` → sin Lenis ni rotaciones

_Como desarrollo, quiero comprobar cada tier y cada fallback para garantizar que el sitio funciona en cualquier dispositivo._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Hay un modo de desarrollo para forzar T1, T2 y T3, que no está activo en producción.
- [ ] Los 5 escenarios están documentados con captura: T3, T2, T1, sin WebGL y con reduced motion.
- [ ] Sin WebGL: no hay canvas WebGL, la página se recorre completa y el CTA funciona.
- [x] Con reduced motion: no se crea Lenis, el shader queda quieto y las secuencias avanzan solo con el scroll nativo.
- [x] La consola no muestra errores, salvo los 404 esperados de assets aún no entregados.

**DEV-28 · Core Web Vitals y bundle** — DEV · `Dev-WebGL` `P0` · 4 h · G6
- [ ] Lighthouse móvil: LCP < 2.5 s, CLS < 0.1, INP < 200 ms
- [ ] Bundle analyzer: JS inicial ≤ budget
- [ ] Dynamic import del Canvas y las secciones pesadas

_Como visitante en móvil, quiero que el sitio cargue rápido y responda al instante._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Lighthouse móvil: LCP < 2.5 s, CLS < 0.1 e INP < 200 ms (informe adjunto).
- [ ] El JS inicial entra en el budget de DEV-01 (captura del bundle analyzer adjunta).
- [x] El Canvas WebGL se carga en diferido (hecho en DEV-07).
- [ ] Las secciones pesadas se cargan con dynamic import.

---

### FASE 8 · QA Y ACCESIBILIDAD — Semana 7 → **G6**

**DIR-06 · QA en matriz de dispositivos** — DIR · `P0` · 6 h · G6 · ← DEV-26…28
- [ ] Los 6 dispositivos de DEV-01: scroll, CTA, formulario, audio, rotación de pantalla
- [ ] Red lenta (Fast 3G simulado)
- [ ] Cada fallo → tarjeta `BUG-XX`

_Como dirección, quiero probar el sitio en los dispositivos reales del público para detectar fallos antes del lanzamiento._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] En los 6 dispositivos de DEV-01 se probó: scroll completo, CTA, formulario, audio y rotación de pantalla.
- [ ] Se probó con red lenta (Fast 3G simulado).
- [ ] Cada fallo es una tarjeta `BUG-XX` con dispositivo, pasos para reproducirlo y captura.
- [ ] Al cerrar, no queda ninguna tarjeta `BUG` con prioridad P0 abierta.

**DEV-29 · Accesibilidad WCAG 2.2 AA** — DEV · `Dev-UI` `P0` · 4 h · G6
Prompt P8.
- [ ] Recorrido completo con teclado y skip link
- [ ] Foco visible, `alt`, `aria-label` en controles de icono
- [ ] Contraste ≥ 4.5:1
- [ ] Lighthouse accesibilidad ≥ 95

_Como visitante que navega con teclado o lector de pantalla, quiero usar todo el sitio para llegar al producto y al CTA._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] Con Tab se recorre todo el sitio: el enlace «Saltar al contenido» es lo primero, el foco se ve en cada control y el orden es lógico.
- [x] Los botones de icono y los canvas de las secuencias tienen `aria-label`, y la capa WebGL tiene `aria-hidden`.
- [x] El contraste es ≥ 4.5:1 en texto normal y ≥ 3:1 en texto grande.
- [x] Lighthouse accesibilidad ≥ 95 (informe adjunto).
- [ ] La prueba se repite con el diseño definitivo antes de G6.

**DIR-07 · Revisión de dirección de arte final** — DIR · `Concepto/Arte` `P1` · 3 h · G6
- [ ] Coherencia lumínica entre todos los assets
- [ ] Jerarquía tipográfica y espaciado (Prompt P6 si hace falta)

_Como dirección, quiero una revisión final de arte para asegurar la coherencia visual de todo el sitio._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Revisado que luz y color coinciden entre videos, pósters y fondo.
- [ ] Revisadas la jerarquía tipográfica y el espaciado en 360, 768 y 1440 px.
- [ ] Cada ajuste pendiente es una tarjeta P2 en el backlog.

**GATE-G6 · Beta QA** — DIR

✔ **Criterios de salida** (checklist en Trello):
- [ ] DEV-26 a DEV-29, DIR-06 y DIR-07 están en «completados».
- [ ] Lighthouse móvil: LCP < 2.5 s, CLS < 0.1, INP < 200 ms y accesibilidad ≥ 95.
- [ ] No queda ninguna tarjeta `BUG` con prioridad P0 abierta.

---

### FASE 9 · NEGOCIO, SEO Y CONTENIDO — Semanas 6-7

**DEV-30 · SEO técnico** — DEV · `SEO/Negocio` `P0` · 4 h · G7
Ref. M Fase 9 Paso 25.
- [ ] `metadata` (title, description, OG, canónica)
- [ ] `sitemap.ts`, `robots.ts`
- [ ] JSON-LD según tipo de negocio
- [ ] Todo el texto en el DOM real

_Como marca, quiero que el sitio aparezca en buscadores y se comparta bien en redes para atraer clientes._
✔ **Criterios de aceptación** (checklist en Trello):
- [x] La `metadata` es real: título ≤ 60 caracteres, descripción ≤ 155, imagen Open Graph (`og-image.jpg`) y URL canónica.
- [x] `/sitemap.xml` y `/robots.txt` existen y son válidos (generados con `sitemap.ts` y `robots.ts`).
- [x] Los datos estructurados (JSON-LD) del negocio pasan Rich Results Test sin errores.
- [x] Todo el texto está en el HTML de la página (nada existe solo dentro de un canvas).

**DEV-31 · CMS headless (si está en alcance)** — DEV · `SEO/Negocio` `P1` · 10 h · G7

_Como cliente, quiero editar textos y precios sin programar para mantener el sitio al día._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Solo se hace si DIR-02 lo incluye en el alcance; si no, la tarjeta se archiva.
- [ ] Los textos que hoy están en `src/content/producto.ts` se leen desde el CMS.
- [ ] El cliente cambia un texto en el CMS y el cambio se ve en la web sin volver a desplegar el código.

**DEV-32 · E-commerce / checkout (si está en alcance)** — DEV · `SEO/Negocio` `P0` · 16 h · G7
- [ ] `frameloop` en pausa con carrito o checkout abierto
- [ ] Pago probado de punta a punta (sandbox y real)

_Como visitante, quiero comprar desde el sitio para pedir sin salir de la experiencia._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Solo se hace si DIR-02 lo incluye en el alcance; si no, la tarjeta se archiva.
- [ ] Con el carrito o el checkout abiertos, el Canvas se pausa (`frameloop` en «never»).
- [ ] El pago funciona en modo de prueba (sandbox) y con una compra real.
- [ ] Se completó una compra real en iOS y otra en Android.

**DEV-33 · Analítica, Sentry y consentimiento de cookies** — DEV · `SEO/Negocio` `P1` · 4 h · G7
- [ ] Eventos de conversión (clic en CTA, envío de formulario, compra)
- [ ] Sentry capturando errores WebGL
- [ ] Banner de consentimiento + política de privacidad

_Como dirección, quiero medir conversiones y errores para saber si el sitio cumple el KPI._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] En el panel de analítica se ven los eventos de clic en el CTA y de envío de formulario (y compra, si aplica).
- [ ] Sentry recibe un error WebGL de prueba.
- [ ] Mientras el visitante no acepta el banner de cookies, no se carga ningún script de analítica.
- [ ] La política de privacidad está publicada y enlazada en el footer.

**DIR-08 · Copy final + textos legales** — DIR · `SEO/Negocio` `P1` · 4 h · G7

_Como dirección, quiero el copy final y los textos legales aprobados para publicar sin errores ni riesgos._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El copy final está revisado por una segunda persona y cargado en `src/content/producto.ts`.
- [ ] Están listos los textos legales: privacidad, cookies y, si corresponde, alérgenos y tabla nutricional.
- [ ] El cliente aprueba el copy y los textos legales por escrito.

---

### FASE 10 · LANZAMIENTO — Semana 8 → **G7**

**DEV-34 · Dominio, SSL, cabeceras y caché** — DEV · `P0` · 2 h · G7
- [ ] Dominio + SSL
- [ ] Cabeceras de seguridad (CSP, HSTS)
- [ ] `Cache-Control immutable` en assets **versionados**

_Como visitante, quiero un sitio seguro y rápido en el dominio oficial de la marca._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El dominio apunta a producción con certificado SSL válido y siempre redirige a HTTPS.
- [ ] Las cabeceras CSP y HSTS están activas y securityheaders.com da nota A o superior.
- [ ] Solo los assets versionados (con nombre o carpeta nueva en cada cambio) usan `Cache-Control immutable`.

**DIR-09 · Checklist de lanzamiento** — DIR · `P0` · 3 h · G7 · ← todo lo anterior
Copiar como checklist la **Parte III del Manual v2** completa.

_Como dirección, quiero un checklist de lanzamiento completo para no olvidar nada antes de publicar._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] La Parte III del Manual está copiada como checklist en esta tarjeta.
- [ ] Todos los ítems están marcados, o justificados como «no aplica» con un comentario.
- [ ] DIR y DEV revisaron el checklist y lo dejan aprobado con un comentario.

**DEV-35 · Deploy a producción + verificación en vivo** — DEV · `P0` · 3 h · G7 · ← DIR-09
- [ ] Deploy
- [ ] Repetir Lighthouse y QA rápido **en producción**
- [ ] Plan de rollback documentado

_Como cliente, quiero el sitio en producción y verificado para lanzarlo con confianza._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El sitio está desplegado en producción desde la rama `main`.
- [ ] En producción se repitieron Lighthouse móvil y una prueba rápida de QA, con los mismos umbrales de G6.
- [ ] Está documentado cómo volver a la versión anterior si algo falla (plan de rollback).
- [ ] Producción se comporta igual que la preview aprobada, sin regresiones.

**GATE-G7 · Go-live** — Cliente + DIR

✔ **Criterios de salida** (checklist en Trello):
- [ ] El checklist de lanzamiento de DIR-09 está completo al 100 %.
- [ ] DEV-35 está verificado en producción.
- [ ] El cliente aprueba el lanzamiento por escrito.

**DIR-10 · Entrega y handoff** — DIR · `P1` · 3 h
- [ ] Accesos entregados al cliente
- [ ] Guía de uso del CMS
- [ ] `LICENCIAS.md` final

_Como cliente, quiero recibir los accesos y la documentación para operar el sitio sin depender del estudio._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Los accesos (dominio, hosting, CMS y analítica) se entregan mediante un gestor de contraseñas.
- [ ] Si hay CMS, el cliente recibe una guía de uso (documento o video).
- [ ] El cliente recibe la versión final de `LICENCIAS.md`.
- [ ] El acta de entrega está firmada por el cliente.

---

### 🚀 POST-LANZAMIENTO (lista "Producción")

**DIR-11 · Medición a 30 días** — DIR · 2 h: KPI de negocio vs. objetivo, embudo de conversión y mapa de calor.

_Como dirección, quiero medir los resultados a los 30 días para saber si el sitio cumple el KPI del brief._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] El informe compara el KPI real con el objetivo de DIR-01.
- [ ] El informe muestra el embudo completo: visitas → clic en CTA → conversión.
- [ ] Hay un mapa de calor o grabaciones de las secciones clave.
- [ ] Cada recomendación del informe es una tarjeta nueva.

**DEV-36 · Monitoreo semanal (Card Repeater)** — DEV · 1 h/sem: errores de Sentry, CWV de campo (CrUX/Vercel) y FPS reportados.

_Como desarrollo, quiero revisar cada semana los errores y el rendimiento real para detectar problemas antes que los usuarios._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] Cada semana queda un comentario con: errores nuevos de Sentry, Core Web Vitals de usuarios reales y FPS reportados.
- [ ] Cada problema nuevo se convierte en una tarjeta `BUG-XX`.
- [ ] Las Core Web Vitals de usuarios reales están en verde (LCP < 2.5 s, CLS < 0.1, INP < 200 ms) o hay una tarjeta de mejora abierta.

**DIR-12 · Retro del proyecto y actualización del Manual** — Todo el equipo · 2 h: lecciones aprendidas → nueva versión del Manual (v2.1).

_Como equipo, queremos cerrar el proyecto con una retro para mejorar el proceso en el siguiente._
✔ **Criterios de aceptación** (checklist en Trello):
- [ ] La retro se hizo con todo el equipo y registra qué funcionó, qué no y qué acciones tomar.
- [ ] Cada acción de la retro tiene un responsable.
- [ ] Las lecciones aprendidas están en una nueva versión del Manual (PR en una rama `docs/`).

---

## 6. CRONOGRAMA DE REFERENCIA (8 SEMANAS)

| Semana | DIR | ART | DEV | Gate |
| :-: | :--- | :--- | :--- | :-: |
| **1** | Kickoff, brief, alcance, licencias | Concepto, moodboard | Budget, matriz de dispositivos | **G1** |
| **2** | Storyboard, copy v1 | Paleta, tipografía, wireframes | Validación técnica, setup repo + CLAUDE.md | **G2** |
| **3** | Seguimiento, review | Key visuals, keyframes, inicio del modelo 3D | Política GPU, store, scroll, Canvas | **G3** |
| **4** | Review vertical slice parcial | Secuencia IA Hero, upscale, export; modelo 3D | ImageSequenceCanvas, shader, Hero mesh (con fallbacks) | — |
| **5** | Review G5 con cliente | Compresión `.glb`, HDRI, assets secundarios, audio | Integración de assets reales, preloader | **G4 · G5** |
| **6** | Copy final, legales | Assets secundarios, pósters, ajustes | Secciones UI, transiciones, partículas, SEO, analítica | — |
| **7** | QA de dispositivos, revisión de arte | Pulido de assets | Auditorías de rendimiento y accesibilidad, bugs | **G6** |
| **8** | Checklist, entrega | — | Producción, verificación en vivo | **G7** |

> **Ruta crítica:** ART-07 → ART-08 → ART-10 → DEV-12 → G5. Si la generación IA se atrasa, DEV avanza con los fallbacks procedurales (por eso existen) y **G5 no se mueve**: DIR decide si se presenta con un asset provisional.

---

## 7. RIESGOS PRINCIPALES Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación | Dueño |
| :--- | :-: | :-: | :--- | :-: |
| El clip IA no sale sin *morphing* | Alta | Alto | Presupuestar 3× iteraciones; plan B: render en Blender del mismo movimiento | ART |
| VRAM agotada en iOS (la pestaña se recarga) | Media | Alto | Ventana deslizante, KTX2, `dpr` limitado, pruebas en un iPhone viejo desde G5 | DEV |
| LCP > 2.5 s por el hero 3D | Media | Alto | `<h1>` en SSR como LCP, Canvas con dynamic import, preloader corto | DEV |
| Desfase de color entre assets y fondo | Media | Medio | Mismo hex/alfa, LUT única, prueba en navegador en G3 | ART |
| Cliente pide cambios fuera de alcance | Alta | Medio | Alcance firmado (DIR-02); cambios → tarjeta en Backlog con estimación y aprobación | DIR |
| Licencia de fuente/modelo/IA no apta para uso comercial | Baja | Alto | `LICENCIAS.md` desde G1; no se usa ningún asset sin licencia registrada | DIR |
| Conversión baja ("wow" sin acción) | Media | Alto | CTA persistente, ≤ 3 clics, eventos de analítica, revisión a 30 días | DIR |

---

## 8. CÓMO MONTAR ESTE TABLERO EN TRELLO (paso a paso, ~45 min)

1. Crear tablero **"WEB-<Cliente> · Experiencia Hiperrealista"** (fondo oscuro).
2. Crear las **10 listas** de la sección 2.1 en ese orden.
3. Activar los Power-Ups **Custom Fields** y **Card Repeater**, y crear los campos de la sección 2.3.
4. Crear las **12 etiquetas** de la sección 2.2.
5. En **📌 Guía del Tablero**, crear GUIA-01…05 y las **5 plantillas** (sección 4).
6. En **🚦 Gates**, crear GATE-G1…G7 con sus checklists (sección 3.4).
7. Cargar el **Backlog** (sección 5). Truco: pegar una lista de títulos (uno por línea) en "Añadir tarjeta" y Trello ofrece crear una tarjeta por línea. Después se completa cada una.
8. Configurar las **reglas Butler** (sección 3.5) en Automatización → Reglas.
9. Asignar responsables y fechas según el cronograma (sección 6).
10. Planning del Sprint 1: mover a **Sprint Actual** las tarjetas de Fase 0 y las primeras de Fase 1.

**Lista rápida de títulos para pegar en el Backlog:**
```
DIR-01 · Kickoff y brief del cliente
DIR-02 · Alcance cerrado y cronograma
DEV-01 · Performance Budget y matriz de dispositivos
DIR-03 · Registro de licencias
ART-01 · Concepto y física de la experiencia
ART-02 · Moodboard estético + motion
ART-03 · Paleta, luz y LUT
ART-04 · Sistema tipográfico con licencia
DIR-04 · Storyboard por sección
DEV-02 · Validación técnica del storyboard
ART-05 · Wireframes y grilla en Figma
DIR-05 · Copy v1
ART-06 · Key visuals maestros
ART-07 · Keyframes inicial/final secuencia Hero
ART-08 · Generación secuencia IA Hero
ART-09 · Upscale y color de la secuencia
ART-10 · Export WebP desktop/mobile
ART-11 · Secuencias/imágenes de secciones secundarias
ART-12 · Pósters fallback T0/T1 y OG image
ART-13 · Modelo 3D Hero (Blender)
ART-14 · HDRI de estudio
DEV-03 · Pipeline de compresión .glb
ART-15 · Diseño sonoro
DEV-04 · Repo, Next.js 16 y CLAUDE.md
DEV-05 · Política de GPU, manifiesto y store
DEV-06 · SmoothScrollProvider + detect-gpu
DEV-07 · GlobalCanvas Single-Canvas + PerformanceMonitor
DEV-08 · Tokens de diseño y fuentes
DEV-09 · ImageSequenceCanvas ventana deslizante
DEV-10 · Shader de fondo fluido
DEV-11 · HeroArtifactMesh + rig de iluminación
DEV-12 · Integrar assets reales en la vertical slice
DEV-13 · Preloader por prioridades
DEV-14 · Partículas InstancedMesh/GPGPU
DEV-15 · Post-procesado Bloom + Noise
DEV-16 · SoundController
DEV-17 · Navbar + CTA persistente
DEV-18 · Hero UI tipografía cinética
DEV-19 · Sección narrativa 1
DEV-20 · Sección narrativa 2
DEV-21 · Sección narrativa 3
DEV-22 · Sección narrativa 4
DEV-23 · Transiciones entre secciones
DEV-24 · Cursor personalizado
DEV-25 · Footer + formulario de contacto
DEV-26 · Auditoría VRAM y fugas
DEV-27 · Prueba de tiers y fallbacks
DEV-28 · Core Web Vitals y bundle
DIR-06 · QA matriz de dispositivos
DEV-29 · Accesibilidad WCAG 2.2 AA
DIR-07 · Revisión de dirección de arte final
DEV-30 · SEO técnico
DEV-31 · CMS headless
DEV-32 · E-commerce / checkout
DEV-33 · Analítica, Sentry y cookies
DIR-08 · Copy final + legales
DEV-34 · Dominio, SSL, cabeceras y caché
DIR-09 · Checklist de lanzamiento
DEV-35 · Deploy a producción + verificación
DIR-10 · Entrega y handoff
DIR-11 · Medición a 30 días
DEV-36 · Monitoreo semanal
DIR-12 · Retro del proyecto y actualización del Manual
```

---

> **Cierre de Dirección:** la calidad "nivel Lusion" no sale de una herramienta. Sale de **gates respetados, presupuestos medidos y una sola fuente de verdad**. Si un asset rompe el budget, no entra. Si una sección no convierte, no está terminada. Si algo no está en el tablero, no existe.
