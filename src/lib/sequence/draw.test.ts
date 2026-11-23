import { describe, expect, it } from "vitest";
import { SEQUENCE_FRAMING } from "@/config/sequences";
import { computeFrameRect, configureContext, drawFrame } from "@/lib/sequence/draw";

/** Contexto 2D falso que registra las llamadas */
function fakeContext(width = 1920, height = 1080) {
  const calls: string[] = [];
  const ctx = {
    canvas: { width, height },
    globalAlpha: 1,
    fillStyle: "",
    imageSmoothingEnabled: false,
    imageSmoothingQuality: "low",
    fillRect: () => calls.push("fillRect"),
    drawImage: () => calls.push(`drawImage@${ctx.globalAlpha}`),
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls, raw: ctx };
}
const image = { width: 1292, height: 696 } as ImageBitmap;

describe("drawFrame (mezcla de frames)", () => {
  it("un frame opaco se dibuja completo", () => {
    const { ctx, calls } = fakeContext(375, 812); // vertical → con franjas
    drawFrame(ctx, image);
    expect(calls).toEqual(["fillRect", "drawImage@1"]);
  });

  it("el frame que se funde no repinta el fondo y deja globalAlpha como estaba", () => {
    const { ctx, calls, raw } = fakeContext(375, 812);
    drawFrame(ctx, image, 0.3);
    expect(calls).toEqual(["drawImage@0.3"]);
    expect(raw.globalAlpha).toBe(1);
  });

  it("con alpha 0 no dibuja nada", () => {
    const { ctx, calls } = fakeContext();
    drawFrame(ctx, image, 0);
    expect(calls).toEqual([]);
  });

  it("configureContext activa el escalado de alta calidad", () => {
    const { ctx, raw } = fakeContext();
    configureContext(ctx);
    expect(raw.imageSmoothingEnabled).toBe(true);
    expect(raw.imageSmoothingQuality).toBe("high");
  });
});

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

  it("en vertical muestra la franja central del ancho y la ubica sobre el espacio de las fichas", () => {
    // Móvil 375×812 con dpr 1
    const { portraitVisibleWidth, portraitTopOffset } = SEQUENCE_FRAMING;
    const r = computeFrameRect(375, 812, 1292, 696);
    expect(r.letterbox).toBe(true);
    expect(r.width * portraitVisibleWidth).toBeCloseTo(375); // la franja visible ocupa todo el ancho
    expect(r.x).toBeCloseTo((375 - r.width) / 2);
    expect(r.y).toBeCloseTo((812 - r.height) * portraitTopOffset);
    expect(r.y).toBeGreaterThan(60); // deja libre el título del capítulo
    expect(r.y + r.height).toBeLessThan(812 * 0.62); // y el tercio inferior para las fichas
  });

  it("un master vertical en viewport vertical vuelve a «cover»", () => {
    expect(computeFrameRect(375, 812, 696, 1292).letterbox).toBe(false);
  });
});
