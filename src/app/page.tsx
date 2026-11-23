// Página de Kuvaro's Smash Burguers — experiencia 100 % video hiperrealista (DEV-37: sin modelos 3D).
// La página solo compone secciones (DEV-38); cada una vive en src/components/sections y toma su texto
// de src/content/producto.ts y su configuración de src/config.
//   1. Hero (SSR, el <h1> es el LCP)                           → DEV-18
//   2-3. Historia en video (una sola sección, DEV-40): la hamburguesa se separa capa por capa con
//        sus fichas, se vuelve a armar y entra a la bolsa con la ficha del packaging → DEV-09/19/37
//   4. Primer bocado: fotos reales de la marca                   → DEV-19 (ART-12)
//   5. Conversión                                                → DEV-25 (canal definitivo: DIR-01)
import HeroSection from "@/components/sections/HeroSection";
import ProductStorySection from "@/components/sections/ProductStorySection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductStorySection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
