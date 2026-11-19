"use client";

// DEV-09 · Ref: Manual v2 Parte II §7 (Prompt P3). Motor 2D con ventana deslizante de ImageBitmap.
// - Solo [f-R, f+R] decodificados (R = gpuPolicy.sequenceWindowRadius); el resto se cierra con close().
// - Fallback procedural SOLO si falta el frame 1 (Hard Constraint 4).
// - Flush de caché al cambiar de tier/variante.
// - El progreso se publica en el store transiente (`sequenceProgress[sequenceId]`) para que los
//   overlays (ingredientes, specs del packaging) se sincronicen sin setState de React (Hard Constraint 1).

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceStore } from "@/store/useExperienceStore";
import type { SequenceVariant } from "@/config/gpu-policy";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  /** Id de la secuencia: clave de su progreso en el store (`sequenceProgress[sequenceId]`) */
  sequenceId: string;
  /** p. ej. "/sequences/hero_explode" */
  sequenceFolder: string;
  /** Conteo por variante. Pasar una referencia estable (constante del manifiesto). */
  totalFrames: Readonly<Record<SequenceVariant, number>>;
  scrollDistance?: number;
  accentColor?: string;
  /** Descripción accesible de la animación */
  ariaLabel: string;
  /** Capa DOM que se pinnea junto con el canvas (callouts, títulos…) */
  children?: ReactNode;
  id?: string;
}

export default function ImageSequenceCanvas({
  sequenceId,
  sequenceFolder,
  totalFrames,
  scrollDistance = 2600,
  accentColor = "#FFD645",
  ariaLabel,
  children,
  id,
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
    let generation = 0; // invalida cargas en vuelo al cambiar de variante o desmontar
    let fallback = false;
    let probed = false; // no se piden frames hasta saber si existe el frame 1 (evita una ráfaga de 404)
    let drawn = -1;
    const playhead = { progress: 0 };

    const frameUrl = (i: number) =>
      `${sequenceFolder}/${variant}/frame_${String(i + 1).padStart(4, "0")}.webp`;
    const currentIndex = () => Math.round(playhead.progress * (count - 1));

    const drawFallback = (i: number) => {
      const { width: w, height: h } = canvas;
      const p = i / Math.max(1, count - 1);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);
      // Capas apiladas que se separan con el progreso (placeholder de la hamburguesa desarmándose)
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
      ctx.fillText(`[FALLBACK] ${sequenceId.toUpperCase()} · FRAME ${i + 1}/${count}`, w / 2, h * 0.88);
    };

    const drawCover = (bmp: ImageBitmap) => {
      const { width: cw, height: ch } = canvas;
      const s = Math.max(cw / bmp.width, ch / bmp.height);
      ctx.drawImage(bmp, (cw - bmp.width * s) / 2, (ch - bmp.height * s) / 2, bmp.width * s, bmp.height * s);
    };

    /** Bitmap decodificado más cercano al índice pedido (evita canvas en blanco durante el decode) */
    const nearestLoaded = (i: number): number => {
      for (let d = 0; d < count; d++) {
        if (bitmaps[i - d]) return i - d;
        if (bitmaps[i + d]) return i + d;
      }
      return -1;
    };

    const syncWindow = (center: number) => {
      if (fallback || !probed) return;
      const R = getPolicy().sequenceWindowRadius;
      const min = Math.max(0, center - R);
      const max = Math.min(count - 1, center + R);

      for (let i = 0; i < count; i++) {
        if ((i < min || i > max) && bitmaps[i]) {
          bitmaps[i]!.close();
          bitmaps[i] = null;
        }
      }

      for (let i = min; i <= max; i++) {
        if (bitmaps[i] || loading[i]) continue;
        loading[i] = true;
        const gen = generation;
        fetch(frameUrl(i))
          .then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            return r.blob();
          })
          .then((b) => createImageBitmap(b))
          .then((bmp) => {
            const c = currentIndex();
            if (gen !== generation || Math.abs(i - c) > getPolicy().sequenceWindowRadius) {
              bmp.close();
              return;
            }
            bitmaps[i] = bmp;
            if (Math.abs(i - c) <= 1) {
              drawn = -1;
              render();
            }
          })
          .catch(() => {
            /* frame aislado faltante: se usa el más cercano */
          })
          .finally(() => {
            if (gen === generation) loading[i] = false;
          });
      }
    };

    const render = () => {
      // Escritura transiente (sin setState de React): solo cuando cambia el progreso
      const prog = useExperienceStore.getState().sequenceProgress;
      if (prog[sequenceId] !== playhead.progress) {
        useExperienceStore.setState({ sequenceProgress: { ...prog, [sequenceId]: playhead.progress } });
      }
      const i = currentIndex();
      syncWindow(i);
      if (fallback) {
        drawFallback(i);
        drawn = i;
        return;
      }
      if (i === drawn) return;
      const n = bitmaps[i] ? i : nearestLoaded(i);
      if (n >= 0) {
        drawCover(bitmaps[n]!);
        if (n === i) drawn = i;
      }
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
    let alive = true;
    fetch(frameUrl(0), { method: "HEAD" })
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
    const unsubscribe = useExperienceStore.subscribe((s, prev) => {
      if (s.gpuPolicy !== prev.gpuPolicy) {
        resetCache();
        resize();
      }
    });

    const tween = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 0.35,
        pin: true,
      },
    });

    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
      generation++;
      bitmaps.forEach((b) => b?.close());
      bitmaps = [];
    };
  }, [sequenceId, sequenceFolder, totalFrames, scrollDistance, accentColor]);

  return (
    <section ref={containerRef} id={id} className="relative h-screen w-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={ariaLabel} />
      {children ? <div className="pointer-events-none absolute inset-0">{children}</div> : null}
    </section>
  );
}
