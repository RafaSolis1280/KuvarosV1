"use client";

// DEV-38 · Suscripción al progreso de una secuencia (lo publica ImageSequenceCanvas en el store).
// Para overlays que se animan con el scroll SIN re-renders de React (Hard Constraint 1): el callback
// escribe estilos directamente en los nodos (o fija objetivos de useDampedValues, DEV-40). Se llama una
// vez al montar y luego solo cuando el progreso cambia.
import { useEffect, useEffectEvent } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";

export type SequenceProgressHandler = (progress: number, reducedMotion: boolean) => void;

export function useSequenceProgress(sequenceId: string, onProgress: SequenceProgressHandler): void {
  // useEffectEvent: el callback siempre ve las props más recientes sin volver a suscribirse
  const handle = useEffectEvent(onProgress);

  useEffect(() => {
    let last = -1;
    const apply = (progress: number) => {
      if (progress === last) return;
      last = progress;
      handle(progress, useExperienceStore.getState().reducedMotion);
    };
    apply(useExperienceStore.getState().sequenceProgress[sequenceId] ?? 0);
    return useExperienceStore.subscribe((s) => apply(s.sequenceProgress[sequenceId] ?? 0));
  }, [sequenceId]);
}
