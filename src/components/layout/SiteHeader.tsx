// DEV-17 · Cabecera fija del sitio: marca (vuelve al inicio) + CTA de pedido, visibles durante todo el
// scroll y por encima de las secuencias fijadas (capa `stack-nav`). Desde cualquier punto: CTA → sección
// de conversión → canal de pedido (2 clics).
// El logo va sin «Smash Burguers»: en 11 px y color muted no llega a 4.5:1 sobre el video.
// DEV-16: el control de sonido aparece junto al CTA solo si el audio existe en /public (se decide en el build).
import StickyHeader from "@/components/layout/StickyHeader";
import Wordmark from "@/components/dom/Wordmark";
import CtaLink from "@/components/ui/CtaLink";
import { PRODUCTO } from "@/content/producto";
import { SITIO } from "@/content/sitio";
import { LazySoundController } from "@/components/dom/lazy";
import { ambientAudio } from "@/lib/audio/availability";
import { HERO_SECTION_ID } from "@/config/site";

export default function SiteHeader() {
  const { cta } = PRODUCTO;
  const { nav } = SITIO;
  const audio = ambientAudio();
  return (
    <StickyHeader>
      <nav aria-label={nav.ariaLabel} className="flex h-full items-center justify-between">
        {/* Ancla al hero, no <Link href="/">: en la misma página Next no vuelve a subir el scroll */}
        <a
          href={`#${HERO_SECTION_ID}`}
          aria-label={nav.inicio}
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Wordmark size="sm" conBajada={false} />
        </a>
        <div className="flex items-center gap-3">
          {/* El hueco del botón viene en el HTML (el servidor sabe si hay audio): al hidratar no se mueve nada */}
          {audio.length > 0 ? (
            <span className="inline-flex h-9 w-9">
              <LazySoundController sources={audio} />
            </span>
          ) : null}
          <CtaLink href={cta.hrefHeader}>{cta.botonHeader}</CtaLink>
        </div>
      </nav>
    </StickyHeader>
  );
}
