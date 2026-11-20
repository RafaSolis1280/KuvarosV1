"use client";

// DEV-37 · Ficha técnica del packaging sobre su secuencia de video (sin modelo 3D).
// El panel entra al empezar la secuencia y cada especificación aparece en su tramo del scroll
// y queda visible. Sin setState de React: suscripción al store transiente y estilos directos
// en los nodos (Hard Constraint 1). El texto está siempre en el DOM (Hard Constraint 7).
import { useEffect, useRef } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import { clamp } from "@/lib/math";
import type { Especificacion } from "@/content/producto";

interface Props {
  sequenceId: string;
  eyebrow: string;
  titulo: string;
  descripcion: string;
  especificaciones: readonly Especificacion[];
  nota?: string;
  /** Tramo (0-1) en el que entra el panel */
  entrada?: readonly [number, number];
  /** Tramo (0-1) a lo largo del cual se van sumando las especificaciones */
  tramoSpecs?: readonly [number, number];
  /** Lado del panel en desktop: el contrario a donde está el producto en el encuadre del video */
  lado?: "izquierda" | "derecha";
}

const ENTRADA_DEFECTO = [0.08, 0.2] as const;
const TRAMO_SPECS_DEFECTO = [0.25, 0.8] as const;

const rampa = (p: number, a: number, b: number) => clamp((p - a) / Math.max(1e-4, b - a), 0, 1);

export default function PackagingSpecs({
  sequenceId,
  eyebrow,
  titulo,
  descripcion,
  especificaciones,
  nota,
  entrada = ENTRADA_DEFECTO,
  tramoSpecs = TRAMO_SPECS_DEFECTO,
  lado = "izquierda",
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let last = -1;
    const n = especificaciones.length;
    const apply = (p: number) => {
      if (p === last) return;
      last = p;
      const reduced = useExperienceStore.getState().reducedMotion;
      const panel = panelRef.current;
      if (panel) {
        const v = rampa(p, entrada[0], entrada[1]);
        panel.style.opacity = String(reduced ? (v > 0.5 ? 1 : 0) : v);
        panel.style.transform = reduced ? "none" : `translate3d(${(1 - v) * (lado === "derecha" ? 24 : -24)}px, 0, 0)`;
      }
      const [a, b] = tramoSpecs;
      const step = (b - a) / Math.max(1, n);
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const v = rampa(p, a + i * step, a + i * step + step * 0.8);
        row.style.opacity = String(reduced ? (v > 0.5 ? 1 : 0) : v);
        row.style.transform = reduced ? "none" : `translate3d(0, ${(1 - v) * 10}px, 0)`;
      });
    };
    apply(useExperienceStore.getState().sequenceProgress[sequenceId] ?? 0);
    return useExperienceStore.subscribe((s) => apply(s.sequenceProgress[sequenceId] ?? 0));
  }, [sequenceId, especificaciones, entrada, tramoSpecs, lado]);

  return (
    <div className={`flex h-full w-full items-end px-4 pb-8 md:items-center md:px-16 md:pb-0 ${lado === "derecha" ? "md:justify-end" : ""}`}>
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-3xl md:max-w-sm border border-ink/10 bg-surface-deep/75 p-5 opacity-0 backdrop-blur-md will-change-[opacity,transform] md:p-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
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
      </div>
    </div>
  );
}
