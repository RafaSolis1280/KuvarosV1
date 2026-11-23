// DEV-30 · /robots.txt (convención de archivo de Next). Contenido en src/lib/seo.ts.
import type { MetadataRoute } from "next";
import { createRobots } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return createRobots();
}
