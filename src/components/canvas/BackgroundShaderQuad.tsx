"use client";

// DEV-10 · Quad a pantalla completa con el shader fluido. Uniforms siempre vía damp() (Hard Constraint 3)
// y lectura transiente del store con getState() dentro de useFrame (Hard Constraint 1).
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";
import { DAMPING } from "@/config/motion";
// Import con efecto: registra el material con extend(). Si solo se importara el tipo,
// TypeScript eliminaría el import y R3F no encontraría <fluidBackgroundMaterial>.
import "./shaders/FluidBackgroundMaterial";
import type { FluidBackgroundMaterial } from "./shaders/FluidBackgroundMaterial";

type FluidMat = InstanceType<typeof FluidBackgroundMaterial> & {
  uTime: number;
  uScrollVelocity: number;
  uPointer: THREE.Vector2;
};

export default function BackgroundShaderQuad() {
  const mat = useRef<FluidMat>(null);
  const smoothed = useRef(new THREE.Vector2());
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const { pointerNDC, scrollVelocity, reducedMotion } = useExperienceStore.getState();
    const motion = reducedMotion ? 0 : 1;
    smoothed.current.set(
      damp(smoothed.current.x, pointerNDC.x * motion, DAMPING.pointer, delta),
      damp(smoothed.current.y, pointerNDC.y * motion, DAMPING.pointer, delta)
    );
    // Con reduced motion el ruido queda casi quieto (tiempo congelado)
    if (motion) m.uTime = state.clock.elapsedTime;
    m.uPointer.copy(smoothed.current);
    m.uScrollVelocity = damp(m.uScrollVelocity, scrollVelocity * motion, DAMPING.scrollVelocity, delta);
  });

  return (
    <mesh geometry={geometry} renderOrder={-1} frustumCulled={false}>
      <fluidBackgroundMaterial ref={mat} depthWrite={false} depthTest={false} />
    </mesh>
  );
}
