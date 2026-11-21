"use client";

// DEV-40 · Orientación dentro de la historia en video: título del capítulo actual (arriba) y barra de
// progreso (abajo). Se anima sin re-renders con useSequenceProgress; la barra usa scaleX (solo GPU).
import { useRef } from "react";
import { useDampedValues } from "@/hooks/useDampedValues";
import { useSequenceProgress } from "@/hooks/useSequenceProgress";
import { useExperienceStore } from "@/store/useExperienceStore";
import { applyStyle, exclusiveTargets, oneHot } from "@/lib/reveal";
import { DAMPING, REVEAL } from "@/config/motion";

export interface StoryChapter {
  numero: string;
  titulo: string;
  /** Tramo del scroll (0-1) que abarca el capítulo */
  range: readonly [number, number];
}

interface Props {
  sequenceId: string;
  chapters: readonly StoryChapter[];
}

export default function StoryProgress({ sequenceId, chapters }: Props) {
  const titleRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const { offsetPx } = REVEAL.chapters;

  /** +1: el capítulo viene después (entra desde abajo); -1: ya pasó (sale hacia arriba) */
  const sides = useRef<number[]>([]);

  // Títulos: uno a la vez, con fundido en el tiempo (el siguiente espera a que el anterior se vaya)
  const setTargets = useDampedValues(
    DAMPING.overlays,
    (values) => {
      const { reducedMotion } = useExperienceStore.getState();
      values.forEach((v, i) => {
        const el = titleRefs.current[i];
        if (el) applyStyle(el, v, { axis: "y", offsetPx: (1 - v) * (sides.current[i] ?? 1) * offsetPx, reducedMotion });
      });
    },
    exclusiveTargets
  );

  useSequenceProgress(sequenceId, (progress) => {
    // Capítulo actual: el primero ya se ve al empezar y el último sigue hasta el final (la sección se va igual)
    const found = chapters.findIndex((chapter) => progress < chapter.range[1]);
    const active = found < 0 ? chapters.length - 1 : found;
    chapters.forEach((_, i) => {
      if (i !== active) sides.current[i] = i < active ? -1 : 1;
    });
    setTargets(oneHot(chapters.length, active));
    // La barra sigue al video sin retraso
    if (barRef.current) barRef.current.style.transform = `scaleX(${+progress.toFixed(4)})`;
  });

  return (
    <>
      {/* Debajo de la cabecera fija (DEV-17) */}
      <div className="absolute inset-x-0 top-[calc(var(--spacing-nav)+0.75rem)] flex justify-center" aria-hidden="true">
        <div className="relative h-5 w-full">
          {chapters.map((chapter, i) => (
            <p
              key={chapter.numero}
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              className="absolute inset-x-0 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-ink/70 opacity-0 will-change-[opacity,transform]"
            >
              <span className="text-accent">{chapter.numero}</span> · {chapter.titulo}
            </p>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink/10" aria-hidden="true">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent/80 will-change-transform" />
      </div>
    </>
  );
}
