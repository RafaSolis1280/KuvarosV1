"use client";

// DEV-37 · Ficha técnica del packaging sobre su secuencia de video (sin modelo 3D).
// El panel entra al empezar la secuencia y cada especificación aparece en su tramo del scroll
// y queda visible. Sin setState de React (Hard Constraint 1). El texto está siempre en el DOM (Hard Constraint 7).
// DEV-38: la suscripción y la animación salen de useSequenceProgress y lib/reveal; tramos en config/motion.
import { useRef } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import Eyebrow from "@/components/ui/Eyebrow";
import { useSequenceProgress } from "@/hooks/useSequenceProgress";
import { applyReveal, progressBetween } from "@/lib/reveal";
import { cx } from "@/lib/cx";
import { REVEAL } from "@/config/motion";
import type { Especificacion, Lado } from "@/content/types";

export interface PackagingSpecsContent {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  especificaciones: readonly Especificacion[];
  nota?: string;
}

interface Props {
  sequenceId: string;
  content: PackagingSpecsContent;
  /** Tramo (0-1) en el que entra el panel */
  entrada?: readonly [number, number];
  /** Tramo (0-1) a lo largo del cual se van sumando las especificaciones */
  tramoSpecs?: readonly [number, number];
  /** Lado del panel en desktop: el contrario a donde está el producto en el encuadre del video */
  lado?: Lado;
}

export default function PackagingSpecs({
  sequenceId,
  content,
  entrada = REVEAL.specs.panelEntry,
  tramoSpecs = REVEAL.specs.rowsRange,
  lado = "izquierda",
}: Props) {
  const { eyebrow, titulo, descripcion, especificaciones, nota } = content;
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useSequenceProgress(sequenceId, (progress, reducedMotion) => {
    const panel = panelRef.current;
    if (panel) {
      const v = progressBetween(progress, entrada[0], entrada[1]);
      const offsetPx = lado === "derecha" ? REVEAL.specs.panelOffsetPx : -REVEAL.specs.panelOffsetPx;
      applyReveal(panel, v, { axis: "x", offsetPx, reducedMotion });
    }
    const [a, b] = tramoSpecs;
    const step = (b - a) / Math.max(1, especificaciones.length);
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const start = a + i * step;
      const v = progressBetween(progress, start, start + step * REVEAL.specs.rowFadeShare);
      applyReveal(row, v, { axis: "y", offsetPx: REVEAL.specs.rowOffsetPx, reducedMotion });
    });
  });

  return (
    <div className={cx("flex h-full w-full items-end px-4 pb-8 md:items-center md:px-16 md:pb-0", lado === "derecha" && "md:justify-end")}>
      <GlassPanel
        ref={panelRef}
        radius="lg"
        className="w-full max-w-md md:max-w-sm p-5 opacity-0 will-change-[opacity,transform] md:p-8"
      >
        <Eyebrow variant="mono">{eyebrow}</Eyebrow>
        <h2 className="font-display mt-3 text-3xl uppercase leading-[0.95] tracking-tight md:text-5xl">{titulo}</h2>
        <p className="mt-3 text-xs text-muted md:mt-4 md:text-base">{descripcion}</p>

        <dl className="mt-4 divide-y md:mt-6 divide-ink/10 border-y border-ink/10">
          {especificaciones.map((spec, i) => (
            <div
              key={spec.etiqueta}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="flex items-baseline justify-between gap-6 py-2 opacity-0 md:py-3 will-change-[opacity,transform]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{spec.etiqueta}</dt>
              <dd className="text-right text-sm font-semibold md:text-base">{spec.valor}</dd>
            </div>
          ))}
        </dl>
        {nota ? <p className="mt-3 text-xs text-muted/70">{nota}</p> : null}
      </GlassPanel>
    </div>
  );
}
