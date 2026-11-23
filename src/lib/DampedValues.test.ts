import { describe, expect, it, vi } from "vitest";
import { DampedValues, type Ticker } from "@/lib/DampedValues";
import { exclusiveTargets } from "@/lib/reveal";

/** Ticker manual: avanza frames de `ms` milisegundos */
function manualTicker() {
  const callbacks = new Set<(t: number, d: number) => void>();
  const ticker: Ticker = { add: (cb) => callbacks.add(cb), remove: (cb) => callbacks.delete(cb) };
  const frame = (ms: number) => [...callbacks].forEach((cb) => cb(0, ms));
  return { ticker, frame, active: () => callbacks.size };
}

describe("DampedValues", () => {
  it("el primer objetivo se aplica al instante", () => {
    const { ticker } = manualTicker();
    const onUpdate = vi.fn();
    new DampedValues(10, onUpdate, ticker).set([0, 1]);
    expect(onUpdate).toHaveBeenLastCalledWith([0, 1]);
  });

  it("un salto de objetivo (0 → 1) se recorre a velocidad acotada, no en un frame", () => {
    const { ticker, frame } = manualTicker();
    let last: readonly number[] = [];
    const d = new DampedValues(10, (v) => (last = [...v]), ticker);
    d.set([0]);
    d.set([1]); // tirón de la rueda: la ficha debería estar entera
    const perFrame: number[] = [];
    let prev = 0;
    for (let i = 0; i < 165; i++) {
      frame(1000 / 165);
      perFrame.push(last[0] - prev);
      prev = last[0];
    }
    expect(Math.max(...perFrame)).toBeLessThan(0.07); // a 165 fps, < 7 % por frame
    const reach90 = perFrame.reduce((acc, _, i) => (acc < 0 && perFrame.slice(0, i + 1).reduce((a, b) => a + b, 0) >= 0.9 ? i : acc), -1);
    expect(reach90 / 165).toBeGreaterThan(0.15); // tarda más de 0.15 s en llegar al 90 %
    expect(reach90 / 165).toBeLessThan(0.4); // y menos de 0.4 s
  });

  it("se detiene (sale del ticker) cuando se asienta", () => {
    const { ticker, frame, active } = manualTicker();
    const d = new DampedValues(10, () => {}, ticker);
    d.set([0]);
    d.set([1]);
    expect(active()).toBe(1);
    for (let i = 0; i < 400; i++) frame(16);
    expect(active()).toBe(0);
  });

  it("no da un salto tras una pausa larga (pestaña en segundo plano)", () => {
    const { ticker, frame } = manualTicker();
    let last: readonly number[] = [];
    const d = new DampedValues(10, (v) => (last = [...v]), ticker);
    d.set([0]);
    d.set([1]);
    frame(5000); // 5 s sin frames
    expect(last[0]).toBeLessThan(0.5);
  });

  it("con exclusiveTargets el cambio de ficha es «sale una, entra la otra», sin cortes bruscos", () => {
    const { ticker, frame, active } = manualTicker();
    let last: readonly number[] = [];
    const d = new DampedValues(10, (v) => (last = [...v]), ticker, exclusiveTargets);
    d.set([1, 0]);
    d.set([0, 1]);
    let prev = [...last];
    let maxStep = 0;
    let overlap = 0;
    for (let i = 0; i < 330; i++) {
      frame(1000 / 165);
      maxStep = Math.max(maxStep, ...last.map((v, k) => Math.abs(v - prev[k])));
      if (Math.min(...last) > 0.15) overlap++;
      prev = [...last];
    }
    expect(overlap).toBe(0); // nunca dos visibles
    expect(maxStep).toBeLessThan(0.07); // a 165 fps, < 7 % por frame (salida y entrada suaves)
    expect(last).toEqual([0, 1]); // terminó el cambio
    expect(active()).toBe(0); // y dejó de animar
  });
});
