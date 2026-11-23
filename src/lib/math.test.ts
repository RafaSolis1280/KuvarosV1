import { describe, expect, it } from "vitest";
import { clamp, damp, mapRange } from "@/lib/math";

describe("damp", () => {
  it("no depende de los FPS: 1 paso de 1/30 s ≈ 2 pasos de 1/60 s", () => {
    const at30 = damp(0, 10, 6, 1 / 30);
    const at60 = damp(damp(0, 10, 6, 1 / 60), 10, 6, 1 / 60);
    expect(at60).toBeCloseTo(at30, 10);
  });

  it("converge al objetivo y no lo sobrepasa", () => {
    let x = 0;
    for (let i = 0; i < 600; i++) x = damp(x, 1, 8, 1 / 60);
    expect(x).toBeLessThanOrEqual(1);
    expect(x).toBeCloseTo(1, 6);
  });
});

describe("clamp y mapRange", () => {
  it("clamp limita al rango", () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(2, 0, 1)).toBe(1);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it("mapRange interpola y satura", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(20, 0, 10, 0, 100)).toBe(100);
    expect(mapRange(3, 3, 3, 7, 9)).toBe(7); // rango vacío
  });
});
