"use client";

// DEV-09 · Ref: Manual v2 Parte II §7 (Prompt P3). Secuencia de frames controlada por el scroll.
// - Solo [f-R, f+R] decodificados (R = gpuPolicy.sequenceWindowRadius): FrameCache.
// - Fallback procedural SOLO si falta el frame 1 (Hard Constraint 4).
// - Flush de caché al cambiar de tier/variante.
// - El progreso se publica en el store transiente (`sequenceProgress[id]`) para que los overlays
//   se sincronicen sin setState de React (Hard Constraint 1).
// DEV-38: la caché, el dibujo y las rutas viven en src/lib/sequence; la configuración en src/config.
// DEV-39 (fluidez): mezcla de frames según la posición exacta del scroll, escalado de alta calidad y
// entrada del video al aparecer en pantalla.
// DEV-40 (historia continua): varios clips en una sola sección y ritmo por beats (lib/sequence/timeline).
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useExperienceStore } from "@/store/useExperienceStore";
import { waitForStore } from "@/store/waitFor";
import { PRELOAD } from "@/config/preload";
import { FrameCache, loadImageBitmap } from "@/lib/sequence/FrameCache";
import { configureContext, drawFallback, drawFrame } from "@/lib/sequence/draw";
import { splitFrame } from "@/lib/sequence/frames";
import { createTimeline, storyFrameUrl } from "@/lib/sequence/timeline";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { hexToRgba } from "@/lib/color";
import { BRAND_COLORS } from "@/config/brand";
import { SEQUENCE_ENTRANCE, SEQUENCE_PLAYBACK } from "@/config/motion";
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

  // El efecto depende del CONTENIDO de la configuración (clips y beats), no de la identidad del objeto
  const configKey = JSON.stringify({ clips: sequence.clips, beats: sequence.beats });
  const sequenceId = sequence.id;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { clips, beats } = JSON.parse(configKey) as Pick<SequenceConfig, "clips" | "beats">;
    const store = useExperienceStore;
    const getPolicy = () => store.getState().gpuPolicy;

    let variant = getPolicy().sequenceVariant;
    let timeline = createTimeline(beats, clips, variant);
    let fallback = false;
    let probed = false; // no se piden frames hasta saber si existe el frame 1 (evita una ráfaga de 404)
    let drawn = -1;
    const playhead = { progress: 0 };

    const urlFor = (i: number) => storyFrameUrl(clips, variant, i);
    // Posición exacta en el video según el ritmo de los beats (DEV-40)
    const position = () => timeline.frameAt(playhead.progress);
    const currentIndex = () => Math.round(position());

    const cache: FrameCache = new FrameCache({
      count: timeline.count,
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

      // Posición continua: con mezcla, entre el frame `from` y el `to` se funden los dos (DEV-39)
      const pos = splitFrame(position(), cache.count);
      const blend = SEQUENCE_PLAYBACK.frameBlending && pos.mix > 0;
      const key = blend ? Math.round(pos.exact * SEQUENCE_PLAYBACK.blendSteps) : i * SEQUENCE_PLAYBACK.blendSteps;
      if (key === drawn) return; // ya está en pantalla

      const baseIndex = blend ? pos.from : i;
      // Mientras se decodifica el frame pedido, se muestra el más cercano (nunca un canvas en blanco)
      const n = cache.get(baseIndex) ? baseIndex : cache.nearestLoaded(baseIndex);
      const base = n >= 0 ? cache.get(n) : null;
      if (!base) return;
      drawFrame(ctx, base);
      let complete = n === baseIndex;
      if (blend) {
        const next = cache.get(pos.to);
        if (next) drawFrame(ctx, next, pos.mix);
        else complete = false; // se completa cuando llegue (onReady)
      }
      if (complete) drawn = key;
    };

    // Fallback SOLO si el primer frame no existe.
    // DEV-13: antes se espera a saber el tier (variante desktop/mobile, máx. PRELOAD.gpuWaitMs): así no se
    // descargan frames de una variante que se descartaría al resolver detect-gpu.
    let alive = true;
    waitForStore(store, (s) => s.gpuReady, PRELOAD.gpuWaitMs)
      .then(() => fetch(urlFor(0), { method: "HEAD" }))
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
      configureContext(ctx); // cambiar el tamaño reinicia el estado del contexto
      drawn = -1;
      render();
    };
    resize();
    window.addEventListener("resize", resize);

    // Al cambiar de tier/variante se vacía la caché y se recarga la ventana
    const unsubscribe = store.subscribe((s, prev) => {
      if (s.gpuPolicy !== prev.gpuPolicy) {
        variant = s.gpuPolicy.sequenceVariant;
        timeline = createTimeline(beats, clips, variant);
        cache.reset(timeline.count, urlFor);
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
        // El recorrido se mide en alturas de viewport (DEV-40): igual de largo en cualquier pantalla
        end: () => `+=${Math.round(timeline.totalVh * window.innerHeight)}`,
        invalidateOnRefresh: true,
        scrub: SEQUENCE_PLAYBACK.scrub,
        pin: true,
      },
    });

    // Entrada del video al aparecer en pantalla (DEV-39): opacidad y escala del canvas, que la GPU
    // compone sin repintar. Con reduced motion solo el fundido (no hay movimiento).
    const reduced = prefersReducedMotion();
    const entrance = gsap.fromTo(
      canvas,
      { opacity: SEQUENCE_ENTRANCE.fromOpacity, scale: reduced ? 1 : SEQUENCE_ENTRANCE.fromScale },
      {
        opacity: 1,
        scale: 1,
        ease: SEQUENCE_ENTRANCE.ease,
        scrollTrigger: {
          trigger: container,
          start: SEQUENCE_ENTRANCE.start,
          end: SEQUENCE_ENTRANCE.end,
          scrub: true,
        },
      }
    );

    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener("resize", resize);
      entrance.scrollTrigger?.kill();
      entrance.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
      cache.dispose();
    };
  }, [sequenceId, configKey, accentColor]);

  return (
    <section ref={containerRef} id={sequence.anchorId} className="relative h-screen w-full overflow-hidden bg-surface">
      <canvas
        ref={canvasRef}
        className="block h-full w-full will-change-[opacity,transform]"
        role="img"
        aria-label={ariaLabel}
      />
      {children ? <div className="pointer-events-none absolute inset-0">{children}</div> : null}
    </section>
  );
}
