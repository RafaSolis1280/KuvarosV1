// Sección 1 · Hero (SSR). El <h1> es el elemento LCP: se renderiza en el servidor, nunca en un canvas.
// DEV-18 lo convertirá en tipografía cinética animando este mismo texto.
import Eyebrow from "@/components/ui/Eyebrow";
import { PRODUCTO } from "@/content/producto";
import { HERO_SECTION_ID } from "@/config/site";

export default function HeroSection() {
  const { nombre, titular, bajada, indicacionScroll } = PRODUCTO;
  // DEV-17: la cabecera es fija (layout.tsx); pt-nav le deja su sitio y el titular queda centrado
  return (
    <section id={HERO_SECTION_ID} className="relative flex h-dvh w-full flex-col px-6 pb-10 pt-nav md:px-16 md:pb-12">
      <div className="my-auto max-w-4xl">
        <Eyebrow className="mb-5">{nombre}</Eyebrow>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">
          {titular.linea1} <span className="text-accent">{titular.destacado}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted md:text-lg">{bajada}</p>
      </div>

      <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted" aria-hidden="true">
        <span className="inline-block h-8 w-px bg-accent" />
        {indicacionScroll}
      </p>

      {/* DEV-40: funde el fondo del hero con el de la historia en video (sin línea de corte entre ambos) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-surface"
      />
    </section>
  );
}
