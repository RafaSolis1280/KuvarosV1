// DEV-16 · Sonido ambiente (Manual v2, Fase 5 Paso 16). Solo suena si el visitante lo activa.
export const SOUND = {
  /** Filtro low-pass: casi cerrado en reposo (sonido apagado, lejano)… */
  cutoffRestHz: 400,
  /** …y abierto con el scroll rápido */
  cutoffOpenHz: 2500,
  /** Velocidad de scroll (la de Lenis) a partir de la cual el filtro queda abierto del todo */
  velocityForOpen: 5,
  /** λ de damp() del corte (Hard Constraint 3): se abre y se cierra con suavidad */
  cutoffLambda: 4,
  /** Volumen del loop (0-1) */
  volume: 0.4,
  /** Segundos del fundido al activar o silenciar */
  fadeSeconds: 0.6,
} as const;

/** Tipo MIME de cada formato de audio, para preguntar al navegador si lo puede reproducir */
export const AUDIO_MIME: Record<string, string> = {
  webm: 'audio/webm; codecs="opus"',
  m4a: 'audio/mp4; codecs="mp4a.40.2"',
  mp3: "audio/mpeg",
};
