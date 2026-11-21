import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvasLoader from "@/components/canvas/GlobalCanvasLoader";
import SkipLink from "@/components/layout/SkipLink";
import { fontVariables } from "./fonts";
import { createSiteMetadata } from "@/lib/seo";
import { MAIN_CONTENT_ID, SITE } from "@/config/site";

// Metadatos de marca (texto en src/content/producto.ts, URL e idioma en src/config/site.ts).
// El SEO técnico completo llega con DEV-30.
export const metadata = createSiteMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SITE.lang} className={`${fontVariables} bg-surface text-ink antialiased`}>
      <body className="selection:bg-accent selection:text-on-accent">
        <SkipLink />
        <SmoothScrollProvider>
          <GlobalCanvasLoader />
          <main id={MAIN_CONTENT_ID} className="relative stack-content">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
