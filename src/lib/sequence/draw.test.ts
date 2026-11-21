import { describe, expect, it } from "vitest";
import { computeFrameRect } from "@/lib/sequence/draw";

describe("computeFrameRect", () => {
  it("en horizontal hace «cover» centrado (llena el canvas)", () => {
    // Master 1292×696 en un canvas 1920×1080
    const r = computeFrameRect(1920, 1080, 1292, 696);
    expect(r.letterbox).toBe(false);
    // "cover": cubre los dos ejes y coincide exactamente con el canvas en uno de ellos
    expect(r.width).toBeGreaterThanOrEqual(1920 - 1e-6);
    expect(r.height).toBeGreaterThanOrEqual(1080 - 1e-6);
    expect(Math.min(r.width - 1920, r.height - 1080)).toBeCloseTo(0);
    expect(r.x).toBeCloseTo((1920 - r.width) / 2);
    expect(r.y).toBeCloseTo((1080 - r.height) / 2);
  });

  it("en vertical muestra el 72 % central del ancho, sin recortar el producto, y lo sube", () => {
    // Móvil 375×812 con dpr 1
    const r = computeFrameRect(375, 812, 1292, 696);
    expect(r.letterbox).toBe(true);
    expect(r.width * 0.72).toBeCloseTo(375); // la franja visible ocupa todo el ancho
    expect(r.x).toBeCloseTo((375 - r.width) / 2);
    expect(r.y).toBeCloseTo((812 - r.height) * 0.12);
    expect(r.y + r.height).toBeLessThan(812); // queda sitio abajo para las fichas
  });

  it("un master vertical en viewport vertical vuelve a «cover»", () => {
    expect(computeFrameRect(375, 812, 696, 1292).letterbox).toBe(false);
  });
});
