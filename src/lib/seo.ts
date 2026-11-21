// DEV-38 · Metadatos del sitio a partir del contenido (src/content) y la configuración (src/config/site).
// DEV-30 (SEO técnico) completa desde aquí: sitemap, robots, JSON-LD.
import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/config/site";
import { PRODUCTO } from "@/content/producto";

export function createSiteMetadata(): Metadata {
  const { seo, marca, bajadaMarca } = PRODUCTO;
  return {
    metadataBase: new URL(SITE_URL),
    title: seo.titulo,
    description: seo.descripcion,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: `${marca} ${bajadaMarca}`,
      title: seo.titulo,
      description: seo.descripcion,
      images: [{ ...SITE.ogImage, alt: seo.ogAlt }],
    },
  };
}
