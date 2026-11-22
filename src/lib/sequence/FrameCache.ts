// DEV-38 · Caché de frames con ventana deslizante (extraída de ImageSequenceCanvas, DEV-09).
// Solo [f-R, f+R] quedan decodificados como ImageBitmap; el resto se libera con close() (Hard Constraint 6).
// No conoce React, el DOM ni GSAP: recibe el cargador y los callbacks, así se puede testear.
import { windowBounds } from "@/lib/sequence/frames";
import { fetchFrame } from "@/lib/sequence/prefetch";

/** Lo mínimo que la caché necesita de un frame decodificado (ImageBitmap lo cumple) */
export interface DecodedFrame {
  close(): void;
}

export interface FrameCacheOptions<T extends DecodedFrame> {
  /** Número de frames de la secuencia */
  count: number;
  /** Ruta del frame i (base 0) */
  url: (index: number) => string;
  /** Radio R vigente (se consulta en cada uso: puede cambiar con el tier) */
  radius: () => number;
  /** Frame que se está mostrando ahora (para descartar cargas que llegan tarde) */
  center: () => number;
  /** Descarga y decodifica un frame */
  load: (url: string) => Promise<T>;
  /** Se llama cuando un frame queda disponible */
  onReady?: (index: number) => void;
}

/**
 * Cargador por defecto: descarga + createImageBitmap (decodifica fuera del hilo principal).
 * DEV-13: la descarga es compartida con el preloader (lib/sequence/prefetch): un frame nunca viaja dos veces.
 */
export async function loadImageBitmap(url: string): Promise<ImageBitmap> {
  const blob = await fetchFrame(url, "high");
  if (!blob) throw new Error(`frame no disponible: ${url}`);
  return createImageBitmap(blob);
}

export class FrameCache<T extends DecodedFrame = ImageBitmap> {
  private frames: (T | null)[];
  private loading: boolean[];
  /** Invalida las cargas en vuelo al vaciar la caché (cambio de variante o desmontaje) */
  private generation = 0;

  constructor(private readonly opts: FrameCacheOptions<T>) {
    this.frames = new Array(opts.count).fill(null);
    this.loading = new Array(opts.count).fill(false);
  }

  get count(): number {
    return this.frames.length;
  }

  get(index: number): T | null {
    return this.frames[index] ?? null;
  }

  /** Cuántos frames hay decodificados ahora (para auditar la regla 2R+1) */
  get size(): number {
    return this.frames.reduce((n, f) => (f ? n + 1 : n), 0);
  }

  /** Índice decodificado más cercano a `index` (evita un canvas en blanco mientras se decodifica), o -1 */
  nearestLoaded(index: number): number {
    for (let d = 0; d < this.frames.length; d++) {
      if (this.frames[index - d]) return index - d;
      if (this.frames[index + d]) return index + d;
    }
    return -1;
  }

  /** Libera lo que quedó fuera de la ventana alrededor de `center` y pide lo que falta dentro */
  sync(center: number): void {
    const { min, max } = windowBounds(center, this.opts.radius(), this.frames.length);

    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      if ((i < min || i > max) && frame) {
        frame.close();
        this.frames[i] = null;
      }
    }

    for (let i = min; i <= max; i++) {
      if (this.frames[i] || this.loading[i]) continue;
      this.request(i);
    }
  }

  /** Vacía la caché (cierra todo) y la prepara para otra secuencia o variante */
  reset(count: number, url: FrameCacheOptions<T>["url"]): void {
    this.dispose();
    this.opts.count = count;
    this.opts.url = url;
    this.frames = new Array(count).fill(null);
    this.loading = new Array(count).fill(false);
  }

  /** Cierra todos los frames e invalida las cargas en vuelo */
  dispose(): void {
    this.generation++;
    this.frames.forEach((f) => f?.close());
    this.frames = [];
    this.loading = [];
  }

  private request(index: number): void {
    this.loading[index] = true;
    const gen = this.generation;
    this.opts
      .load(this.opts.url(index))
      .then((frame) => {
        // Llegó tarde: la caché se vació o el usuario ya está lejos de este frame
        if (gen !== this.generation || Math.abs(index - this.opts.center()) > this.opts.radius()) {
          frame.close();
          return;
        }
        this.frames[index] = frame;
        this.opts.onReady?.(index);
      })
      .catch(() => {
        /* frame aislado faltante: se dibuja el más cercano */
      })
      .finally(() => {
        if (gen === this.generation) this.loading[index] = false;
      });
  }
}
