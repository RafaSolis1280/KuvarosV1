import type { NextConfig } from "next";
import {
  CACHE_CONTROL,
  UNVERSIONED_ASSET_DIRS,
  VERSIONED_ASSET_DIRS,
  securityHeaders,
} from "./src/config/http-headers";

/**
 * Ref: Manual v2 Parte II §3 (next.config.ts) y Paso 26 (caché inmutable).
 * Recordatorio: con `immutable`, cada cambio de un asset requiere NOMBRE o CARPETA nuevos
 * (p. ej. `/sequences/hero_explode_v2/`). Qué carpeta va en cada grupo: src/config/http-headers.ts (DEV-34).
 */
const headerEnv = {
  isDev: process.env.NODE_ENV === "development",
  isHttpsDeploy: Boolean(process.env.VERCEL),
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // Solo si se importan archivos .glsl externos (por defecto: template strings).
      // "*.{glsl,vert,frag}": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
  async headers() {
    return [
      // DEV-34 · Seguridad en todas las rutas
      { source: "/:path*", headers: securityHeaders(headerEnv) },
      // Caché: un año sin revalidar solo para lo versionado por nombre o carpeta
      {
        source: `/:dir(${VERSIONED_ASSET_DIRS.join("|")})/:path*`,
        headers: [{ key: "Cache-Control", value: CACHE_CONTROL.immutable }],
      },
      // Lo que cambia sin cambiar de nombre (benchmarks de detect-gpu): caché corta que se revalida
      {
        source: `/:dir(${UNVERSIONED_ASSET_DIRS.join("|")})/:path*`,
        headers: [{ key: "Cache-Control", value: CACHE_CONTROL.revalidate }],
      },
    ];
  },
};

export default nextConfig;
