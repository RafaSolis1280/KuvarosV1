import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvasLoader from "@/components/canvas/GlobalCanvasLoader";
import SkipLink from "@/components/layout/SkipLink";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import JsonLd from "@/components/seo/JsonLd";
import CustomCursorLoader from "@/components/dom/CustomCursorLoader";
import { LazyPreloader } from "@/components/dom/lazy";
import { ambientAudio } from "@/lib/audio/availability";
import { fontVariables } from "./fonts";
import { createSiteMetadata } from "@/lib/seo";
import { MAIN_CONTENT_ID, SITE } from "@/config/site";

// Metadatos de marca (texto en src/content/producto.ts, URL e idioma en src/config/site.ts).
// SEO técnico (DEV-30): src/lib/seo.ts (metadatos, JSON-LD, sitemap y robots).
export const metadata = createSiteMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SITE.lang} className={`${fontVariables} bg-surface text-ink antialiased`}>
      <body className="selection:bg-accent selection:text-on-accent">
        <JsonLd />
        <SkipLink />
        <SmoothScrollProvider>
          <SiteHeader />
          <GlobalCanvasLoader />
          <LazyPreloader soundAvailable={ambientAudio().length > 0} />
          {/* tabIndex -1: destino de «Saltar al contenido» y del foco al cerrar el preloader (DEV-13) */}
          <main id={MAIN_CONTENT_ID} tabIndex={-1} className="relative stack-content outline-none">
            {children}
          </main>
          <SiteFooter />
          <CustomCursorLoader />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
