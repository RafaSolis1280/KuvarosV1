// DEV-38 · Forma del contenido del sitio. Los datos viven en src/content/producto.ts (CLAUDE.md).

export interface Ingrediente {
  id: string;
  nombre: string;
  descripcion: string;
  /** Dato corto destacado (peso, origen, maduración…) */
  dato: string;
  /** Posición del callout en desktop (% del viewport). Ajustada al encuadre del video (hamburguesa al centro). */
  ancla: { x: number; y: number };
  lado: Lado;
}

export type Lado = "izquierda" | "derecha";

export interface Especificacion {
  etiqueta: string;
  valor: string;
}

export interface Foto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Capítulo de la historia en video: abarca los beats `desde`…`hasta` de config/sequences.ts */
export interface Capitulo {
  numero: string;
  titulo: string;
  desde: string;
  hasta: string;
}

export interface Enlace {
  texto: string;
  href: string;
  /** Abre en otra pestaña (enlaces a otros sitios) */
  externo?: boolean;
}
