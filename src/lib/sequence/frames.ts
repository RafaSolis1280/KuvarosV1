// DEV-38 · Cálculos de la secuencia (sin DOM): rutas de frames, índice según el progreso y
// ventana deslizante. Ref: Manual v2 Parte II §7.
import { FRAME_FILE } from "@/config/sequences";
import type { SequenceVariant } from "@/config/gpu-policy";

/** Ruta del frame `index` (base 0): `/sequences/x/desktop/frame_0001.webp` */
export function frameUrl(basePath: string, variant: SequenceVariant, index: number): string {
  const n = String(index + 1).padStart(FRAME_FILE.digits, "0");
  return `${basePath}/${variant}/${FRAME_FILE.prefix}${n}.${FRAME_FILE.extension}`;
}

/** Frame que corresponde a un progreso 0-1 en una secuencia de `count` frames */
export function frameIndexForProgress(progress: number, count: number): number {
  return Math.round(progress * (count - 1));
}

/**
 * Posición continua dentro de la secuencia para la mezcla de frames (frame blending):
 * entre el frame `from` y el siguiente `to`, con `mix` 0-1 de cuánto se ve `to`.
 * Ej.: 54 frames y progreso 0.5 → exact 26.5 → from 26, to 27, mix 0.5.
 */
export function framePosition(progress: number, count: number): { exact: number; from: number; to: number; mix: number } {
  const last = Math.max(0, count - 1);
  const exact = Math.min(last, Math.max(0, progress * last));
  const from = Math.floor(exact);
  const to = Math.min(last, from + 1);
  return { exact, from, to, mix: to === from ? 0 : exact - from };
}

/** Ventana [min, max] de frames que deben estar decodificados alrededor de `center` */
export function windowBounds(center: number, radius: number, count: number): { min: number; max: number } {
  return { min: Math.max(0, center - radius), max: Math.min(count - 1, center + radius) };
}
