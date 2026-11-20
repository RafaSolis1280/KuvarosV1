// Página de Kuvaro's Smash Burguers — experiencia 100 % video hiperrealista (DEV-37: sin modelos 3D).
// Orden narrativo:
//   1. Hero (SSR, el <h1> es el LCP)                                  → DEV-18 lo convierte en tipografía cinética
//   2. Video 1: la hamburguesa se separa capa por capa                 → DEV-09 + callouts de ingredientes (DEV-19)
//   3. Video 2: hamburguesa y papas entran a la bolsa + ficha          → DEV-37
//   4. Primer bocado: fotos reales de la marca                         → DEV-19 (ART-12)
//   5. Conversión                                                      → DEV-25 (canal definitivo: DIR-01)
// Los dos videos salen del mismo master (Marca/Video.mp4) y se reproducen como secuencias de frames
// controladas por el scroll (avanzan y retroceden). Todo el texto sale de src/content/producto.ts.
import Image from "next/image";
import Link from "next/link";
import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import IngredientCallouts from "@/components/dom/IngredientCallouts";
import PackagingSpecs from "@/components/dom/PackagingSpecs";
import Wordmark from "@/components/dom/Wordmark";
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import { PRODUCTO } from "@/content/producto";

const { heroExplode, packagingReveal } = ASSET_MANIFEST.sequences;

/** Funde los bordes del video (fondo negro puro con viñeta) con el Negro Profundo de la página */
function SequenceEdges() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-surface to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface to-transparent" />
    </>
  );
}

export default function HomePage() {
  const { packaging, cta, experiencia, instagram } = PRODUCTO;

  return (
    <>
      {/* 1 · HERO */}
      <section className="relative flex h-dvh w-full flex-col justify-between px-6 py-10 md:px-16 md:py-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="pointer-events-auto rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <Wordmark size="sm" />
          </Link>
          <a
            href={cta.hrefHeader}
            className="pointer-events-auto rounded-full bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-on-accent transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {cta.botonHeader}
          </a>
        </header>

        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{PRODUCTO.nombre}</p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">
            {PRODUCTO.titular.linea1} <span className="text-accent">{PRODUCTO.titular.destacado}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted md:text-lg">{PRODUCTO.bajada}</p>
        </div>

        <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted" aria-hidden="true">
          <span className="inline-block h-8 w-px bg-accent" />
          {PRODUCTO.indicacionScroll}
        </p>
      </section>

      {/* 2 · VIDEO 1: HAMBURGUESA + INGREDIENTES */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          id="ingredientes"
          sequenceId="hamburguesa"
          sequenceFolder={heroExplode.basePath}
          totalFrames={heroExplode.totalFrames}
          scrollDistance={3200}
          ariaLabel={PRODUCTO.secuenciaAria}
        >
          <SequenceEdges />
          <IngredientCallouts sequenceId="hamburguesa" ingredientes={PRODUCTO.ingredientes} />
        </ImageSequenceCanvas>
      </div>

      {/* 3 · VIDEO 2: PACKAGING + FICHA */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          id="packaging"
          sequenceId="packaging"
          sequenceFolder={packagingReveal.basePath}
          totalFrames={packagingReveal.totalFrames}
          scrollDistance={3400}
          ariaLabel={packaging.secuenciaAria}
        >
          <SequenceEdges />
          <PackagingSpecs
            sequenceId="packaging"
            eyebrow={packaging.eyebrow}
            titulo={packaging.titulo}
            descripcion={packaging.descripcion}
            especificaciones={packaging.especificaciones}
            nota={packaging.nota}
            lado="derecha"
          />
        </ImageSequenceCanvas>
      </div>

      {/* 4 · PRIMER BOCADO (fotos reales) */}
      <section className="relative z-[15] bg-surface px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{experiencia.eyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-[0.95] md:text-6xl">{experiencia.titulo}</h2>
            <p className="mt-6 max-w-md text-base text-muted md:text-lg">{experiencia.texto}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {experiencia.fotos.map((foto, i) => (
              <Image
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                width={foto.width}
                height={foto.height}
                sizes="(min-width: 768px) 30vw, 45vw"
                className={`h-auto w-full rounded-3xl border border-ink/10 object-cover ${i === 1 ? "md:mt-16" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5 · CONVERSIÓN */}
      <section
        id="contacto"
        className="relative z-[15] flex min-h-dvh flex-col items-center justify-center bg-surface-deep/90 px-6 text-center backdrop-blur-sm"
      >
        <Wordmark size="lg" className="mb-12" />
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">{cta.titulo}</h2>
        <p className="mt-4 max-w-md text-muted">{cta.texto}</p>
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-10 rounded-full bg-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-on-accent transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {cta.boton}
        </a>
        <p className="mt-6 text-sm text-muted">{instagram.usuario}</p>
      </section>
    </>
  );
}
