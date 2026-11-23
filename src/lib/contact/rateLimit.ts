// DEV-25 · Límite de envíos por clave (IP) con ventana deslizante, en memoria.
// En Vercel cada instancia tiene su propia memoria: frena ráfagas de un mismo visitante, que es lo que pide
// el criterio. Para un límite global entre instancias hace falta un almacén compartido (p. ej. Upstash),
// que es una dependencia nueva (Rafael).

export interface RateLimitResult {
  allowed: boolean;
  /** Segundos hasta que se libera el próximo envío (0 si está permitido) */
  retryAfterSec: number;
}

export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()): RateLimitResult {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    // Limpieza: claves sin envíos recientes no ocupan memoria
    for (const [k, times] of hits) if (k !== key && times.every((t) => now - t >= windowMs)) hits.delete(k);

    if (recent.length >= max) {
      hits.set(key, recent);
      return { allowed: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
    }
    recent.push(now);
    hits.set(key, recent);
    return { allowed: true, retryAfterSec: 0 };
  };
}
