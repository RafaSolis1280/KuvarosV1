"use client";

// DEV-07 · Ref: Manual v2 Parte II §8 (GlobalCanvas) y Fase 4 Paso 10 (Single-Canvas).
// Un ÚNICO <Canvas> WebGL fijo en toda la app (fixed; inset 0; pointer-events none; z-index 1).
// Aquí se enchufan, cada uno en su tarjeta:
//   DEV-10 → <BackgroundShaderQuad /> (shader de fondo fluido)
//   (DEV-11 descartada por DEV-37: el proyecto no usa modelos 3D, solo video)
//   DEV-14 → <ParticleField /> (polvo, un draw call, gpuPolicy.maxParticles)
//   DEV-15 → bloom + grano DENTRO del shader de fondo (BackgroundShaderQuad), solo si
//            gpuPolicy.enablePostProcessing. Sin EffectComposer: el único contenido WebGL es un quad a
//            pantalla completa, y una pasada aparte costaría render targets y ancho de banda sin ganar nada.

import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useExperienceStore } from "@/store/useExperienceStore";
import { CANVAS_CAMERA, PERFORMANCE_GUARD } from "@/config/scene";
import BackgroundShaderQuad from "./BackgroundShaderQuad";
import ParticleField from "./ParticleField";

/**
 * Si el contexto WebGL no se puede crear (driver bloqueado, GPU perdida…), la capa visual
 * se retira y el sitio sigue funcionando: la capa visual nunca bloquea la funcional (Paso 10.5).
 */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.error("[GlobalCanvas] WebGL falló → fallback DOM", error);
    useExperienceStore.getState().setWebGLAvailable(false);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GlobalCanvas() {
  // Selectores de baja frecuencia (cambian pocas veces por sesión): OK usar hooks aquí.
  const gpuPolicy = useExperienceStore((s) => s.gpuPolicy);
  const isCanvasPaused = useExperienceStore((s) => s.isCanvasPaused);
  const webglAvailable = useExperienceStore((s) => s.webglAvailable);
  const tierPinned = useExperienceStore((s) => s.tierPinned); // DEV-27: tier forzado en desarrollo

  if (!webglAvailable) return null; // Tier 0: no se monta el Canvas; el DOM muestra el póster

  return (
    <div
      className="pointer-events-none fixed inset-0 stack-canvas h-dvh w-screen overflow-hidden"
      aria-hidden="true"
      data-testid="global-canvas"
    >
      <CanvasErrorBoundary>
        <Canvas
          dpr={gpuPolicy.dpr}
          frameloop={isCanvasPaused ? "never" : "always"}
          // `antialias` solo se lee al crear el contexto: un cambio de tier en vivo no lo aplica
          // hasta recargar. Es aceptable: recrear el Canvas violaría Single-Canvas.
          gl={{ powerPreference: "high-performance", antialias: gpuPolicy.antialias, stencil: false }}
          camera={CANVAS_CAMERA}
        >
          {/* FPS reales: degrada un tier por caída; tras N oscilaciones fija el tier de respaldo (sin cascada). */}
          {/* Con un tier forzado (DEV-27) no se mide: la prueba debe ver ese tier, no el que dejen los FPS */}
          {!tierPinned && (
            <PerformanceMonitor
              flipflops={PERFORMANCE_GUARD.flipflops}
              onDecline={() => useExperienceStore.getState().downgradeGPUTier()}
              onFallback={() => useExperienceStore.getState().setGPUTier(PERFORMANCE_GUARD.fallbackTier)}
            />
          )}

          {/* DEV-10 · Fondo fluido */}
          <BackgroundShaderQuad />
          {/* DEV-14 · Partículas (encima del fondo, detrás de las secuencias del DOM) */}
          <ParticleField />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
