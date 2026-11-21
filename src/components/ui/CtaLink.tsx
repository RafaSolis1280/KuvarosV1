// DEV-38 · Botón-enlace de llamado a la acción (mostaza, 10 % de la regla 60-30-10 de la marca).
// Un solo lugar para el estilo del CTA: cabecera (sm) y sección de conversión (lg).
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

const BASE =
  "pointer-events-auto rounded-full bg-accent font-bold uppercase tracking-widest text-on-accent transition hover:bg-ink focus-visible:outline-2";

const SIZES = {
  /** Cabecera: compacto, foco en beige para contrastar con el fondo del hero */
  sm: "px-5 py-2.5 text-xs focus-visible:outline-offset-2 focus-visible:outline-ink",
  /** Conversión: grande, foco en mostaza */
  lg: "px-8 py-4 text-sm focus-visible:outline-offset-4 focus-visible:outline-accent",
} as const;

interface Props {
  href: string;
  children: ReactNode;
  size?: keyof typeof SIZES;
  /** Enlace a otro sitio: abre en otra pestaña con rel seguro */
  external?: boolean;
  className?: string;
}

export default function CtaLink({ href, children, size = "sm", external = false, className }: Props) {
  return (
    <a
      href={href}
      className={cx(BASE, SIZES[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
