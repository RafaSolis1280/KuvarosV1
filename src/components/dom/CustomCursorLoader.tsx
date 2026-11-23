"use client";

// DEV-28 · El cursor personalizado (DEV-24) solo sirve con ratón o trackpad y sin prefers-reduced-motion.
// Su código se descarga con dynamic import únicamente en esos casos: en móviles y tablets no viaja.
// La condición se lee con useSyncExternalStore (sin setState en efectos) y se reevalúa si cambia el
// dispositivo de entrada (p. ej. se conecta un ratón a una tablet).
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { CUSTOM_CURSOR } from "@/config/motion";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(CUSTOM_CURSOR.finePointerQuery), window.matchMedia("(prefers-reduced-motion: reduce)")];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

const wantsCustomCursor = () => window.matchMedia(CUSTOM_CURSOR.finePointerQuery).matches && !prefersReducedMotion();

export default function CustomCursorLoader() {
  const enabled = useSyncExternalStore(subscribe, wantsCustomCursor, () => false);
  return enabled ? <CustomCursor /> : null;
}
