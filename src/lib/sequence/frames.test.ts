import { describe, expect, it } from "vitest";
import { frameIndexForProgress, frameUrl, windowBounds } from "@/lib/sequence/frames";

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
