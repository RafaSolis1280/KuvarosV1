// DEV-38 · Antetítulo en mayúsculas espaciadas y color de acento (encima de títulos y fichas).
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

const VARIANTS = {
  /** Secciones de la página (hero, primer bocado) */
  sans: "text-xs font-semibold tracking-[0.3em]",
  /** Fichas técnicas (panel del packaging) */
  mono: "font-mono text-xs tracking-[0.25em]",
  /** Fichas pequeñas (callouts de ingredientes) */
  "mono-sm": "font-mono text-[11px] tracking-[0.25em]",
} as const;

interface Props {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export default function Eyebrow({ children, variant = "sans", className }: Props) {
  return <p className={cx(VARIANTS[variant], "uppercase text-accent", className)}>{children}</p>;
}
