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

  /** DEV-25 · Formulario de contacto (sección de conversión) */
  contacto: {
    titulo: "O escríbenos aquí",
    texto: "Pedidos para eventos, consultas o comentarios: te respondemos por email o WhatsApp.",
    campos: {
      nombre: { label: "Nombre", autocomplete: "name" },
      email: { label: "Email", autocomplete: "email" },
      telefono: { label: "Teléfono o WhatsApp (opcional)", autocomplete: "tel" },
      mensaje: { label: "Mensaje" },
    },
    boton: "Enviar mensaje",
    /** Etiqueta del campo trampa antispam (invisible; solo la "leen" los bots) */
    trampa: "No completar este campo",
    enviando: "Enviando…",
    errores: {
      nombreVacio: "Escribe tu nombre.",
      nombreCorto: "El nombre debe tener al menos 2 letras.",
      nombreLargo: "El nombre puede tener hasta 80 caracteres.",
      emailVacio: "Escribe tu email.",
      emailInvalido: "Revisa el email: falta la @ o el dominio (ej.: nombre@correo.com).",
      telefonoInvalido: "Revisa el teléfono: solo números, espacios, + y - (mínimo 7 dígitos).",
      mensajeVacio: "Escribe tu mensaje.",
      mensajeCorto: "Cuéntanos un poco más (mínimo 10 caracteres).",
      mensajeLargo: "El mensaje puede tener hasta 1000 caracteres.",
    },
    /** Resumen para lectores de pantalla: «Revisa 2 campos: Nombre, Email.» */
    resumenErrores: (campos: readonly string[]) =>
      `Revisa ${campos.length} ${campos.length === 1 ? "campo" : "campos"}: ${campos.join(", ")}.`,
    estados: {
      enviado: "¡Listo! Recibimos tu mensaje y te respondemos pronto.",
      limite: "Enviaste varios mensajes seguidos. Espera unos minutos e inténtalo de nuevo.",
      noDisponible: "El formulario no está disponible ahora mismo. Escríbenos por Instagram.",
      error: "No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por Instagram.",
    },
  },

  /** DEV-25 · Pie de página */
  footer: {
    descripcion: "Cocina cerrada · solo delivery · Zona Cercado, Cochabamba",
    contactoTitulo: "Contacto",
    instagramEtiqueta: "Instagram",
    derechos: "Kuvaro's Smash Burguers. Todos los derechos reservados.",
    // ⏳ DIR-08: privacidad y cookies. Los enlaces se agregan aquí cuando existan los textos aprobados.
    legales: [] as readonly { texto: string; href: string }[],
  },
} as const;

