import { afterEach, describe, expect, it, vi } from "vitest";
import { preloadPlan } from "./plan";
import { fetchFrame, isFetching, prefetchFrame, prefetchQueue, resetPrefetch } from "@/lib/sequence/prefetch";

const clips = [
  { basePath: "/sequences/a", totalFrames: { desktop: 10, mobile: 10 } },
  { basePath: "/sequences/b", totalFrames: { desktop: 8, mobile: 8 } },
];

describe("preloadPlan (DEV-13)", () => {
  it("el camino crítico son los primeros N frames de la historia, en la variante pedida", () => {
    const { critical } = preloadPlan(clips, "mobile", 3);
    expect(critical).toEqual([
      "/sequences/a/mobile/frame_0001.webp",
      "/sequences/a/mobile/frame_0002.webp",
      "/sequences/a/mobile/frame_0003.webp",
    ]);
  });

  it("en segundo plano va primero el arranque del clip siguiente y luego el resto, sin repetir", () => {
    const { critical, stream } = preloadPlan(clips, "desktop", 3);
    expect(stream.slice(0, 3)).toEqual([
      "/sequences/b/desktop/frame_0001.webp",
      "/sequences/b/desktop/frame_0002.webp",
      "/sequences/b/desktop/frame_0003.webp",
    ]);
    expect(stream[3]).toBe("/sequences/a/desktop/frame_0004.webp");
    expect(new Set([...critical, ...stream]).size).toBe(18); // todos los frames, una sola vez
    expect(critical.length + stream.length).toBe(18);
  });
});

describe("prefetchFrame / prefetchQueue", () => {
  afterEach(() => resetPrefetch());

  const okFetch = () => vi.fn(async () => new Response("x", { status: 200 }));

  it("el preloader y la ventana deslizante comparten la descarga en curso (en cualquier orden)", async () => {
    const fetcher = okFetch();
    const precarga = prefetchFrame("/f1.webp", "low", fetcher);
    const ventana = fetchFrame("/f1.webp", "high", fetcher); // la ventana llega mientras se precarga
    expect(isFetching("/f1.webp")).toBe(true);
    const [, blob] = await Promise.all([precarga, ventana]);
    expect(blob).toBeInstanceOf(Blob);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(isFetching("/f1.webp")).toBe(false); // terminada: no se retiene en memoria
  });

  it("un frame que falta (404 o red caída) no rechaza", async () => {
    await expect(fetchFrame("/404.webp", "high", async () => new Response("", { status: 404 }))).resolves.toBeUndefined();
    await expect(prefetchFrame("/404b.webp", "low", async () => new Response("", { status: 404 }))).resolves.toBeUndefined();
    await expect(prefetchFrame("/caida.webp", "low", async () => Promise.reject(new Error("red")))).resolves.toBeUndefined();
  });

  it("la cola respeta la concurrencia y se puede cortar", async () => {
    let active = 0;
    let peak = 0;
    const fetcher = vi.fn(async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 5));
      active--;
      return new Response("x");
    });
    const urls = Array.from({ length: 9 }, (_, i) => `/q${i}.webp`);
    expect(await prefetchQueue(urls, { concurrency: 3, fetcher })).toBe(9);
    expect(peak).toBe(3);

    let stop = false;
    const done = await prefetchQueue(Array.from({ length: 9 }, (_, i) => `/s${i}.webp`), {
      concurrency: 1,
      fetcher,
      onEach: () => (stop = true),
      shouldStop: () => stop,
    });
    expect(done).toBe(1);
  });
});
