"use client";

// DEV-10 · Quad a pantalla completa con el shader fluido. Uniforms siempre vía damp() (Hard Constraint 3)
// y lectura transiente del store con getState() dentro de useFrame (Hard Constraint 1).
// DEV-15: bloom + grano solo si gpuPolicy.enablePostProcessing (T2/T3); en T1 el shader se compila sin ellos.
// El grano, además, solo con el canvas a DPR ≤ GRAIN_MAX_DPR (a más densidad cuesta FPS y apenas se ve).
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";
import { DAMPING } from "@/config/motion";
import { BACKGROUND_FX, GRAIN_MAX_DPR } from "@/config/scene";
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
  // La política cambia pocas veces por sesión (detección o bajada de tier): OK leerla con el hook
  const gpuPolicy = useExperienceStore((s) => s.gpuPolicy);
  const fx = gpuPolicy.enablePostProcessing ? BACKGROUND_FX[gpuPolicy.tier] : undefined;
  // DPR real del canvas (el del dispositivo, acotado por gpuPolicy.dpr): cambia con el tier o la pantalla
  const canvasDpr = useThree((s) => s.viewport.dpr);
  const postFx = Boolean(fx);
  const grain = postFx && canvasDpr <= GRAIN_MAX_DPR;
  const defines = useMemo(() => ({ ...(postFx && { POSTFX: "" }), ...(grain && { GRAIN: "" }) }), [postFx, grain]);

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
      {/* key: cambiar la macro exige otro programa; R3F libera el material anterior al desmontarlo */}
      <fluidBackgroundMaterial
        key={`${postFx ? "postfx" : "plain"}-${grain ? "grain" : "nograin"}`}
        ref={mat}
        defines={defines}
        uBloom={fx?.bloom ?? 0}
        uGrain={grain ? (fx?.grain ?? 0) : 0}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
