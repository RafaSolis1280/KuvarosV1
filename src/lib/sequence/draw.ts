// DEV-38 · Dibujo de la secuencia en el canvas 2D. La geometría es una función pura (testeable);
// las funciones de dibujo solo la aplican.
import { SEQUENCE_FRAMING } from "@/config/sequences";

export interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
  /** true si hay que pintar el fondo antes (encuadre vertical con franjas) */
  letterbox: boolean;
}

/**
 * Dónde dibujar una imagen de `imageW×imageH` en un canvas de `canvasW×canvasH`:
 * - Normal: "cover" centrado (llena el canvas, recorta lo que sobra).
 * - Viewport vertical con master horizontal: se muestra la franja central del master a lo ancho
 *   y la imagen se sube para dejar sitio a las fichas (ver SEQUENCE_FRAMING).
 */
export function computeFrameRect(
  canvasW: number,
  canvasH: number,
  imageW: number,
  imageH: number,
  framing: typeof SEQUENCE_FRAMING = SEQUENCE_FRAMING
): FrameRect {
  if (canvasW / canvasH < framing.portraitMaxAspect && imageW / imageH > 1) {
    const s = canvasW / (imageW * framing.portraitVisibleWidth);
    const h = imageH * s;
    return {
      x: (canvasW - imageW * s) / 2,
      y: Math.max(0, (canvasH - h) * framing.portraitTopOffset),
      width: imageW * s,
      height: h,
      letterbox: true,
    };
  }
  const s = Math.max(canvasW / imageW, canvasH / imageH);
  return {
    x: (canvasW - imageW * s) / 2,
    y: (canvasH - imageH * s) / 2,
    width: imageW * s,
    height: imageH * s,
    letterbox: false,
  };
}

/** Dibuja un frame con el encuadre de `computeFrameRect` */
export function drawFrame(ctx: CanvasRenderingContext2D, image: ImageBitmap): void {
  const { width: cw, height: ch } = ctx.canvas;
  const r = computeFrameRect(cw, ch, image.width, image.height);
  if (r.letterbox) {
    ctx.fillStyle = SEQUENCE_FRAMING.letterboxColor;
    ctx.fillRect(0, 0, cw, ch);
  }
  ctx.drawImage(image, r.x, r.y, r.width, r.height);
}

export interface FallbackStyle {
  background: string;
  accent: string;
  /** Color de los anillos secundarios */
  ring: string;
  /** Texto de la etiqueta (p. ej. el id de la secuencia) */
  label: string;
}

/**
 * Animación procedural de respaldo cuando falta el video (Hard Constraint 4): capas apiladas que
 * se separan con el progreso, como placeholder de la hamburguesa desarmándose.
 */
export function drawFallback(ctx: CanvasRenderingContext2D, index: number, count: number, style: FallbackStyle): void {
  const { width: w, height: h } = ctx.canvas;
  const p = index / Math.max(1, count - 1);
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, w, h);
  for (let k = 0; k < 5; k++) {
    const off = (k - 2) * p * h * 0.12;
    ctx.strokeStyle = k === 2 ? style.accent : style.ring;
    ctx.lineWidth = k === 2 ? 3 : 1.5;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2 + off, w * 0.16, h * 0.045, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = style.accent;
  ctx.font = `bold ${Math.max(14, Math.floor(w * 0.012))}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`[FALLBACK] ${style.label.toUpperCase()} · FRAME ${index + 1}/${count}`, w / 2, h * 0.88);
}
