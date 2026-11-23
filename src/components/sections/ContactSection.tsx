// Sección 5 · Conversión (DEV-25). Canal principal: el Instagram de la marca (⏳ DIR-01 define el definitivo).
// Al lado, el formulario de contacto, que solo se muestra si hay un servicio de envío configurado
// (lib/contact/delivery): en producción sin servicio queda solo el CTA, sin un formulario que falle.
import Wordmark from "@/components/dom/Wordmark";
import ContactForm from "@/components/dom/ContactForm";
import CtaLink from "@/components/ui/CtaLink";
import GlassPanel from "@/components/ui/GlassPanel";
import { CONTACT_SECTION_ID } from "@/config/site";
import { PRODUCTO } from "@/content/producto";
import { SITIO } from "@/content/sitio";
import { getContactDelivery } from "@/lib/contact/delivery";
import { cx } from "@/lib/cx";

export default function ContactSection() {
  const { cta, instagram } = PRODUCTO;
  const { contacto } = SITIO;
  const withForm = getContactDelivery() !== null;
  return (
    <section
      id={CONTACT_SECTION_ID}
      className="relative stack-section flex min-h-dvh scroll-mt-nav items-center bg-surface-deep/90 px-6 py-24 backdrop-blur-sm md:px-16"
    >
      <div
        className={cx(
          "mx-auto grid w-full max-w-6xl gap-14",
          withForm ? "md:grid-cols-[1fr_1.1fr] md:items-center" : "justify-items-center"
        )}
      >
        <div className={cx("flex flex-col items-center text-center", withForm && "md:items-start md:text-left")}>
          <Wordmark size="lg" className="mb-12" />
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">{cta.titulo}</h2>
          <p className="mt-4 max-w-md text-muted">{cta.texto}</p>
          <CtaLink href={cta.href} size="lg" external className="mt-10">
            {cta.boton}
          </CtaLink>
          <p className="mt-6 text-sm text-muted">{instagram.usuario}</p>
        </div>

        {withForm ? (
          <GlassPanel radius="lg" className="p-6 md:p-10">
            <h3 className="font-display text-2xl md:text-3xl">{contacto.titulo}</h3>
            <p className="mt-2 mb-6 text-sm text-muted">{contacto.texto}</p>
            <ContactForm />
          </GlassPanel>
        ) : null}
      </div>
    </section>
  );
}
