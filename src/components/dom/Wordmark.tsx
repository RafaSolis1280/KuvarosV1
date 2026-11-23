// DEV-19 · Wordmark tipográfico de Kuvaro's (provisional hasta recibir el logo vectorial, ART-04/DEV-08).
// Reproduce el logotipo del empaque: "Kuvaro's" en la display con la "a" en Amarillo Mostaza
// y "Smash Burguers" debajo en League Spartan. Es texto real (accesible e indexable), no imagen.
import { PRODUCTO } from "@/content/producto";

interface Props {
  /** "sm" para la cabecera, "lg" para el hero */
  size?: "sm" | "lg";
  /** Si se muestra "Smash Burguers" debajo */
  conBajada?: boolean;
  className?: string;
}

export default function Wordmark({ size = "sm", conBajada = true, className = "" }: Props) {
  const { wordmark, bajadaMarca, marca } = PRODUCTO;
  const big = size === "lg";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label={`${marca} ${bajadaMarca}`} role="img">
      <span aria-hidden="true" className={`font-display ${big ? "text-6xl md:text-8xl" : "text-2xl"}`}>
        {wordmark.antes}
        <span className="text-accent">{wordmark.acento}</span>
        {wordmark.despues}
      </span>
      {conBajada ? (
        <span
          aria-hidden="true"
          className={`self-end font-sans font-medium tracking-tight text-muted ${big ? "mt-1 text-xl md:text-3xl" : "text-[11px]"}`}
        >
          {bajadaMarca}
        </span>
      ) : null}
    </span>
  );
}
