// Sección 5 · Conversión (DEV-25). Canal definitivo pendiente de DIR-01: hoy lleva al Instagram de la marca.
import Wordmark from "@/components/dom/Wordmark";
import CtaLink from "@/components/ui/CtaLink";
import { CONTACT_SECTION_ID } from "@/config/site";
import { PRODUCTO } from "@/content/producto";

export default function ContactSection() {
  const { cta, instagram } = PRODUCTO;
  return (
    <section
      id={CONTACT_SECTION_ID}
      className="relative stack-section flex min-h-dvh flex-col items-center justify-center bg-surface-deep/90 px-6 text-center backdrop-blur-sm"
    >
      <Wordmark size="lg" className="mb-12" />
      <h2 className="font-display text-4xl tracking-tight md:text-6xl">{cta.titulo}</h2>
      <p className="mt-4 max-w-md text-muted">{cta.texto}</p>
      <CtaLink href={cta.href} size="lg" external className="mt-10">
        {cta.boton}
      </CtaLink>
      <p className="mt-6 text-sm text-muted">{instagram.usuario}</p>
    </section>
  );
}
