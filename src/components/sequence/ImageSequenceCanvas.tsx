"use client";

// DEV-09 · Ref: Manual v2 Parte II §7 (Prompt P3). Secuencia de frames controlada por el scroll.
// - Solo [f-R, f+R] decodificados (R = gpuPolicy.sequenceWindowRadius): FrameCache.
// - Fallback procedural SOLO si falta el frame 1 (Hard Constraint 4).
// - Flush de caché al cambiar de tier/variante.
// - El progreso se publica en el store transiente (`sequenceProgress[id]`) para que los overlays
//   se sincronicen sin setState de React (Hard Constraint 1).
// DEV-38: la caché, el dibujo y las rutas viven en src/lib/sequence; la configuración en src/config.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useExperienceStore } from "@/store/useExperienceStore";
import { FrameCache, loadImageBitmap } from "@/lib/sequence/FrameCache";
import { drawFallback, drawFrame } from "@/lib/sequence/draw";
import { frameIndexForProgress, frameUrl } from "@/lib/sequence/frames";
import { hexToRgba } from "@/lib/color";
import { BRAND_COLORS } from "@/config/brand";
import { SEQUENCE_PLAYBACK } from "@/config/motion";
import type { SequenceConfig } from "@/config/sequences";

interface Props {
  sequence: SequenceConfig;
  /** Descripción accesible de la animación */
  ariaLabel: string;
  accentColor?: string;
  /** Capa DOM que se fija junto con el canvas (callouts, títulos…) */
  children?: ReactNode;
}

const FALLBACK_RING = hexToRgba(BRAND_COLORS.beigeClaro, 0.25);

export default function ImageSequenceCanvas({
  sequence,
  ariaLabel,
  accentColor = BRAND_COLORS.amarilloMostaza,
  children,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dependencias primitivas: el efecto no se reinicia si el objeto de configuración cambia de identidad
  const { id: sequenceId, basePath, scrollDistance = SEQUENCE_PLAYBACK.defaultScrollDistance } = sequence;
  const { desktop: framesDesktop, mobile: framesMobile } = sequence.totalFrames;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const totalFrames = { desktop: framesDesktop, mobile: framesMobile };
    const store = useExperienceStore;
    const getPolicy = () => store.getState().gpuPolicy;

    let variant = getPolicy().sequenceVariant;
    let fallback = false;
    let probed = false; // no se piden frames hasta saber si existe el frame 1 (evita una ráfaga de 404)
    let drawn = -1;
    const playhead = { progress: 0 };

    const urlFor = (i: number) => frameUrl(basePath, variant, i);
    const currentIndex = () => frameIndexForProgress(playhead.progress, cache.count);

    const cache: FrameCache = new FrameCache({
      count: totalFrames[variant],
      url: urlFor,
      radius: () => getPolicy().sequenceWindowRadius,
      center: () => currentIndex(),
      load: loadImageBitmap,
      // Si llega el frame que se está mostrando (o uno vecino), se redibuja
      onReady: (i) => {
        if (Math.abs(i - currentIndex()) <= 1) {
          drawn = -1;
          render();
        }
      },
    });

    const fallbackStyle = {
      background: BRAND_COLORS.negroProfundo,
      accent: accentColor,
      ring: FALLBACK_RING,
      label: sequenceId,
    };

    const render = () => {
      store.getState().setSequenceProgress(sequenceId, playhead.progress);
      const i = currentIndex();
      if (!fallback && probed) cache.sync(i);
      if (fallback) {
        drawFallback(ctx, i, cache.count, fallbackStyle);
        drawn = i;
        return;
      }
      if (i === drawn) return;
      // Mientras se decodifica el frame pedido, se muestra el más cercano (nunca un canvas en blanco)
      const n = cache.get(i) ? i : cache.nearestLoaded(i);
      const frame = n >= 0 ? cache.get(n) : null;
      if (frame) {
        drawFrame(ctx, frame);
        if (n === i) drawn = i;
      }
    };

    // Fallback SOLO si el primer frame no existe
    let alive = true;
    fetch(urlFor(0), { method: "HEAD" })
      .then((r) => {
        if (!r.ok) fallback = true;
      })
      .catch(() => {
        fallback = true;
      })
      .finally(() => {
        if (!alive) return;
        probed = true;
        drawn = -1;
        render();
      });

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
    const unsubscribe = store.subscribe((s, prev) => {
      if (s.gpuPolicy !== prev.gpuPolicy) {
        variant = s.gpuPolicy.sequenceVariant;
        cache.reset(totalFrames[variant], urlFor);
        drawn = -1;
        resize();
      }
    });

    const tween = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: container,
        start: SEQUENCE_PLAYBACK.start,
        end: `+=${scrollDistance}`,
        scrub: SEQUENCE_PLAYBACK.scrub,
        pin: true,
      },
    });

    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
      cache.dispose();
    };
  }, [sequenceId, basePath, framesDesktop, framesMobile, scrollDistance, accentColor]);

  return (
    <section ref={containerRef} id={sequence.anchorId} className="relative h-screen w-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={ariaLabel} />
      {children ? <div className="pointer-events-none absolute inset-0">{children}</div> : null}
    </section>
  );
}
