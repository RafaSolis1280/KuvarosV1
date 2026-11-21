// DEV-38 / DEV-40 · Lógica compartida por los overlays que aparecen sobre el video (fichas de
// ingredientes, ficha del packaging, títulos de capítulo). Funciones puras + un aplicador de estilos
// sin React (Hard Constraint 1: nada de setState en scroll).
import { clamp } from "@/lib/math";

/** Curva suave (smoothstep): arranca y termina sin brusquedad. */
export function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Reparte `count` turnos consecutivos (sin solaparse) dentro de [start, end]: uno sale y el siguiente
 * entra en el mismo punto, así nunca hay dos fichas superpuestas.
 */
export function splitSlots(range: readonly [number, number], count: number): (readonly [number, number])[] {
  const [a, b] = range;
  const step = (b - a) / Math.max(1, count);
  return Array.from({ length: count }, (_, i) => [a + i * step, a + (i + 1) * step] as const);
}

/**
 * Turno activo dentro de `range` repartido en `count` turnos iguales: -1 antes del tramo, `count`
 * después. El scroll decide QUÉ se ve; el fundido lo hace el tiempo (DampedValues), así que donde sea
 * que el usuario deje de desplazarse el elemento está entero o no está, nunca a medio fundir.
 */
export function activeSlot(progress: number, [start, end]: readonly [number, number], count: number): number {
  if (progress < start) return -1;
  if (progress >= end) return count;
  return Math.min(count - 1, Math.floor(((progress - start) / Math.max(1e-6, end - start)) * count));
}

/** Objetivos 0/1: solo el elemento `active` está visible. */
export function oneHot(count: number, active: number): number[] {
  return Array.from({ length: count }, (_, i) => (i === active ? 1 : 0));
}

/**
 * Exclusión mutua para DampedValues (elementos que ocupan el mismo lugar: fichas, títulos): el que
 * tiene que aparecer espera a que los demás se hayan ido (< `threshold`). El cambio es «sale uno, entra
 * el otro», sin dos textos superpuestos, igual al bajar que al subir.
 */
export function exclusiveTargets(desired: readonly number[], current: readonly number[], threshold = 0.02): number[] {
  return desired.map((d, i) => {
    if (d === 0) return 0;
    const othersVisible = current.some((c, j) => j !== i && c > threshold);
    return othersVisible ? 0 : d;
  });
}

/**
 * Cascada para DampedValues: cada elemento espera a que el anterior vaya por `lead` antes de empezar a
 * aparecer. Si un tirón de la rueda activa varias filas a la vez, aparecen una detrás de otra (cada una
 * con su propio fundido suave). Al ocultarse no hay espera.
 */
export function cascadeTargets(desired: readonly number[], current: readonly number[], lead = 0.35): number[] {
  return desired.map((d, i) => (i > 0 && d > 0 && current[i - 1] < lead ? 0 : d));
}

/**
 * Escribe opacidad y desplazamiento en el nodo. Con reduced motion se mantiene el fundido (no es
 * movimiento) y se quita el desplazamiento.
 */
export function applyStyle(
  el: HTMLElement,
  opacity: number,
  { axis, offsetPx, reducedMotion }: { axis: "x" | "y"; offsetPx: number; reducedMotion: boolean }
): void {
  // Solo opacidad: el texto sigue en el árbol de accesibilidad aunque no se vea (Hard Constraint 7)
  el.style.opacity = String(+opacity.toFixed(4));
  if (reducedMotion) {
    el.style.transform = "none";
    return;
  }
  const o = +offsetPx.toFixed(2);
  el.style.transform = axis === "x" ? `translate3d(${o}px, 0, 0)` : `translate3d(0, ${o}px, 0)`;
}

/** Atajo: aparece desde `offsetPx` hasta su sitio según la visibilidad (0-1). */
export function applyReveal(
  el: HTMLElement,
  visibility: number,
  style: { axis: "x" | "y"; offsetPx: number; reducedMotion: boolean }
): void {
  applyStyle(el, visibility, { ...style, offsetPx: (1 - visibility) * style.offsetPx });
}
