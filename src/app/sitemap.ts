// DEV-30 · /sitemap.xml (convención de archivo de Next). Contenido en src/lib/seo.ts.
import type { MetadataRoute } from "next";
import { createSitemap } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap();
}
