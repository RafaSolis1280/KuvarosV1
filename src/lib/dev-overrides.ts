// DEV-27 · Modo de desarrollo para probar cada tier y el fallback sin WebGL (Manual Fase 7).
//   ?tier=1|2|3  fija la política de GPU y apaga el PerformanceMonitor (no la cambia por FPS).
//   ?nowebgl     el navegador "no tiene" WebGL: getContext("webgl" | "webgl2") devuelve null, así se
//                recorre el camino REAL (detect-gpu → tier 0 → sin Canvas WebGL), no un atajo.
// Solo en desarrollo: en el build de producción DEV_OVERRIDES_ENABLED es false y el bundler elimina
// el código, así un visitante no puede cambiar el tier desde la URL.
import type { GPUTierLevel } from "@/config/gpu-policy";

export const DEV_OVERRIDES_ENABLED = process.env.NODE_ENV !== "production";

export interface DevOverrides {
  /** Tier forzado, o null para usar el detectado */
  tier: GPUTierLevel | null;
  /** Simular un navegador sin WebGL */
  noWebGL: boolean;
}

/** Lee los overrides de la query string (`?tier=2&nowebgl`). Sin DOM, para poder testearlo. */
export function parseDevOverrides(search: string): DevOverrides {
  const params = new URLSearchParams(search);
  const rawTier = params.get("tier");
  const tier = rawTier === "1" || rawTier === "2" || rawTier === "3" ? (Number(rawTier) as GPUTierLevel) : null;
  const rawNoWebGL = params.get("nowebgl");
  const noWebGL = rawNoWebGL !== null && rawNoWebGL !== "0" && rawNoWebGL !== "false";
  return { tier, noWebGL };
}

/** Overrides activos de la URL actual, o null si no hay ninguno (o si es el build de producción) */
export function readDevOverrides(): DevOverrides | null {
  if (!DEV_OVERRIDES_ENABLED || typeof window === "undefined") return null;
  const overrides = parseDevOverrides(window.location.search);
  return overrides.tier !== null || overrides.noWebGL ? overrides : null;
}

type GetContext = (this: HTMLCanvasElement, contextId: string, ...rest: unknown[]) => unknown;

/**
 * Hace que la página no pueda crear contextos WebGL (los 2D siguen funcionando: las secuencias los
 * usan). Devuelve la función que lo deshace.
 */
export function disableWebGL(proto: Pick<HTMLCanvasElement, "getContext"> = HTMLCanvasElement.prototype): () => void {
  const original = proto.getContext;
  const blocked: GetContext = function (contextId, ...rest) {
    if (/webgl/i.test(contextId)) return null;
    return (original as unknown as GetContext).call(this, contextId, ...rest);
  };
  proto.getContext = blocked as unknown as typeof proto.getContext;
  return () => {
    proto.getContext = original;
  };
}
