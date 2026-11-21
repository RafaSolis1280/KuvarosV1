// DEV-38 · Ajustes del único Canvas WebGL (DEV-07). El fondo es un quad a pantalla completa que
// no depende de la cámara, pero R3F necesita una; se deja fija aquí y no en el componente.
export const CANVAS_CAMERA = { position: [0, 0, 4.2] as [number, number, number], fov: 42 } as const;

/** PerformanceMonitor de drei: tras N oscilaciones de FPS deja de subir/bajar y fija el tier de respaldo */
export const PERFORMANCE_GUARD = { flipflops: 3, fallbackTier: 1 } as const;
