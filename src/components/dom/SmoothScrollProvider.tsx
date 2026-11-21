"use client";

// DEV-06 · Ref: Manual v2 Parte II §6 (Prompt P2). Un solo reloj: gsap.ticker maneja Lenis.
// Hard Constraints: cero setState de React en scroll/pointer; sin Lenis con prefers-reduced-motion.
// DEV-38: cada responsabilidad es una función que devuelve su limpieza; parámetros en config/.
import { useEffect } from "react";
import Lenis from "lenis";
import { getGPUTier } from "detect-gpu";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { useExperienceStore } from "@/store/useExperienceStore";
import { ASSET_MANIFEST, DEFAULT_TIER, tierFromGPU } from "@/config/gpu-policy";
import { SMOOTH_SCROLL } from "@/config/motion";

type Cleanup = () => void;
const isDev = process.env.NODE_ENV !== "production";

/** Clasifica la GPU con los benchmarks auto-hospedados y fija la política (tier) del sitio */
function detectGPUTier(): void {
  const store = useExperienceStore.getState();
  getGPUTier({ benchmarksURL: ASSET_MANIFEST.benchmarksURL })
    .then((gpu) => {
      if (isDev) console.info(`[GPU] detect-gpu tier=${gpu.tier} mobile=${Boolean(gpu.isMobile)} gpu=${gpu.gpu ?? "?"}`);
      const { tier, webglAvailable } = tierFromGPU(gpu);
      if (!webglAvailable) store.setWebGLAvailable(false); // sin WebGL → fallback estático
      store.setGPUTier(tier);
    })
    .catch((err) => {
      if (isDev) console.warn(`[GPU] detect-gpu falló → Tier ${DEFAULT_TIER}`, err);
      store.setGPUTier(DEFAULT_TIER);
    });
}

/** Lenis movido por gsap.ticker; publica scroll y velocidad en el store transiente */
function startSmoothScroll(): Cleanup {
  const lenis = new Lenis({ autoRaf: false, ...SMOOTH_SCROLL });
  lenis.on("scroll", (e: Lenis) => {
    ScrollTrigger.update();
    useExperienceStore.setState({ scrollY: e.scroll, scrollVelocity: e.velocity, scrollProgress: e.progress });
  });
  const update = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(update);
    lenis.destroy();
  };
}

/** Con reduced motion: scroll nativo, pero el store se sigue alimentando (shader y secuencias) */
function trackNativeScroll(): Cleanup {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    useExperienceStore.setState({
      scrollY: window.scrollY,
      scrollVelocity: 0,
      scrollProgress: max > 0 ? window.scrollY / max : 0,
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/** Puntero normalizado [-1, 1] mutando el objeto del store (sin re-renders ni basura) */
function trackPointer(): Cleanup {
  const pointer = useExperienceStore.getState().pointerNDC;
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  return () => window.removeEventListener("pointermove", onPointerMove);
}

/** Pausa la GPU con la pestaña oculta */
function pauseWhenHidden(): Cleanup {
  const onVisibilityChange = () => useExperienceStore.getState().setCanvasPaused(document.hidden);
  document.addEventListener("visibilitychange", onVisibilityChange);
  return () => document.removeEventListener("visibilitychange", onVisibilityChange);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Accesibilidad: eje independiente del rendimiento
    const reducedMotion = prefersReducedMotion();
    useExperienceStore.getState().setReducedMotion(reducedMotion);

    detectGPUTier();
    const cleanups: Cleanup[] = [
      reducedMotion ? trackNativeScroll() : startSmoothScroll(),
      trackPointer(),
      pauseWhenHidden(),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <>{children}</>;
}
