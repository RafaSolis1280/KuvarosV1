import { describe, expect, it, vi } from "vitest";
import { FrameCache, type DecodedFrame } from "@/lib/sequence/FrameCache";

/** Frame falso que registra si se liberó */
class FakeFrame implements DecodedFrame {
  closed = false;
  constructor(readonly url: string) {}
  close() {
    this.closed = true;
  }
}

/** Cargador controlable: cada petición queda pendiente hasta resolverla a mano */
function controllableLoader() {
  const pending = new Map<string, { resolve: (f: FakeFrame) => void; reject: (e: Error) => void }>();
  const created: FakeFrame[] = [];
  const load = (url: string) =>
    new Promise<FakeFrame>((resolve, reject) => {
      pending.set(url, { resolve, reject });
    });
  const resolve = (url: string) => {
    const frame = new FakeFrame(url);
    created.push(frame);
    pending.get(url)!.resolve(frame);
    pending.delete(url);
  };
  const resolveAll = () => [...pending.keys()].forEach(resolve);
  return { load, resolve, resolveAll, pending, created };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

function setup({ count = 20, radius = 2, center = 0 } = {}) {
  const loader = controllableLoader();
  const state = { radius, center };
  const onReady = vi.fn();
  const cache = new FrameCache<FakeFrame>({
    count,
    url: (i) => `f${i}`,
    radius: () => state.radius,
    center: () => state.center,
    load: loader.load,
    onReady,
  });
  return { cache, loader, state, onReady };
}

describe("FrameCache", () => {
  it("pide solo la ventana [c-R, c+R] y no repite peticiones en vuelo", () => {
    const { cache, loader } = setup({ radius: 2, center: 5 });
    cache.sync(5);
    cache.sync(5);
    expect([...loader.pending.keys()]).toEqual(["f3", "f4", "f5", "f6", "f7"]);
  });

  it("nunca deja más de 2R+1 frames decodificados y libera los que salen de la ventana", async () => {
    const { cache, loader, state } = setup({ radius: 2 });
    for (let c = 0; c < 20; c++) {
      state.center = c;
      cache.sync(c);
      loader.resolveAll();
      await flush();
      expect(cache.size).toBeLessThanOrEqual(2 * 2 + 1);
    }
    const alive = loader.created.filter((f) => !f.closed);
    expect(alive).toHaveLength(cache.size);
    expect(loader.created.filter((f) => f.closed).length).toBeGreaterThan(0);
  });

  it("descarta (y libera) un frame que llega cuando el usuario ya está lejos", async () => {
    const { cache, loader, state, onReady } = setup({ radius: 2, center: 0 });
    cache.sync(0);
    state.center = 15; // el usuario siguió bajando antes de que llegara f0
    loader.resolve("f0");
    await flush();
    expect(cache.get(0)).toBeNull();
    expect(loader.created[0].closed).toBe(true);
    expect(onReady).not.toHaveBeenCalledWith(0);
  });

  it("avisa con onReady cuando un frame de la ventana queda disponible", async () => {
    const { cache, loader, onReady } = setup({ radius: 1, center: 0 });
    cache.sync(0);
    loader.resolve("f1");
    await flush();
    expect(onReady).toHaveBeenCalledWith(1);
    expect(cache.get(1)).not.toBeNull();
  });

  it("nearestLoaded devuelve el frame decodificado más cercano (o -1)", async () => {
    const { cache, loader } = setup({ radius: 2, center: 10 });
    expect(cache.nearestLoaded(10)).toBe(-1);
    cache.sync(10);
    loader.resolve("f12");
    await flush();
    expect(cache.nearestLoaded(10)).toBe(12);
    loader.resolve("f9");
    await flush();
    expect(cache.nearestLoaded(10)).toBe(9);
  });

  it("reset invalida las cargas en vuelo: lo que llega después se libera", async () => {
    const { cache, loader } = setup({ radius: 1, center: 0 });
    cache.sync(0);
    cache.reset(30, (i) => `m${i}`); // cambio de variante (p. ej. desktop → mobile)
    loader.resolve("f0");
    await flush();
    expect(loader.created[0].closed).toBe(true);
    expect(cache.count).toBe(30);
    cache.sync(0);
    expect([...loader.pending.keys()]).toContain("m0");
  });

  it("dispose libera todo lo decodificado", async () => {
    const { cache, loader } = setup({ radius: 1, center: 0 });
    cache.sync(0);
    loader.resolveAll();
    await flush();
    cache.dispose();
    expect(loader.created.every((f) => f.closed)).toBe(true);
  });

  it("un frame que falla no rompe la caché (se usa el más cercano)", async () => {
    const { cache, loader } = setup({ radius: 1, center: 0 });
    cache.sync(0);
    loader.pending.get("f0")!.reject(new Error("404"));
    loader.resolve("f1");
    await flush();
    expect(cache.get(0)).toBeNull();
    expect(cache.nearestLoaded(0)).toBe(1);
  });

  it("el cargador sabe si el frame sigue en la ventana antes de decodificarlo (DEV-26: nunca un bitmap de más)", () => {
    const state = { center: 5 };
    const asked = new Map<string, () => boolean>();
    const cache = new FrameCache<FakeFrame>({
      count: 30,
      url: (i) => `f${i}`,
      radius: () => 2,
      center: () => state.center,
      load: (url, stillNeeded) => {
        asked.set(url, stillNeeded);
        return new Promise<FakeFrame>(() => {}); // la descarga queda en vuelo
      },
    });
    cache.sync(5);
    expect(asked.get("f7")?.()).toBe(true); // dentro de [3, 7]
    state.center = 20; // el usuario se fue lejos mientras se descargaba
    expect(asked.get("f7")?.()).toBe(false); // el cargador no lo decodifica
    cache.reset(30, (i) => `f${i}`);
    state.center = 5;
    expect(asked.get("f5")?.()).toBe(false); // otra generación (caché vaciada): tampoco
  });
});
