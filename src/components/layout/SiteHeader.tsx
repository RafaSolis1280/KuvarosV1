// DEV-17 / DEV-38 · Cabecera del sitio: marca (vuelve al inicio) + CTA de pedido.
// Hoy vive dentro del Hero; DEV-17 la hará persistente durante todo el scroll.
import Link from "next/link";
import Wordmark from "@/components/dom/Wordmark";
import CtaLink from "@/components/ui/CtaLink";
import { PRODUCTO } from "@/content/producto";

export default function SiteHeader() {
  const { cta } = PRODUCTO;
  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="pointer-events-auto rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <Wordmark size="sm" />
      </Link>
      <CtaLink href={cta.hrefHeader}>{cta.botonHeader}</CtaLink>
    </header>
  );
}
