// DEV-08 · Paleta oficial de Kuvaro's (Manual de marca, Página 4 · Manuales/MANUAL_MARCA_KUVAROS.md §6.3).
// Fuente única para el código que pinta fuera de CSS (shader WebGL y canvas 2D).
// Los mismos valores viven como tokens de Tailwind en src/app/globals.css (@theme): si cambia uno, cambian los dos.
// Regla 60-30-10: 60 % Negro Profundo (fondo) · 30 % Beige Claro (texto/contraste) · 10 % Amarillo Mostaza (acento/CTA).
export const BRAND_COLORS = {
  /** Negro Profundo · fondo dominante */
  negroProfundo: "#303030",
  /** Beige Claro · texto principal y superficies cálidas */
  beigeClaro: "#DDD1B7",
  /** Amarillo Mostaza · acento, CTA, precios (máx. 10 % de la pieza) */
  amarilloMostaza: "#DDA730",
} as const;
