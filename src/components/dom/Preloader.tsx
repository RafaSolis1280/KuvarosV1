"use client";

// DEV-13 · Preloader por prioridades (Manual v2, Fase 8 Paso 22). «Marca el tono, pero no es una barrera»:
// el hero, el <h1> (SSR) y el CTA se usan desde el primer momento; el panel solo informa y se aparta.
//   1. Carga crítica: fuentes + primeros PRELOAD.criticalFrames frames de la historia en la variante del
//      tier (espera a detect-gpu) + primer frame del shader de fondo. Marca `kuvaros:critical-done`.
//      En red lenta (3G o < 2 Mbps), solo 8 frames y sin esperar al shader (decorativo).
//   2. Resto en segundo plano: en un momento libre del hilo principal, con prioridad baja y sin
//      decodificar (caché HTTP). No corre con «ahorro de datos» ni en redes 2G.
//   3. Panel: progreso, «Saltar» y, si hay audio, «Entrar con sonido» (activa el sonido de DEV-16 dentro
//      del gesto). Se va solo al terminar (sin audio), al desplazarse o al pulsar un botón / Escape.
// Sin setState de React por scroll ni por progreso (Hard Constraint 1): el panel cambia con data-atributos
// (waiting → loading → ready → hidden; ver Preloader.css).
// Llega con dynamic import (ssr: false): no pesa en el JS inicial (budget de DEV-01).
import { useEffect, useRef } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import { ctaClassName } from "@/components/ui/CtaLink";
import { useExperienceStore } from "@/store/useExperienceStore";
import { waitForStore } from "@/store/waitFor";
import { preloadPlan } from "@/lib/preload/plan";
import { prefetchFrame, prefetchQueue } from "@/lib/sequence/prefetch";
import { PRODUCT_STORY } from "@/config/sequences";
import { PRELOAD } from "@/config/preload";
import { MAIN_CONTENT_ID } from "@/config/site";
import { SITIO } from "@/content/sitio";
import "./Preloader.css";

type NetworkInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };
const connection = () => (navigator as Navigator & { connection?: NetworkInfo }).connection;

/** Con «ahorro de datos» o red 2G no se descarga nada que el visitante no haya pedido */
function constrainedNetwork(): boolean {
  const c = connection();
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? "");
}

/** Red lenta: 3G o menos, o menos de PRELOAD.slowNetwork.maxDownlinkMbps (si el navegador lo informa) */
function slowNetwork(): boolean {
  const c = connection();
  if (!c) return false;
  return /(^|-)[23]g$/.test(c.effectiveType ?? "") || (c.downlink != null && c.downlink < PRELOAD.slowNetwork.maxDownlinkMbps);
}

/** Ejecuta `fn` cuando el hilo principal esté libre (o en 1 s como máximo) */
function whenIdle(fn: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

export default function Preloader({ soundAvailable }: { soundAvailable: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const { preloader: t } = SITIO;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const store = useExperienceStore;
    let alive = true;
    let cancelIdle: (() => void) | undefined;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    const hide = () => {
      if (panel.dataset.state === "hidden") return;
      // Si el foco estaba en el panel, pasa al contenido (no se pierde al ocultarlo)
      if (panel.contains(document.activeElement)) document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
      panel.dataset.state = "hidden";
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > PRELOAD.hideAfterScrollPx) hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Progreso → DOM (sin re-renders)
    const showProgress = (pct: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (percentRef.current) percentRef.current.textContent = `${pct} %`;
    };
    store.getState().setPreloadProgress(0);
    performance.mark("kuvaros:preload-start");
    // El panel se muestra con la fuente de la marca ya cargada: si se pintara con la de respaldo, al
    // cambiar de fuente cambiaría de alto y se movería (CLS)
    void document.fonts.ready.then(() => {
      if (alive && panel.dataset.state === "waiting") panel.dataset.state = "loading";
    });

    (async () => {
      await waitForStore(store, (s) => s.gpuReady, PRELOAD.gpuWaitMs);
      if (!alive) return;
      const variant = store.getState().gpuPolicy.sequenceVariant;
      const slow = slowNetwork();
      const { critical, stream } = preloadPlan(PRODUCT_STORY.clips, variant, slow ? PRELOAD.slowNetwork.criticalFrames : PRELOAD.criticalFrames);
      const tasks: Promise<unknown>[] = [
        document.fonts.ready,
        ...critical.map((url) => prefetchFrame(url, "high")),
        // El shader de fondo es decorativo: en red lenta no frena la carga crítica
        ...(slow ? [] : [waitForStore(store, (s) => s.canvasReady || !s.webglAvailable, PRELOAD.canvasWaitMs)]),
      ];
      let done = 0;
      const step = () => {
        if (!alive) return;
        done++;
        const pct = Math.round((done / tasks.length) * 100);
        store.getState().setPreloadProgress(pct);
        showProgress(pct);
      };
      await Promise.all(tasks.map((task) => task.then(step, step)));
      if (!alive) return;

      performance.mark("kuvaros:critical-done");
      panel.dataset.state = panel.dataset.state === "hidden" ? "hidden" : "ready";
      if (statusRef.current) statusRef.current.textContent = t.listo;
      if (!soundAvailable) holdTimer = setTimeout(hide, PRELOAD.doneHoldMs);

      if (constrainedNetwork()) return;
      cancelIdle = whenIdle(() => {
        void prefetchQueue(stream, {
          concurrency: PRELOAD.streamConcurrency,
          // Si cambia el tier (otra variante de frames), lo que queda de esta lista ya no sirve
          shouldStop: () => !alive || store.getState().gpuPolicy.sequenceVariant !== variant,
        }).then(() => alive && performance.mark("kuvaros:stream-done"));
      });
    })();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel.dataset.state !== "hidden") hide();
    };
    window.addEventListener("keydown", onKey);

    // Botones: delegación (se lee la acción del data-atributo)
    const onClick = (e: MouseEvent) => {
      const action = (e.target as Element | null)?.closest<HTMLElement>("[data-preloader-action]")?.dataset.preloaderAction;
      if (!action) return;
      // Dentro del gesto: el SoundController (DEV-16) crea el AudioContext en la misma pila de llamadas
      if (action === "sound") store.getState().setSoundOn(true);
      hide();
    };
    panel.addEventListener("click", onClick);

    return () => {
      alive = false;
      cancelIdle?.();
      clearTimeout(holdTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      panel.removeEventListener("click", onClick);
    };
  }, [soundAvailable, t.listo]);

  return (
    <div
      ref={panelRef}
      data-preloader=""
      data-state="waiting"
      role="region"
      aria-label={t.ariaLabel}
      // La visibilidad por estado va en clases (CSS principal, ya cargado): Preloader.css llega con este chunk
      // diferido y solo aporta las transiciones; si llegara tarde, el panel igual nace oculto
      className="pointer-events-auto fixed inset-x-4 bottom-4 stack-nav mx-auto max-w-md data-[state=hidden]:pointer-events-none data-[state=hidden]:invisible data-[state=hidden]:opacity-0 data-[state=waiting]:pointer-events-none data-[state=waiting]:invisible data-[state=waiting]:opacity-0 md:bottom-8"
    >
      {/* Alto fijo: estado en una línea, barra y botones en su fila. Cambiar el texto no mueve nada (CLS 0) */}
      <GlassPanel radius="lg" className="px-5 py-4">
        <div className="flex items-baseline justify-between gap-3 text-xs uppercase tracking-[0.15em]">
          <p ref={statusRef} role="status" className="whitespace-nowrap text-ink">
            {t.preparando}
          </p>
          <span ref={percentRef} aria-hidden="true" className="w-[7ch] shrink-0 whitespace-nowrap text-right tabular-nums text-muted">
            0 %
          </span>
        </div>
        <div aria-hidden="true" className="mt-2 h-px w-full overflow-hidden bg-ink/15">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-accent motion-safe:transition-transform motion-safe:duration-300" />
        </div>
        <div className="mt-3 flex items-center justify-end gap-3">
          {soundAvailable ? (
            <button type="button" data-preloader-action="sound" className={ctaClassName("sm")}>
              {t.entrarConSonido}
            </button>
          ) : null}
          <button
            type="button"
            data-preloader-action="skip"
            className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-widest text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t.saltar}
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}
