// Preferencia del sistema «reducir movimiento» (WCAG 2.3.3). Se consulta directamente al navegador
// porque los efectos de los componentes hijos corren antes de que SmoothScrollProvider la guarde en el store.
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
