# DEV-01 · Performance Budget y matriz de dispositivos

**Fecha:** 22-11-2026 · **Rama:** `docs/dev-01-budget-dispositivos` (sobre `feat/dev-34-cabeceras-seguridad`)
**Estado:** propuesta. Falta que DIR la valide con un comentario en la tarjeta (criterio 4).

## Por qué se usan los valores del Manual

DIR-01 todavía no tiene analítica: la marca vende por Instagram y no tiene web, así que no hay datos de qué parte del
tráfico es móvil o iOS. Por eso rigen los valores de la Fase 0 del Manual v2. Hay una excepción: el JS inicial se
controla con el límite **móvil** (250 KB), porque desktop y móvil descargan el mismo bundle. Cuando el sitio tenga
analítica (DEV-33), estos valores se revisan con datos reales.

## Budget y estado actual

Medición con el build de producción del 22-11. Los pesos son lo que viaja por la red, ya comprimido. Desktop:
1440×900 con la GPU del equipo (T3, frames desktop). Móvil: 412×823 Android emulado (T2, frames mobile).
Scripts: `npm run budget`, `Manuales/qa/scripts/pesos.cjs`, Lighthouse e `inp.cjs` (DEV-28).

| Métrica | Budget desktop | Budget móvil | Hoy desktop | Hoy móvil | Estado |
| :--- | :-: | :-: | :-: | :-: | :-: |
| JS inicial (gzip) | ≤ 350 KB | ≤ 250 KB | 246 KB | 246 KB | ✅ (margen móvil: 3.6 KB) |
| Peso crítico (hasta el primer impacto: hero + ventana inicial de frames) | ≤ 4 MB | ≤ 2 MB | 1.5 MB | 0.7 MB | ✅ |
| Peso total (recorrido completo, con streaming) | ≤ 25 MB | ≤ 12 MB | 5.6 MB | 3.4 MB | ✅ |
| Video 1, hamburguesa (`hero_explode`) | ≤ 8 MB | ≤ 4 MB | 1.4 MB | 0.9 MB | ✅ |
| Video 2, packaging (`packaging_reveal`) | ≤ 8 MB | ≤ 4 MB | 3.9 MB | 2.4 MB | ✅ |
| Modelo `.glb` | no aplica (proyecto 100 % video, DEV-37) | | | | — |
| LCP (Lighthouse móvil) | < 2.5 s | < 2.5 s | — | 0.9 s | ✅ |
| CLS | < 0.1 | < 0.1 | 0 | 0 | ✅ |
| INP | < 200 ms | < 200 ms | — | 80–120 ms | ✅ |
| FPS medios | ≥ 55 | ≥ 50 (Android de gama media) | ~156 (Intel UHD, capacidad) | ⏳ sin dispositivo | ⏳ |

**Dónde vive el budget:** `src/config/budget.ts` (`PERFORMANCE_BUDGET`), la fuente única. Hay dos controles automáticos:

- `src/config/budget.test.ts`: cada carpeta de frames, de cada video y variante, tiene que entrar en el budget. Si se
  exporta un master más pesado (ART-10 espera uno ≥ 1600 px), el test lo avisa antes del merge.
- `npm run budget` (después de `npm run build`): suma con gzip el JS que pide el HTML de `/` y falla si pasa de 250 KB.

**Regla que sale de esto:** con 3.6 KB de margen, toda funcionalidad nueva que agregue JS (sonido, preloader,
analítica) se carga con `dynamic import`, fuera del JS inicial.

## Matriz de QA (6 dispositivos)

Son modelos de referencia. DIR puede cambiarlos por equipos equivalentes que el equipo tenga a mano.

| Categoría | Dispositivo | Navegador | Tier esperado | Qué se prueba |
| :--- | :--- | :--- | :-: | :--- |
| iPhone reciente | iPhone 17 (iOS 26) | Safari | T2 (móvil) | Fluidez, sonido `.m4a` (DEV-16), reduced motion del sistema |
| iPhone de 3-4 años | iPhone 13 (iOS 18 o posterior) | Safari | T2 | Memoria (ventana de frames), FPS ≥ 50 |
| Android gama media | Samsung Galaxy A55 | Chrome | T2 | FPS ≥ 50 (criterio de DEV-10, 14 y 15), INP |
| Android gama baja | Samsung Galaxy A15 | Chrome | T1 | Bajada de tier (PerformanceMonitor), fallback sin efectos |
| MacBook | MacBook Air M2 | Safari y Chrome | T3 | Calidad (frames desktop, DPR 2) |
| Windows con GPU integrada | Portátil con Intel UHD Graphics (equipo de QA de Javier) | Chrome y Edge | T3 | FPS ≥ 55 a DPR 1 y 2 (ya medido: ~156 de capacidad) |

En las pruebas automáticas, el override de DEV-27 (`?tier=1|2|3`, `?nowebgl`) reproduce cada tier. Los FPS y la
memoria reales solo se pueden medir en el dispositivo.
