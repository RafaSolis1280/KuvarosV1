// Textos del sitio que no son del producto: navegación, footer, formulario, legales (§0.5 del FLUJO).
// Los textos del producto (titulares, ingredientes, packaging, CTA) viven en src/content/producto.ts.

export const SITIO = {
  /** DEV-17 · Navegación principal (cabecera fija) */
  nav: {
    ariaLabel: "Principal",
    /** Nombre accesible del logo, que lleva al inicio de la página */
    inicio: "Kuvaro's Smash Burguers: volver al inicio",
  },

  /**
   * DEV-30 · Datos del negocio para los datos estructurados (JSON-LD). Solo lo que el manual de marca y el
   * empaque confirman: cocina cerrada, 100 % delivery, Zona Cercado de Cochabamba.
   * ⏳ DIR-01: teléfono / WhatsApp, horario y rango de precios (se agregan aquí cuando el cliente los dé).
   */
  negocio: {
    cocina: ["Hamburguesas", "Smash burgers"],
    zonaDeEntrega: "Zona Cercado, Cochabamba",
    ciudad: "Cochabamba",
    region: "Cochabamba",
    /** ISO 3166-1 alfa-2 */
    pais: "BO",
    /** Sin salón: no hay reservas */
    aceptaReservas: false,
  },
} as const;
