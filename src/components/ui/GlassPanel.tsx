// DEV-38 · Panel translúcido (vidrio esmerilado) de las fichas que flotan sobre los videos.
import type { ReactNode, Ref } from "react";
import { cx } from "@/lib/cx";

const RADIUS = { md: "rounded-2xl", lg: "rounded-3xl" } as const;

interface Props {
  children: ReactNode;
  radius?: keyof typeof RADIUS;
  className?: string;
  /** Para animar el panel desde fuera (opacidad/transform) sin re-renders */
  ref?: Ref<HTMLDivElement>;
}

export default function GlassPanel({ children, radius = "md", className, ref }: Props) {
  return (
    <div ref={ref} className={cx(RADIUS[radius], "border border-ink/10 bg-surface-deep/75 backdrop-blur-md", className)}>
      {children}
    </div>
  );
}
