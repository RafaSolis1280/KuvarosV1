import { describe, expect, it } from "vitest";
import { applyReveal, progressBetween, windowVisibility } from "@/lib/reveal";

/** Nodo mínimo con `style` para probar applyReveal sin DOM */
const fakeElement = () => ({ style: { opacity: "", transform: "" } }) as unknown as HTMLElement;

describe("progressBetween", () => {
  it("vale 0 antes del tramo, 1 después y lineal dentro", () => {
    expect(progressBetween(0.1, 0.2, 0.4)).toBe(0);
    expect(progressBetween(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(progressBetween(0.9, 0.2, 0.4)).toBe(1);
  });

  it("no divide por cero si el tramo está vacío", () => {
    expect(progressBetween(0.5, 0.5, 0.5)).toBe(0);
    expect(progressBetween(0.6, 0.5, 0.5)).toBe(1);
  });
});

describe("windowVisibility", () => {
  const tramo = [0.36, 0.48] as const;

  it("es 0 fuera del tramo y 1 en su centro", () => {
    expect(windowVisibility(0.2, tramo, 0.04)).toBe(0);
    expect(windowVisibility(0.42, tramo, 0.04)).toBe(1);
    expect(windowVisibility(0.6, tramo, 0.04)).toBe(0);
  });

  it("tiene rampas de entrada y salida simétricas", () => {
    expect(windowVisibility(0.38, tramo, 0.04)).toBeCloseTo(0.5);
    expect(windowVisibility(0.46, tramo, 0.04)).toBeCloseTo(0.5);
  });

  it("en tramos cortos la rampa mide un tercio del tramo", () => {
    expect(windowVisibility(0.01, [0, 0.03], 0.04)).toBeCloseTo(1);
  });
});

describe("applyReveal", () => {
  it("escribe opacidad y desplazamiento en el eje pedido", () => {
    const el = fakeElement();
    applyReveal(el, 0.5, { axis: "y", offsetPx: 16, reducedMotion: false });
    expect(el.style.opacity).toBe("0.5");
    expect(el.style.transform).toBe("translate3d(0, 8px, 0)");

    applyReveal(el, 0, { axis: "x", offsetPx: -24, reducedMotion: false });
    expect(el.style.transform).toBe("translate3d(-24px, 0, 0)");
  });

  it("con reduced motion: sin desplazamiento y opacidad binaria", () => {
    const el = fakeElement();
    applyReveal(el, 0.6, { axis: "y", offsetPx: 16, reducedMotion: true });
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("none");
    applyReveal(el, 0.4, { axis: "y", offsetPx: 16, reducedMotion: true });
    expect(el.style.opacity).toBe("0");
  });
});
