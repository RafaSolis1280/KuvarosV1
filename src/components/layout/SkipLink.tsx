// Enlace «Saltar al contenido»: invisible hasta recibir el foco con el teclado (WCAG 2.4.1).
import { MAIN_CONTENT_ID } from "@/config/site";
import { PRODUCTO } from "@/content/producto";

export default function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:stack-top focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
    >
      {PRODUCTO.accesibilidad.saltarAlContenido}
    </a>
  );
}
