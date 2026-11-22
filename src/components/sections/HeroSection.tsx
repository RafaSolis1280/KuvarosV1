// Sección 1 · Hero (SSR). El <h1> es el elemento LCP: se renderiza en el servidor, nunca en un canvas.
// DEV-18: el titular entra con tipografía cinética (HeroTitle) sin dejar de estar en el HTML del servidor.
import Eyebrow from "@/components/ui/Eyebrow";
import HeroTitle from "@/components/dom/HeroTitle";
import { PRODUCTO } from "@/content/producto";
import { HERO_SECTION_ID } from "@/config/site";

export default function HeroSection() {
  const { nombre, titular, bajada, indicacionScroll } = PRODUCTO;
  // DEV-17: la cabecera es fija (layout.tsx); pt-nav le deja su sitio y el titular queda centrado
  return (
    <section
      id={HERO_SECTION_ID}
      className="relative flex h-dvh w-full flex-col overflow-x-clip px-6 pb-10 pt-nav md:px-16 md:pb-12"
    >
      <div className="relative isolate my-auto max-w-4xl">
        {/*
          DEV-29 · Velo detrás del texto: el shader de fondo puede mezclar hasta un 23 % de mostaza (vetas +
          brillo del puntero + velocidad del scroll) y ahí el texto pequeño (antetítulo mostaza, bajada muted)
          bajaba a ~3.2:1. Con el velo al 95 % el texto queda siempre ≥ 4.6:1; el shader sigue viéndose alrededor.
        */}
        <div aria-hidden="true" className="absolute -inset-16 -z-10 rounded-[4rem] bg-surface/95 blur-2xl" />
        <Eyebrow className="mb-5">{nombre}</Eyebrow>
        <HeroTitle
          linea1={titular.linea1}
          destacado={titular.destacado}
          className="font-display text-5xl leading-[0.95] tracking-tight md:text-8xl"
        />
        <p className="mt-6 max-w-xl text-base text-muted md:text-lg">{bajada}</p>
      </div>

      {/* En ink: queda sobre el shader y el degradado inferior, donde muted no llega a 4.5:1 (DEV-29) */}
      <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink" aria-hidden="true">
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
