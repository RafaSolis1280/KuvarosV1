import { describe, expect, it } from "vitest";
import { anchorScrollTop, hashTargetId } from "./hashTarget";

describe("hashTargetId", () => {
  it("devuelve el id sin la almohadilla", () => {
    expect(hashTargetId("#contacto")).toBe("contacto");
    expect(hashTargetId("#inicio")).toBe("inicio");
  });

  it("devuelve null si no hay hash o está vacío", () => {
    expect(hashTargetId("")).toBeNull();
    expect(hashTargetId("#")).toBeNull();
  });

  it("decodifica caracteres codificados y tolera un hash mal codificado", () => {
    expect(hashTargetId("#secci%C3%B3n")).toBe("sección");
    expect(hashTargetId("#%E0%A4%A")).toBe("%E0%A4%A");
  });
});

describe("anchorScrollTop", () => {
  it("suma el scroll actual y resta el scroll-margin (cabecera fija)", () => {
    expect(anchorScrollTop(6597, 2512, 72)).toBe(9037);
  });

  it("ignora un margen inválido y nunca devuelve un valor negativo", () => {
    expect(anchorScrollTop(100, 0, Number.NaN)).toBe(100);
    expect(anchorScrollTop(-50, 0, 72)).toBe(0);
  });
});
