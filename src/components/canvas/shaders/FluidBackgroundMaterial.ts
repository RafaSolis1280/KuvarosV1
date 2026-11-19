// DEV-10 · Ref: Manual v2 Parte II §8 (Prompt P4). GLSL estándar de three (ShaderMaterial):
// sin #version ni precision, three los inyecta. Hash sin sin() → estable en GPUs móviles mediump.
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

export const FluidBackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollVelocity: 0,
    uIntensity: 1,
    uPointer: new THREE.Vector2(0, 0),
    uColorBase: new THREE.Color("#0A0A0A"),
    uColorAccent: new THREE.Color("#FFD645"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0); // quad a pantalla completa (plane 2x2)
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uIntensity;
    uniform vec2  uPointer;
    uniform vec3  uColorBase;
    uniform vec3  uColorAccent;

    // Hash sin sin() (Dave Hoskins)
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float valueNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i),                  hash12(i + vec2(1.0, 0.0)), u.x),
                 mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2  mouseUV = uPointer * 0.5 + 0.5;
      float dist    = distance(vUv, mouseUV);
      float warp    = clamp(abs(uScrollVelocity) * 0.015, 0.0, 0.35);
      float n       = valueNoise(vUv * 4.5 + vec2(uTime * 0.12, uTime * 0.08 + warp));
      float glow    = smoothstep(0.42, 0.0, dist) * 0.18;
      float vein    = smoothstep(0.62, 0.68, n + glow) * (0.08 + warp * 0.25);
      vec3  color   = mix(uColorBase, uColorAccent, (vein + glow * 0.35) * uIntensity);
      gl_FragColor  = vec4(color, 1.0);
    }
  `
);

extend({ FluidBackgroundMaterial });

// Tipado JSX para R3F v9 (evita @ts-expect-error)
declare module "@react-three/fiber" {
  interface ThreeElements {
    fluidBackgroundMaterial: ThreeElement<typeof FluidBackgroundMaterial>;
  }
}
