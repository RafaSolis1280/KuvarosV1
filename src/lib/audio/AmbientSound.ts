// DEV-16 · Motor del sonido ambiente con Web Audio (sin dependencias). Se carga con dynamic import en el
// primer clic del visitante: no forma parte del JS inicial (budget de DEV-01).
// Grafo: loop (AudioBufferSourceNode) → low-pass (BiquadFilterNode) → volumen (GainNode) → salida.
import { SOUND } from "@/config/sound";

export class AmbientSound {
  private readonly filter: BiquadFilterNode;
  private readonly gain: GainNode;
  private source: AudioBufferSourceNode | null = null;

  /** El AudioContext se crea fuera, dentro del gesto del usuario (política de autoplay) */
  constructor(private readonly ctx: AudioContext) {
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = SOUND.cutoffRestHz;
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.filter.connect(this.gain).connect(ctx.destination);
  }

  /** Descarga, decodifica y arranca el loop (en silencio: el volumen lo pone `setOn`) */
  async load(url: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`audio ${res.status}`);
    const buffer = await this.ctx.decodeAudioData(await res.arrayBuffer());
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.filter);
    source.start();
    this.source = source;
  }

  /** Fundido de entrada o de salida */
  setOn(on: boolean): void {
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(on ? SOUND.volume : 0, now, SOUND.fadeSeconds / 3);
  }

  /** Corte del low-pass (ya amortiguado con damp() por quien lo llama) */
  setCutoff(hz: number): void {
    this.filter.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.03);
  }

  get cutoff(): number {
    return this.filter.frequency.value;
  }

  dispose(): void {
    try {
      this.source?.stop();
    } catch {
      /* ya estaba detenido */
    }
    this.source?.disconnect();
    this.filter.disconnect();
    this.gain.disconnect();
  }
}
