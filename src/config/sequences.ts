// DEV-40 · La historia del producto en video: UNA sola sección fijada que reproduce los dos clips del
// master (la hamburguesa que se separa y la que entra a la bolsa) uno detrás de otro, sin cortes.
// Los assets (rutas y conteo de frames) vienen del manifiesto (CLAUDE.md §4).
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import type { SequenceClip, StoryBeat } from "@/lib/sequence/timeline";

export interface SequenceConfig {
  /** Clave de su progreso en el store (`sequenceProgress[id]`) */
  id: string;
  /** `id` HTML de la sección (destino de anclas) */
  anchorId: string;
  /** Clips que se reproducen uno detrás de otro */
  clips: readonly SequenceClip[];
  /** Ritmo: qué parte del video ocurre en cada tramo de scroll */
  beats: readonly StoryBeat[];
}

/**
 * Beats medidos sobre el video real (movimiento frame a frame, DEV-40):
 * - hamburguesa 0-0.45 se separa · 0.45-0.85 capas casi quietas (aquí van las fichas) · 0.85-1 se vuelve a armar
 * - bolsa 0-0.19 papas y hamburguesa van a la bolsa · 0.19-0.42 quietas sobre la bolsa (se comprime)
 *   · 0.42-0.8 entran y la bolsa se cierra · 0.8-1 logo quieto (cierre corto)
 * `vh` es el scroll de cada beat en alturas de viewport: se adapta a cada pantalla.
 */
export const PRODUCT_STORY = {
  id: "producto",
  anchorId: "producto",
  clips: [ASSET_MANIFEST.sequences.heroExplode, ASSET_MANIFEST.sequences.packagingReveal],
  beats: [
    { id: "separa", clip: 0, to: 0.45, vh: 1 },
    { id: "ingredientes", clip: 0, to: 0.85, vh: 2.8 },
    { id: "se-arma", clip: 0, to: 1, vh: 0.5 },
    { id: "a-la-bolsa", clip: 1, to: 0.19, vh: 0.8 },
    { id: "sobre-la-bolsa", clip: 1, to: 0.42, vh: 0.35 },
    { id: "adentro", clip: 1, to: 0.8, vh: 1.2 },
    { id: "logo", clip: 1, to: 1, vh: 0.6 },
  ],
} as const satisfies SequenceConfig;

/** Convención de nombres de los frames (la misma que genera `scripts/video-to-frames.mjs`) */
export const FRAME_FILE = { prefix: "frame_", digits: 4, extension: "webp" } as const;

/**
 * Encuadre del canvas. En pantallas verticales con un master horizontal, "cover" recortaría el
 * producto por los lados (DEV-19): se muestra solo la franja central y se rellena con negro.
 */
export const SEQUENCE_FRAMING = {
  /** Por debajo de esta relación ancho/alto el viewport se considera vertical */
  portraitMaxAspect: 0.8,
  /** Fracción del ancho del master que se muestra en vertical (DEV-40: entran la hamburguesa y la bolsa) */
  portraitVisibleWidth: 0.66,
  /** Posición vertical de la imagen (0 = arriba, 1 = abajo): centrada en el espacio libre sobre las fichas */
  portraitTopOffset: 0.3,
  /** Color de relleno: el fondo negro puro del video */
  letterboxColor: "#000",
  /**
   * Calidad del escalado al dibujar: los frames (1292 px) se amplían hasta el ancho del viewport × dpr.
   * "high" evita el aspecto pixelado/serrado del escalado por defecto ("low").
   */
  smoothingQuality: "high" as ImageSmoothingQuality,
} as const;
