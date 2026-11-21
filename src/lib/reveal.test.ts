import { describe, expect, it } from "vitest";
import {
  activeSlot,
  applyReveal,
  applyStyle,
  cascadeTargets,
  exclusiveTargets,
  oneHot,
  smoothstep,
  splitSlots,
} from "@/lib/reveal";

/** Nodo mínimo con `style` para probar los aplicadores sin DOM */
const fakeElement = () => ({ style: { opacity: "", transform: "" } }) as unknown as HTMLElement;

describe("smoothstep", () => {
  it("arranca y termina sin brusquedad y es simétrica", () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5);
    // pendiente casi nula en los extremos: el primer 5 % del tramo mueve menos del 1 %
    expect(smoothstep(0.05)).toBeLessThan(0.01);
    expect(1 - smoothstep(0.95)).toBeLessThan(0.01);
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
  });
});

describe("splitSlots y activeSlot (fichas una detrás de otra)", () => {
  it("reparte turnos consecutivos sin huecos ni superposición", () => {
    const slots = splitSlots([0.2, 0.7], 5);
    expect(slots).toHaveLength(5);
    expect(slots[0][0]).toBeCloseTo(0.2);
    expect(slots[4][1]).toBeCloseTo(0.7);
    for (let i = 1; i < slots.length; i++) expect(slots[i][0]).toBeCloseTo(slots[i - 1][1]);
  });

  it("antes del tramo es -1, después es count y dentro, el turno que corresponde", () => {
    expect(activeSlot(0.19, [0.2, 0.7], 5)).toBe(-1);
    expect(activeSlot(0.2, [0.2, 0.7], 5)).toBe(0);
    expect(activeSlot(0.35, [0.2, 0.7], 5)).toBe(1);
    expect(activeSlot(0.6999, [0.2, 0.7], 5)).toBe(4);
    expect(activeSlot(0.7, [0.2, 0.7], 5)).toBe(5);
  });

  it("en cualquier punto del tramo hay exactamente una ficha activa (entera, nunca a medias)", () => {
    for (let p = 0.2; p < 0.7; p += 0.0025) {
      const targets = oneHot(5, activeSlot(p, [0.2, 0.7], 5));
      expect(targets.filter((t) => t === 1)).toHaveLength(1);
      expect(targets.every((t) => t === 0 || t === 1)).toBe(true);
    }
    expect(oneHot(5, -1)).toEqual([0, 0, 0, 0, 0]);
    expect(oneHot(5, 5)).toEqual([0, 0, 0, 0, 0]);
  });
});

describe("exclusiveTargets (una sola ficha a la vez)", () => {
  it("la siguiente espera mientras la anterior sigue visible", () => {
    expect(exclusiveTargets([0, 1, 0], [0.6, 0, 0])).toEqual([0, 0, 0]);
    expect(exclusiveTargets([0, 1, 0], [0.01, 0, 0])).toEqual([0, 1, 0]);
  });

  it("no retiene a la que ya estaba visible ni a las que salen", () => {
    expect(exclusiveTargets([0, 1, 0], [0, 1, 0])).toEqual([0, 1, 0]);
    expect(exclusiveTargets([0, 0, 0], [0.5, 0.5, 0])).toEqual([0, 0, 0]);
  });

  it("es igual al bajar que al subir", () => {
    expect(exclusiveTargets([1, 0, 0], [0, 0.4, 0])).toEqual([0, 0, 0]);
    expect(exclusiveTargets([1, 0, 0], [0, 0, 0])).toEqual([1, 0, 0]);
  });
});

describe("cascadeTargets (filas una tras otra)", () => {
  it("si se activan todas a la vez, cada fila espera a que la anterior vaya por el 35 %", () => {
    expect(cascadeTargets([1, 1, 1], [0, 0, 0])).toEqual([1, 0, 0]);
    expect(cascadeTargets([1, 1, 1], [0.5, 0, 0])).toEqual([1, 1, 0]);
    expect(cascadeTargets([1, 1, 1], [1, 0.4, 0])).toEqual([1, 1, 1]);
  });

  it("al ocultarse no espera", () => {
    expect(cascadeTargets([0, 0, 0], [1, 1, 1])).toEqual([0, 0, 0]);
  });
});

describe("applyStyle / applyReveal", () => {
  it("escribe opacidad y desplazamiento en el eje pedido", () => {
    const el = fakeElement();
    applyReveal(el, 0.5, { axis: "y", offsetPx: 16, reducedMotion: false });
    expect(el.style.opacity).toBe("0.5");
    expect(el.style.transform).toBe("translate3d(0, 8px, 0)");

    applyStyle(el, 1, { axis: "x", offsetPx: -24, reducedMotion: false });
    expect(el.style.transform).toBe("translate3d(-24px, 0, 0)");
  });

  it("con reduced motion mantiene el fundido de opacidad pero sin desplazamiento", () => {
    const el = fakeElement();
    applyReveal(el, 0.4, { axis: "y", offsetPx: 16, reducedMotion: true });
    expect(el.style.opacity).toBe("0.4");
    expect(el.style.transform).toBe("none");
  });
});
