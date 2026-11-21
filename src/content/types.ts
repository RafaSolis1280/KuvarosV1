// DEV-38 · Forma del contenido del sitio. Los datos viven en src/content/producto.ts (CLAUDE.md).

export interface Ingrediente {
  id: string;
  nombre: string;
  descripcion: string;
  /** Dato corto destacado (peso, origen, maduración…) */
  dato: string;
  /**
   * Tramo del scroll de la secuencia (0-1) en el que se muestra el callout.
   * Video actual (54 frames): armada 0-0.22 · se separa 0.22-0.4 · capas quietas 0.4-0.85 · se vuelve a juntar 0.85-1.
   */
  rango: readonly [number, number];
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

export interface Enlace {
  texto: string;
  href: string;
  /** Abre en otra pestaña (enlaces a otros sitios) */
  externo?: boolean;
}
