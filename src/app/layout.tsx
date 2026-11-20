import type { Metadata } from "next";
import { Bree_Serif, League_Spartan } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvasLoader from "@/components/canvas/GlobalCanvasLoader";
import { PRODUCTO } from "@/content/producto";

// DEV-08 · Tipografías de marca (Manual de marca, Página 5). next/font las descarga en el build y las sirve
// desde el propio dominio (sin peticiones a Google en el navegador) con métricas de fallback → sin CLS.
// · Secundaria (oficial): League Spartan (licencia SIL OFL 1.1).
// · Primaria / display: el manual no da el nombre (está en curvas). Bree Serif (OFL) es un PROVISIONAL cercano
//   al wordmark de los empaques; se reemplaza por la fuente real con next/font/local cuando ART-04 la entregue.
const display = Bree_Serif({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-display" });
const sans = League_Spartan({ subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-sans" });

// Metadatos de marca (texto en src/content/producto.ts). El SEO técnico completo llega con DEV-30.
// NEXT_PUBLIC_SITE_URL = dominio de producción (o la Preview URL); sin él, las URLs del OG se resuelven contra localhost.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: PRODUCTO.seo.titulo,
  description: PRODUCTO.seo.descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: `${PRODUCTO.marca} ${PRODUCTO.bajadaMarca}`,
    title: PRODUCTO.seo.titulo,
    description: PRODUCTO.seo.descripcion,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: PRODUCTO.seo.ogAlt }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} bg-surface text-ink antialiased`}>
      <body className="selection:bg-accent selection:text-on-accent">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Saltar al contenido
        </a>
        <SmoothScrollProvider>
          <GlobalCanvasLoader />
          <main id="contenido" className="relative z-[10]">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
