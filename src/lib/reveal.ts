// DEV-38 · Lógica compartida por los overlays que aparecen sobre las secuencias (callouts de
// ingredientes y ficha del packaging). Funciones puras + un aplicador de estilos sin React
// (Hard Constraint 1: nada de setState en scroll).
import { clamp } from "@/lib/math";

/** Progreso 0-1 de `value` dentro de [start, end] (0 antes, 1 después). */
export function progressBetween(value: number, start: number, end: number): number {
  return clamp((value - start) / Math.max(1e-4, end - start), 0, 1);
}

/**
 * Visibilidad 0-1 dentro de un tramo [a, b], con rampas suaves de entrada y salida.
 * La rampa mide como máximo `maxFade` y nunca más de un tercio del tramo.
 */
export function windowVisibility(progress: number, [a, b]: readonly [number, number], maxFade: number): number {
  const fade = Math.min(maxFade, (b - a) / 3);
  return clamp(Math.min((progress - a) / fade, (b - progress) / fade), 0, 1);
}

export interface RevealStyle {
  /** Eje del desplazamiento de entrada */
  axis: "x" | "y";
  /** Desplazamiento (px) cuando la visibilidad es 0 */
  offsetPx: number;
  /** Con reduced motion: sin desplazamiento y opacidad binaria (aparece o no) */
  reducedMotion: boolean;
}

/** Escribe opacidad y transform en el nodo según la visibilidad (0-1). */
export function applyReveal(el: HTMLElement, visibility: number, { axis, offsetPx, reducedMotion }: RevealStyle): void {
  if (reducedMotion) {
    el.style.opacity = visibility > 0.5 ? "1" : "0";
    el.style.transform = "none";
    return;
  }
  const offset = (1 - visibility) * offsetPx;
  el.style.opacity = String(visibility);
  el.style.transform = axis === "x" ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`;
}
