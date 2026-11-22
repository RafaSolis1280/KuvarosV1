"use client";

// DEV-14 · Partículas de polvo sobre el fondo, dentro del único Canvas (Single-Canvas): por encima del
// shader de fondo (se dibujan después) y por detrás de las secuencias (canvas 2D del DOM, más arriba).
// - Cantidad: gpuPolicy.maxParticles del tier activo (cambia en vivo si el PerformanceMonitor baja de tier).
// - Un solo draw call (THREE.Points). La CPU solo actualiza 4 uniforms por frame, amortiguados con damp()
//   y leídos del store transiente con getState() (Hard Constraints 1 y 3).
// - Con prefers-reduced-motion quedan quietas: tiempo congelado y sin parallax.
// - Al desmontar (o al cambiar la cantidad) se liberan la geometría y el material (Hard Constraint 6).
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";
import { DAMPING } from "@/config/motion";
import { createParticleSystem, type ParticleSystem } from "./shaders/particles";

export default function ParticleField() {
  // La política cambia pocas veces por sesión: OK leerla con el hook
  const count = useExperienceStore((s) => s.gpuPolicy.maxParticles);
  const pointsRef = useRef<THREE.Points>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const time = useRef(0);

  // Crear / liberar según la cantidad del tier
  useEffect(() => {
    const points = pointsRef.current;
    if (!points) return;
    const system = createParticleSystem(count);
    points.geometry = system.geometry;
    points.material = system.material;
    systemRef.current = system;
    return () => {
      systemRef.current = null;
      system.dispose();
    };
  }, [count]);

  useFrame((state, delta) => {
    const system = systemRef.current;
    if (!system) return;
    const u = system.material.uniforms;
    const { pointerNDC, scrollProgress, reducedMotion } = useExperienceStore.getState();
    const motion = reducedMotion ? 0 : 1;
    if (motion) time.current += delta; // con reduced motion el tiempo no avanza: quietas
    u.uTime.value = time.current;
    u.uPixelRatio.value = state.viewport.dpr;
    const pointer = u.uPointer.value as THREE.Vector2;
    pointer.set(
      damp(pointer.x, pointerNDC.x * motion, DAMPING.pointer, delta),
      damp(pointer.y, pointerNDC.y * motion, DAMPING.pointer, delta)
    );
    u.uScroll.value = damp(u.uScroll.value as number, scrollProgress * motion, DAMPING.scrollVelocity, delta);
  });

  return <points ref={pointsRef} frustumCulled={false} renderOrder={0} />;
}
