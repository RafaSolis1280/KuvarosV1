// DEV-16 · Lógica del sonido sin Web Audio ni DOM (testeable).
import { clamp } from "@/lib/math";
import { AUDIO_MIME, SOUND } from "@/config/sound";

/**
 * Frecuencia de corte del low-pass según la velocidad del scroll: 400 Hz en reposo → 2 500 Hz con
 * |velocidad| ≥ velocityForOpen. Interpola en escala logarítmica (como oye el oído): a mitad de camino
 * la frecuencia es la media geométrica (1 000 Hz), no la aritmética.
 */
export function cutoffForVelocity(velocity: number, cfg: Pick<typeof SOUND, "cutoffRestHz" | "cutoffOpenHz" | "velocityForOpen"> = SOUND): number {
  const t = clamp(Math.abs(velocity) / cfg.velocityForOpen, 0, 1);
  return cfg.cutoffRestHz * Math.pow(cfg.cutoffOpenHz / cfg.cutoffRestHz, t);
}

/**
 * Primer archivo que el navegador sabe reproducir, en el orden del manifiesto (WebM/Opus primero, M4A de
 * respaldo para Safari). `canPlayType` es el de HTMLMediaElement: devuelve "", "maybe" o "probably".
 */
export function pickAudioSource(sources: readonly string[], canPlayType: (mime: string) => string): string | null {
  for (const src of sources) {
    const ext = src.split(".").pop()?.toLowerCase() ?? "";
    const mime = AUDIO_MIME[ext];
    if (mime && canPlayType(mime) !== "") return src;
  }
  return null;
}
