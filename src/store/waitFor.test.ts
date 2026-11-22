import { afterEach, describe, expect, it, vi } from "vitest";
import { createStore } from "zustand/vanilla";
import { waitForStore } from "./waitFor";

afterEach(() => vi.useRealTimers());

describe("waitForStore (DEV-13)", () => {
  it("resuelve en el acto si la condición ya se cumple", async () => {
    const store = createStore(() => ({ ready: true }));
    await expect(waitForStore(store, (s) => s.ready, 1000)).resolves.toBe(true);
  });

  it("resuelve true cuando el estado cambia antes del plazo", async () => {
    vi.useFakeTimers();
    const store = createStore(() => ({ ready: false }));
    const p = waitForStore(store, (s) => s.ready, 1000);
    store.setState({ ready: true });
    await expect(p).resolves.toBe(true);
  });

  it("resuelve false al vencer el plazo (nunca bloquea)", async () => {
    vi.useFakeTimers();
    const store = createStore(() => ({ ready: false }));
    const p = waitForStore(store, (s) => s.ready, 1000);
    vi.advanceTimersByTime(1000);
    await expect(p).resolves.toBe(false);
  });
});
