"use client";

// DEV-19 · Sección del packaging: aparece al terminar la secuencia de la hamburguesa.
// El modelo 3D vive en el GlobalCanvas (HeroArtifactMesh, DEV-11). Esta sección solo publica el
// revelado en el store transiente (`packagingReveal`) desde un ScrollTrigger: sin setState por scroll.
// El fondo es transparente para que se vea el canvas fijo detrás. Sin WebGL → caja CSS de respaldo.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceStore } from "@/store/useExperienceStore";
import { mapRange } from "@/lib/math";
import type { Especificacion } from "@/content/producto";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  especificaciones: readonly Especificacion[];
  nota?: string;
  posterAlt: string;
}

export default function PackagingSection({ eyebrow, titulo, descripcion, especificaciones, nota, posterAlt }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const webglAvailable = useExperienceStore((s) => s.webglAvailable); // baja frecuencia: OK con hook

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Entra entre 0 y 0.4 del recorrido; se retira en el último 20 % (antes del CTA)
        const reveal = mapRange(self.progress, 0, 0.4, 0, 1) * (1 - mapRange(self.progress, 0.8, 1, 0, 1));
        useExperienceStore.setState({ packagingReveal: reveal });
      },
      onLeave: () => useExperienceStore.setState({ packagingReveal: 0 }),
      onLeaveBack: () => useExperienceStore.setState({ packagingReveal: 0 }),
    });

    return () => {
      st.kill();
      useExperienceStore.setState({ packagingReveal: 0 });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="packaging"
      aria-labelledby="packaging-titulo"
      className="relative z-[15] min-h-[160dvh] px-6 md:px-16"
    >
      <div className="sticky top-0 grid min-h-dvh w-full items-center gap-12 py-16 md:grid-cols-2">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          <h2 id="packaging-titulo" className="mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-6xl">
            {titulo}
          </h2>
          <p className="mt-6 text-muted md:text-lg">{descripcion}</p>

          <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {especificaciones.map((spec) => (
              <div key={spec.etiqueta} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{spec.etiqueta}</dt>
                <dd className="text-right font-semibold">{spec.valor}</dd>
              </div>
            ))}
          </dl>
          {nota ? <p className="mt-4 text-xs text-muted/70">{nota}</p> : null}
        </div>

        {/* Columna del modelo 3D: en WebGL queda vacía (el canvas fijo dibuja el packaging detrás). */}
        <div className="relative aspect-square w-full max-w-md justify-self-center" aria-hidden={webglAvailable}>
          {!webglAvailable ? (
            <div
              role="img"
              aria-label={posterAlt}
              className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950"
            >
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Packaging</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
