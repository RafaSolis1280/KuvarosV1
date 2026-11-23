// DEV-40 · Línea de tiempo de una secuencia compuesta por varios clips y dividida en «beats».
// Cada beat dice hasta qué punto de qué clip llega el video y cuánto scroll dura (en alturas de
// viewport). Así se reparte el scroll según lo que pasa en pantalla: los tramos quietos del video se
// comprimen y los que necesitan lectura (fichas) se alargan. Sin DOM: testeable.
import type { SequenceVariant } from "@/config/gpu-policy";
import { frameUrl } from "@/lib/sequence/frames";

export interface SequenceClip {
  /** Carpeta del clip: `<basePath>/<variante>/frame_0001.webp` */
  basePath: string;
  /** Conteo por variante (referencia estable del manifiesto) */
  totalFrames: Readonly<Record<SequenceVariant, number>>;
}

export interface StoryBeat {
  id: string;
  /** Clip en el que termina el beat */
  clip: number;
  /** Punto del clip (0-1) al que llega el video al final del beat */
  to: number;
  /** Scroll que dura el beat, en alturas de viewport */
  vh: number;
}

/** Desplazamientos de cada clip dentro de la secuencia unida y total de frames */
export function clipLayout(clips: readonly SequenceClip[], variant: SequenceVariant): { offsets: number[]; count: number } {
  const offsets: number[] = [];
  let count = 0;
  for (const clip of clips) {
    offsets.push(count);
    count += clip.totalFrames[variant];
  }
  return { offsets, count };
}

/** Ruta del frame global `index` (los clips van uno detrás de otro) */
export function storyFrameUrl(clips: readonly SequenceClip[], variant: SequenceVariant, index: number): string {
  const { offsets } = clipLayout(clips, variant);
  let c = offsets.length - 1;
  while (c > 0 && index < offsets[c]) c--;
  return frameUrl(clips[c].basePath, variant, index - offsets[c]);
}

/** Scroll total de la secuencia, en alturas de viewport */
export function totalViewportHeights(beats: readonly StoryBeat[]): number {
  return beats.reduce((sum, b) => sum + b.vh, 0);
}

/** Tramo [inicio, fin] (progreso 0-1 del scroll) de cada beat */
export function beatRanges(beats: readonly StoryBeat[]): Record<string, readonly [number, number]> {
  const total = totalViewportHeights(beats);
  const ranges: Record<string, readonly [number, number]> = {};
  let acc = 0;
  for (const b of beats) {
    ranges[b.id] = [acc / total, (acc + b.vh) / total] as const;
    acc += b.vh;
  }
  return ranges;
}

/**
 * Función progreso del scroll (0-1) → posición exacta en frames (global, continua).
 * Lineal dentro de cada beat: entre beats cambia la velocidad del video, nunca salta.
 */
export function createTimeline(beats: readonly StoryBeat[], clips: readonly SequenceClip[], variant: SequenceVariant) {
  const { offsets, count } = clipLayout(clips, variant);
  const total = totalViewportHeights(beats);
  const stops: { at: number; frame: number }[] = [{ at: 0, frame: 0 }];
  let acc = 0;
  for (const b of beats) {
    acc += b.vh;
    const clipFrames = clips[b.clip].totalFrames[variant];
    stops.push({ at: acc / total, frame: offsets[b.clip] + b.to * (clipFrames - 1) });
  }

  const frameAt = (progress: number): number => {
    const p = Math.min(1, Math.max(0, progress));
    for (let k = 1; k < stops.length; k++) {
      const a = stops[k - 1];
      const b = stops[k];
      if (p <= b.at) {
        const t = b.at > a.at ? (p - a.at) / (b.at - a.at) : 1;
        return a.frame + t * (b.frame - a.frame);
      }
    }
    return stops[stops.length - 1].frame;
  };

  return { count, totalVh: total, frameAt };
}
