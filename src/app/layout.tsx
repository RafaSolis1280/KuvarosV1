import type { Metadata } from "next";
import { Bree_Serif, League_Spartan } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvasLoader from "@/components/canvas/GlobalCanvasLoader";

// DEV-08 · Tipografías de marca (Manual de marca, Página 5). next/font las descarga en el build y las sirve
// desde el propio dominio (sin peticiones a Google en el navegador) con métricas de fallback → sin CLS.
// · Secundaria (oficial): League Spartan (licencia SIL OFL 1.1).
// · Primaria / display: el manual no da el nombre (está en curvas). Bree Serif (OFL) es un PROVISIONAL cercano
//   al wordmark de los empaques; se reemplaza por la fuente real con next/font/local cuando ART-04 la entregue.
const display = Bree_Serif({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-display" });
const sans = League_Spartan({ subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-sans" });

// Metadatos provisionales: el copy definitivo llega con DIR-05 y el SEO técnico con DEV-30.
export const metadata: Metadata = {
  title: "Nombre de Marca | Propuesta de valor en una línea",
  description: "Descripción real orientada a búsqueda (150-160 caracteres).",
  alternates: { canonical: "/" },
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
