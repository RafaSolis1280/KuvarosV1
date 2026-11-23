// DEV-05 · Ref: Manual v2 Parte II §4. DEV-37: proyecto solo-video (sin .glb, HDRI ni Draco/KTX2). Toda pieza gráfica lee la política activa (GPU_STRICT_POLICY).
export type GPUTierLevel = 1 | 2 | 3;
export type SequenceVariant = "desktop" | "mobile";

export interface GPUStrictParameter {
  tier: GPUTierLevel;
  /** Rango [min, max] de devicePixelRatio para Canvas WebGL y 2D */
  dpr: [number, number];
  /** Presupuesto orientativo de memoria para secuencias (MB) */
  maxSequenceVRAM_MB: number;
  /** Radio R de la ventana deslizante: solo [f-R, f+R] decodificados */
  sequenceWindowRadius: number;
  sequenceVariant: SequenceVariant;
  maxParticles: number;
  enablePostProcessing: boolean;
  antialias: boolean;
}

export const GPU_STRICT_POLICIES: Record<GPUTierLevel, GPUStrictParameter> = {
  3: { tier: 3, dpr: [1, 2],   maxSequenceVRAM_MB: 256, sequenceWindowRadius: 35, sequenceVariant: "desktop", maxParticles: 8000, enablePostProcessing: true,  antialias: true  },
  2: { tier: 2, dpr: [1, 1.5], maxSequenceVRAM_MB: 96,  sequenceWindowRadius: 18, sequenceVariant: "mobile",  maxParticles: 2500, enablePostProcessing: true,  antialias: false },
  1: { tier: 1, dpr: [1, 1],   maxSequenceVRAM_MB: 32,  sequenceWindowRadius: 8,  sequenceVariant: "mobile",  maxParticles: 500,  enablePostProcessing: false, antialias: false },
};

/** Tier seguro mientras detect-gpu no responde (o si falla) */
export const DEFAULT_TIER: GPUTierLevel = 2;

/** Lo que importa del resultado de detect-gpu (tier 0 = sin WebGL o GPU en lista negra) */
export interface GPUDetection {
  tier: number;
  isMobile?: boolean;
}

/**
 * Traduce el resultado de detect-gpu a la política del sitio (DEV-06):
 * tier 0 → sin WebGL (fallback estático, política T1) · tier 1 → T1 · tier 2 o móvil → T2 · resto → T3.
 */
export function tierFromGPU({ tier, isMobile }: GPUDetection): { tier: GPUTierLevel; webglAvailable: boolean } {
  if (tier <= 0) return { tier: 1, webglAvailable: false };
  if (tier === 1) return { tier: 1, webglAvailable: true };
  if (tier === 2 || isMobile) return { tier: 2, webglAvailable: true };
  return { tier: 3, webglAvailable: true };
}

export const ASSET_MANIFEST = {
  benchmarksURL: "/benchmarks",
  heroPoster: "/fallback/hero_poster.webp",
  sequences: {
    heroExplode: {
      basePath: "/sequences/hero_explode",
      // Conteo POR VARIANTE (deben coincidir si se exportan al mismo fps)
      // ART-10 · Marca/Video.mp4, tramo 0-2.25 s a 24 fps nativos (armada → capas separadas → se vuelve a juntar)
      totalFrames: { desktop: 54, mobile: 54 } satisfies Record<SequenceVariant, number>,
    },
    // DEV-37 · El packaging también es video hiperrealista (sin modelo 3D / .glb)
    packagingReveal: {
      basePath: "/sequences/packaging_reveal",
      // ART-10 · Marca/Video.mp4, tramo 2.25-8.79 s a 24 fps nativos (papas + hamburguesa entran a la bolsa → logo)
      totalFrames: { desktop: 157, mobile: 157 } satisfies Record<SequenceVariant, number>,
    },
  },
  audio: {
    ambient: ["/audio/ambient_drone.webm", "/audio/ambient_drone.m4a"],
    hover: ["/audio/ui_hover_tick.webm", "/audio/ui_hover_tick.m4a"],
  },
} as const;
