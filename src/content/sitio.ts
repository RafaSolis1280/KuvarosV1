// Textos del sitio que no son del producto: navegación, footer, formulario, legales (§0.5 del FLUJO).
// Los textos del producto (titulares, ingredientes, packaging, CTA) viven en src/content/producto.ts.

export const SITIO = {
  /** DEV-17 · Navegación principal (cabecera fija) */
  nav: {
    ariaLabel: "Principal",
    /** Nombre accesible del logo, que lleva al inicio de la página */
    inicio: "Kuvaro's Smash Burguers: volver al inicio",
  },
} as const;
