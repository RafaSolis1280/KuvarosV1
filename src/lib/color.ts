// DEV-38 · Utilidades de color para lo que se pinta fuera de CSS (canvas 2D), a partir de BRAND_COLORS.

/** "#DDD1B7" + 0.25 → "rgba(221,209,183,0.25)". Acepta #RGB y #RRGGBB. */
export function hexToRgba(hex: string, alpha: number): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Color hex inválido: ${hex}`);
  const n = Number.parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
