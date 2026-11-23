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

/**
 * BUG-01 · Enlace directo a una sección (`/#contacto`). El navegador salta al ancla con el layout del
 * servidor; después ScrollTrigger crea los pins de la historia (≈ 6500 px más de página) y el ancla
 * queda en mitad del video. Se vuelve a alinear tras cada `ScrollTrigger.refresh()` hasta que el
 * usuario interactúa o pasan `settleMs` desde la carga completa (fuentes e imágenes ya medidas).
 */
export const ANCHOR_ON_LOAD = {
  settleMs: 1500,
  /** Cualquiera de estos eventos significa que el usuario ya decidió dónde estar */
  userEvents: ["wheel", "touchstart", "keydown", "pointerdown"],
} as const;

/** Constantes λ de `damp()` (Hard Constraint 3): más alto = responde más rápido */
export const DAMPING = {
  /** Brillo del fondo que sigue al puntero (DEV-10) */
  pointer: 6,
  /** Deformación del fondo según la velocidad del scroll (DEV-10) */
  scrollVelocity: 8,
  /**
   * Overlays del video (fichas, ficha del packaging, capítulos): siguen al video con suavizado en el
   * tiempo, así un tirón de la rueda no los hace aparecer de golpe (≈ 0.3 s para asentarse).
   */
  overlays: 10,
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

/**
 * Cómo aparecen los overlays DOM sobre el video (DEV-40). Todas las transiciones usan una curva suave
 * (smoothstep) y están ligadas al progreso del video. Con reduced motion se mantiene el fundido de
 * opacidad (no es movimiento) y se quita el desplazamiento.
 */
export const REVEAL = {
  // El scroll decide qué overlay está activo; el fundido dura lo que marca DAMPING.overlays (en tiempo,
  // ~0.25 s), así ningún texto queda a medio aparecer donde el usuario deja de desplazarse.
  callouts: {
    /** La ficha entra subiendo desde aquí (px)… */
    enterOffsetPx: 22,
    /** …y sale subiendo hasta aquí (px): se lee como un movimiento continuo hacia arriba */
    exitOffsetPx: -14,
  },
  specs: {
    /** Punto del beat «a la bolsa» (0-1) en el que aparece el panel: cuando la bolsa ya está en cuadro */
    panelEntryShare: 0.35,
    /** Punto del beat «logo» (0-1) en el que el panel se va: el cierre es la bolsa con el logo sola */
    panelExitShare: 0.15,
    /** Desplazamiento horizontal (px) del panel al entrar */
    panelOffsetPx: 28,
    /** Desplazamiento vertical (px) de cada fila al entrar */
    rowOffsetPx: 12,
  },
  chapters: {
    offsetPx: 10,
  },
} as const;

/**
 * DEV-18 · Entrada del titular del hero (tipografía cinética con SplitText). Las letras suben desde
 * debajo de su línea (máscara por línea), una tras otra. Solo transform: no mueve el layout (CLS 0).
 * Con prefers-reduced-motion el titular aparece quieto.
 */
export const HERO_TITLE = {
  /** Curva de entrada del Manual (cubic-bezier(0.16, 1, 0.3, 1)): arranca rápida y se asienta suave */
  ease: "0.16,1,0.3,1",
  duration: 1.1,
  /** Segundos entre letra y letra */
  stagger: 0.025,
  /** Las letras parten un 110 % por debajo de su línea (ocultas por la máscara) */
  fromYPercent: 110,
  delay: 0.05,
} as const;

/**
 * DEV-24 · Cursor personalizado (solo ratón/trackpad, nunca en táctil ni con prefers-reduced-motion).
 * El punto sigue al puntero exacto; el anillo lo alcanza con damp() (inercia independiente de los FPS).
 */
export const CUSTOM_CURSOR = {
  /** Dispositivos con ratón o trackpad (los únicos donde se monta, y se descarga, el cursor: DEV-28) */
  finePointerQuery: "(hover: hover) and (pointer: fine)",
  /** λ de damp() del anillo: más alto = lo alcanza antes */
  ringLambda: 16,
  /** Escala del anillo sobre enlaces y botones */
  hoverScale: 1.6,
  /** Escala del anillo al hacer clic */
  pressScale: 0.85,
  /** Por debajo de este movimiento (px) el anillo se da por quieto y no se reescribe el DOM */
  restPx: 0.1,
} as const;
