// DEV-38 · Secuencias de la página: qué video, dónde se ancla y cuánto scroll dura cada una.
// Los assets (rutas y conteo de frames) siguen viniendo del manifiesto (CLAUDE.md §4); aquí solo se
// añade cómo se usan en la página. Para sumar un video nuevo: manifiesto + una entrada aquí + su sección.
import { ASSET_MANIFEST, type SequenceVariant } from "@/config/gpu-policy";

export interface SequenceConfig {
  /** Clave de su progreso en el store (`sequenceProgress[id]`) */
  id: string;
  /** `id` HTML de la sección (destino de anclas) */
  anchorId: string;
  /** Carpeta del video: `<basePath>/<variante>/frame_0001.webp` */
  basePath: string;
  /** Conteo por variante. Es una referencia estable del manifiesto (no crear objetos nuevos). */
  totalFrames: Readonly<Record<SequenceVariant, number>>;
  /** Recorrido de scroll (px) mientras la sección está fijada */
  scrollDistance: number;
}

export const SEQUENCES = {
  /** Video 1 · la hamburguesa se separa capa por capa (DEV-09 + DEV-19) */
  hamburguesa: {
    id: "hamburguesa",
    anchorId: "ingredientes",
    basePath: ASSET_MANIFEST.sequences.heroExplode.basePath,
    totalFrames: ASSET_MANIFEST.sequences.heroExplode.totalFrames,
    scrollDistance: 3200,
  },
  /** Video 2 · hamburguesa y papas entran a la bolsa (DEV-37) */
  packaging: {
    id: "packaging",
    anchorId: "packaging",
    basePath: ASSET_MANIFEST.sequences.packagingReveal.basePath,
    totalFrames: ASSET_MANIFEST.sequences.packagingReveal.totalFrames,
    scrollDistance: 3400,
  },
} as const satisfies Record<string, SequenceConfig>;

/** Convención de nombres de los frames (la misma que genera `scripts/video-to-frames.mjs`) */
export const FRAME_FILE = { prefix: "frame_", digits: 4, extension: "webp" } as const;

/**
 * Encuadre del canvas. En pantallas verticales con un master horizontal, "cover" recortaría el
 * producto por los lados (DEV-19): se muestra solo la franja central y se rellena con negro.
 */
export const SEQUENCE_FRAMING = {
  /** Por debajo de esta relación ancho/alto el viewport se considera vertical */
  portraitMaxAspect: 0.8,
  /** Fracción del ancho del master que se muestra en vertical */
  portraitVisibleWidth: 0.72,
  /** Posición vertical de la imagen (0 = arriba, 1 = abajo) para dejar sitio a las fichas */
  portraitTopOffset: 0.12,
  /** Color de relleno: el fondo negro puro del video */
  letterboxColor: "#000",
} as const;
