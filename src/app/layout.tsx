import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvasLoader from "@/components/canvas/GlobalCanvasLoader";

// Metadatos provisionales: el copy definitivo llega con DIR-05 y el SEO técnico con DEV-30.
export const metadata: Metadata = {
  title: "Nombre de Marca | Propuesta de valor en una línea",
  description: "Descripción real orientada a búsqueda (150-160 caracteres).",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="bg-surface text-ink antialiased">
      <body className="selection:bg-accent selection:text-black">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
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
