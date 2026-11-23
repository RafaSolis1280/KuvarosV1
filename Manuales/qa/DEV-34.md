# DEV-34 · Cabeceras de seguridad y caché (parte que no depende del dominio)

**Fecha:** 22-11-2026 · **Rama:** `feat/dev-34-cabeceras-seguridad` (sobre `feat/dev-28-cwv-bundle`)
**Código:** `src/config/http-headers.ts` (con 7 tests) + `next.config.ts` (`headers()`).
**Prueba:** build de producción local y `npm run dev`. **Script:** `Manuales/qa/scripts/csp.cjs`

## Cabeceras (todas las rutas)

| Cabecera | Valor | Para qué |
| :--- | :--- | :--- |
| `Content-Security-Policy` | `default-src 'self'` · `script-src 'self' 'unsafe-inline'` · `style-src 'self' 'unsafe-inline'` · `img-src 'self' data: blob:` · `font-src`/`connect-src`/`media-src 'self'` · `worker-src 'self' blob:` · `object-src 'none'` · `base-uri 'self'` · `form-action 'self'` · `frame-ancestors 'none'` · `upgrade-insecure-requests` (solo en Vercel) | Solo se carga lo del propio dominio |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Siempre HTTPS durante 2 años |
| `X-Content-Type-Options` | `nosniff` | — |
| `X-Frame-Options` | `DENY` | Nadie puede enmarcar el sitio (clickjacking) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | — |
| `Permissions-Policy` | cámara, micrófono, geolocalización, pagos, USB y `browsing-topics` desactivados | — |
| `Cross-Origin-Opener-Policy` | `same-origin` | — |

**Decisiones:**

- **CSP sin nonce.** La página es estática (prerender + Partial Prerendering). Un nonce obliga a renderizar cada
  visita en el servidor, sin CDN ni PPR (docs de Next 16, «Content Security Policy»). Por eso los scripts inline de
  Next y el JSON-LD van con `'unsafe-inline'`. Todo lo demás se limita al propio origen: el sitio no carga nada de
  terceros. El enlace a Instagram es una navegación, que la CSP no restringe. Se comprobó que el build sigue
  generando `/` como estática (○).
- En desarrollo se suman `'unsafe-eval'` y `ws:`/`wss:`, que necesitan React Refresh y HMR. En producción no van.
- `upgrade-insecure-requests` solo en Vercel (`VERCEL=1`). En `http://localhost` rompería los recursos.
- **HSTS sin `preload`:** entrar en la lista de precarga de los navegadores es difícil de deshacer y lo decide el
  dueño del dominio.
- **Dominios externos a sumar** cuando lleguen: analítica (DEV-33) y un servicio de envío del formulario, si alguna
  vez se llama desde el navegador (DEV-25; hoy el envío va por `/api/contacto`, del propio dominio).

## Caché de `/public`

| Carpeta | Antes | Ahora | Por qué |
| :--- | :--- | :--- | :--- |
| `sequences`, `fallback`, `photos`, `audio`, `fonts` | `immutable` (1 año) | `immutable` (1 año) | Versionadas por convención: si cambian, se publican con nombre o carpeta nuevos |
| `benchmarks` | `immutable` ❌ | `max-age=86400, stale-while-revalidate=604800` | Se copian de `node_modules/detect-gpu` en cada `npm install` **con el mismo nombre**: con `immutable`, tras actualizar la dependencia un visitante podía quedarse un año con benchmarks viejos |
| `/_next/static/**` | `immutable` (Next) | igual | Nombres con hash |
| `og-image.jpg`, `robots.txt`, HTML | `max-age=0` | igual | — |

Un test exige que **cada carpeta de `/public`** esté clasificada como versionada o no. Si alguien crea una carpeta
nueva, tiene que decidir su caché.

## Verificación

| Prueba | Resultado |
| :--- | :--- |
| `curl -I` en `/`, un frame, un benchmark, `og-image.jpg`, `robots.txt` y un chunk de `/_next/static` | 7 cabeceras de seguridad en todas; `Cache-Control` según la tabla |
| Producción, Chrome con SwiftShader: recorrido completo, CTA, formulario enviado (200) | **0 violaciones de CSP**, 0 errores, 326 frames, 0 peticiones fallidas |
| Igual, con reduced motion | 0 violaciones, 0 errores |
| Producción con la GPU real (detect-gpu descarga su benchmark) | 0 violaciones, 0 errores, 571 frames, 1 benchmark |
| `npm run dev` (HMR) | 0 violaciones, 0 errores |
| Build | `/` sigue siendo estática (○) |

## Pendiente (depende del despliegue y del cliente)

- **Criterio 1:** dominio oficial con SSL y redirección a HTTPS (lo entrega el cliente vía Rafael, en Vercel).
- **Criterio 2:** las cabeceras ya están activas, pero la nota de **securityheaders.com** solo se puede pedir con una URL
  pública (falta conectar Vercel). Están las 6 cabeceras que puntúa esa herramienta.
