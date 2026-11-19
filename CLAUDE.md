# CLAUDE.md — Instrucciones del agente para este repositorio

@AGENTS.md

> Fuente: **Parte II del `Manuales/MANUAL_V2_WEB_HIPERREALISTA.md`** (copiada abajo sin cambios).
> Flujo operativo: `Manuales/FLUJO_TRELLO_WEB_HIPERREALISTA.md`. Gobernanza Git: `Manuales/gu_a_de_configuraci_n_y_gobernanza_github.md`.
> Si este archivo y el manual divergen, manda el manual: actualizar este archivo en la misma PR.

## Flujo de trabajo del agente (resumen de gobernanza)

- **Nunca** commit/push directo a `main` ni a `develop`. Todo cambio va en una rama y entra por Pull Request.
- Ramas: `feat/<id-trello>-<tarea>` (p. ej. `feat/dev-05-gpu-policy-store`), `fix/<bug>`, `assets/<tipo>`.
- Una rama = una tarjeta de Trello (`DEV-XX`). El ID de la tarjeta va en el nombre de la rama, en los commits y en la PR.
- Commits con Conventional Commits: `feat(DEV-05): ...`, `fix(BUG-03): ...`, `chore(DEV-04): ...`.
- Trabajo por módulos (Manual Paso 20): no tocar archivos fuera del alcance de la tarjeta.
- Antes de cerrar una tarjeta: ejecutar el **Protocolo de verificación (§10)** — `npm run typecheck`, `npm run lint`, `npm run build`.

---

# PARTE II — ESPECIFICACIÓN DE CÓDIGO PARA EL AGENTE (`CLAUDE.md`)

**Rol del agente:** Principal Creative Technologist y Graphics Engineer. Inicializa, arquitecta y programa la aplicación siguiendo la fórmula del estudio y estas reglas.

## 0. Reglas inquebrantables (*Hard Constraints*)

1. **Prohibido `setState` de React** en `lenis.on('scroll')`, `pointermove` o `useFrame`. El estado continuo va en `useRef` o en escritura transiente de Zustand (`setState`/`getState`, o mutación de objetos del store).
2. **Single-Canvas:** un único `<Canvas>` WebGL en toda la app (`fixed; inset: 0; pointer-events: none; z-index: 1`).
3. **Inercia con $\Delta t$:** ninguna transformación de cámara, malla o uniform se asigna directamente. Todo pasa por `damp()`.
4. **Resiliencia ante assets faltantes:** si falta `.glb`, `.hdr`, `.webp` o audio, **no hay error fatal**: se renderiza un fallback procedural.
5. **`GPU_STRICT_POLICY`:** todo componente gráfico lee la política activa para `dpr`, radio de ventana VRAM, variante de secuencia y conteo de instancias.
6. **Limpieza total:** toda geometría, material, textura, `ImageBitmap`, `ScrollTrigger` y listener se libera al desmontar.
7. **Accesibilidad no negociable:** `reducedMotion` desactiva Lenis y movimientos de cámara. El HTML es usable sin WebGL.

## 1. Matriz de lenguajes por capa

| Capa | Ruta | Lenguaje | Responsabilidad |
| :--- | :--- | :--- | :--- |
| Configuración y políticas GPU | `src/config/*.ts` | TypeScript estricto | Políticas por tier, budgets y manifiesto de assets |
| Matemática y estado | `src/lib/*.ts`, `src/store/*.ts` | TypeScript puro | `damp`, `clamp`, `mapRange`, store transiente |
| Escena 3D | `src/components/canvas/**/*.tsx` | TSX + R3F | Grafo de escena, cargadores GLTF/Draco/KTX2, instancing, luces PBR |
| Shaders | `src/components/canvas/shaders/*.ts` | **GLSL compatible con `ShaderMaterial` de three** | Vertex/Fragment en template strings con uniforms tipados |
| Secuencias 2D | `src/components/sequence/*.tsx` | TSX + Canvas 2D + `ImageBitmap` | Ventana deslizante y liberación explícita de memoria |
| DOM / Layout | `src/app/**`, `src/components/dom/**` | TSX + Tailwind v4 | HTML semántico, grilla, `pointer-events: auto` |

> ⚠️ **Corrección v2:** la v1 exigía `#version 300 es`, pero el shader usaba sintaxis GLSL 1 (`varying`, `gl_FragColor`). Con `ShaderMaterial`, **three.js inyecta la versión, la precisión y las macros de compatibilidad**, así que se escribe GLSL estándar de three (`varying`, `gl_FragColor` funcionan) y **no** se declara `#version` ni `precision`. Solo con `RawShaderMaterial` se escriben a mano. También se eliminó el campo `shaderPrecision` de la política, porque no estaba conectado a nada.

## 2. Contrato de archivos de arte (`/public`)

```text
public/
├── draco/            draco_decoder.wasm, draco_wasm_wrapper.js, draco_decoder.js   (copiados por script)
├── basis/            basis_transcoder.wasm, basis_transcoder.js                     (copiados por script)
├── benchmarks/       (copiados de node_modules/detect-gpu/dist/benchmarks)
├── hdri/studio_dark_01.hdr                       < 1 MB
├── models/hero_artifact.glb                      Draco o Meshopt + KTX2
├── sequences/hero_explode/desktop/frame_0001.webp … frame_0120.webp   1600 px, 24 fps
├── sequences/hero_explode/mobile/frame_0001.webp  … frame_0120.webp   800 px, 24 fps (MISMO conteo)
├── audio/ambient_drone.webm + ambient_drone.m4a
├── audio/ui_hover_tick.webm + ui_hover_tick.m4a  < 80 ms
├── fallback/hero_poster.webp                     Tier 0/1
└── fonts/Display-Bold.woff2, Tech-Regular.woff2  (con licencia web)
```

## 3. Inicialización del proyecto

```bash
# 1. Next.js 16 (App Router, TS, Tailwind v4, ESLint, src/, alias @/*)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Núcleo 3D (R3F v9 requiere React 19)
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing

# 3. Animación, scroll, estado, GPU, audio
npm install gsap lenis zustand maath detect-gpu howler

# 4. Tipos
npm install -D @types/three @types/howler
```

> ⚠️ **Corrección v2:** se eliminaron `glslify-loader` y `raw-loader`. `raw-loader` está deprecado en webpack 5, y **Next.js 16 usa Turbopack por defecto**, que ignora el bloque `webpack()` de la config. Los shaders se escriben como **template strings** en `.ts`. Si hiciera falta importar `.glsl`, se usa `turbopack.rules` (ver abajo).

### `scripts/copy-decoders.mjs` (nuevo en v2)

```js
import { cpSync, mkdirSync } from "node:fs";

const copies = [
  ["node_modules/three/examples/jsm/libs/draco/gltf", "public/draco"],
  ["node_modules/three/examples/jsm/libs/basis", "public/basis"],
  ["node_modules/detect-gpu/dist/benchmarks", "public/benchmarks"],
];

for (const [from, to] of copies) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-decoders] ${from} → ${to}`);
}
```

En `package.json`: `"scripts": { "postinstall": "node scripts/copy-decoders.mjs", ... }`

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Solo si se importan archivos .glsl externos (por defecto: template strings, no hace falta)
  // turbopack: {
  //   rules: { "*.{glsl,vert,frag}": { loaders: ["raw-loader"], as: "*.js" } },
  // },
  async headers() {
    return [
      {
        source: "/:dir(models|sequences|hdri|draco|basis|benchmarks|audio|fonts|fallback)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
```

> Recordatorio: con `immutable`, cada cambio de un asset requiere **nombre o carpeta nuevos** (versionado).

## 4. Política de GPU — `src/config/gpu-policy.ts`

```ts
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

export const ASSET_MANIFEST = {
  dracoPath: "/draco/",
  basisPath: "/basis/",
  benchmarksURL: "/benchmarks",
  hdri: "/hdri/studio_dark_01.hdr",
  heroModel: "/models/hero_artifact.glb",
  heroPoster: "/fallback/hero_poster.webp",
  sequences: {
    heroExplode: {
      basePath: "/sequences/hero_explode",
      // Conteo POR VARIANTE (deben coincidir si se exportan al mismo fps)
      totalFrames: { desktop: 120, mobile: 120 } satisfies Record<SequenceVariant, number>,
    },
  },
  audio: {
    ambient: ["/audio/ambient_drone.webm", "/audio/ambient_drone.m4a"],
    hover: ["/audio/ui_hover_tick.webm", "/audio/ui_hover_tick.m4a"],
  },
} as const;
```

## 5. Matemática y store transiente

### `src/lib/math.ts`

```ts
/** Amortiguación exponencial independiente de FPS: target + (x - target)·e^(−λ·Δt) */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return target + (current - target) * Math.exp(-lambda * delta);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}
```

### `src/store/useExperienceStore.ts`

```ts
import { create } from "zustand";
import { GPUTierLevel, GPUStrictParameter, GPU_STRICT_POLICIES } from "@/config/gpu-policy";

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
```

## 6. Detector de hardware + motor de scroll — `src/components/dom/SmoothScrollProvider.tsx`

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getGPUTier } from "detect-gpu";
import { useExperienceStore } from "@/store/useExperienceStore";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const store = useExperienceStore.getState();
    const cleanups: Array<() => void> = [];

    // 1. Accesibilidad (eje independiente del rendimiento)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    store.setReducedMotion(reducedMotion);

    // 2. Clasificación de GPU con benchmarks auto-hospedados
    getGPUTier({ benchmarksURL: ASSET_MANIFEST.benchmarksURL })
      .then((gpu) => {
        if (gpu.tier === 0) {
          store.setWebGLAvailable(false); // sin WebGL → fallback estático
          store.setGPUTier(1);
        } else if (gpu.tier === 1) {
          store.setGPUTier(1);
        } else if (gpu.tier === 2 || gpu.isMobile) {
          store.setGPUTier(2);
        } else {
          store.setGPUTier(3);
        }
      })
      .catch(() => store.setGPUTier(2)); // si falla la detección, Tier 2 seguro

    // 3. Lenis manejado por el ticker de GSAP (un solo reloj). Sin Lenis si reduced motion.
    let lenis: Lenis | null = null;
    const update = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", (e: Lenis) => {
        ScrollTrigger.update();
        useExperienceStore.setState({
          scrollY: e.scroll,
          scrollVelocity: e.velocity,
          scrollProgress: e.progress,
        });
      });

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    } else {
      // Scroll nativo: igual alimentamos el store para shaders/sequencias
      const onNativeScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        useExperienceStore.setState({
          scrollY: window.scrollY,
          scrollVelocity: 0,
          scrollProgress: max > 0 ? window.scrollY / max : 0,
        });
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onNativeScroll));
    }

    // 4. Puntero normalizado [-1, 1] mutando el objeto (sin re-renders ni basura)
    const pointer = useExperienceStore.getState().pointerNDC;
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // 5. Pausar GPU con la pestaña oculta
    const onVisibilityChange = () => store.setCanvasPaused(document.hidden);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(update);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

## 7. Motor 2D con ventana deslizante — `src/components/sequence/ImageSequenceCanvas.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceStore } from "@/store/useExperienceStore";
import type { SequenceVariant } from "@/config/gpu-policy";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  sequenceFolder: string;                              // "/sequences/hero_explode"
  totalFrames: Record<SequenceVariant, number>;        // conteo por variante
  scrollDistance?: number;
  accentColor?: string;
  ariaLabel: string;                                    // descripción accesible de la animación
}

export default function ImageSequenceCanvas({
  sequenceFolder, totalFrames, scrollDistance = 2600, accentColor = "#FFD645", ariaLabel,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const getPolicy = () => useExperienceStore.getState().gpuPolicy;
    let variant = getPolicy().sequenceVariant;
    let count = totalFrames[variant];

    let bitmaps: (ImageBitmap | null)[] = new Array(count).fill(null);
    let loading: boolean[] = new Array(count).fill(false);
    let generation = 0;             // invalida cargas en vuelo al cambiar de variante
    let fallback = false;
    let drawn = -1;
    const playhead = { progress: 0 };

    const frameUrl = (i: number) => `${sequenceFolder}/${variant}/frame_${String(i + 1).padStart(4, "0")}.webp`;
    const currentIndex = () => Math.round(playhead.progress * (count - 1));

    const drawFallback = (i: number) => {
      const { width: w, height: h } = canvas;
      const p = i / Math.max(1, count - 1);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 5; k++) {
        const off = (k - 2) * p * h * 0.12;
        ctx.strokeStyle = k === 2 ? accentColor : "rgba(255,255,255,0.22)";
        ctx.lineWidth = k === 2 ? 3 : 1.5;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 + off, w * 0.16, h * 0.045, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = accentColor;
      ctx.font = `bold ${Math.max(14, Math.floor(w * 0.012))}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`[FALLBACK] FRAME ${i + 1}/${count}`, w / 2, h * 0.88);
    };

    const drawCover = (bmp: ImageBitmap) => {
      const { width: cw, height: ch } = canvas;
      const s = Math.max(cw / bmp.width, ch / bmp.height);
      ctx.drawImage(bmp, (cw - bmp.width * s) / 2, (ch - bmp.height * s) / 2, bmp.width * s, bmp.height * s);
    };

    /** Busca el bitmap decodificado más cercano al índice pedido (evita canvas en blanco) */
    const nearestLoaded = (i: number): number => {
      for (let d = 0; d < count; d++) {
        if (bitmaps[i - d]) return i - d;
        if (bitmaps[i + d]) return i + d;
      }
      return -1;
    };

    const syncWindow = (center: number) => {
      if (fallback) return;
      const R = getPolicy().sequenceWindowRadius;
      const min = Math.max(0, center - R);
      const max = Math.min(count - 1, center + R);

      for (let i = 0; i < count; i++) {
        if ((i < min || i > max) && bitmaps[i]) { bitmaps[i]!.close(); bitmaps[i] = null; }
      }

      for (let i = min; i <= max; i++) {
        if (bitmaps[i] || loading[i]) continue;
        loading[i] = true;
        const gen = generation;
        fetch(frameUrl(i))
          .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
          .then((b) => createImageBitmap(b))
          .then((bmp) => {
            const c = currentIndex();
            if (gen !== generation || Math.abs(i - c) > getPolicy().sequenceWindowRadius) { bmp.close(); return; }
            bitmaps[i] = bmp;
            if (Math.abs(i - c) <= 1) { drawn = -1; render(); }
          })
          .catch(() => { /* frame aislado faltante: se usa el más cercano */ })
          .finally(() => { if (gen === generation) loading[i] = false; });
      }
    };

    const render = () => {
      const i = currentIndex();
      syncWindow(i);
      if (fallback) { drawFallback(i); drawn = i; return; }
      if (i === drawn) return;
      const n = bitmaps[i] ? i : nearestLoaded(i);
      if (n >= 0) { drawCover(bitmaps[n]!); if (n === i) drawn = i; }
    };

    const resetCache = () => {
      generation++;
      bitmaps.forEach((b) => b?.close());
      variant = getPolicy().sequenceVariant;
      count = totalFrames[variant];
      bitmaps = new Array(count).fill(null);
      loading = new Array(count).fill(false);
      drawn = -1;
    };

    // Fallback SOLO si el primer frame no existe
    fetch(frameUrl(0), { method: "HEAD" })
      .then((r) => { if (!r.ok) fallback = true; })
      .catch(() => { fallback = true; })
      .finally(() => { drawn = -1; render(); });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, getPolicy().dpr[1]);
      canvas.width = Math.round(container.clientWidth * dpr);
      canvas.height = Math.round(container.clientHeight * dpr);
      drawn = -1;
      render();
    };
    resize();
    window.addEventListener("resize", resize);

    // Al cambiar de tier/variante se vacía la caché y se recarga la ventana
    const unsubscribe = useExperienceStore.subscribe((s, prev) => {
      if (s.gpuPolicy !== prev.gpuPolicy) { resetCache(); resize(); }
    });

    const tween = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: { trigger: container, start: "top top", end: `+=${scrollDistance}`, scrub: 0.35, pin: true },
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
      generation++;
      bitmaps.forEach((b) => b?.close());
      bitmaps = [];
    };
  }, [sequenceFolder, totalFrames, scrollDistance, accentColor]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={ariaLabel} />
    </section>
  );
}
```

> **Cambios respecto a la spec v1:** el playhead pasa a ser un `progress` 0-1, así funciona con cualquier `count` por variante. El fallback se activa solo si falta el frame 1. Se dibuja el frame más cercano mientras se decodifica. Se vacía la caché al cambiar de tier. El tamaño del canvas usa el contenedor (no `window`). Se agregó `aria-label`. `totalFrames` debe pasarse como referencia estable (constante del manifiesto) para no reiniciar el efecto.

## 8. Shader y escena 3D

### `src/components/canvas/shaders/FluidBackgroundMaterial.ts`

```ts
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const FluidBackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollVelocity: 0,
    uIntensity: 1,
    uPointer: new THREE.Vector2(0, 0),
    uColorBase: new THREE.Color("#0A0A0A"),
    uColorAccent: new THREE.Color("#FFD645"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0); // quad a pantalla completa (plane 2x2)
    }
  `,
  /* glsl */ `
    // Sin #version ni precision: three.js los inyecta en ShaderMaterial
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uIntensity;
    uniform vec2  uPointer;
    uniform vec3  uColorBase;
    uniform vec3  uColorAccent;

    // Hash sin sin() (Dave Hoskins): estable en GPUs móviles con precisión media
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float valueNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i),               hash12(i + vec2(1.0, 0.0)), u.x),
                 mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2  mouseUV = uPointer * 0.5 + 0.5;
      float dist    = distance(vUv, mouseUV);
      float warp    = clamp(abs(uScrollVelocity) * 0.015, 0.0, 0.35);
      float n       = valueNoise(vUv * 4.5 + vec2(uTime * 0.12, uTime * 0.08 + warp));
      float glow    = smoothstep(0.42, 0.0, dist) * 0.18;
      float vein    = smoothstep(0.62, 0.68, n + glow) * (0.08 + warp * 0.25);
      vec3  color   = mix(uColorBase, uColorAccent, (vein + glow * 0.35) * uIntensity);
      gl_FragColor  = vec4(color, 1.0);
    }
  `
);

extend({ FluidBackgroundMaterial });

// Tipado JSX para R3F v9 (evita @ts-expect-error)
declare module "@react-three/fiber" {
  interface ThreeElements {
    fluidBackgroundMaterial: import("@react-three/fiber").ThreeElement<typeof FluidBackgroundMaterial>;
  }
}
```

### `src/components/canvas/HeroArtifactMesh.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => { if (v instanceof THREE.Texture) v.dispose(); });
      m.dispose();
    });
  });
}

export default function HeroArtifactMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let mounted = true;
    let loaded: THREE.Group | null = null;

    const draco = new DRACOLoader().setDecoderPath(ASSET_MANIFEST.dracoPath);
    const ktx2 = new KTX2Loader().setTranscoderPath(ASSET_MANIFEST.basisPath).detectSupport(gl);
    const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      ASSET_MANIFEST.heroModel,
      (gltf) => {
        loaded = gltf.scene;
        if (mounted) setScene(gltf.scene);
        else disposeObject(gltf.scene);
      },
      undefined,
      () => { /* asset aún no entregado → se mantiene el fallback procedural */ }
    );

    return () => {
      mounted = false;
      if (loaded) disposeObject(loaded);
      draco.dispose();
      ktx2.dispose();
    };
  }, [gl]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const { pointerNDC, scrollProgress, scrollVelocity, reducedMotion } = useExperienceStore.getState();
    const motion = reducedMotion ? 0 : 1;

    const targetRotY = (pointerNDC.x * 0.65 + scrollProgress * Math.PI * 2) * motion;
    const targetRotX = (-pointerNDC.y * 0.35 + scrollVelocity * 0.004) * motion;
    g.rotation.y = damp(g.rotation.y, targetRotY, 5.5, delta);
    g.rotation.x = damp(g.rotation.x, targetRotX, 5.5, delta);

    const targetY = (Math.sin(state.clock.elapsedTime * 1.4) * 0.12) * motion + scrollProgress * 1.5;
    g.position.y = damp(g.position.y, targetY, 4.0, delta);
  });

  return (
    <group ref={groupRef}>
      {scene ? (
        <primitive object={scene} scale={1.4} />
      ) : (
        <group>
          <mesh>
            <octahedronGeometry args={[1.25, 2]} />
            <meshStandardMaterial color="#141414" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh scale={1.015}>
            <octahedronGeometry args={[1.25, 2]} />
            <meshBasicMaterial color="#FFD645" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      )}
    </group>
  );
}
```

> **Cambios v2:** se libera la escena cargada al desmontar (antes quedaba en VRAM). Se quitó `castShadow`/`receiveShadow`, porque las sombras no estaban habilitadas. Se soporta Meshopt además de Draco. Las mallas del fallback ya no van anidadas dentro de otra malla. Se respeta `reducedMotion`.

### `src/components/canvas/GlobalCanvas.tsx`

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";
import HeroArtifactMesh from "./HeroArtifactMesh";
import { FluidBackgroundMaterial } from "./shaders/FluidBackgroundMaterial";

type FluidMat = InstanceType<typeof FluidBackgroundMaterial> & {
  uTime: number; uScrollVelocity: number; uPointer: THREE.Vector2;
};

function BackgroundShaderQuad() {
  const mat = useRef<FluidMat>(null);
  const smoothed = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const { pointerNDC, scrollVelocity } = useExperienceStore.getState();
    smoothed.current.set(
      damp(smoothed.current.x, pointerNDC.x, 6, delta),
      damp(smoothed.current.y, pointerNDC.y, 6, delta)
    );
    m.uTime = state.clock.elapsedTime;
    m.uPointer.copy(smoothed.current);
    m.uScrollVelocity = damp(m.uScrollVelocity, scrollVelocity, 8, delta);
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <fluidBackgroundMaterial ref={mat} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export default function GlobalCanvas() {
  // Selectores de baja frecuencia (cambian pocas veces por sesión): OK usar hooks aquí
  const gpuPolicy = useExperienceStore((s) => s.gpuPolicy);
  const isCanvasPaused = useExperienceStore((s) => s.isCanvasPaused);
  const webglAvailable = useExperienceStore((s) => s.webglAvailable);

  if (!webglAvailable) return null; // el DOM muestra el póster estático

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] h-dvh w-screen overflow-hidden" aria-hidden="true">
      <Canvas
        dpr={gpuPolicy.dpr}
        frameloop={isCanvasPaused ? "never" : "always"}
        gl={{ powerPreference: "high-performance", antialias: gpuPolicy.antialias, stencil: false }}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => useExperienceStore.getState().downgradeGPUTier()}
          onFallback={() => useExperienceStore.getState().setGPUTier(1)}
        />

        <BackgroundShaderQuad />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFF8E7" />
        <spotLight position={[-4, -2, -2]} intensity={4.5} color="#FFD645" angle={0.6} />

        <HeroArtifactMesh />

        {gpuPolicy.enablePostProcessing && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1.05} mipmapBlur intensity={0.45} />
            <Noise opacity={0.032} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
```

> Nota: `antialias` solo se lee al crear el contexto WebGL. Si el tier cambia en vivo, el cambio de `antialias` no se aplica hasta recargar, y eso es aceptable. No se fuerza la recreación del Canvas, porque violaría la regla Single-Canvas.

## 9. Layout y página — `src/app`

### `layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";

export const metadata: Metadata = {
  title: "Nombre de Marca | Propuesta de valor en una línea",
  description: "Descripción real orientada a búsqueda (150-160 caracteres).",
  openGraph: { images: ["/og-image.jpg"] },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-[#0A0A0A] text-white antialiased">
      <body className="selection:bg-[#FFD645] selection:text-black">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
          Saltar al contenido
        </a>
        <SmoothScrollProvider>
          <GlobalCanvas />
          <main id="contenido" className="relative z-[10]">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

### `page.tsx`

```tsx
import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

const hero = ASSET_MANIFEST.sequences.heroExplode;

export default function HomePage() {
  return (
    <>
      {/* SECCIÓN 1: HERO — el <h1> es el elemento LCP (SSR, visible antes del 3D) */}
      <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-between px-6 py-12 md:px-16">
        <header className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFD645]">MARCA</span>
          <a href="#catalogo" className="pointer-events-auto rounded-full border border-white/15 bg-black/50 px-5 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-md transition hover:border-[#FFD645] hover:text-[#FFD645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFD645]">
            Explorar catálogo
          </a>
        </header>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl">
            Titular <span className="text-[#FFD645]">de impacto</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-zinc-400 md:text-base">Propuesta de valor clara en una o dos frases.</p>
        </div>
      </section>

      {/* SECCIÓN 2: STORYTELLING POR SECUENCIA */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          sequenceFolder={hero.basePath}
          totalFrames={hero.totalFrames}
          scrollDistance={2800}
          ariaLabel="Animación del producto desarmándose en sus componentes"
        />
      </div>

      {/* SECCIÓN 3: CONVERSIÓN */}
      <section id="catalogo" className="relative z-[15] flex min-h-dvh flex-col items-center justify-center bg-[#0A0A0A]/90 px-6 text-center backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">Llamado a la acción</h2>
        <a href="https://wa.me/XXXXXXXXXXX" className="mt-8 rounded-full bg-[#FFD645] px-8 py-4 font-bold uppercase text-black">
          Contactar
        </a>
      </section>
    </>
  );
}
```

## 10. Protocolo de verificación del agente

Antes de dar una tarea por terminada:
1. `npx tsc --noEmit` y `npm run build`: **cero errores**.
2. `grep -rn "useState" src/components/canvas src/components/sequence`: cada uso se revisa; ninguno puede escribirse por frame, scroll o pointer.
3. `GPU_STRICT_POLICIES` está conectado al `dpr` del `<Canvas>`, a la ventana `close()` de `ImageSequenceCanvas` y a `maxParticles`.
4. Con `/public` vacío, el sitio carga sin errores fatales (fallbacks visibles).
5. Playwright o DevTools: scroll de arriba a abajo 10 veces; la memoria JS y GPU vuelve a su nivel (sin fugas).
6. Lighthouse móvil: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; accesibilidad ≥ 95.

