// DEV-40 · Valores que siguen a su objetivo con amortiguación en el TIEMPO (damp, Hard Constraint 3).
// Lo usan los overlays del video: el scroll fija hacia dónde va cada opacidad y esto la lleva hasta ahí
// a velocidad acotada, así una ficha nunca aparece de un frame a otro aunque la rueda salte 500 px.
// Se mueve con un ticker (gsap.ticker por defecto: un solo reloj) solo mientras hay algo por asentar.
import { damp } from "@/lib/math";

export interface Ticker {
  add(callback: (time: number, deltaMs: number) => void): void;
  remove(callback: (time: number, deltaMs: number) => void): void;
}

/** Diferencia por debajo de la cual un valor se da por asentado */
const SETTLED = 1e-3;
/** Paso máximo considerado (s): tras una pestaña en segundo plano no se salta de golpe */
const MAX_STEP = 1 / 20;

/**
 * Ajusta los objetivos según lo que se ve ahora (p. ej. que una ficha espere a que la anterior termine
 * de irse). Se evalúa en cada frame.
 */
export type Constrain = (desired: readonly number[], current: readonly number[]) => number[];

export class DampedValues {
  private current: number[] | null = null;
  private desired: number[] = [];
  private ticking = false;

  constructor(
    private readonly lambda: number,
    private readonly onUpdate: (values: readonly number[]) => void,
    private readonly ticker: Ticker,
    private readonly constrain?: Constrain
  ) {}

  /** Nuevos objetivos. La primera vez se aplican al instante (no hay desde dónde animar). */
  set(targets: readonly number[]): void {
    this.desired = [...targets];
    if (!this.current || this.current.length !== targets.length) {
      this.current = this.targetFor(this.desired);
      this.onUpdate(this.current);
      return;
    }
    if (!this.ticking) {
      this.ticking = true;
      this.ticker.add(this.tick);
    }
  }

  dispose(): void {
    this.ticker.remove(this.tick);
    this.ticking = false;
  }

  private targetFor(current: readonly number[]): number[] {
    return this.constrain ? this.constrain(this.desired, current) : [...this.desired];
  }

  private tick = (_time: number, deltaMs: number): void => {
    if (!this.current) return;
    const dt = Math.min(MAX_STEP, Math.max(0, deltaMs / 1000));
    const target = this.targetFor(this.current);
    // Asentado = llegó a su objetivo y ese objetivo ya no está retenido por `constrain`
    let settled = true;
    for (let i = 0; i < this.current.length; i++) {
      const next = damp(this.current[i], target[i], this.lambda, dt);
      if (Math.abs(next - target[i]) < SETTLED) {
        this.current[i] = target[i];
      } else {
        this.current[i] = next;
        settled = false;
      }
      if (target[i] !== this.desired[i]) settled = false;
    }
    this.onUpdate(this.current);
    if (settled) this.dispose();
  };
}
