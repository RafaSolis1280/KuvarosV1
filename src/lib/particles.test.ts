import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { mulberry32, particleSeeds } from "./particles";
import { backgroundCeilingRGB, createParticleSystem } from "@/components/canvas/shaders/particles";
import { GPU_STRICT_POLICIES } from "@/config/gpu-policy";

describe("particleSeeds (DEV-14)", () => {
  it("3 valores por partícula, todos en [0, 1)", () => {
    const s = particleSeeds(500, 7);
    expect(s.length).toBe(1500);
    expect(Math.min(...s)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...s)).toBeLessThan(1);
  });

  it("deterministas: misma semilla → misma nube; un tier con menos usa las primeras de la misma lista", () => {
    expect(particleSeeds(100, 1729)).toEqual(particleSeeds(100, 1729));
    expect(particleSeeds(2500, 1729).slice(0, 1500)).toEqual(particleSeeds(500, 1729));
  });

  it("repartidas por toda la pantalla (sin huecos grandes)", () => {
    const rand = mulberry32(1729);
    const buckets = new Array(10).fill(0);
    for (let i = 0; i < 8000; i++) buckets[Math.floor(rand() * 10)]++;
    for (const b of buckets) expect(b).toBeGreaterThan(650); // ~800 por franja
  });
});

describe("createParticleSystem", () => {
  it("crea tantos vértices como maxParticles del tier (un solo Points = un draw call)", () => {
    for (const policy of Object.values(GPU_STRICT_POLICIES)) {
      const ps = createParticleSystem(policy.maxParticles);
      expect(ps.geometry.getAttribute("aSeed").count).toBe(policy.maxParticles);
      expect(ps.geometry.getAttribute("position").count).toBe(policy.maxParticles);
      ps.dispose();
    }
  });

  it("el color es el tope de brillo del fondo de DEV-29 (#584B30) y se mezcla con él: nunca lo supera", () => {
    const [r, g, b] = backgroundCeilingRGB();
    expect([r, g, b].map((v) => Math.round(v * 255))).toEqual([0x58, 0x4b, 0x30]);
    const ps = createParticleSystem(10);
    const c = ps.material.uniforms.uColor.value as THREE.Color;
    expect([c.r, c.g, c.b]).toEqual([r, g, b]); // sin conversión de espacio de color
    expect(ps.material.blending).toBe(THREE.NormalBlending);
    ps.dispose();
  });

  it("dispose libera la geometría y el material (Hard Constraint 6)", () => {
    const ps = createParticleSystem(10);
    const geo = vi.fn();
    const mat = vi.fn();
    ps.geometry.addEventListener("dispose", geo);
    ps.material.addEventListener("dispose", mat);
    ps.dispose();
    expect(geo).toHaveBeenCalledTimes(1);
    expect(mat).toHaveBeenCalledTimes(1);
  });
});
