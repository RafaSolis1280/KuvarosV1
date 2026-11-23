// DEV-10 · Ref: Manual v2 Parte II §8 (Prompt P4). GLSL estándar de three (ShaderMaterial):
// sin #version ni precision, three los inyecta. Hash sin sin() → estable en GPUs móviles mediump.
// DEV-15: con la macro POSTFX (solo T2/T3) se suma el bloom suave; con GRAIN (además, solo a DPR ≤ 1)
// el grano de película. Sin las macros, esos bloques no existen en el programa compilado.
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { BRAND_COLORS } from "@/config/brand";
import { BACKGROUND_MAX_ACCENT } from "@/config/scene";

export const FluidBackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollVelocity: 0,
    uIntensity: 1,
    uPointer: new THREE.Vector2(0, 0),
    uColorBase: new THREE.Color(BRAND_COLORS.negroProfundo),
    uColorAccent: new THREE.Color(BRAND_COLORS.amarilloMostaza),
    uBloom: 0,
    uGrain: 0,
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
    uniform float uBloom;
    uniform float uGrain;

    // Mezcla máxima de mostaza que puede alcanzar el fondo (veta con el scroll más rápido + brillo del
    // puntero). El contraste del texto (DEV-29) se calculó contra este tope: el acabado no lo supera.
    const float MAX_ACCENT = ${BACKGROUND_MAX_ACCENT.toFixed(6)}; // config/scene.ts (fuente única)

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
      float veinAmp = 0.08 + warp * 0.25;
      float vein    = smoothstep(0.62, 0.68, n + glow) * veinAmp;
    #ifdef POSTFX
      // Bloom: la misma veta con una transición mucho más ancha es su versión desenfocada. Se toma el
      // máximo (no la suma), así la luz se derrama alrededor sin aclarar el centro de la veta.
      float halo    = smoothstep(0.42, 0.74, n + glow) * veinAmp * uBloom;
      vein          = max(vein, halo);
    #endif
      vec3  color   = mix(uColorBase, uColorAccent, (vein + glow * 0.35) * uIntensity);
    #ifdef GRAIN
      // Grano de película: ruido por píxel que cambia cada frame (con reduced motion el tiempo está
      // congelado y queda fijo). Además disimula el banding del degradado oscuro. Nunca supera el tope.
      float grain   = hash12(gl_FragCoord.xy + floor(fract(uTime * 0.37) * 997.0)) - 0.5;
      color         = min(color + grain * uGrain, mix(uColorBase, uColorAccent, MAX_ACCENT * uIntensity));
    #endif
      gl_FragColor  = vec4(max(color, 0.0), 1.0);
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
