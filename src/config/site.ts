// DEV-38 · Datos del sitio que no son copy: URL, idioma y anclas compartidas.
// El texto visible vive en src/content/producto.ts.

type Env = Partial<Record<string, string | undefined>>;

/**
 * DEV-30 · URL pública del sitio, base de la canónica, Open Graph, sitemap, robots y JSON-LD. Por orden:
 * 1. `NEXT_PUBLIC_SITE_URL`: el dominio oficial (DEV-34), definido a mano en Vercel.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL`: el dominio de producción del proyecto, que Vercel define solo.
 * 3. `VERCEL_URL`: la URL de cada deploy (Preview), también automática.
 * 4. localhost en desarrollo.
 * Las de Vercel llegan sin protocolo; se normaliza sin «/» final.
 */
export function resolveSiteUrl(env: Env): string {
  const raw =
    env.NEXT_PUBLIC_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || "http://localhost:3000";
  const withProtocol = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

// Acceso explícito a cada variable (no a todo process.env): así Next puede reemplazarlas en el build
export const SITE_URL = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

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
