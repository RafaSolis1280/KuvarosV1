"use client";

// DEV-17 · Contenedor fijo de la cabecera. Solo esta capa es de cliente: el contenido (logo, CTA) se
// renderiza en el servidor y llega como children.
// Arriba del todo es transparente (deja ver el hero); al bajar gana un fondo de vidrio para que el logo
// y el CTA mantengan el contraste sobre los videos. El cambio se escribe como atributo del DOM, sin
// setState de React en el scroll (Hard Constraint 1), y solo cuando cruza el umbral.
import { useEffect, useRef, type ReactNode } from "react";
import { NAV } from "@/config/site";

export default function StickyHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let scrolled: boolean | null = null;
    // Lenis desplaza la ventana de verdad, así que el evento nativo sirve con y sin scroll suave
    const update = () => {
      const next = window.scrollY > NAV.solidAfterPx;
      if (next === scrolled) return;
      scrolled = next;
      header.dataset.scrolled = String(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled="false"
      className="fixed inset-x-0 top-0 stack-nav h-nav border-b border-transparent px-6 transition-[background-color,border-color,backdrop-filter] duration-300 md:px-16 data-[scrolled=true]:border-ink/10 data-[scrolled=true]:bg-surface/85 data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
