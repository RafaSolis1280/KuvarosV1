import type { NextConfig } from "next";

/**
 * Ref: Manual v2 Parte II §3 (next.config.ts) y Paso 26 (caché inmutable).
 * Recordatorio: con `immutable`, cada cambio de un asset requiere NOMBRE o CARPETA nuevos
 * (p. ej. `hero_artifact.v2.glb` o `/sequences/hero_explode/v2/`).
 */
const IMMUTABLE_ASSET_DIRS =
  "models|sequences|hdri|draco|basis|benchmarks|audio|fonts|fallback";

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
      {
        source: `/:dir(${IMMUTABLE_ASSET_DIRS})/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
