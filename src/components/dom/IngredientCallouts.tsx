"use client";

// DEV-19 · Callouts de ingredientes sincronizados con el scroll de la secuencia (DEV-09).
// Sin setState de React: useSequenceProgress escribe estilos directamente en los nodos (Hard Constraint 1).
// El texto está siempre en el DOM → legible sin WebGL y por lectores de pantalla (Hard Constraint 7).
// DEV-38: la suscripción y la animación salen de useSequenceProgress y lib/reveal.
import { useRef, type CSSProperties } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import Eyebrow from "@/components/ui/Eyebrow";
import { useSequenceProgress } from "@/hooks/useSequenceProgress";
import { applyReveal, windowVisibility } from "@/lib/reveal";
import { cx } from "@/lib/cx";
import { REVEAL } from "@/config/motion";
import type { Ingrediente } from "@/content/types";

interface Props {
  /** Id de la secuencia que controla los callouts */
  sequenceId: string;
  ingredientes: readonly Ingrediente[];
  /** Nombre accesible de la lista */
  ariaLabel: string;
}

export default function IngredientCallouts({ sequenceId, ingredientes, ariaLabel }: Props) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useSequenceProgress(sequenceId, (progress, reducedMotion) => {
    ingredientes.forEach((ing, i) => {
      const el = refs.current[i];
      if (!el) return;
      const v = windowVisibility(progress, ing.rango, REVEAL.callouts.maxFade);
      applyReveal(el, v, { axis: "y", offsetPx: REVEAL.callouts.offsetPx, reducedMotion });
      el.dataset.active = v > 0.5 ? "true" : "false";
    });
  });

  return (
    <ol className="relative h-full w-full" aria-label={ariaLabel}>
      {ingredientes.map((ing, i) => (
        <li
          key={ing.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-active="false"
          className="absolute inset-x-4 bottom-8 opacity-0 will-change-[opacity,transform] md:inset-x-auto md:bottom-auto md:left-[var(--x)] md:top-[var(--y)] md:w-[min(28vw,360px)]"
          style={{ "--x": `${ing.ancla.x}%`, "--y": `${ing.ancla.y}%` } as CSSProperties}
        >
          <GlassPanel
            className={cx(
              "p-5",
              ing.lado === "derecha" ? "md:border-l-accent md:border-l-2" : "md:border-r-accent md:border-r-2"
            )}
          >
            <Eyebrow variant="mono-sm">
              {String(i + 1).padStart(2, "0")} · {ing.dato}
            </Eyebrow>
            <h3 className="font-display mt-2 text-xl uppercase tracking-tight md:text-2xl">{ing.nombre}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{ing.descripcion}</p>
          </GlassPanel>
        </li>
      ))}
    </ol>
  );
}
