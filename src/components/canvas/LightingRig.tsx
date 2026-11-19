"use client";

// DEV-11 · Rig de iluminación PBR (Manual v2 Parte II §8) + HDRI de estudio opcional.
// Si /hdri/studio_dark_01.hdr no existe, la escena sigue con luces analíticas (Hard Constraint 4).
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

function StudioEnvironment() {
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    let mounted = true;
    let texture: THREE.DataTexture | null = null;

    new HDRLoader().load(
      ASSET_MANIFEST.hdri,
      (tex) => {
        if (!mounted) {
          tex.dispose();
          return;
        }
        tex.mapping = THREE.EquirectangularReflectionMapping;
        texture = tex;
        scene.environment = tex;
        scene.environmentIntensity = 0.6;
      },
      undefined,
      () => {
        /* HDRI aún no entregado (ART-14) → solo luces analíticas */
      }
    );

    return () => {
      mounted = false;
      if (texture) {
        if (scene.environment === texture) scene.environment = null;
        texture.dispose();
      }
    };
  }, [scene]);

  return null;
}

export default function LightingRig() {
  return (
    <>
      <StudioEnvironment />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFF8E7" />
      <spotLight position={[-4, -2, -2]} intensity={4.5} color="#FFD645" angle={0.6} />
    </>
  );
}
