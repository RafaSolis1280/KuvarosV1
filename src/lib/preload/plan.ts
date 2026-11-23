// DEV-13 · Qué frames se descargan primero (sin DOM: testeable).
//   crítico   → los primeros N frames de la historia: lo que se ve en cuanto empieza el scroll.
//   streaming → primero el arranque de cada clip siguiente (el próximo corte de la historia) y luego el
//               resto en el orden de la historia, que es el orden en que el visitante los va a necesitar.
import type { SequenceVariant } from "@/config/gpu-policy";
import { clipLayout, storyFrameUrl, type SequenceClip } from "@/lib/sequence/timeline";

export function preloadPlan(clips: readonly SequenceClip[], variant: SequenceVariant, criticalFrames: number): { critical: string[]; stream: string[] } {
  const { offsets, count } = clipLayout(clips, variant);
  const url = (i: number) => storyFrameUrl(clips, variant, i);
  const critical = Array.from({ length: Math.min(criticalFrames, count) }, (_, i) => url(i));

  const seen = new Set(critical);
  const stream: string[] = [];
  const add = (i: number) => {
    const u = url(i);
    if (!seen.has(u)) {
      seen.add(u);
      stream.push(u);
    }
  };
  for (const offset of offsets.slice(1)) {
    for (let i = offset; i < Math.min(offset + criticalFrames, count); i++) add(i);
  }
  for (let i = 0; i < count; i++) add(i);
  return { critical, stream };
}
