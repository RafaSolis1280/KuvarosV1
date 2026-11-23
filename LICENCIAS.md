# LICENCIAS.md — Registro de licencias y derechos

> Tarjeta **DIR-03** (Fase 0 · G1). Responsable: DIR. Ref: Manual v2 Fase 0 punto 5.
> **Regla:** ningún asset entra a `/public` sin una fila en este archivo.

## Fuentes tipográficas
| Familia | Archivo(s) | Proveedor | Tipo de licencia | Uso web permitido | Comprobante |
| :--- | :--- | :--- | :--- | :-: | :--- |
| League Spartan (secundaria oficial de marca) | autoalojada por `next/font/google` en el build | Google Fonts | SIL Open Font License 1.1 | ✅ | https://fonts.google.com/specimen/League+Spartan/license |
| Bree Serif (display **provisional**, reemplaza a la primaria no identificada del manual) | autoalojada por `next/font/google` en el build | Google Fonts | SIL Open Font License 1.1 | ✅ | https://fonts.google.com/specimen/Bree+Serif/license |
| _Primaria de marca: pendiente ART-04 (nombre y licencia web)_ | `public/fonts/` | | | | |

## Audio (música / SFX)
| Asset | Ruta en `/public` | Origen | Licencia | Uso comercial | Comprobante |
| :--- | :--- | :--- | :--- | :-: | :--- |

## Fotografía
| Asset | Ruta en `/public` | Origen | Licencia | Uso comercial | Comprobante |
| :--- | :--- | :--- | :--- | :-: | :--- |
| Foto bolsa + hamburguesa | `photos/kuvaros_bolsa_mano.webp` | Cliente (sesión Sony A7 III, 05-2026) | ⏳ cesión de uso web | ⏳ | ⏳ DIR-03 (confirmar autor y derechos de imagen de la persona que aparece) |
| Foto papas + hamburguesa | `photos/kuvaros_papas_banca.webp` | Cliente (sesión Sony A7 III, 05-2026) | ⏳ cesión de uso web | ⏳ | ⏳ DIR-03 (ídem) |
| Póster y OG (frame del video de marca) | `fallback/hero_poster.webp`, `og-image.jpg` | Derivados de `Marca/Video.mp4` | Igual que el video | ⏳ | Ver fila del video |

## Imagen / video generado con IA
| Asset | Herramienta + versión | Prompt / seed | Plan / términos comerciales | Fecha | Comprobante |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Video de marca Kuvaro's (master `Marca/Video.mp4`, fuera de Git) → `public/sequences/hero_explode/**` y `public/sequences/packaging_reveal/**` | ⏳ entregado por el cliente; confirmar si es IA o rodaje y con qué herramienta | ⏳ | ⏳ cesión de uso web del cliente | 20-11-2026 | ⏳ pedir confirmación escrita (DIR-03) |

## Librerías de código
Las dependencias npm se rigen por sus licencias (MIT en su mayoría). GSAP: licencia estándar gratuita de GSAP (incluye plugins).
