"use client";

// DEV-37 · Ficha técnica del packaging sobre su secuencia de video (sin modelo 3D).
// El panel entra al empezar la secuencia y cada especificación aparece en su tramo del scroll
// y queda visible. Sin setState de React (Hard Constraint 1). El texto está siempre en el DOM (Hard Constraint 7).
// DEV-38: la suscripción y la animación salen de useSequenceProgress y lib/reveal.
// DEV-40: los tramos salen de los beats de la historia (config/sequences.ts); el scroll decide qué se
// ve y el fundido es en el tiempo (sin quedar a medias), con las filas en cascada.
import { useRef } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import Eyebrow from "@/components/ui/Eyebrow";
import { useDampedValues } from "@/hooks/useDampedValues";
import { useSequenceProgress } from "@/hooks/useSequenceProgress";
import { useExperienceStore } from "@/store/useExperienceStore";
import { applyReveal, cascadeTargets, splitSlots } from "@/lib/reveal";
import { cx } from "@/lib/cx";
import { DAMPING, REVEAL } from "@/config/motion";
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
  /** Punto del scroll (0-1) desde el que se ve el panel */
  entrada: number;
  /** Punto del scroll (0-1) en el que el panel se va (p. ej. para dejar solo el plano final del logo) */
  salida?: number;
  /** Tramo del scroll (0-1) a lo largo del cual se van sumando las especificaciones */
  tramoSpecs: readonly [number, number];
  /** Lado del panel en desktop: el contrario a donde está el producto en el encuadre del video */
  lado?: Lado;
}

export default function PackagingSpecs({ sequenceId, content, entrada, salida = Infinity, tramoSpecs, lado = "izquierda" }: Props) {
  const { eyebrow, titulo, descripcion, especificaciones, nota } = content;
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { panelOffsetPx, rowOffsetPx } = REVEAL.specs;

  // Lo que se ve: [panel, fila 1…n], llevados a su objetivo con suavizado en el tiempo. cascadeTargets:
  // cada fila espera a la anterior (y la primera, al panel), así aparecen una tras otra aunque la rueda
  // active varias juntas
  const setTargets = useDampedValues(DAMPING.overlays, ([panelV, ...rowsV]) => {
    const { reducedMotion } = useExperienceStore.getState();
    if (panelRef.current) {
      applyReveal(panelRef.current, panelV, {
        axis: "x",
        offsetPx: lado === "derecha" ? panelOffsetPx : -panelOffsetPx,
        reducedMotion,
      });
    }
    rowsV.forEach((v, i) => {
      const row = rowRefs.current[i];
      if (row) applyReveal(row, v, { axis: "y", offsetPx: rowOffsetPx, reducedMotion });
    });
  }, cascadeTargets);

  useSequenceProgress(sequenceId, (progress) => {
    // El scroll decide qué se ve; el fundido lo hace el tiempo. Cada especificación aparece al llegar
    // a su turno y queda visible (la ficha se va completando)
    const panel = progress >= entrada && progress < salida ? 1 : 0;
    const rows = splitSlots(tramoSpecs, especificaciones.length).map(([start]) => (progress >= start ? 1 : 0));
    setTargets([panel, ...rows]);
  });

  return (
    <div className={cx("flex h-full w-full items-end px-4 pb-8 md:items-center md:px-16 md:py-16", lado === "derecha" && "md:justify-end")}>
      <GlassPanel
        ref={panelRef}
        radius="lg"
        className="w-full max-w-md md:max-w-sm p-5 opacity-0 will-change-[opacity,transform] md:p-8"
      >
        <Eyebrow variant="mono">{eyebrow}</Eyebrow>
        <h2 className="font-display mt-3 text-3xl uppercase leading-[0.95] tracking-tight md:text-5xl">{titulo}</h2>
        {/* En móvil la ficha va compacta para no tapar el video: la descripción y la nota quedan solo para
            lectores de pantalla (sr-only); en desktop se ven */}
        <p className="sr-only md:not-sr-only md:mt-4 md:block md:text-base md:text-muted">{descripcion}</p>

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
        {nota ? <p className="sr-only md:not-sr-only md:mt-3 md:block md:text-xs md:text-muted/70">{nota}</p> : null}
      </GlassPanel>
    </div>
  );
}
