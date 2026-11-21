// Página de Kuvaro's Smash Burguers — experiencia 100 % video hiperrealista (DEV-37: sin modelos 3D).
// La página solo compone secciones (DEV-38); cada una vive en src/components/sections y toma su texto
// de src/content/producto.ts y su configuración de src/config.
//   1. Hero (SSR, el <h1> es el LCP)                           → DEV-18
//   2. Video 1: la hamburguesa se separa capa por capa          → DEV-09 + DEV-19
//   3. Video 2: hamburguesa y papas entran a la bolsa + ficha    → DEV-37
//   4. Primer bocado: fotos reales de la marca                   → DEV-19 (ART-12)
//   5. Conversión                                                → DEV-25 (canal definitivo: DIR-01)
import HeroSection from "@/components/sections/HeroSection";
import IngredientsSection from "@/components/sections/IngredientsSection";
import PackagingSection from "@/components/sections/PackagingSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IngredientsSection />
      <PackagingSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
