// DEV-19 · Contenido de la landing de Kuvaro's Smash Burguers. Fuente única de texto del sitio (CLAUDE.md).
// Fuentes: Manuales/MANUAL_MARCA_KUVAROS.md (voz y tono §7, propuesta de valor §3.2, packaging §8, territorio §5),
// el empaque real (bolsa "Kuvaro's · Smash Burguers", @Kuvaros_burger) y lo que se ve en Marca/Video.mp4.
// ⏳ DIR-05: el cliente debe validar el copy. No se inventaron cifras (gramajes, precios, tiempos reales):
//    lo que el manual da como objetivo se presenta como objetivo.

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
  lado: "izquierda" | "derecha";
}

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

export const PRODUCTO = {
  marca: "Kuvaro's",
  /** Wordmark: la "a" va en mostaza, como en el logotipo (donde es el ícono de la hamburguesa) */
  wordmark: { antes: "Kuv", acento: "a", despues: "ro's" },
  bajadaMarca: "Smash Burguers",
  instagram: { usuario: "@Kuvaros_burger", url: "https://www.instagram.com/kuvaros_burger/" },

  seo: {
    titulo: "Kuvaro's Smash Burguers | Hamburguesas smash a domicilio en Cochabamba",
    descripcion:
      "Hamburguesas smash premium hechas al momento en cocina cerrada y entregadas a domicilio en Zona Cercado, Cochabamba. Sin atajos: pide la tuya en Kuvaro's.",
    ogAlt: "Hamburguesa smash de Kuvaro's separada en capas: pan brioche, salsa, doble carne y cheddar fundido",
  },

  nombre: "Smash Burguers · Cochabamba",
  titular: { linea1: "Sin atajos.", destacado: "Solo carne real." },
  bajada:
    "Técnica precisa y el sabor que estabas esperando. Hechas al momento en nuestra cocina cerrada y entregadas con detalle premium en Zona Cercado.",
  indicacionScroll: "Desliza para verla capa por capa",
  secuenciaAria:
    "Video de la hamburguesa smash de Kuvaro's separándose en capas: pan brioche, salsa de la casa con carne, cheddar fundido, segundo medallón y base de pan",

  ingredientes: [
    {
      id: "pan-superior",
      nombre: "Pan brioche",
      descripcion: "Dorado, suave y brillante. Sostiene todo sin robarle protagonismo a la carne.",
      dato: "Brioche",
      rango: [0.36, 0.48],
      ancla: { x: 4, y: 10 },
      lado: "izquierda",
    },
    {
      id: "salsa",
      nombre: "Salsa de la casa",
      descripcion: "Cremosa y con carácter. Cubre el primer medallón recién salido de la plancha.",
      dato: "Receta propia",
      rango: [0.45, 0.57],
      ancla: { x: 68, y: 26 },
      lado: "derecha",
    },
    {
      id: "queso",
      nombre: "Cheddar fundido",
      descripcion: "Se derrite sobre la carne caliente hasta caer por los bordes. Queso real, sin trucos.",
      dato: "Fundido real",
      rango: [0.54, 0.66],
      ancla: { x: 4, y: 44 },
      lado: "izquierda",
    },
    {
      id: "carne",
      nombre: "Doble smash",
      descripcion: "Carne aplastada contra la plancha bien caliente: costra crujiente por fuera, jugosa por dentro.",
      dato: "Costra Maillard",
      rango: [0.63, 0.75],
      ancla: { x: 68, y: 56 },
      lado: "derecha",
    },
    {
      id: "pan-inferior",
      nombre: "Base de pan",
      descripcion: "El orden de armado está pensado para el delivery: la base llega firme, sin humedecerse.",
      dato: "Armada para el viaje",
      rango: [0.72, 0.86],
      ancla: { x: 4, y: 68 },
      lado: "izquierda",
    },
  ] satisfies readonly Ingrediente[],

  packaging: {
    eyebrow: "100 % delivery",
    titulo: "El empaque es el restaurante",
    descripcion:
      "No tenemos salón: toda la energía va a la cocina y a lo que llega a tu puerta. Cada pedido sale armado y cerrado para que la abras como salió de la plancha.",
    especificaciones: [
      { etiqueta: "Bolsa", valor: "Papel con logo Kuvaro's" },
      { etiqueta: "Papas", valor: "Bolsa antigrasa propia" },
      { etiqueta: "Cocina", valor: "Cerrada · solo delivery" },
      { etiqueta: "Cobertura", valor: "Zona Cercado, Cochabamba" },
      { etiqueta: "Entrega objetivo", valor: "30 a 40 min puerta a puerta" },
    ] satisfies readonly Especificacion[],
    nota: "Ficha basada en el manual de marca. ⏳ Pendiente de confirmar con el cliente (DIR-05).",
    secuenciaAria:
      "Video de la hamburguesa y las papas de Kuvaro's entrando en la bolsa de papel, que se cierra mostrando el logo Kuvaro's Smash Burguers",
  },

  experiencia: {
    eyebrow: "Primer bocado",
    titulo: "Hecha sin concesiones.",
    texto: "Disfruta el primer bocado. Así llega: caliente, armada y con el detalle que se nota al abrir la bolsa.",
    fotos: [
      {
        src: "/photos/kuvaros_bolsa_mano.webp",
        alt: "Una mano sostiene una hamburguesa smash con doble carne y queso sobre la bolsa blanca de Kuvaro's Smash Burguers",
        width: 1000,
        height: 1500,
      },
      {
        src: "/photos/kuvaros_papas_banca.webp",
        alt: "Una mano toma una papa frita de la bolsa de Kuvaro's junto a una hamburguesa smash sobre una banca de madera",
        width: 1000,
        height: 1500,
      },
    ] satisfies readonly Foto[],
  },

  cta: {
    titulo: "Pide la tuya hoy en Cercado",
    texto: "Tu pedido va directo a la plancha. Escríbenos y preparamos cada detalle para que llegue perfecto a tu puerta.",
    // ⏳ DIR-01: canal de pedido definitivo (WhatsApp Business / app de delivery). Por ahora, el Instagram del empaque.
    boton: "Pedir por Instagram",
    href: "https://www.instagram.com/kuvaros_burger/",
    botonHeader: "Pedir ahora",
    hrefHeader: "#contacto",
  },
} as const;
