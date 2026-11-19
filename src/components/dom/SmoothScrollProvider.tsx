"use client";

// DEV-06 · Ref: Manual v2 Parte II §6 (Prompt P2). Un solo reloj: gsap.ticker maneja Lenis.
// Hard Constraints: cero setState de React en scroll/pointer; sin Lenis con prefers-reduced-motion.

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
        if (process.env.NODE_ENV !== "production") {
          console.info(`[GPU] detect-gpu tier=${gpu.tier} mobile=${Boolean(gpu.isMobile)} gpu=${gpu.gpu ?? "?"}`);
        }
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
      .catch((err) => {
        // si falla la detección, Tier 2 seguro
        if (process.env.NODE_ENV !== "production") console.warn("[GPU] detect-gpu falló → Tier 2", err);
        store.setGPUTier(2);
      });

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
