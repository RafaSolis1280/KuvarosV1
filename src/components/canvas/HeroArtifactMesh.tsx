"use client";

// DEV-11 · Ref: Manual v2 Parte II §8 (Prompt P5). En este proyecto el "artefacto" 3D es el
// PACKAGING de la hamburguesa: aparece cuando termina la secuencia y acompaña las especificaciones.
// - Carga /models/hero_artifact.glb (Draco o Meshopt + KTX2). Sin .glb → caja procedural (Hard Constraint 4).
// - Toda transformación pasa por damp() (Hard Constraint 3); store leído con getState() (Hard Constraint 1).
// - Se libera geometría, materiales y texturas al desmontar (Hard Constraint 6).
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ASSET_MANIFEST } from "@/config/gpu-policy";
import { useExperienceStore } from "@/store/useExperienceStore";
import { damp } from "@/lib/math";

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => {
        if (v instanceof THREE.Texture) v.dispose();
      });
      m.dispose();
    });
  });
}

/** Placeholder: caja tipo clamshell con la tapa entreabierta y una franja de acento. */
function ProceduralPackaging() {
  return (
    <group>
      <RoundedBox args={[1.9, 0.8, 1.9]} radius={0.08} smoothness={3} position={[0, -0.4, 0]}>
        <meshStandardMaterial color="#3a3530" metalness={0.1} roughness={0.6} />
      </RoundedBox>
      {/* Tapa con bisagra en el borde trasero */}
      <group position={[0, 0, -0.95]} rotation={[-0.35, 0, 0]}>
        <RoundedBox args={[1.9, 0.6, 1.9]} radius={0.08} smoothness={3} position={[0, 0.3, 0.95]}>
          <meshStandardMaterial color="#46403a" metalness={0.1} roughness={0.55} />
        </RoundedBox>
      </group>
      <mesh position={[0, -0.4, 0.951]}>
        <planeGeometry args={[1.4, 0.12]} />
        <meshBasicMaterial color="#FFD645" />
      </mesh>
      <mesh scale={1.02} position={[0, -0.1, 0]}>
        <boxGeometry args={[1.9, 1.4, 1.9]} />
        <meshBasicMaterial color="#FFD645" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function HeroArtifactMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let mounted = true;
    let loaded: THREE.Group | null = null;

    const draco = new DRACOLoader().setDecoderPath(ASSET_MANIFEST.dracoPath);
    const ktx2 = new KTX2Loader().setTranscoderPath(ASSET_MANIFEST.basisPath).detectSupport(gl);
    const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      ASSET_MANIFEST.heroModel,
      (gltf) => {
        loaded = gltf.scene;
        if (mounted) setScene(gltf.scene); // una sola vez al cargar: no es por frame
        else disposeObject(gltf.scene);
      },
      undefined,
      () => {
        /* asset aún no entregado (ART-13) → se mantiene el fallback procedural */
      }
    );

    return () => {
      mounted = false;
      if (loaded) disposeObject(loaded);
      draco.dispose();
      ktx2.dispose();
    };
  }, [gl]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const { pointerNDC, packagingReveal, reducedMotion } = useExperienceStore.getState();
    const motion = reducedMotion ? 0 : 1;
    const wide = state.viewport.aspect > 1;

    // Escala: aparece con el revelado. Con reduced motion no hay animación: salta al valor final.
    const targetScale = packagingReveal > 0.02 ? (wide ? 0.58 : 0.42) * Math.min(1, packagingReveal * 1.4) : 0.0001;
    const s = motion ? damp(g.scale.x, targetScale, 6, delta) : targetScale;
    g.scale.setScalar(s);
    g.visible = s > 0.01;
    if (!g.visible) return;

    // Posición: a la derecha en desktop (las specs van a la izquierda), abajo en móvil
    const targetX = wide ? 1.15 : 0;
    const targetY = (wide ? 0 : -0.9) + Math.sin(state.clock.elapsedTime * 1.2) * 0.06 * motion;
    g.position.x = damp(g.position.x, targetX, 4, delta);
    g.position.y = damp(g.position.y, targetY, 4, delta);

    // Rotación: giro de presentación con el revelado + parallax del puntero (pose fija con reduced motion)
    const targetRotY = motion ? packagingReveal * Math.PI * 1.25 - 0.6 + pointerNDC.x * 0.4 : -0.5;
    const targetRotX = motion ? 0.25 - pointerNDC.y * 0.2 : 0.25;
    g.rotation.y = damp(g.rotation.y, targetRotY, 5, delta);
    g.rotation.x = damp(g.rotation.x, targetRotX, 5, delta);
  });

  return (
    <group ref={groupRef} scale={0.0001} visible={false}>
      {scene ? <primitive object={scene} /> : <ProceduralPackaging />}
    </group>
  );
}
