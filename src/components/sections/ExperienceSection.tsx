// Sección 4 · «Primer bocado»: fotos reales de la marca (DEV-19 / ART-12).
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import { cx } from "@/lib/cx";
import { PRODUCTO } from "@/content/producto";

/** Ancho que ocupa cada foto en el layout (2 columnas): guía a next/image para elegir el tamaño */
const PHOTO_SIZES = "(min-width: 768px) 30vw, 45vw";

export default function ExperienceSection() {
  const { eyebrow, titulo, texto, fotos } = PRODUCTO.experiencia;
  return (
    <section className="relative stack-section bg-surface px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-4xl leading-[0.95] md:text-6xl">{titulo}</h2>
          <p className="mt-6 max-w-md text-base text-muted md:text-lg">{texto}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {fotos.map((foto, i) => (
            <Image
              key={foto.src}
              src={foto.src}
              alt={foto.alt}
              width={foto.width}
              height={foto.height}
              sizes={PHOTO_SIZES}
              // Columnas desfasadas en desktop: la segunda foto de cada fila baja un poco
              className={cx("h-auto w-full rounded-3xl border border-ink/10 object-cover", i % 2 === 1 && "md:mt-16")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
