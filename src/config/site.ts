// DEV-38 · Datos del sitio que no son copy: URL, idioma y anclas compartidas.
// El texto visible vive en src/content/producto.ts.

/**
 * URL pública. En Vercel se define con `NEXT_PUBLIC_SITE_URL` (dominio o Preview URL);
 * sin ella, las URLs absolutas (canonical, Open Graph) apuntan a localhost.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE = {
  lang: "es",
  locale: "es_BO",
  ogImage: { url: "/og-image.jpg", width: 1200, height: 630 },
} as const;

/** DEV-17 · Cabecera fija. Su altura es el token `--spacing-nav` de globals.css (clases `h-nav`, `pt-nav`…). */
export const NAV = {
  /** A partir de estos px de scroll la cabecera gana su fondo de vidrio (contraste sobre los videos) */
  solidAfterPx: 24,
} as const;

/** `id` del <main>: destino del enlace «Saltar al contenido» */
export const MAIN_CONTENT_ID = "contenido";
/** `id` del hero: destino del logo de la cabecera («volver al inicio», también con Lenis) */
export const HERO_SECTION_ID = "inicio";
/** `id` de la sección de conversión: destino del CTA de la cabecera */
export const CONTACT_SECTION_ID = "contacto";
