// DEV-13 · Preloader por prioridades (Manual v2, Fase 8 Paso 22). El preloader no es una barrera: el hero,
// el <h1> y el CTA se usan desde el primer momento; esto solo ordena qué se descarga primero.
export const PRELOAD = {
  /**
   * Primeros frames de la historia en el camino crítico (el Manual pide 15-20). Desde DEV-40 la historia es
   * una sola secuencia (hamburguesa → bolsa): los primeros frames del segundo clip van primeros en segundo plano.
   */
  criticalFrames: 15,
  /**
   * Red lenta (el navegador informa 3G o menos, o < 2 Mbps): el camino crítico se reduce a lo esencial
   * (Paso 22, prioridades): menos frames y no espera al shader de fondo, que es decorativo.
   */
  slowNetwork: { criticalFrames: 8, maxDownlinkMbps: 2 },
  /** Objetivo de la carga crítica (criterio de DEV-13) */
  criticalBudgetMs: 2500,
  /** Espera máxima a detect-gpu para saber la variante de frames (desktop / mobile) */
  gpuWaitMs: 1500,
  /** Espera máxima al primer frame del shader de fondo (si WebGL tarda, no frena el resto) */
  canvasWaitMs: 2000,
  /**
   * Descargas simultáneas en segundo plano (prioridad baja). 2 y no más: con ≤ 2 peticiones en curso el
   * navegador (y Lighthouse) consideran la red «quieta», así el streaming no retrasa la interactividad.
   */
  streamConcurrency: 2,
  /** El panel se va solo en cuanto el visitante empieza a desplazarse */
  hideAfterScrollPx: 40,
  /** Sin audio, el panel muestra «Listo» este tiempo antes de irse */
  doneHoldMs: 900,
} as const;
