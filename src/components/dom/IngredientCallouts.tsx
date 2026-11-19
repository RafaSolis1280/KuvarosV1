"use client";

// DEV-19 · Callouts de ingredientes sincronizados con el scroll de la secuencia (DEV-09).
// Sin setState de React: se suscribe al store transiente (`sequenceProgress`) y escribe estilos
// directamente en los nodos (Hard Constraint 1). El texto está siempre en el DOM → legible sin
// WebGL y por lectores de pantalla (Hard Constraint 7).
import { useEffect, useRef } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import { clamp } from "@/lib/math";
import type { Ingrediente } from "@/content/producto";

interface Props {
  ingredientes: readonly Ingrediente[];
}

/** Opacidad 0-1 con rampas suaves de entrada/salida dentro del tramo [a, b] */
function visibilidad(p: number, [a, b]: readonly [number, number]): number {
  const fade = Math.min(0.04, (b - a) / 3);
  return clamp(Math.min((p - a) / fade, (b - p) / fade), 0, 1);
}

export default function IngredientCallouts({ ingredientes }: Props) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let last = -1;
    const apply = (p: number) => {
      if (p === last) return;
      last = p;
      const reduced = useExperienceStore.getState().reducedMotion;
      ingredientes.forEach((ing, i) => {
        const el = refs.current[i];
        if (!el) return;
        const v = visibilidad(p, ing.rango);
        el.style.opacity = String(reduced ? (v > 0.5 ? 1 : 0) : v);
        el.style.transform = reduced ? "none" : `translate3d(0, ${(1 - v) * 16}px, 0)`;
        el.dataset.active = v > 0.5 ? "true" : "false";
      });
    };
    apply(useExperienceStore.getState().sequenceProgress);
    return useExperienceStore.subscribe((s) => apply(s.sequenceProgress));
  }, [ingredientes]);

  return (
    <ol className="relative h-full w-full" aria-label="Ingredientes">
      {ingredientes.map((ing, i) => (
        <li
          key={ing.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-active="false"
          className="absolute inset-x-4 bottom-8 opacity-0 will-change-[opacity,transform] md:inset-x-auto md:bottom-auto md:left-[var(--x)] md:top-[var(--y)] md:w-[min(28vw,360px)]"
          style={{ "--x": `${ing.ancla.x}%`, "--y": `${ing.ancla.y}%` } as React.CSSProperties}
        >
          <div
            className={`rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-md ${
              ing.lado === "derecha" ? "md:border-l-accent md:border-l-2" : "md:border-r-accent md:border-r-2"
            }`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {String(i + 1).padStart(2, "0")} · {ing.dato}
            </p>
            <h3 className="mt-2 text-xl font-bold uppercase tracking-tight md:text-2xl">{ing.nombre}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{ing.descripcion}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
