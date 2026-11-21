import { describe, expect, it } from "vitest";
import { firstInvalidField, validateContact } from "@/lib/contact/validation";
import { SITIO } from "@/content/sitio";

const ok = { nombre: "Ana Pérez", email: "ana@correo.com", telefono: "", mensaje: "Quiero pedir 10 hamburguesas." };
const e = SITIO.contacto.errores;

describe("validateContact (misma regla en navegador y servidor)", () => {
  it("acepta un mensaje válido, con o sin teléfono, y recorta espacios", () => {
    expect(validateContact(ok)).toEqual({ ok: true, data: ok, isBot: false });
    const r = validateContact({ ...ok, nombre: "  Ana  ", telefono: "+591 7123-4567" });
    expect(r.ok && r.data.nombre).toBe("Ana");
    expect(r.ok && r.data.telefono).toBe("+591 7123-4567");
  });

  it("da un mensaje claro por cada campo con error", () => {
    const r = validateContact({ nombre: "", email: "ana@", telefono: "12ab", mensaje: "hola" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual({
      nombre: e.nombreVacio,
      email: e.emailInvalido,
      telefono: e.telefonoInvalido,
      mensaje: e.mensajeCorto,
    });
  });

  it("controla longitudes mínimas y máximas", () => {
    const r = validateContact({ ...ok, nombre: "A", mensaje: "x".repeat(1001) });
    expect(!r.ok && r.errors).toEqual({ nombre: e.nombreCorto, mensaje: e.mensajeLargo });
    expect(validateContact({ ...ok, telefono: "123 45" }).ok).toBe(false); // menos de 7 dígitos
  });

  it("ignora tipos raros (no strings) como si estuvieran vacíos", () => {
    const r = validateContact({ nombre: 42, email: ["a@b.co"], mensaje: { texto: "x" } });
    expect(!r.ok && Object.keys(r.errors)).toEqual(["nombre", "email", "mensaje"]);
  });

  it("marca como bot si el campo trampa trae texto", () => {
    expect(validateContact({ ...ok, sitio_web: "http://spam" }).isBot).toBe(true);
    expect(validateContact({ ...ok, sitio_web: "" }).isBot).toBe(false);
  });

  it("el foco va al primer campo con error en el orden del formulario", () => {
    expect(firstInvalidField({ mensaje: "x", email: "y" })).toBe("email");
    expect(firstInvalidField({})).toBeUndefined();
  });
});
