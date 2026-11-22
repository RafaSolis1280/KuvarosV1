// DEV-14 · Semillas de las partículas (sin three ni DOM: testeable). Cada partícula tiene 3 valores en
// [0, 1): x, y de partida y profundidad. PRNG determinista (mulberry32): la misma nube en cada visita y en
// cada tier (un tier con menos partículas usa las primeras de la misma lista).
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function particleSeeds(count: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(Math.max(0, Math.floor(count)) * 3);
  for (let i = 0; i < out.length; i++) out[i] = rand();
  return out;
}
