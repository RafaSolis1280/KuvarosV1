// DEV-05 · Ref: Manual v2 Parte II §5. Store transiente: los campos de scroll/puntero se leen
// SIEMPRE con useExperienceStore.getState() dentro de useFrame/RAF, nunca con el hook (Hard Constraint 1).
import { create } from "zustand";
import { type GPUTierLevel, type GPUStrictParameter, GPU_STRICT_POLICIES } from "@/config/gpu-policy";

interface ExperienceState {
  // Hardware y accesibilidad (cambian rara vez → pueden leerse con hooks)
  gpuPolicy: GPUStrictParameter;
  webglAvailable: boolean;
  reducedMotion: boolean;
  isCanvasPaused: boolean;
  preloadProgress: number;
  isPreloaded: boolean;

  // Transiente (leer SIEMPRE con getState() en useFrame / RAF; nunca con hooks)
  scrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  /**
   * Progreso 0-1 de cada secuencia pinneada, por id (DEV-09 / DEV-37). Lo escribe ImageSequenceCanvas
   * y lo leen los overlays (ingredientes, specs del packaging) por suscripción, nunca con hooks.
   */
  sequenceProgress: Readonly<Record<string, number>>;
  /** Objeto MUTABLE: se modifica in situ para no generar basura en cada pointermove */
  pointerNDC: { x: number; y: number };

  setGPUTier: (tier: GPUTierLevel) => void;
  downgradeGPUTier: () => void;
  setWebGLAvailable: (ok: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setCanvasPaused: (paused: boolean) => void;
  setPreloadProgress: (progress: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  gpuPolicy: GPU_STRICT_POLICIES[2], // Tier 2 seguro hasta que detect-gpu resuelva
  webglAvailable: true,
  reducedMotion: false,
  isCanvasPaused: false,
  preloadProgress: 0,
  isPreloaded: false,

  scrollY: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  sequenceProgress: {},
  pointerNDC: { x: 0, y: 0 },

  setGPUTier: (tier) => set({ gpuPolicy: GPU_STRICT_POLICIES[tier] }),
  downgradeGPUTier: () => {
    const current = get().gpuPolicy.tier;
    if (current > 1) {
      const next = (current - 1) as GPUTierLevel;
      console.warn(`[GPU_STRICT_GUARD] Tier ${current} → ${next}`);
      set({ gpuPolicy: GPU_STRICT_POLICIES[next] });
    }
  },
  setWebGLAvailable: (ok) => set({ webglAvailable: ok }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setCanvasPaused: (paused) => set({ isCanvasPaused: paused }),
  setPreloadProgress: (progress) => set({ preloadProgress: progress, isPreloaded: progress >= 100 }),
}));
