// DEV-25 · Pie de página: marca, cómo trabaja el negocio, canal de contacto y (cuando existan) textos legales.
// Va después de <main> en layout.tsx. Textos en src/content/sitio.ts.
import Wordmark from "@/components/dom/Wordmark";
import Eyebrow from "@/components/ui/Eyebrow";
import { PRODUCTO } from "@/content/producto";
import { SITIO } from "@/content/sitio";

const LINK =
  "rounded underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default function SiteFooter() {
  const { footer } = SITIO;
  const { instagram } = PRODUCTO;
  return (
    <footer className="relative stack-section border-t border-ink/10 bg-surface-deep px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Wordmark size="sm" />
          <p className="mt-4 max-w-xs text-sm text-muted">{footer.descripcion}</p>
        </div>

        <address className="not-italic">
          <Eyebrow>{footer.contactoTitulo}</Eyebrow>
          <p className="mt-3 text-sm">
            {footer.instagramEtiqueta}:{" "}
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              {instagram.usuario}
            </a>
          </p>
        </address>

        {footer.legales.length > 0 ? (
          <nav aria-label="Legal">
            <ul className="space-y-2 text-sm">
              {footer.legales.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={LINK}>
                    {link.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted">© {footer.derechos}</p>
    </footer>
  );
}
