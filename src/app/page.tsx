// Página de la hamburguesa — experiencia 100 % video hiperrealista (DEV-37: sin modelos 3D).
// Orden narrativo:
//   1. Hero (SSR, el <h1> es el LCP)                         → DEV-18 lo convierte en tipografía cinética
//   2. Video 1: la hamburguesa se separa capa por capa        → DEV-09 + callouts de ingredientes (DEV-19)
//   3. Video 2: aparece el packaging + ficha técnica          → DEV-37
//   4. Conversión                                             → DEV-25 (formulario / WhatsApp)
// Los videos se reproducen como secuencias de frames controladas por el scroll (avanzan y retroceden).
// Todo el texto sale de src/content/producto.ts (provisional hasta recibir el branding).
import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import IngredientCallouts from "@/components/dom/IngredientCallouts";
import PackagingSpecs from "@/components/dom/PackagingSpecs";
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import { PRODUCTO } from "@/content/producto";

const { heroExplode, packagingReveal } = ASSET_MANIFEST.sequences;

export default function HomePage() {
  const { packaging, cta } = PRODUCTO;

  return (
    <>
      {/* 1 · HERO */}
      <section className="relative flex h-dvh w-full flex-col justify-between px-6 py-12 md:px-16">
        <header className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{PRODUCTO.marca}</span>
          <a
            href={cta.href}
            className="pointer-events-auto rounded-full border border-white/15 bg-black/50 px-5 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-md transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {cta.boton}
          </a>
        </header>
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">{PRODUCTO.nombre}</p>
          <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tighter md:text-8xl">
            {PRODUCTO.titular.linea1} <span className="text-accent">{PRODUCTO.titular.destacado}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted md:text-base">{PRODUCTO.bajada}</p>
        </div>
      </section>

      {/* 2 · VIDEO 1: HAMBURGUESA + INGREDIENTES */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          id="ingredientes"
          sequenceId="hamburguesa"
          sequenceFolder={heroExplode.basePath}
          totalFrames={heroExplode.totalFrames}
          scrollDistance={3600}
          ariaLabel={PRODUCTO.secuenciaAria}
        >
          <IngredientCallouts sequenceId="hamburguesa" ingredientes={PRODUCTO.ingredientes} />
        </ImageSequenceCanvas>
      </div>

      {/* 3 · VIDEO 2: PACKAGING + FICHA TÉCNICA */}
      <div className="relative z-[15]">
        <ImageSequenceCanvas
          id="packaging"
          sequenceId="packaging"
          sequenceFolder={packagingReveal.basePath}
          totalFrames={packagingReveal.totalFrames}
          scrollDistance={2800}
          ariaLabel={packaging.secuenciaAria}
        >
          <PackagingSpecs
            sequenceId="packaging"
            eyebrow={packaging.eyebrow}
            titulo={packaging.titulo}
            descripcion={packaging.descripcion}
            especificaciones={packaging.especificaciones}
            nota={packaging.nota}
          />
        </ImageSequenceCanvas>
      </div>

      {/* 4 · CONVERSIÓN */}
      <section
        id="contacto"
        className="relative z-[15] flex min-h-dvh flex-col items-center justify-center bg-base/90 px-6 text-center backdrop-blur-sm"
      >
        <h2 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">{cta.titulo}</h2>
        <p className="mt-4 max-w-md text-muted">{cta.texto}</p>
      </section>
    </>
  );
}
