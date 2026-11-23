// DEV-13 · Espera a que el store cumpla una condición (p. ej. que detect-gpu haya decidido el tier), con un
// tiempo máximo: nunca bloquea para siempre. Devuelve true si se cumplió y false si venció el plazo.
import type { StoreApi } from "zustand";

export function waitForStore<T>(store: Pick<StoreApi<T>, "getState" | "subscribe">, predicate: (state: T) => boolean, timeoutMs: number): Promise<boolean> {
  if (predicate(store.getState())) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, timeoutMs);
    const unsubscribe = store.subscribe((state) => {
      if (!predicate(state)) return;
      clearTimeout(timer);
      unsubscribe();
      resolve(true);
    });
  });
}
