// DEV-19 · Contenido de la landing de la hamburguesa. TODO EL COPY ES PROVISIONAL.
// Fuente única de texto: cuando lleguen el branding y las especificaciones del cliente (DIR-05)
// se reemplaza SOLO este archivo; los componentes no llevan texto propio.

export interface Ingrediente {
  id: string;
  nombre: string;
  descripcion: string;
  /** Dato corto destacado (peso, origen, maduración…) */
  dato: string;
  /**
   * Tramo del scroll de la secuencia (0-1) en el que se muestra el callout.
   * Ajustar al video real: el ingrediente debe estar separado y visible en ese tramo.
   */
  rango: readonly [number, number];
  /** Posición del callout en desktop (% del viewport). Ajustar al encuadre del video. */
  ancla: { x: number; y: number };
  lado: "izquierda" | "derecha";
}

export interface Especificacion {
  etiqueta: string;
  valor: string;
}

export const PRODUCTO = {
  marca: "MARCA",
  nombre: "Nombre de la hamburguesa",
  titular: { linea1: "Capa por capa,", destacado: "sin secretos" },
  bajada: "Propuesta de valor en una o dos frases. Copy definitivo pendiente del cliente (DIR-05).",
  secuenciaAria: "Animación de la hamburguesa separándose capa por capa en sus ingredientes",

  ingredientes: [
    { id: "pan-superior", nombre: "Pan brioche", descripcion: "Descripción del pan: masa, horneado, textura.", dato: "Horneado diario", rango: [0.1, 0.24], ancla: { x: 8, y: 22 }, lado: "izquierda" },
    { id: "salsa", nombre: "Salsa de la casa", descripcion: "Descripción de la salsa y su receta.", dato: "Receta propia", rango: [0.22, 0.36], ancla: { x: 64, y: 30 }, lado: "derecha" },
    { id: "vegetales", nombre: "Lechuga y tomate", descripcion: "Origen y frescura de los vegetales.", dato: "Productor local", rango: [0.34, 0.48], ancla: { x: 8, y: 40 }, lado: "izquierda" },
    { id: "queso", nombre: "Queso cheddar", descripcion: "Tipo de queso, maduración y fundido.", dato: "Maduración 6 meses", rango: [0.46, 0.6], ancla: { x: 64, y: 50 }, lado: "derecha" },
    { id: "carne", nombre: "Medallón de carne", descripcion: "Corte, molienda, punto de cocción.", dato: "180 g · 100 % vacuno", rango: [0.58, 0.74], ancla: { x: 8, y: 58 }, lado: "izquierda" },
    { id: "pan-inferior", nombre: "Base de pan", descripcion: "Por qué la base no se humedece.", dato: "Tostado a la plancha", rango: [0.72, 0.88], ancla: { x: 64, y: 70 }, lado: "derecha" },
  ] satisfies readonly Ingrediente[],

  packaging: {
    eyebrow: "El packaging",
    titulo: "Diseñado para llegar intacta",
    descripcion:
      "Descripción del packaging: material, cierre, cómo conserva la temperatura y la forma. Pendiente de las especificaciones del cliente.",
    especificaciones: [
      { etiqueta: "Material", valor: "Cartón kraft reciclado" },
      { etiqueta: "Medidas", valor: "12 × 12 × 9 cm" },
      { etiqueta: "Peso del producto", valor: "320 g" },
      { etiqueta: "Conservación", valor: "Ventilación anti-humedad" },
      { etiqueta: "Sostenibilidad", valor: "100 % compostable" },
    ] satisfies readonly Especificacion[],
    nota: "Valores de ejemplo. Reemplazar por la ficha técnica real.",
    posterAlt: "Packaging de la hamburguesa",
  },

  cta: {
    titulo: "Pedí la tuya",
    texto: "Acción de conversión pendiente de DIR-01 (WhatsApp, delivery o tienda).",
    boton: "Contactar",
    href: "#contacto",
  },
} as const;
