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

/** Ventana [min, max] de frames que deben estar decodificados alrededor de `center` */
export function windowBounds(center: number, radius: number, count: number): { min: number; max: number } {
  return { min: Math.max(0, center - radius), max: Math.min(count - 1, center + radius) };
}
