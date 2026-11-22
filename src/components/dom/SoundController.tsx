"use client";

// DEV-16 · Sonido ambiente opt-in (Manual v2, Fase 5 Paso 16).
// - No suena nada hasta que el visitante pulsa el botón (o «Entrar con sonido» del preloader, DEV-13):
//   el AudioContext se crea dentro de ese gesto. El motor (lib/audio/AmbientSound) llega con dynamic
//   import en ese momento: no pesa en el JS inicial (budget de DEV-01).
// - Low-pass de 400 a 2 500 Hz según la velocidad del scroll, leída del store transiente en gsap.ticker y
//   amortiguada con damp() (Hard Constraints 1 y 3). El ticker solo corre mientras suena.
// - Se suspende con la pestaña oculta y se libera todo al desmontar.
// - Solo se monta si el audio existe en /public (lo decide SiteHeader en el build): sin archivos, no hay
//   botón ni peticiones. Si el archivo falla al cargar, el botón desaparece y la página sigue igual.
import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { damp } from "@/lib/math";
import { cutoffForVelocity, pickAudioSource } from "@/lib/audio/sound";
import { useExperienceStore } from "@/store/useExperienceStore";
import { SOUND } from "@/config/sound";
import { SITIO } from "@/content/sitio";
import type { AmbientSound } from "@/lib/audio/AmbientSound";

export default function SoundController({ sources }: { sources: string[] }) {
  // soundOn cambia solo con un clic: leerlo con el hook no viola la regla de no re-renderizar por frame
  const soundOn = useExperienceStore((s) => s.soundOn);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const store = useExperienceStore;
    let ctx: AudioContext | null = null;
    let engine: AmbientSound | null = null;
    let cutoff: number = SOUND.cutoffRestHz;
    let suspendTimer: number | undefined;
    let alive = true;

    const fail = () => {
      if (!alive) return;
      gsap.ticker.remove(tick);
      void ctx?.close(); // sin audio no hace falta el contexto: se libera
      ctx = null;
      store.getState().setSoundOn(false);
      setFailed(true);
    };

    const tick = (_time: number, deltaMs: number) => {
      if (!engine) return;
      const target = cutoffForVelocity(store.getState().scrollVelocity);
      cutoff = damp(cutoff, target, SOUND.cutoffLambda, Math.min(deltaMs / 1000, 0.1));
      engine.setCutoff(cutoff);
    };

    // Corre dentro del gesto: la suscripción de Zustand es síncrona con setSoundOn(true)
    const start = () => {
      window.clearTimeout(suspendTimer);
      if (!ctx) {
        const url = pickAudioSource(sources, (mime) => document.createElement("audio").canPlayType(mime));
        if (!url) return fail();
        ctx = new AudioContext();
        const context = ctx;
        import("@/lib/audio/AmbientSound")
          .then(async ({ AmbientSound: Engine }) => {
            if (!alive) return;
            const created = new Engine(context);
            await created.load(url);
            if (!alive) return created.dispose();
            engine = created;
            engine.setOn(store.getState().soundOn);
          })
          .catch(fail);
      } else {
        void ctx.resume();
        engine?.setOn(true);
      }
      gsap.ticker.add(tick);
    };

    const stop = () => {
      engine?.setOn(false);
      gsap.ticker.remove(tick);
      // Tras el fundido se suspende el contexto: no gasta CPU mientras está en silencio
      suspendTimer = window.setTimeout(() => {
        if (!store.getState().soundOn) void ctx?.suspend();
      }, SOUND.fadeSeconds * 1000 + 100);
    };

    // Sin gesto no se puede arrancar el audio: si alguien lo marcó antes de que este control existiera
    // (p. ej. «Entrar con sonido» del preloader mientras se cargaba), se deja apagado y visible como tal.
    if (store.getState().soundOn) store.getState().setSoundOn(false);

    const unsubscribe = store.subscribe((s, prev) => {
      if (s.soundOn !== prev.soundOn) (s.soundOn ? start : stop)();
    });

    const onVisibility = () => {
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else if (store.getState().soundOn) void ctx.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(tick);
      window.clearTimeout(suspendTimer);
      engine?.dispose();
      void ctx?.close();
      store.getState().setSoundOn(false);
    };
  }, [sources]);

  if (failed) return null;

  const { sonido } = SITIO;
  return (
    <button
      type="button"
      onClick={() => useExperienceStore.getState().setSoundOn(!soundOn)}
      aria-label={sonido.ariaLabel}
      aria-pressed={soundOn}
      title={soundOn ? sonido.silenciar : sonido.activar}
      data-sound-toggle=""
      /* h-9 = alto del CTA de la cabecera: al aparecer (tras hidratar) no cambia el alto del grupo (CLS 0) */
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:text-accent"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {soundOn ? (
          <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
    </button>
  );
}
