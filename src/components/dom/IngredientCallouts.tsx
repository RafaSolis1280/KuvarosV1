"use client";

// DEV-19 · Fichas de ingredientes sincronizadas con el video (DEV-09).
// DEV-40: cada ficha tiene su turno dentro del beat «ingredientes». El scroll elige la ficha activa y
// el cambio es un fundido en el tiempo (~0.25 s, entra subiendo y sale hacia arriba), una sola a la vez.
// Sin setState de React: useSequenceProgress escribe estilos en los nodos (Hard Constraint 1).
// El texto está siempre en el DOM → legible sin WebGL y por lectores de pantalla (Hard Constraint 7).
import { useRef, type CSSProperties } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import Eyebrow from "@/components/ui/Eyebrow";
import { useDampedValues } from "@/hooks/useDampedValues";
import { useSequenceProgress } from "@/hooks/useSequenceProgress";
import { useExperienceStore } from "@/store/useExperienceStore";
import { activeSlot, applyStyle, exclusiveTargets, oneHot } from "@/lib/reveal";
import { cx } from "@/lib/cx";
import { DAMPING, REVEAL } from "@/config/motion";
import type { Ingrediente } from "@/content/types";

interface Props {
  /** Id de la secuencia que controla las fichas */
  sequenceId: string;
  ingredientes: readonly Ingrediente[];
  /** Tramo del scroll (0-1) en el que se presentan todas las fichas */
  range: readonly [number, number];
  /** Nombre accesible de la lista */
  ariaLabel: string;
}

export default function IngredientCallouts({ sequenceId, ingredientes, range, ariaLabel }: Props) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const { enterOffsetPx, exitOffsetPx } = REVEAL.callouts;

  /** Lado de cada ficha respecto de la activa: +1 viene después (entra desde abajo), -1 ya pasó (sale hacia arriba) */
  const sides = useRef<number[]>([]);

  // Lo que se ve: la visibilidad de cada ficha, llevada a su objetivo en el tiempo. exclusiveTargets hace
  // que la siguiente espere a que la anterior termine de irse (una sola a la vez)
  const setTargets = useDampedValues(
    DAMPING.overlays,
    (values) => {
      const { reducedMotion } = useExperienceStore.getState();
      values.forEach((v, i) => {
        const el = refs.current[i];
        if (!el) return;
        const offsetPx = (1 - v) * ((sides.current[i] ?? 1) < 0 ? exitOffsetPx : enterOffsetPx);
        applyStyle(el, v, { axis: "y", offsetPx, reducedMotion });
        el.dataset.active = v > 0.5 ? "true" : "false";
      });
    },
    exclusiveTargets
  );

  // El scroll decide qué ficha está activa (su turno dentro del beat); el fundido lo hace el tiempo
  useSequenceProgress(sequenceId, (progress) => {
    const active = activeSlot(progress, range, ingredientes.length);
    ingredientes.forEach((_, i) => {
      if (i !== active) sides.current[i] = i < active ? -1 : 1;
    });
    setTargets(oneHot(ingredientes.length, active));
  });

  // DEV-29: un <h2> (solo para lectores de pantalla) antes de las fichas, que son <h3>: sin él el orden de
  // encabezados saltaba de h1 a h3 (Lighthouse «heading-order»). Nombra también la lista.
  const headingId = `${sequenceId}-ingredientes`;
  return (
    <>
      <h2 id={headingId} className="sr-only">
        {ariaLabel}
      </h2>
      <ol className="relative h-full w-full" aria-labelledby={headingId}>
        {ingredientes.map((ing, i) => (
          <li
            key={ing.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-active="false"
            className="absolute inset-x-4 bottom-10 opacity-0 will-change-[opacity,transform] md:inset-x-auto md:bottom-auto md:left-[var(--x)] md:top-[var(--y)] md:w-[min(28vw,360px)]"
            style={{ "--x": `${ing.ancla.x}%`, "--y": `${ing.ancla.y}%` } as CSSProperties}
          >
            <GlassPanel
              className={cx(
                "p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)]",
                ing.lado === "derecha" ? "md:border-l-accent md:border-l-2" : "md:border-r-accent md:border-r-2"
              )}
            >
              <Eyebrow variant="mono-sm">
                {String(i + 1).padStart(2, "0")} / {String(ingredientes.length).padStart(2, "0")} · {ing.dato}
              </Eyebrow>
              <h3 className="font-display mt-2 text-xl uppercase tracking-tight md:text-2xl">{ing.nombre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{ing.descripcion}</p>
            </GlassPanel>
          </li>
        ))}
      </ol>
    </>
  );
}
