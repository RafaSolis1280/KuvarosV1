// DEV-05 · Ref: Manual v2 Parte II §5. Store transiente: los campos de scroll/puntero se leen
// SIEMPRE con useExperienceStore.getState() dentro de useFrame/RAF, nunca con el hook (Hard Constraint 1).
import { create } from "zustand";
import { type GPUTierLevel, type GPUStrictParameter, GPU_STRICT_POLICIES, DEFAULT_TIER } from "@/config/gpu-policy";

interface ExperienceState {
  // Hardware y accesibilidad (cambian rara vez → pueden leerse con hooks)
  gpuPolicy: GPUStrictParameter;
  /** DEV-27: tier fijado a mano (override de desarrollo); ni detect-gpu ni los FPS lo cambian */
  tierPinned: boolean;
  webglAvailable: boolean;
  /** DEV-13: detect-gpu ya decidió el tier (o falló, o hay override): se sabe qué variante de frames pedir */
  gpuReady: boolean;
  /** DEV-13: el fondo WebGL ya dibujó su primer frame (shader compilado) */
  canvasReady: boolean;
  reducedMotion: boolean;
  isCanvasPaused: boolean;
  preloadProgress: number;
  isPreloaded: boolean;
  /** DEV-16: el visitante activó el sonido (solo cambia con un clic/toque: se puede leer con el hook) */
  soundOn: boolean;

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
  /** DEV-27: fija el tier y lo bloquea (setGPUTier y downgradeGPUTier dejan de cambiarlo) */
  pinGPUTier: (tier: GPUTierLevel) => void;
  downgradeGPUTier: () => void;
  setWebGLAvailable: (ok: boolean) => void;
  setGpuReady: () => void;
  setCanvasReady: () => void;
  setReducedMotion: (v: boolean) => void;
  setCanvasPaused: (paused: boolean) => void;
  setPreloadProgress: (progress: number) => void;
  /** DEV-16: llamar SOLO desde un gesto del usuario (los navegadores bloquean el audio sin gesto) */
  setSoundOn: (on: boolean) => void;
  /** Escritura transiente del progreso de una secuencia; no notifica si el valor no cambió */
  setSequenceProgress: (sequenceId: string, progress: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  gpuPolicy: GPU_STRICT_POLICIES[DEFAULT_TIER], // tier seguro hasta que detect-gpu resuelva
  tierPinned: false,
  webglAvailable: true,
  gpuReady: false,
  canvasReady: false,
  reducedMotion: false,
  isCanvasPaused: false,
  preloadProgress: 0,
  isPreloaded: false,
  soundOn: false,

  scrollY: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  sequenceProgress: {},
  pointerNDC: { x: 0, y: 0 },

  setGPUTier: (tier) => {
    if (!get().tierPinned) set({ gpuPolicy: GPU_STRICT_POLICIES[tier] });
  },
  pinGPUTier: (tier) => set({ gpuPolicy: GPU_STRICT_POLICIES[tier], tierPinned: true }),
  downgradeGPUTier: () => {
    if (get().tierPinned) return;
    const current = get().gpuPolicy.tier;
    if (current > 1) {
      const next = (current - 1) as GPUTierLevel;
      console.warn(`[GPU_STRICT_GUARD] Tier ${current} → ${next}`);
      set({ gpuPolicy: GPU_STRICT_POLICIES[next] });
    }
  },
  setWebGLAvailable: (ok) => set({ webglAvailable: ok }),
  setGpuReady: () => {
    if (!get().gpuReady) set({ gpuReady: true });
  },
  setCanvasReady: () => {
    if (!get().canvasReady) set({ canvasReady: true });
  },
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setCanvasPaused: (paused) => set({ isCanvasPaused: paused }),
  setPreloadProgress: (progress) => set({ preloadProgress: progress, isPreloaded: progress >= 100 }),
  setSoundOn: (on) => set({ soundOn: on }),
  setSequenceProgress: (sequenceId, progress) => {
    const current = get().sequenceProgress;
    if (current[sequenceId] === progress) return;
    set({ sequenceProgress: { ...current, [sequenceId]: progress } });
  },
}));
