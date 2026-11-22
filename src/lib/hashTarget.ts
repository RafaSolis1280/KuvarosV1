// BUG-01 · Id del elemento al que apunta el hash de la URL (`/#contacto` → "contacto").
// Sin DOM, para poder testearlo. Devuelve null si no hay hash o está vacío.
export function hashTargetId(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw; // hash mal codificado: se usa tal cual
  }
}

/**
 * Posición de scroll (px) que deja un elemento arriba, debajo de su `scroll-margin-top` (la cabecera
 * fija). Se calcula con el scroll REAL de la ventana: el interno de Lenis puede estar desactualizado
 * justo después de un `ScrollTrigger.refresh()`, que mueve el scroll por su cuenta.
 */
export function anchorScrollTop(rectTop: number, scrollY: number, scrollMarginTop: number): number {
  const margin = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;
  return Math.max(0, Math.round(rectTop + scrollY - margin));
}
