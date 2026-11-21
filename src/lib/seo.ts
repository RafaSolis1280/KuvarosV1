// DEV-38 / DEV-30 · SEO técnico a partir del contenido (src/content) y la configuración (src/config/site):
// metadatos de la página, datos estructurados (JSON-LD) y entradas del sitemap y robots.
import type { Metadata, MetadataRoute } from "next";
import { SITE, SITE_URL } from "@/config/site";
import { PRODUCTO } from "@/content/producto";
import { SITIO } from "@/content/sitio";

/** Límites de longitud que muestran los buscadores sin cortar (criterio de DEV-30) */
export const SEO_LIMITS = { title: 60, description: 155 } as const;

const absolute = (path: string, base = SITE_URL) => new URL(path, base).toString();

export function createSiteMetadata(): Metadata {
  const { seo, marca, bajadaMarca } = PRODUCTO;
  return {
    metadataBase: new URL(SITE_URL),
    title: seo.titulo,
    description: seo.descripcion,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      locale: SITE.locale,
      siteName: `${marca} ${bajadaMarca}`,
      title: seo.titulo,
      description: seo.descripcion,
      images: [{ ...SITE.ogImage, alt: seo.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titulo,
      description: seo.descripcion,
      images: [SITE.ogImage.url],
    },
  };
}

/**
 * Datos estructurados del negocio (schema.org): un Restaurant de solo delivery, más el WebSite.
 * Solo datos confirmados (ver SITIO.negocio): sin inventar dirección, teléfono ni horario.
 */
export function createBusinessJsonLd(base = SITE_URL) {
  const { marca, bajadaMarca, seo, instagram } = PRODUCTO;
  const { negocio } = SITIO;
  const name = `${marca} ${bajadaMarca}`;
  const url = absolute("/", base);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${url}#negocio`,
        name,
        description: seo.descripcion,
        url,
        image: absolute(SITE.ogImage.url, base),
        servesCuisine: [...negocio.cocina],
        acceptsReservations: negocio.aceptaReservas,
        address: {
          "@type": "PostalAddress",
          addressLocality: negocio.ciudad,
          addressRegion: negocio.region,
          addressCountry: negocio.pais,
        },
        areaServed: { "@type": "Place", name: negocio.zonaDeEntrega },
        sameAs: [instagram.url],
      },
      {
        "@type": "WebSite",
        "@id": `${url}#sitio`,
        name,
        url,
        inLanguage: SITE.lang,
        publisher: { "@id": `${url}#negocio` },
      },
    ],
  };
}

/**
 * Serializa JSON-LD para un <script> en el HTML: escapa «<» para que ningún texto pueda cerrar la
 * etiqueta (recomendación de la guía de JSON-LD de Next.js).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Una sola página (landing): la home es la única URL indexable */
export function createSitemap(base = SITE_URL): MetadataRoute.Sitemap {
  return [{ url: absolute("/", base), changeFrequency: "monthly", priority: 1 }];
}

export function createRobots(base = SITE_URL): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absolute("/sitemap.xml", base),
  };
}
