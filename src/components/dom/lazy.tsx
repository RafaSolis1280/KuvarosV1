"use client";

// Componentes de cliente que se cargan con dynamic import, fuera del JS inicial (budget de DEV-01,
// `npm run budget`). Solo se descargan si se renderizan.
//
// ⚠ Siempre con `ssr: false`. Con SSR activo, Next 16.4.6 + Turbopack escribe en el HTML un
//   <link rel="preload"> a un chunk que no existe (el manifiesto de carga diferida lista otro nombre):
//   el componente funciona, pero queda un 404 en consola. Medido el 22-11-2026 (DEV-16).
//   Lo que tiene que venir en el HTML del servidor (p. ej. el formulario de contacto) se importa normal.
//
//   - SoundController (DEV-16): solo existe si hay audio en /public/audio. Es un botón a la derecha
//     de la cabecera: aparecer tras la hidratación no mueve nada (CLS 0).
import dynamic from "next/dynamic";

export const LazySoundController = dynamic(() => import("./SoundController"), { ssr: false });
