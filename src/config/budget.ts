// DEV-01 · Performance Budget del proyecto (Manual v2, Fase 0). Fuente única de los límites: la usan los
// tests (pesos de las secuencias), el control de JS (`npm run budget`) y los informes de QA.
// No hay analítica del cliente (DIR-01: la marca vende por Instagram y aún no tiene web), así que rigen los
// valores del Manual. Se ajustan cuando DIR-01 entregue el reparto real de dispositivos.
// Unidades: KB = 1024 bytes, tal como viajan por la red (comprimidos).

export const PERFORMANCE_BUDGET = {
  /** JS que se descarga al cargar la página (gzip). Es el mismo bundle en desktop y móvil: manda el de móvil. */
  initialJsGzipKB: { desktop: 350, mobile: 250 },
  /** Todo lo descargado hasta el primer impacto (hero visible y la ventana inicial de frames) */
  criticalKB: { desktop: 4 * 1024, mobile: 2 * 1024 },
  /** Todo lo descargado al recorrer la página entera (frames incluidos) */
  totalKB: { desktop: 25 * 1024, mobile: 12 * 1024 },
  /** Cada video (carpeta de frames de una variante) */
  sequenceKB: { desktop: 8 * 1024, mobile: 4 * 1024 },
  /** Core Web Vitals (Lighthouse móvil + INP de laboratorio) */
  lcpMs: 2500,
  cls: 0.1,
  inpMs: 200,
  /** FPS medios: desktop / Android de gama media */
  fps: { desktop: 55, mobile: 50 },
} as const;
