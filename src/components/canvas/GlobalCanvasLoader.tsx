"use client";

// DEV-07 · Carga diferida del Canvas (sin SSR): three/R3F salen del JS inicial y el <h1> del SSR
// sigue siendo el elemento LCP (Manual v2 Paso 18, Paso 22 y riesgo "LCP > 2.5 s").
// `ssr: false` solo es válido dentro de un Client Component (docs Next 16: lazy-loading).
import dynamic from "next/dynamic";

const GlobalCanvas = dynamic(() => import("./GlobalCanvas"), { ssr: false });

export default function GlobalCanvasLoader() {
  return <GlobalCanvas />;
}
