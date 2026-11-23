# Verificación integral · 22-11-2026

**Código:** la cadena completa de ramas hasta `docs/verificacion-integral-22-11`. Incluye la tanda del 21-11 y la del
22-11 (BUG-01, DEV-27, DEV-15, DEV-28, DEV-34, DEV-01, DEV-16, BUG-02, DEV-13 y DEV-14).
**Build:** producción local. Se probó con el formulario activo (`CONTACTO_ENVIO=simulado`) y tal como se publicaría
(sin servicio de envío ni audio). **Navegador:** Chrome 157 headless; con la GPU real (Intel UHD) donde se indica.

## Controles automáticos

| Control | Resultado |
| :--- | :--- |
| `npm run typecheck` · `npm run lint` | ✅ sin errores ni avisos |
| `npm test` | ✅ 23 archivos, **136 tests** |
| `npm run build` | ✅ `/` sigue siendo estática (○) |
| `npm run budget` (JS inicial de `/`) | ✅ **248.0 KB gzip** de 250 (móvil) · 216.3 KB brotli |

## Regresión por historia

| Historia | Prueba | Resultado |
| :--- | :--- | :--- |
| BUG-01 enlace directo | `/#contacto`, `/#inicio`, CTA y logo; con Lenis, reduced motion, CPU ×4 y 375 px | ✅ contacto a 72 px (bajo la cabecera), inicio en 0, sin forzar el scroll después |
| BUG-02 / DEV-18 titular | Layout Shift en 375, 768 y 1440 px | ✅ 0 desplazamientos |
| DEV-25 formulario | Envío válido con CSP activa (3 modos) | ✅ 200 y mensaje de éxito |
| DEV-34 CSP | Recorrido completo, CTA y formulario: SwiftShader, reduced motion y GPU real | ✅ **0 violaciones, 0 errores, 0 peticiones fallidas** |
| DEV-28 INP | Móvil con CPU ×4 y 73 interacciones (con formulario) | ✅ **72 ms** |
| DEV-26 memoria | 10 recorridos completos en 1440 y 375 px | ✅ heap +4.9 % / +4.4 % (estable), **máx. 17 bitmaps = 2R+1**, canvas sin crecer |
| DEV-13 preloader | Carga crítica (varias corridas) | ✅ desktop 0.58–1.36 s · Fast 4G 1.75–1.81 s · 0 descargas repetidas |
| DEV-14 partículas | Draw calls por tier (`?tier=`), reduced motion | ✅ 2 por frame con 8 000 / 2 500 / 500 puntos; quietas con reduced motion |
| Lighthouse móvil | 3 corridas | ✅ rendimiento 98–99, accesibilidad / buenas prácticas / SEO 100, LCP 0.9 s, CLS 0 |

## Lo que se corrigió durante esta verificación

1. **Un bitmap de más, por un instante (DEV-26):**
   - Qué pasaba: con la descarga compartida del preloader los frames llegan antes y a veces uno se decodificaba cuando
     la ventana ya se había movido. Quedaba un momento 1 bitmap por encima de 2R+1 (18 en vez de 17).
   - Arreglo: `FrameCache` le pregunta al cargador si el frame sigue haciendo falta **antes** de decodificarlo.
     También ahorra CPU en el scroll rápido. Test nuevo.
   - Resultado: máximo 17 en los dos anchos.
2. **Coste de las partículas en la carga crítica (DEV-14):**
   - Qué pasaba: en una comparación A/B en las mismas condiciones, compilar su shader en el primer frame sumaba
     ~250 ms con la CPU ×4 (Fast 4G: 1.82–1.92 → 2.08–2.15 s).
   - Arreglo: el shader se compila en paralelo (`compileAsync`) y las partículas aparecen cuando está listo.
   - Resultado: Fast 4G vuelve a 1.75–1.81 s.

## Sobre la variación de las medidas

Durante la tarde el equipo cambió de estado. El `benchmarkIndex` de Lighthouse bajó de ~4 400 a ~4 000 y la cadencia
de frames del navegador pasó de 6.1 a 8 ms por frame. Por eso:

- Las comparaciones de esta verificación se hicieron A/B, con los dos builds medidos uno detrás del otro.
- La carga crítica en desktop es bimodal (≈ 0.6 s o 1.0–1.4 s). La diferencia es una tarea larga de 0.5–0.9 s: la
  compilación inicial de shaders en Direct3D. Ya aparecía antes de esta tanda y en todos los casos queda < 2.5 s.
- El TBT de Lighthouse varió entre 110 y 170 ms en el mismo build. Rendimiento 98–99: dentro de la regla de no bajar
  más de 5 puntos frente a `main` (FLUJO §3.7).

## Pendiente (no depende del código)

- **Dispositivos reales** (matriz de DEV-01): Android de gama media para los FPS de DEV-10, 14 y 15; iPhone para el
  `.m4a` de DEV-16; repetir DEV-13 y DEV-28 en 4G real.
- **Preview URL de Vercel:** nota de securityheaders.com (DEV-34), Lighthouse en el dominio y dominio oficial.
- **Del cliente o de DIR:** audio (ART-15), servicio de envío y canal del formulario (DEV-25, DIR-01), textos legales
  (DIR-08), validación del budget (DEV-01) y aprobación visual de las partículas (DIR-07).
- **DEV-33** (analítica, Sentry y cookies) no se hizo en esta tanda: 3 de sus 4 criterios dependen de cuentas, claves
  y dependencias (Rafael) y de la política de privacidad (DIR-08).
