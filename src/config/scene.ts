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
