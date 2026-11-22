// DEV-14 · Sistema de partículas en un solo draw call (THREE.Points + ShaderMaterial). Las posiciones no
// se recalculan en la CPU: el vertex shader las mueve con el tiempo, el puntero y el scroll (uniforms).
// GLSL estándar de three (sin #version ni precision).
// Color: cada punto se mezcla con el fondo (NormalBlending) hacia el tope de brillo del fondo
// (BACKGROUND_MAX_ACCENT, ≈ #584B30): como es una mezcla, el resultado nunca pasa de ese tope, que es el
// fondo contra el que DEV-29 calculó el peor contraste del texto.
// Ojo con el espacio de color: los shaders propios escriben el valor tal cual (sin pasar de lineal a
// sRGB), así que el color se da en los valores que se ven en pantalla (`backgroundCeilingRGB`).
import * as THREE from "three";
import { BRAND_COLORS } from "@/config/brand";
import { BACKGROUND_MAX_ACCENT, PARTICLES } from "@/config/scene";
import { particleSeeds } from "@/lib/particles";

const vertexShader = /* glsl */ `
  attribute vec3 aSeed;           // x, y de partida y profundidad, en [0, 1)
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2  uPointer;         // ya amortiguado (damp) y en 0 con reduced motion
  uniform float uScroll;          // progreso del scroll 0-1, amortiguado
  varying float vAlpha;

  void main() {
    float depth = aSeed.z;
    float drift = mix(${PARTICLES.driftFar.toFixed(5)}, ${PARTICLES.driftNear.toFixed(5)}, depth);
    // Suben lentamente (y reaparecen abajo); las cercanas se mueven más con el puntero y el scroll
    float y = fract(aSeed.y + uTime * drift + uScroll * ${PARTICLES.scrollParallax.toFixed(3)} * depth);
    vec2 p = vec2(aSeed.x, y) * 2.2 - 1.1;
    p.x += sin(uTime * 0.3 + aSeed.y * 40.0) * 0.01 * depth;
    p += uPointer * ${PARTICLES.pointerParallax.toFixed(4)} * depth;
    gl_Position = vec4(p, 0.0, 1.0);
    gl_PointSize = ${PARTICLES.sizePx.toFixed(2)} * mix(0.6, 1.6, depth) * uPixelRatio;
    float twinkle = 0.7 + 0.3 * sin(uTime * 0.8 + aSeed.x * 50.0);
    vAlpha = mix(${PARTICLES.alphaFar.toFixed(3)}, ${PARTICLES.alphaNear.toFixed(3)}, depth) * twinkle;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Punto redondo con borde suave
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/** Tope de brillo del fondo en los valores que se ven en pantalla (0-1): mezcla de los hex de la marca */
export function backgroundCeilingRGB(): [number, number, number] {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const base = hex(BRAND_COLORS.negroProfundo);
  const accent = hex(BRAND_COLORS.amarilloMostaza);
  return base.map((v, i) => v + (accent[i] - v) * BACKGROUND_MAX_ACCENT) as [number, number, number];
}

export interface ParticleSystem {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  /** Libera la geometría y el material de la GPU (Hard Constraint 6) */
  dispose: () => void;
}

export function createParticleSystem(count: number): ParticleSystem {
  const geometry = new THREE.BufferGeometry();
  const seeds = particleSeeds(count, PARTICLES.seed);
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
  // Posición de relleno (three la necesita para contar vértices); la real la calcula el shader
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  const [r, g, b] = backgroundCeilingRGB();
  // LinearSRGBColorSpace = "no convertir": el shader escribe estos valores tal cual y se ven así
  const color = new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uColor: { value: color },
    },
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
    depthTest: false,
  });

  return {
    geometry,
    material,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
