// DEV-38 · Parámetros de movimiento en un solo lugar (antes estaban repartidos por los componentes).
// Cambiar la "sensación" del sitio (inercia del scroll, suavizado del fondo, aparición de fichas) se hace aquí.

/** Lenis (DEV-06): scroll suave manejado por gsap.ticker. Ref: Manual v2 Parte II §6. */
export const SMOOTH_SCROLL = {
  duration: 1.15,
  /** Curva exponencial de salida: rápida al principio, se asienta suave */
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
} as const;

/** Constantes λ de `damp()` (Hard Constraint 3): más alto = responde más rápido */
export const DAMPING = {
  /** Brillo del fondo que sigue al puntero (DEV-10) */
  pointer: 6,
  /** Deformación del fondo según la velocidad del scroll (DEV-10) */
  scrollVelocity: 8,
} as const;

/** Reproducción de las secuencias controladas por el scroll (DEV-09 · fluidez: DEV-39) */
export const SEQUENCE_PLAYBACK = {
  /**
   * Segundos que tarda el playhead en alcanzar al scroll. Da inercia al video (sobre todo en táctil,
   * donde Lenis no suaviza) y, con la mezcla de frames, el avance se ve continuo en vez de a saltos.
   */
  scrub: 0.6,
  /** La sección se fija cuando su borde superior toca el del viewport */
  start: "top top",
  /** Recorrido de scroll (px) mientras la sección está fijada, si la secuencia no define el suyo */
  defaultScrollDistance: 2600,
  /**
   * Mezcla de frames: entre dos frames del video se funden los dos según la posición exacta del scroll.
   * Con 54 frames en 3200 px, sin mezcla la imagen solo cambia cada ~60 px (efecto stop-motion).
   */
  frameBlending: true,
  /** Resolución de la mezcla: pasos por frame (evita redibujar si el cambio no se notaría) */
  blendSteps: 64,
} as const;

/**
 * Entrada de cada video al aparecer en pantalla (DEV-39): mientras la sección sube hasta fijarse,
 * el video pasa de transparente y algo ampliado a su tamaño real, como si "aterrizara".
 * Ligado al scroll (va y vuelve). Desactivado con prefers-reduced-motion.
 */
export const SEQUENCE_ENTRANCE = {
  fromOpacity: 0,
  fromScale: 1.08,
  /** Curva sobre el recorrido de entrada: la mayor parte del cambio ocurre al principio */
  ease: "power2.out",
  /** Desde que el borde superior de la sección asoma por abajo hasta que toca arriba (donde se fija) */
  start: "top bottom",
  end: "top top",
} as const;

/** Cómo aparecen los overlays DOM sobre las secuencias (DEV-19 / DEV-37) */
export const REVEAL = {
  callouts: {
    /** Ancho máximo (en progreso 0-1) de la rampa de entrada/salida de cada ficha */
    maxFade: 0.04,
    /** Desplazamiento vertical (px) con el que entra cada ficha */
    offsetPx: 16,
  },
  specs: {
    /** Tramo (0-1) en el que entra el panel del packaging */
    panelEntry: [0.08, 0.2] as const,
    /** Tramo (0-1) a lo largo del cual se suman las especificaciones */
    rowsRange: [0.25, 0.8] as const,
    /** Fracción del paso de cada fila que dura su fundido */
    rowFadeShare: 0.8,
    /** Desplazamiento horizontal (px) del panel al entrar */
    panelOffsetPx: 24,
    /** Desplazamiento vertical (px) de cada fila al entrar */
    rowOffsetPx: 10,
  },
} as const;
