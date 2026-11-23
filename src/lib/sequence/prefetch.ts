// DEV-13 · Descarga de frames compartida entre el preloader y la ventana deslizante (FrameCache).
// - El preloader descarga sin decodificar: el frame queda en el caché HTTP (los frames son `immutable`,
//   DEV-34) y la memoria de GPU no cambia (solo se decodifica la ventana 2R+1, DEV-26).
// - Si los dos piden el mismo frame a la vez, comparten la misma descarga (en cualquier orden): ningún
//   frame viaja dos veces. Al terminar, la entrada se borra (no se retiene el archivo en memoria); una
//   petición posterior la sirve el caché HTTP.
type Fetcher = (url: string, init?: RequestInit & { priority?: "high" | "low" | "auto" }) => Promise<Response>;

const inFlight = new Map<string, Promise<Blob | undefined>>();

/** Descarga `url` (o se suma a la descarga en curso). Nunca rechaza: si falta, devuelve undefined. */
export function fetchFrame(url: string, priority: "high" | "low" = "low", fetcher: Fetcher = fetch): Promise<Blob | undefined> {
  let pending = inFlight.get(url);
  if (!pending) {
    pending = fetcher(url, { priority })
      .then((res) => (res.ok ? res.blob() : undefined))
      .catch(() => undefined)
      .finally(() => inFlight.delete(url));
    inFlight.set(url, pending);
  }
  return pending;
}

/** Precarga sin quedarse con el archivo (va al caché HTTP) */
export function prefetchFrame(url: string, priority: "high" | "low" = "low", fetcher: Fetcher = fetch): Promise<void> {
  return fetchFrame(url, priority, fetcher).then(() => undefined);
}

/** ¿Hay una descarga en curso de `url`? (para los tests) */
export function isFetching(url: string): boolean {
  return inFlight.has(url);
}

/** Para los tests */
export function resetPrefetch(): void {
  inFlight.clear();
}

/**
 * Descarga una lista en orden con `concurrency` descargas a la vez. `shouldStop` permite cortarla
 * (p. ej. al desmontar). Devuelve cuántas terminó.
 */
export async function prefetchQueue(
  urls: readonly string[],
  { concurrency, priority = "low", shouldStop = () => false, fetcher = fetch, onEach }: {
    concurrency: number;
    priority?: "high" | "low";
    shouldStop?: () => boolean;
    fetcher?: Fetcher;
    onEach?: (url: string) => void;
  }
): Promise<number> {
  let next = 0;
  let done = 0;
  const worker = async () => {
    while (next < urls.length && !shouldStop()) {
      const url = urls[next++];
      await prefetchFrame(url, priority, fetcher);
      done++;
      onEach?.(url);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return done;
}
