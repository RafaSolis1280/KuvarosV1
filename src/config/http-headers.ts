// DEV-34 · Cabeceras HTTP del sitio: seguridad (CSP, HSTS y compañía) y caché de /public.
// Las usa next.config.ts (headers()). Sin imports con alias "@/": next.config carga este archivo
// directamente. Ref: docs de Next 16 «Content Security Policy» (sección «Without Nonces»).

export interface HeaderEnv {
  /** `next dev`: HMR por WebSocket y eval de React Refresh */
  isDev: boolean;
  /** Build en Vercel (siempre HTTPS): ahí se pide además subir a HTTPS cualquier recurso http:// */
  isHttpsDeploy: boolean;
}

/**
 * Content-Security-Policy sin nonce. La página es estática (prerender + Partial Prerendering) y un nonce
 * obligaría a renderizarla en cada visita; por eso los scripts inline de Next (hidratación y el JSON-LD)
 * van con 'unsafe-inline'. Todo lo demás se limita a este mismo origen: el sitio no carga nada de
 * terceros (fuentes con next/font, frames, benchmarks y el formulario son del propio dominio).
 * Al conectar analítica o un servicio de envío por el navegador (DEV-33 / DEV-25) hay que sumar su
 * dominio aquí, en la directiva que corresponda.
 */
export function contentSecurityPolicy({ isDev, isHttpsDeploy }: HeaderEnv): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(isDev ? ["ws:", "wss:"] : [])],
    "media-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (isHttpsDeploy) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

/** Cabeceras de seguridad para todas las rutas */
export function securityHeaders(env: HeaderEnv): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(env) },
    // 2 años. Sin `preload`: entrar en la lista de precarga de los navegadores es difícil de deshacer y
    // es una decisión del dueño del dominio (DEV-34, con el cliente).
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}

/**
 * Carpetas de /public versionadas por convención: si un archivo cambia, se publica con NOMBRE o CARPETA
 * nuevos (p. ej. `/sequences/hero_explode_v2/`). Solo ellas pueden usar `immutable` (un año sin volver
 * a preguntar al servidor).
 */
export const VERSIONED_ASSET_DIRS = ["sequences", "fallback", "photos", "audio", "fonts"] as const;

/**
 * Carpetas que cambian de contenido SIN cambiar de nombre: los benchmarks de detect-gpu se copian desde
 * node_modules en cada `npm install` (postinstall) y se actualizan con la dependencia. Caché corta que se
 * revalida (304 si no cambiaron).
 */
export const UNVERSIONED_ASSET_DIRS = ["benchmarks"] as const;

export const CACHE_CONTROL = {
  immutable: "public, max-age=31536000, immutable",
  revalidate: "public, max-age=86400, stale-while-revalidate=604800",
} as const;
