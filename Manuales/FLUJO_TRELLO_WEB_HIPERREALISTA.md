# FLUJO DE TRABAJO EN TRELLO — PRODUCCIÓN DE WEB HIPERREALISTA
## Tablero operativo del estudio (equipo de 2 a 4 personas)

**Versión:** 1.0 · **Fecha:** 19-11-2026 · **Documento técnico de referencia:** `MANUAL_V2_WEB_HIPERREALISTA.md` (se cita como **M§**, p. ej. *M Fase 2 Paso 5*)
**Alcance de referencia:** landing inmersiva de 4-6 secciones con un Hero 3D, una secuencia cinematográfica IA y una sección de conversión. **Duración:** 8 semanas.

> **Directiva de Dirección:** este tablero es la única fuente de verdad del proyecto. Si algo no está en una tarjeta, no existe; si una tarjeta no tiene criterio de aceptación, no puede pasar a *Done*. **Ninguna tarjeta salta un Gate.**

---

## 0. ESTADO ACTUAL DEL TABLERO (registro vivo)

> **Obligatorio:** cada rama que empieza, avanza o cierra una tarjeta actualiza esta sección **en la misma rama/PR** (ver Guía de gobernanza GitHub §4). Si no está aquí, el equipo no sabe que existe.
> **Última actualización:** 19-11-2026 · **Sprint:** 1 · **Actualizado por:** DEV (Claude Code)

### 0.1 Tarjetas activas

| Tarjeta | Estado (lista) | Responsable | Rama | PR / base | Notas |
| :--- | :--- | :-: | :--- | :--- | :--- |
| DEV-04 · Repo, Next.js 16 y CLAUDE.md | 🔍 Revisión Interna / QA | DEV | `feat/dev-04-setup-base` | PR → `develop` | Lint/typecheck/build OK. Falta: conectar Vercel (Preview URL) |
| DEV-05 · Política de GPU, manifiesto y store | 🔍 Revisión Interna / QA | DEV | `feat/dev-05-gpu-policy-store` | PR → `feat/dev-04-setup-base` | `damp` verificado independiente de FPS |
| DEV-06 · SmoothScrollProvider + detect-gpu | 🔍 Revisión Interna / QA | DEV | `feat/dev-06-smooth-scroll` | PR → `feat/dev-05-gpu-policy-store` | Falta probar en navegador: tier en consola y scroll sin doble RAF |
| DOCS · Registro de avance en Trello y gobernanza | 🔍 Revisión Interna / QA | DEV | `docs/trello-registro-avance` | PR → `feat/dev-06-smooth-scroll` | Esta sección + regla en la guía de GitHub |
| DEV-07 · GlobalCanvas + PerformanceMonitor | 🗓️ Sprint Actual (siguiente) | DEV | `feat/dev-07-global-canvas` (por crear) | — | Sale de DEV-06 |

**Orden de fusión del stack:** DEV-04 → `develop`; luego cambiar la base de cada PR siguiente a `develop` y fusionar DEV-05 → DEV-06 → DOCS.

### 0.2 Hecho (resumen de lo trabajado)

| Fecha | Tarjeta | Qué se hizo | Commit / rama |
| :--- | :--- | :--- | :--- |
| 19-11-2026 | DEV-04 | Dependencias fijadas (three, R3F v9, drei, gsap, lenis, zustand, maath, detect-gpu, howler); `copy-decoders.mjs` en `postinstall`; `next.config.ts` con caché `immutable`; `CLAUDE.md` (Parte II del manual); contrato de carpetas `/public`; `LICENCIAS.md` plantilla; se eliminó el boilerplate; CI con typecheck | `75068d8` · `feat/dev-04-setup-base` |
| 19-11-2026 | DEV-05 | `gpu-policy.ts` (políticas por tier + `ASSET_MANIFEST`), `math.ts` (`damp`, `clamp`, `mapRange`), `useExperienceStore.ts` | `47f5df7` · `feat/dev-05-gpu-policy-store` |
| 19-11-2026 | DEV-06 | `SmoothScrollProvider`: Lenis (`autoRaf:false`) con `gsap.ticker`, sin Lenis con reduced motion, detect-gpu con benchmarks propios, puntero mutable, pausa con `visibilitychange`; montado en el layout | `07737d6` · `feat/dev-06-smooth-scroll` |

### 0.3 Bloqueos y dependencias abiertas

- **G1 / G2 sin aprobar:** DIR-01…05 y ART-01…05 siguen en Backlog. DEV avanzó en paralelo con la base técnica, que no depende del arte (ruta crítica, §6). La paleta y las fuentes reales entran en DEV-08, después de ART-03 y ART-04.
- **Vercel:** las Preview URLs aún no están conectadas (pendiente de DEV-04).
- **DIR-03:** `LICENCIAS.md` creado como plantilla; falta completarlo.

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
- [ ] Criterio de aceptación verificado **por una persona distinta al responsable**.
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
| **G4** | Assets optimizados | DIR + DEV | Todos los `.glb`/secuencias/audio dentro del budget, en `/public` con nombres del contrato (M Parte II §2) | 5 |
| **G5** | Vertical slice | DIR + Cliente | Hero + 1 secuencia + CTA en URL de preview a 60 FPS desktop / ≥ 50 gama media | 5 |
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
Criterio de aceptación: DIR aprueba el clip frame a frame; peso ≤ 8 MB desktop / 4 MB mobile.
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
✔ Brief de 1 página aprobado por el cliente.

**DIR-02 · Alcance cerrado y cronograma** — DIR · `P0` · 3 h · G1 · ← DIR-01
- [ ] Nº de secciones, idiomas, CMS sí/no, e-commerce sí/no
- [ ] Rondas de revisión por gate (2 recomendadas)
- [ ] Cronograma de 8 semanas con fechas de gates
- [ ] Qué queda **fuera** del alcance (por escrito)
✔ Documento de alcance firmado.

**DEV-01 · Performance Budget y matriz de dispositivos** — DEV · `Dev-WebGL` `P0` · 2 h · G1 · ← DIR-01
Ref. M Fase 0. Ajustar la tabla según la analítica del cliente.
- [ ] Budget de JS, peso crítico, peso total, `.glb`, secuencias
- [ ] Matriz QA: iPhone reciente, iPhone de hace 3-4 años, Android gama media, Android gama baja, MacBook, Windows con GPU integrada
- [ ] Objetivos de CWV y FPS
✔ Budget publicado en GUIA-03.

**DIR-03 · Registro de licencias** — DIR · `SEO/Negocio` `P1` · 1 h · G1
- [ ] Crear `LICENCIAS.md` (fuentes, modelos, audio, IA)
- [ ] Revisar los términos de uso comercial de cada herramienta IA del plan
✔ Archivo creado y enlazado.

**GATE-G1 · Brief y alcance aprobados** — DIR + Cliente
- [ ] DIR-01, DIR-02, DEV-01, DIR-03 en Hecho
- [ ] Aprobación escrita del cliente (email o comentario)

---

### FASE 1 · CONCEPTO Y DIRECCIÓN DE ARTE — Semanas 1-2 → **G2**

**ART-01 · Concepto y física de la experiencia** — ART · `Concepto/Arte` `P0` · 6 h · G2 · ← G1
Ref. M Fase 1 Paso 1.
- [ ] Arquetipo y dirección estética (1 párrafo)
- [ ] Física de interacción traducida a valores λ (denso 2-4 / natural 5-7 / preciso 10-14)
- [ ] 3 palabras clave sensoriales
✔ DIR aprueba la ficha de concepto.

**ART-02 · Moodboard estético + motion** — ART · `Concepto/Arte` `P0` · 6 h · G2 · ← ART-01
Ref. M Fase 1 Paso 2.
- [ ] Tablero Estética (Behance/Pinterest/Midjourney)
- [ ] Tablero Motion (Awwwards/FWA con links a los sitios)
- [ ] 3 exploraciones de material/luz con IA
✔ Moodboard presentado y aprobado.

**ART-03 · Paleta, luz y LUT** — ART · `Concepto/Arte` `P0` · 3 h · G2 · ← ART-02
- [ ] Hex de fondo (`#0A0A0A` o el definido) y acentos
- [ ] Dirección de Key Light y Rim Light (diagrama)
- [ ] LUT de color para todos los assets
✔ Publicado en GUIA-04.

**ART-04 · Sistema tipográfico con licencia** — ART/DIR · `Dev-UI` `P1` · 2 h · G2
- [ ] Display (preferible variable font) + técnica (una sola familia, no "Slab/Mono")
- [ ] Licencia web comprada o fuente open source
- [ ] Archivos `.woff2` entregados a DEV
✔ Licencias en `LICENCIAS.md`.

**DIR-04 · Storyboard por sección** — DIR · `Concepto/Arte` `P0` · 6 h · G2 · ← ART-02
Ref. M Fase 1 entregable. Cuadro por cuadro, del preloader al CTA.
- [ ] Por cada sección: objetivo, técnica (Secuencia / 3D RT / Shader 2D / UI) y **fallback T1/T0**
- [ ] Ubicación del CTA persistente
- [ ] Transiciones entre secciones
✔ Storyboard aprobado por cliente.

**DEV-02 · Validación técnica del storyboard** — DEV · `Dev-WebGL` `P0` · 3 h · G2 · ← DIR-04
- [ ] Cada técnica es viable dentro del budget
- [ ] Riesgos marcados con ⚠
- [ ] Estimación de peso por sección
✔ Comentario de viabilidad en DIR-04; riesgos convertidos en tarjetas.

**ART-05 · Wireframes y grilla en Figma** — ART/DIR · `Dev-UI` `P1` · 8 h · G2 · ← DIR-04
- [ ] Grilla de 12 columnas, desktop y mobile
- [ ] Wireframes de todas las secciones
- [ ] Estados de botones, nav y preloader
✔ Figma enlazado y aprobado.

**DIR-05 · Copy v1** — DIR · `SEO/Negocio` `P1` · 6 h · G2 · ← DIR-04
- [ ] Titulares, textos y CTAs por sección
- [ ] Palabras clave SEO objetivo
✔ Copy aprobado por cliente.

**GATE-G2 · Dirección de arte y storyboard aprobados** — Cliente + DIR
- [ ] ART-01 a ART-05, DIR-04, DIR-05 y DEV-02 en Hecho

---

### FASE 2 · PRODUCCIÓN DE ASSETS E IA — Semanas 3-4 → **G3**

**ART-06 · Key visuals maestros** — ART · `Concepto/Arte` `P0` · 10 h · G3 · ← G2
Ref. M Fase 2 Paso 3.
- [ ] Renders/imágenes maestras por sección con la luz de ART-03
- [ ] Fondo = hex del DOM o alfa
- [ ] Prueba de borde en navegador
✔ Sin costura visible contra el fondo del sitio.

**ART-07 · Keyframes inicial/final para la secuencia Hero** — ART · `IA-Video` `P0` · 6 h · G3 · ← ART-06
- [ ] Mismo aspect ratio, lente y altura de cámara
- [ ] Inicial (producto cerrado) y final (exploded view)
✔ DIR aprueba el par de keyframes.

**GATE-G3 · Key visuals + coherencia lumínica** — Cliente + DIR · ← ART-06, ART-07

**ART-08 · Generación de la secuencia IA Hero** — ART · `IA-Video` `P0` · 10 h · G4 · ← G3
*Usar la PLANTILLA Asset IA-Video.* Ref. M Fase 2 Paso 4 (verificar el flujo vigente de la herramienta).
✔ Clip master sin morphing, aprobado frame a frame.

**ART-09 · Upscale y color de la secuencia** — ART · `IA-Video` `P1` · 4 h · G4 · ← ART-08
- [ ] Topaz Video / DaVinci a FPS constantes
- [ ] LUT del proyecto aplicada
✔ Master final archivado en Drive.

**ART-10 · Export WebP desktop/mobile** — ART · `IA-Video` `⚠` `P0` · 2 h · G4 · ← ART-09
Ref. M Fase 2 Paso 5 (corrección: **mismo fps**).
- [ ] `ffmpeg` desktop 1600 px y mobile 800 px a 24 fps
- [ ] Conteos idénticos (`ls | wc -l`)
- [ ] Peso ≤ 8 MB / 4 MB
- [ ] Copiar a `/public/sequences/hero_explode/{desktop,mobile}`
✔ Campo *Peso (MB)* completo y DEV confirma que el conteo coincide con `ASSET_MANIFEST`.

**ART-11 · Secuencias / imágenes de secciones secundarias** — ART · `IA-Video` `P1` · 12 h · G4 · ← G3
*Una tarjeta por asset* (duplicar desde la plantilla).

**ART-12 · Pósters de fallback T0/T1 y OG image** — ART · `Concepto/Arte` `P1` · 3 h · G4 · ← ART-06
- [ ] `hero_poster.webp` y un póster por secuencia
- [ ] `og-image.jpg` 1200×630
✔ En `/public/fallback`.

---

### FASE 3 · MODELADO 3D Y OPTIMIZACIÓN — Semanas 3-5 → **G4**

**ART-13 · Modelo 3D Hero (Blender)** — ART · `3D` `P0` · 16 h · G4 · ← G2
*Usar la PLANTILLA Modelo 3D.* Ref. M Fase 3 Pasos 6-7.
✔ Polycount dentro del presupuesto; materiales PBR correctos.

**ART-14 · HDRI de estudio** — ART · `3D` `P1` · 2 h · G4
- [ ] `.hdr` < 1 MB coherente con la luz de ART-03
✔ En `/public/hdri/studio_dark_01.hdr`.

**DEV-03 · Pipeline de compresión .glb** — DEV · `3D` `Dev-WebGL` `⚠` `P0` · 4 h · G4 · ← ART-13
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
✔ Archivos en `/public/audio`.

**GATE-G4 · Assets optimizados** — DIR + DEV
- [ ] Todos los assets en `/public` con los nombres del contrato (M Parte II §2)
- [ ] Todos los pesos dentro del budget (campo *Peso*)
- [ ] `LICENCIAS.md` actualizado

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
✔ URL de preview funcionando y `npm run build` limpio.

**DEV-05 · Política de GPU, manifiesto y store** — DEV · `Dev-WebGL` `P0` · 3 h · G5 · ← DEV-04
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-05-gpu-policy-store`
Ref. M Parte II §4-5. Prompt P1.
✔ `gpu-policy.ts` (con `totalFrames` por variante) y `useExperienceStore.ts` con `reducedMotion`/`webglAvailable`.

**DEV-06 · SmoothScrollProvider + detect-gpu** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← DEV-05
> 📍 **Estado:** 🔍 Revisión Interna / QA · rama `feat/dev-06-smooth-scroll` · falta prueba en navegador real
*Usar la PLANTILLA Componente WebGL.* Ref. M Parte II §6. Prompt P2.
- [ ] `autoRaf:false`, un solo reloj (gsap.ticker)
- [ ] Sin Lenis con `prefers-reduced-motion`
- [ ] Benchmarks auto-hospedados
- [ ] Puntero mutable
✔ Tier detectado visible en consola (en desarrollo); scroll fluido sin doble RAF.

**DEV-07 · GlobalCanvas (Single-Canvas) + PerformanceMonitor** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← DEV-06
> 📍 **Estado:** 🗓️ Sprint Actual (siguiente) · rama `feat/dev-07-global-canvas` (por crear)
Ref. M Parte II §8. `flipflops={3}`, `onFallback`, no se monta si `webglAvailable=false`.
✔ Un único contexto WebGL (verificado en DevTools).

**DEV-08 · Tokens de diseño y fuentes** — DEV · `Dev-UI` `P1` · 2 h · G5 · ← ART-03, ART-04
- [ ] `@theme` de Tailwind v4 con la paleta
- [ ] `next/font/local` con las `.woff2`
✔ Sin FOUT visible ni CLS por fuentes.

---

### FASE 5 · EXPERIENCIA INMERSIVA — Semanas 4-6 → **G5**

**DEV-09 · ImageSequenceCanvas (ventana deslizante)** — DEV · `Dev-WebGL` `⚠` `P0` · 8 h · G5 · ← DEV-06
*PLANTILLA Componente WebGL.* Ref. M Parte II §7. Prompt P3.
- [ ] Fallback solo si falta el frame 1
- [ ] Dibuja el frame más cercano
- [ ] Flush al cambiar de tier
- [ ] `aria-label`
✔ Con `/public` vacío muestra el fallback; con los assets reales, scrub fluido sin frames en blanco.

**DEV-10 · Shader de fondo (fluido)** — DEV · `Dev-WebGL` `P1` · 6 h · G5 · ← DEV-07
Ref. M Parte II §8. Prompt P4. Hash sin `sin()`.
✔ Sin artefactos en Android de gama media.

**DEV-11 · HeroArtifactMesh + rig de iluminación** — DEV · `Dev-WebGL` `3D` `P0` · 8 h · G5 · ← DEV-07 (y DEV-03 para el asset real)
Ref. M Parte II §8. Prompt P5.
✔ Fallback procedural sin `.glb`; con el `.glb`, dispose verificado al desmontar.

**DEV-12 · Integrar assets reales en la vertical slice** — DEV · `Dev-WebGL` `P0` · 4 h · G5 · ← G4, DEV-09, DEV-11
✔ Hero + secuencia + CTA con assets definitivos en la preview.

**DEV-13 · Preloader por prioridades** — DEV · `Dev-UI` `P1` · 6 h · G5 · ← DEV-12
Ref. M Fase 8 Paso 22.
- [ ] Bloqueo crítico < 2.5 s (fuentes, `.glb` Hero, 15-20 frames, `compileAsync`)
- [ ] Streaming del resto en idle
- [ ] Botón "Entrar con sonido" / "Saltar"
✔ El primer scroll no tiene tirones; el `<h1>` es visible desde el SSR.

**GATE-G5 · Vertical slice** — DIR + Cliente
- [ ] Preview con Hero 3D + secuencia + CTA
- [ ] 60 FPS desktop / ≥ 50 gama media (captura de Performance adjunta)
- [ ] Feedback del cliente registrado → tarjetas nuevas

**DEV-14 · Partículas (InstancedMesh / GPGPU)** — DEV · `Dev-WebGL` `⚠` `P2` · 8 h · G6 · ← G5
- [ ] Conteo leído de `gpuPolicy.maxParticles`
- [ ] Un solo draw call
✔ Sin bajar del budget de FPS en T2.

**DEV-15 · Post-procesado (Bloom + Noise)** — DEV · `Dev-WebGL` `P1` · 3 h · G6 · ← G5
✔ Solo se activa en T2/T3; solo brillan materiales HDR (`toneMapped={false}`).

**DEV-16 · SoundController** — DEV · `Audio` `P2` · 5 h · G6 · ← ART-15, G5
Ref. M Fase 5 Paso 16.
- [ ] Opt-in tras gesto del usuario
- [ ] Low-pass 400 → 2 500 Hz según velocidad de scroll
- [ ] Mute visible con `aria-label`; pausa con `visibilitychange`
- [ ] Fallback `.m4a`
✔ Funciona en iOS Safari.

---

### FASE 6 · UI/UX Y TRANSICIONES — Semanas 5-7

**DEV-17 · Navbar + CTA persistente** — DEV · `Dev-UI` `P0` · 4 h · G6 · ← DEV-08
✔ CTA a ≤ 3 clics de la conversión desde cualquier punto; `z-index: 50`; usable con teclado.

**DEV-18 · Hero UI (tipografía cinética)** — DEV · `Dev-UI` `P0` · 5 h · G6 · ← DEV-12
*PLANTILLA Sección UI.* GSAP SplitText, `cubic-bezier(0.16,1,0.3,1)`.
✔ El `<h1>` es el elemento LCP (verificado en Lighthouse).

**DEV-19 a DEV-2X · Secciones narrativas** — DEV · `Dev-UI` `P1` · 6 h c/u · G6 · ← ART-05, DIR-05
*Una tarjeta por sección del storyboard* (PLANTILLA Sección UI).

**DEV-23 · Transiciones entre secciones** — DEV · `Dev-WebGL` `Dev-UI` `P1` · 8 h · G6 · ← DEV-19…
Ref. M Fase 6 Paso 19 (coreografía de cámara, clip-path, máscara de ruido).
✔ DIR aprueba que la navegación se siente continua.

**DEV-24 · Cursor personalizado** — DEV · `Dev-UI` `P2` · 3 h · G6
✔ Se desactiva en táctil y con reduced motion; no oculta el cursor nativo en campos de texto.

**DEV-25 · Footer + formulario de contacto** — DEV · `Dev-UI` `SEO/Negocio` `P0` · 5 h · G6
- [ ] Validación cliente + servidor
- [ ] Rate-limit / captcha
- [ ] Mensajes de error accesibles
✔ Email/WhatsApp recibido en prueba real.

---

### FASE 7 · RENDIMIENTO — Semanas 6-7 → **G6**

**DEV-26 · Auditoría VRAM y fugas** — DEV · `Dev-WebGL` `⚠` `P0` · 4 h · G6 · ← G5
Prompt P7. Ref. M Parte II §10.
- [ ] `grep useState` en canvas/ y sequence/
- [ ] Heap y GPU Memory estables tras 10 scrolls completos
- [ ] Todos los ScrollTriggers matados al desmontar
✔ Informe con capturas adjunto.

**DEV-27 · Prueba de tiers y fallbacks** — DEV · `Dev-WebGL` `P0` · 3 h · G6
- [ ] Forzar T1, T2 y T3 (override de desarrollo)
- [ ] Simular sin WebGL → póster + página funcional
- [ ] `prefers-reduced-motion` → sin Lenis ni rotaciones
✔ Los 5 escenarios documentados con capturas.

**DEV-28 · Core Web Vitals y bundle** — DEV · `Dev-WebGL` `P0` · 4 h · G6
- [ ] Lighthouse móvil: LCP < 2.5 s, CLS < 0.1, INP < 200 ms
- [ ] Bundle analyzer: JS inicial ≤ budget
- [ ] Dynamic import del Canvas y las secciones pesadas
✔ Informe Lighthouse adjunto.

---

### FASE 8 · QA Y ACCESIBILIDAD — Semana 7 → **G6**

**DIR-06 · QA en matriz de dispositivos** — DIR · `P0` · 6 h · G6 · ← DEV-26…28
- [ ] Los 6 dispositivos de DEV-01: scroll, CTA, formulario, audio, rotación de pantalla
- [ ] Red lenta (Fast 3G simulado)
- [ ] Cada fallo → tarjeta `BUG-XX`
✔ Cero bugs P0 abiertos.

**DEV-29 · Accesibilidad WCAG 2.2 AA** — DEV · `Dev-UI` `P0` · 4 h · G6
Prompt P8.
- [ ] Recorrido completo con teclado y skip link
- [ ] Foco visible, `alt`, `aria-label` en controles de icono
- [ ] Contraste ≥ 4.5:1
- [ ] Lighthouse accesibilidad ≥ 95
✔ Informe adjunto.

**DIR-07 · Revisión de dirección de arte final** — DIR · `Concepto/Arte` `P1` · 3 h · G6
- [ ] Coherencia lumínica entre todos los assets
- [ ] Jerarquía tipográfica y espaciado (Prompt P6 si hace falta)
✔ Lista de ajustes de pulido → tarjetas P2.

**GATE-G6 · Beta QA** — DIR
- [ ] DEV-26 a DEV-29, DIR-06 y DIR-07 en Hecho
- [ ] Cero P0 abiertos

---

### FASE 9 · NEGOCIO, SEO Y CONTENIDO — Semanas 6-7

**DEV-30 · SEO técnico** — DEV · `SEO/Negocio` `P0` · 4 h · G7
Ref. M Fase 9 Paso 25.
- [ ] `metadata` (title, description, OG, canónica)
- [ ] `sitemap.ts`, `robots.ts`
- [ ] JSON-LD según tipo de negocio
- [ ] Todo el texto en el DOM real
✔ Rich Results Test sin errores.

**DEV-31 · CMS headless (si está en alcance)** — DEV · `SEO/Negocio` `P1` · 10 h · G7
✔ El cliente edita precios y textos sin redeploy de escenas.

**DEV-32 · E-commerce / checkout (si está en alcance)** — DEV · `SEO/Negocio` `P0` · 16 h · G7
- [ ] `frameloop` en pausa con carrito o checkout abierto
- [ ] Pago probado de punta a punta (sandbox y real)
✔ Compra real exitosa en iOS y Android.

**DEV-33 · Analítica, Sentry y consentimiento de cookies** — DEV · `SEO/Negocio` `P1` · 4 h · G7
- [ ] Eventos de conversión (clic en CTA, envío de formulario, compra)
- [ ] Sentry capturando errores WebGL
- [ ] Banner de consentimiento + política de privacidad
✔ Eventos visibles en el panel.

**DIR-08 · Copy final + textos legales** — DIR · `SEO/Negocio` `P1` · 4 h · G7
✔ Ortografía revisada, aprobado por el cliente.

---

### FASE 10 · LANZAMIENTO — Semana 8 → **G7**

**DEV-34 · Dominio, SSL, cabeceras y caché** — DEV · `P0` · 2 h · G7
- [ ] Dominio + SSL
- [ ] Cabeceras de seguridad (CSP, HSTS)
- [ ] `Cache-Control immutable` en assets **versionados**
✔ SecurityHeaders ≥ A.

**DIR-09 · Checklist de lanzamiento** — DIR · `P0` · 3 h · G7 · ← todo lo anterior
Copiar como checklist la **Parte III del Manual v2** completa.
✔ 100 % marcado.

**DEV-35 · Deploy a producción + verificación en vivo** — DEV · `P0` · 3 h · G7 · ← DIR-09
- [ ] Deploy
- [ ] Repetir Lighthouse y QA rápido **en producción**
- [ ] Plan de rollback documentado
✔ Sitio en vivo sin regresiones.

**GATE-G7 · Go-live** — Cliente + DIR

**DIR-10 · Entrega y handoff** — DIR · `P1` · 3 h
- [ ] Accesos entregados al cliente
- [ ] Guía de uso del CMS
- [ ] `LICENCIAS.md` final
✔ Acta de entrega firmada.

---

### 🚀 POST-LANZAMIENTO (lista "Producción")

**DIR-11 · Medición a 30 días** — DIR · 2 h: KPI de negocio vs. objetivo, embudo de conversión y mapa de calor.
**DEV-36 · Monitoreo semanal (Card Repeater)** — DEV · 1 h/sem: errores de Sentry, CWV de campo (CrUX/Vercel) y FPS reportados.
**DIR-12 · Retro del proyecto y actualización del Manual** — Todo el equipo · 2 h: lecciones aprendidas → nueva versión del Manual (v2.1).

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
