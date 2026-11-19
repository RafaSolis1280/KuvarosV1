import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

const hero = ASSET_MANIFEST.sequences.heroExplode;

// Página base (DEV-04). Las secciones reales llegan con DEV-09 (secuencia), DEV-18 (Hero UI)
// y DEV-19+ (secciones narrativas). El <h1> se renderiza en SSR: es el elemento LCP.
export default function HomePage() {
  return (
    <>
      <section className="relative flex h-dvh w-full flex-col justify-between px-6 py-12 md:px-16">
        <header className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Marca</span>
          <a
            href="#contacto"
            className="pointer-events-auto rounded-full border border-white/15 bg-black/50 px-5 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-md transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Contactar
          </a>
        </header>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl">
            Titular <span className="text-accent">de impacto</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted md:text-base">
            Propuesta de valor clara en una o dos frases.
          </p>
        </div>
      </section>

      {/* DEV-09 · Storytelling por secuencia (hamburguesa separándose en capas) */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          sequenceFolder={hero.basePath}
          totalFrames={hero.totalFrames}
          scrollDistance={2800}
          ariaLabel="Animación de la hamburguesa separándose en sus ingredientes"
        />
      </div>

      <section
        id="contacto"
        className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">
          Llamado a la acción
        </h2>
        <p className="mt-4 max-w-md text-muted">CTA real pendiente de DIR-01 (acción de conversión).</p>
      </section>
    </>
  );
}
