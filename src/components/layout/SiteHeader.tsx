// DEV-17 · Cabecera fija del sitio: marca (vuelve al inicio) + CTA de pedido, visibles durante todo el
// scroll y por encima de las secuencias fijadas (capa `stack-nav`). Desde cualquier punto: CTA → sección
// de conversión → canal de pedido (2 clics).
// El logo va sin «Smash Burguers»: en 11 px y color muted no llega a 4.5:1 sobre el video.
import StickyHeader from "@/components/layout/StickyHeader";
import Wordmark from "@/components/dom/Wordmark";
import CtaLink from "@/components/ui/CtaLink";
import { PRODUCTO } from "@/content/producto";
import { SITIO } from "@/content/sitio";
import { HERO_SECTION_ID } from "@/config/site";

export default function SiteHeader() {
  const { cta } = PRODUCTO;
  const { nav } = SITIO;
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
        <CtaLink href={cta.hrefHeader}>{cta.botonHeader}</CtaLink>
      </nav>
    </StickyHeader>
  );
}
