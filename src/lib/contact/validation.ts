// DEV-25 · Validación del formulario de contacto. La MISMA función corre en el navegador (mensajes al
// instante) y en el servidor (route handler): una sola regla, sin duplicar.
import { CONTACT } from "@/config/site";
import { SITIO } from "@/content/sitio";

/** Campos visibles, en el orden del formulario (el foco salta al primero con error) */
export const CONTACT_FIELDS = ["nombre", "email", "telefono", "mensaje"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export interface ContactMessage {
  nombre: string;
  email: string;
  /** Vacío si no lo dejó */
  telefono: string;
  mensaje: string;
}

export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactValidation =
  | { ok: true; data: ContactMessage; isBot: boolean }
  | { ok: false; errors: ContactErrors; isBot: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS = /^\+?[\d\s-]+$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateContact(input: Record<string, unknown>): ContactValidation {
  const { fields, honeypot } = CONTACT;
  const e = SITIO.contacto.errores;
  const data: ContactMessage = {
    nombre: text(input.nombre),
    email: text(input.email),
    telefono: text(input.telefono),
    mensaje: text(input.mensaje),
  };
  const errors: ContactErrors = {};

  if (!data.nombre) errors.nombre = e.nombreVacio;
  else if (data.nombre.length < fields.nombre.min) errors.nombre = e.nombreCorto;
  else if (data.nombre.length > fields.nombre.max) errors.nombre = e.nombreLargo;

  if (!data.email) errors.email = e.emailVacio;
  else if (data.email.length > fields.email.max || !EMAIL.test(data.email)) errors.email = e.emailInvalido;

  if (data.telefono) {
    const digits = data.telefono.replace(/\D/g, "").length;
    const valid =
      PHONE_CHARS.test(data.telefono) && digits >= fields.telefono.minDigits && data.telefono.length <= fields.telefono.max;
    if (!valid) errors.telefono = e.telefonoInvalido;
  }

  if (!data.mensaje) errors.mensaje = e.mensajeVacio;
  else if (data.mensaje.length < fields.mensaje.min) errors.mensaje = e.mensajeCorto;
  else if (data.mensaje.length > fields.mensaje.max) errors.mensaje = e.mensajeLargo;

  const isBot = text(input[honeypot]) !== "";
  return Object.keys(errors).length ? { ok: false, errors, isBot } : { ok: true, data, isBot };
}

/** Primer campo con error en el orden del formulario (a donde salta el foco) */
export function firstInvalidField(errors: ContactErrors): ContactField | undefined {
  return CONTACT_FIELDS.find((field) => errors[field]);
}
