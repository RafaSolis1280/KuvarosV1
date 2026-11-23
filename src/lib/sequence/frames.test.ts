import { describe, expect, it } from "vitest";
import { frameIndexForProgress, framePosition, frameUrl, windowBounds } from "@/lib/sequence/frames";

describe("framePosition (mezcla de frames)", () => {
  it("ubica el progreso entre dos frames con la fracción de mezcla", () => {
    expect(framePosition(0.5, 54)).toEqual({ exact: 26.5, from: 26, to: 27, mix: 0.5 });
  });

  it("en los extremos no mezcla (no hay frame siguiente al último)", () => {
    expect(framePosition(0, 54)).toMatchObject({ from: 0, to: 1, mix: 0 });
    expect(framePosition(1, 54)).toMatchObject({ from: 53, to: 53, mix: 0 });
  });

  it("satura progresos fuera de 0-1 y tolera secuencias de 1 frame", () => {
    expect(framePosition(1.2, 54)).toMatchObject({ from: 53, mix: 0 });
    expect(framePosition(-0.1, 54)).toMatchObject({ from: 0, mix: 0 });
    expect(framePosition(0.5, 1)).toEqual({ exact: 0, from: 0, to: 0, mix: 0 });
  });

  it("avanza de forma continua: dentro de un frame la mezcla crece, y la posición nunca retrocede", () => {
    const within = [0.5, 0.502, 0.504].map((p) => framePosition(p, 54));
    expect(new Set(within.map((x) => x.from)).size).toBe(1); // mismo par de frames
    expect(within[1].mix).toBeGreaterThan(within[0].mix);
    expect(within[2].mix).toBeGreaterThan(within[1].mix);

    let prev = -1;
    for (let p = 0; p <= 1; p += 0.001) {
      const { exact } = framePosition(p, 54);
      expect(exact).toBeGreaterThanOrEqual(prev);
      prev = exact;
    }
  });
});

describe("frameUrl", () => {
  it("sigue la convención de scripts/video-to-frames.mjs (base 1, 4 dígitos)", () => {
    expect(frameUrl("/sequences/hero_explode", "desktop", 0)).toBe("/sequences/hero_explode/desktop/frame_0001.webp");
    expect(frameUrl("/sequences/packaging_reveal", "mobile", 156)).toBe("/sequences/packaging_reveal/mobile/frame_0157.webp");
  });
});

describe("frameIndexForProgress", () => {
  it("lleva el progreso 0-1 al primer y último frame", () => {
    expect(frameIndexForProgress(0, 54)).toBe(0);
    expect(frameIndexForProgress(1, 54)).toBe(53);
    expect(frameIndexForProgress(0.5, 157)).toBe(78);
  });
});

describe("windowBounds", () => {
  it("abarca [centro-R, centro+R] recortado a la secuencia", () => {
    expect(windowBounds(50, 18, 157)).toEqual({ min: 32, max: 68 });
    expect(windowBounds(2, 18, 157)).toEqual({ min: 0, max: 20 });
    expect(windowBounds(156, 18, 157)).toEqual({ min: 138, max: 156 });
  });
});
