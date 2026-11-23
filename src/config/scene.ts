import type { GPUTierLevel } from "@/config/gpu-policy";

// DEV-38 · Ajustes del único Canvas WebGL (DEV-07). El fondo es un quad a pantalla completa que
// no depende de la cámara, pero R3F necesita una; se deja fija aquí y no en el componente.
export const CANVAS_CAMERA = { position: [0, 0, 4.2] as [number, number, number], fov: 42 } as const;

/** PerformanceMonitor de drei: tras N oscilaciones de FPS deja de subir/bajar y fija el tier de respaldo */
export const PERFORMANCE_GUARD = { flipflops: 3, fallbackTier: 1 } as const;

/**
 * DEV-15 · Acabado cinematográfico del fondo: bloom suave alrededor de las vetas y grano de película.
 * Solo en los tiers con `enablePostProcessing` (T2 «bloom ligero», T3 completo, Manual Paso 23); en T1
 * el bloque ni se compila. Se calcula en el mismo shader del fondo: sin render targets ni pasadas extra.
 *   bloom: cuánto brillo derrama la veta a su alrededor (0-1, nunca supera el brillo del centro de la veta)
 *   grain: amplitud del grano (fracción del rango de color; ±grain/2 por píxel)
 */
export const BACKGROUND_FX: Partial<Record<GPUTierLevel, { bloom: number; grain: number }>> = {
  3: { bloom: 0.75, grain: 0.045 },
  2: { bloom: 0.5, grain: 0.035 },
};

/**
 * El grano solo se dibuja si el canvas del fondo renderiza a este DPR o menos. Medido (Manuales/qa/DEV-15.md):
 * a DPR 1 no cuesta nada; a DPR 2, en una GPU integrada y haciendo scroll, un ruido distinto en cada
 * píxel bajaba de ~157 a ~65 FPS (la imagen deja de poder comprimirse). En pantallas de alta densidad
 * el grano casi no se percibe, así que ahí se omite. El bloom no tiene coste medible y queda siempre.
 */
export const GRAIN_MAX_DPR = 1;

/**
 * Mezcla máxima de mostaza que puede alcanzar el fondo: veta con el scroll más rápido (0.08 + 0.35 × 0.25)
 * + brillo del puntero (0.18 × 0.35) ≈ 23 %. Es el tope contra el que DEV-29 calculó el contraste de todo
 * el texto sobre el fondo: el grano (DEV-15) y las partículas (DEV-14) nunca lo superan.
 */
export const BACKGROUND_MAX_ACCENT = 0.08 + 0.35 * 0.25 + 0.18 * 0.35;

/**
 * DEV-14 · Partículas de polvo sobre el fondo (un solo draw call: THREE.Points). La cantidad la pone
 * gpuPolicy.maxParticles (8000 / 2500 / 500 según el tier). Se mueven en el vertex shader: la CPU solo
 * actualiza 4 uniforms por frame.
 */
export const PARTICLES = {
  /** Tamaño del punto en píxeles CSS (se multiplica por el DPR del canvas y por la profundidad) */
  sizePx: 2.2,
  /** Opacidad de las más cercanas / las más lejanas */
  alphaNear: 0.55,
  alphaFar: 0.12,
  /** Subida lenta (pantallas por segundo) de las más lejanas / las más cercanas */
  driftFar: 0.004,
  driftNear: 0.016,
  /** Desplazamiento por profundidad: con el puntero (en pantallas) y con el progreso del scroll */
  pointerParallax: 0.025,
  scrollParallax: 0.6,
  /** Semilla fija: la misma "nube" en cada visita */
  seed: 1729,
} as const;
