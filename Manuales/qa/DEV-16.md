# DEV-16 · SoundController (sonido ambiente opt-in)

**Fecha:** 22-11-2026 · **Rama:** `feat/dev-16-sound-controller` (sobre `docs/dev-01-budget-dispositivos`)
**Script de prueba:** `Manuales/qa/scripts/sonido.cjs`

## Qué se hizo

| Pieza | Archivo |
| :--- | :--- |
| Botón y control (opt-in, filtro según el scroll, pestaña oculta, limpieza) | `src/components/dom/SoundController.tsx` |
| Motor con Web Audio: loop → low-pass → volumen (sin dependencias; `howler` no se reinstaló) | `src/lib/audio/AmbientSound.ts` |
| Lógica pura con tests: corte según la velocidad (escala logarítmica) y elección de formato (WebM/Opus o M4A) | `src/lib/audio/sound.ts` |
| Qué audio existe en `/public` (se decide en el build, sin peticiones de prueba) | `src/lib/audio/availability.ts` |
| Parámetros (400 → 2 500 Hz, volumen 0.4, fundido de 0.6 s) | `src/config/sound.ts` |
| Estado `soundOn` (cambia solo con un clic) | `src/store/useExperienceStore.ts` |
| Botón en la cabecera, junto al CTA, con un hueco reservado en el HTML | `src/components/layout/SiteHeader.tsx` |

**Peso:**
- El botón llega con `dynamic import` (`ssr: false`).
- El motor de audio se descarga recién en el primer clic.
- El JS inicial queda en 246.8 KB gzip, dentro del budget de DEV-01 (`npm run budget`).

**Cómo se activa en producción:** cuando ART-15 entregue `ambient_drone.webm` y `ambient_drone.m4a`, basta con copiarlos
a `public/audio/` (y registrarlos en `LICENCIAS.md`). El botón aparece solo en el próximo build.

## Verificación

Como el audio real todavía no existe, se usó un tono de prueba de 3 s generado aquí, copiado como
`public/audio/ambient_drone.{webm,m4a}` solo durante la prueba y **borrado después** (no está en el repo). El script
instrumenta Web Audio antes de que cargue la página: `AudioContext`, el filtro y el volumen.

| Criterio | Prueba | Resultado (dev y build de producción) |
| :--- | :--- | :--- |
| 1. No suena hasta que el usuario lo activa | Antes de pulsar | 0 `AudioContext` creados, 0 peticiones a `/audio` ✅ |
| | Al pulsar (ratón) | Se crea el contexto (`running`), volumen 0.4, se pide solo el `.webm` ✅ |
| 2. Low-pass de 400 a 2 500 Hz según la velocidad | Rueda rápida / quieto 3 s | Máximo 2 499-2 500 Hz / vuelve a 400 Hz ✅ |
| 3. Botón visible con `aria-label` y estado; pausa con la pestaña oculta | `aria-label="Sonido ambiente"`, `aria-pressed` true/false | ✅ (se activa y se silencia con ratón y con Enter) |
| | Pestaña oculta / visible | `suspended` / `running` ✅ |
| | Silenciar | Volumen → 0 y el contexto se suspende tras el fundido ✅ |
| 4. En iOS Safari suena el `.m4a` | Elección de formato con test unitario (Safari sin WebM → `.m4a`) | ⏳ Falta probar en un iPhone real, y con el audio real de ART-15 |
| 5. Sin archivos de audio, sin errores | Sin audio en `/public` (estado actual del repo) | Ni botón ni peticiones; 0 errores ✅ |
| | Audio que falla (404 simulado) | El botón desaparece, el contexto se cierra; 0 errores ✅ |

Más comprobaciones:

- **CLS:** el botón aparece tras la hidratación en un hueco de 36 px que ya viene en el HTML, así que la cabecera no
  se mueve. Medido con la API de Layout Shift.
- **Regresión:** recorrido completo con CSP (DEV-34): 0 violaciones, 0 errores, 0 peticiones fallidas y el formulario
  sigue enviándose. INP con el formulario: 112 ms.

## Hallazgo: `dynamic()` con SSR en Next 16.4.6 + Turbopack

Al cargar en diferido también el formulario de contacto (con SSR, para ahorrar unos 4 KB de JS inicial), Next escribió
en el HTML un `<link rel="preload">` hacia un chunk que no existe. El manifiesto de carga diferida lista un nombre
distinto del que genera Turbopack, también con un build limpio. El componente funcionaba, pero quedaba un 404 en
consola. Por eso:

- `src/components/dom/lazy.tsx` solo usa `dynamic(..., { ssr: false })`, igual que el Canvas y el cursor, que ya lo
  usaban y no tienen el problema.
- El formulario sigue con import normal: tiene que venir en el HTML del servidor (enlace directo a `/#contacto`, BUG-01).

Si una versión futura de Next lo corrige, se puede volver a probar.
