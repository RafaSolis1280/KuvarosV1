import { describe, expect, it } from "vitest";
import { beatRanges, clipLayout, createTimeline, storyFrameUrl, totalViewportHeights } from "@/lib/sequence/timeline";
import { PRODUCT_STORY } from "@/config/sequences";

const clips = [
  { basePath: "/a", totalFrames: { desktop: 54, mobile: 54 } },
  { basePath: "/b", totalFrames: { desktop: 157, mobile: 157 } },
] as const;
const beats = [
  { id: "uno", clip: 0, to: 1, vh: 1 },
  { id: "dos", clip: 1, to: 0.5, vh: 1 },
  { id: "tres", clip: 1, to: 1, vh: 2 },
] as const;

describe("clips unidos", () => {
  it("coloca los clips uno detrás de otro", () => {
    expect(clipLayout(clips, "desktop")).toEqual({ offsets: [0, 54], count: 211 });
  });

  it("la ruta del frame global apunta al clip y al frame local correctos", () => {
    expect(storyFrameUrl(clips, "desktop", 0)).toBe("/a/desktop/frame_0001.webp");
    expect(storyFrameUrl(clips, "desktop", 53)).toBe("/a/desktop/frame_0054.webp");
    expect(storyFrameUrl(clips, "mobile", 54)).toBe("/b/mobile/frame_0001.webp");
    expect(storyFrameUrl(clips, "mobile", 210)).toBe("/b/mobile/frame_0157.webp");
  });
});

describe("línea de tiempo por beats", () => {
  it("el scroll se reparte según los vh de cada beat", () => {
    expect(totalViewportHeights(beats)).toBe(4);
    expect(beatRanges(beats)).toEqual({ uno: [0, 0.25], dos: [0.25, 0.5], tres: [0.5, 1] });
  });

  it("al final de cada beat el video llega al punto indicado", () => {
    const t = createTimeline(beats, clips, "desktop");
    expect(t.frameAt(0)).toBe(0);
    expect(t.frameAt(0.25)).toBe(53); // fin del clip 0
    expect(t.frameAt(0.5)).toBe(54 + 0.5 * 156); // mitad del clip 1
    expect(t.frameAt(1)).toBe(210);
  });

  it("es continua y nunca retrocede (sin saltos entre clips)", () => {
    const t = createTimeline(beats, clips, "desktop");
    let prev = -1;
    for (let p = 0; p <= 1.0001; p += 0.001) {
      const f = t.frameAt(p);
      expect(f).toBeGreaterThanOrEqual(prev);
      if (prev >= 0) expect(f - prev).toBeLessThan(1); // con pasos de 0.1 % de scroll, menos de 1 frame
      prev = f;
    }
  });
});

describe("historia del producto (config real)", () => {
  const ranges = beatRanges(PRODUCT_STORY.beats);

  it("dura entre 6 y 8 alturas de pantalla (antes, ~11 con dos secciones)", () => {
    const vh = totalViewportHeights(PRODUCT_STORY.beats);
    expect(vh).toBeGreaterThanOrEqual(6);
    expect(vh).toBeLessThanOrEqual(8);
  });

  it("los beats avanzan siempre hacia adelante en el video", () => {
    let prev = { clip: 0, to: 0 };
    for (const b of PRODUCT_STORY.beats) {
      expect(b.clip > prev.clip || (b.clip === prev.clip && b.to > prev.to)).toBe(true);
      prev = b;
    }
  });

  it("tiene los beats que usan las fichas y los capítulos", () => {
    for (const id of ["separa", "ingredientes", "se-arma", "a-la-bolsa", "sobre-la-bolsa", "adentro", "logo"]) {
      expect(ranges[id]).toBeDefined();
    }
  });
});
