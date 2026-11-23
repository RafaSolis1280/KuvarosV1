// DEV-30 · Datos estructurados del negocio en el HTML del servidor (<script type="application/ld+json">).
// Es un <script> nativo, no next/script: no es código, son datos (guía de JSON-LD de Next.js).
import { createBusinessJsonLd, serializeJsonLd } from "@/lib/seo";

export default function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createBusinessJsonLd()) }} />
  );
}
