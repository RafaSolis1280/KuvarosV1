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

/** `id` del <main>: destino del enlace «Saltar al contenido» */
export const MAIN_CONTENT_ID = "contenido";
/** `id` de la sección de conversión: destino del CTA de la cabecera */
export const CONTACT_SECTION_ID = "contacto";
