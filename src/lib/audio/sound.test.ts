import { describe, expect, it } from "vitest";
import { cutoffForVelocity, pickAudioSource } from "./sound";

describe("cutoffForVelocity (DEV-16)", () => {
  it("400 Hz en reposo y 2 500 Hz con scroll rápido, en ambos sentidos", () => {
    expect(cutoffForVelocity(0)).toBeCloseTo(400);
    expect(cutoffForVelocity(5)).toBeCloseTo(2500);
    expect(cutoffForVelocity(-5)).toBeCloseTo(2500);
    expect(cutoffForVelocity(40)).toBeCloseTo(2500); // no pasa del máximo
  });

  it("interpola en escala logarítmica: a mitad de camino, la media geométrica", () => {
    expect(cutoffForVelocity(2.5)).toBeCloseTo(Math.sqrt(400 * 2500));
  });

  it("crece siempre con la velocidad", () => {
    let prev = 0;
    for (let v = 0; v <= 5; v += 0.5) {
      const hz = cutoffForVelocity(v);
      expect(hz).toBeGreaterThan(prev);
      prev = hz;
    }
  });
});

describe("pickAudioSource", () => {
  const sources = ["/audio/ambient_drone.webm", "/audio/ambient_drone.m4a"];

  it("usa WebM/Opus si el navegador lo reproduce", () => {
    expect(pickAudioSource(sources, () => "probably")).toBe("/audio/ambient_drone.webm");
  });

  it("cae al M4A cuando no hay WebM (Safari antiguo)", () => {
    const safari = (mime: string) => (mime.startsWith("audio/mp4") ? "maybe" : "");
    expect(pickAudioSource(sources, safari)).toBe("/audio/ambient_drone.m4a");
  });

  it("devuelve null si no puede reproducir ninguno o no hay archivos", () => {
    expect(pickAudioSource(sources, () => "")).toBeNull();
    expect(pickAudioSource([], () => "probably")).toBeNull();
  });
});
