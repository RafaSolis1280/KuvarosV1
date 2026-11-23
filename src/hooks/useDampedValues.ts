"use client";

// DEV-40 · Hook de DampedValues: devuelve `setTargets` (estable) y llama a `onUpdate` en cada frame
// mientras los valores se asientan. Declararlo ANTES de useSequenceProgress en el componente, para que
// exista cuando llegue el primer progreso.
import { useCallback, useEffect, useEffectEvent, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DampedValues, type Constrain } from "@/lib/DampedValues";

/** `constrain` debe ser una función estable (definida fuera del componente). */
export function useDampedValues(
  lambda: number,
  onUpdate: (values: readonly number[]) => void,
  constrain?: Constrain
) {
  const update = useEffectEvent(onUpdate);
  const values = useRef<DampedValues | null>(null);

  useEffect(() => {
    const instance = new DampedValues(lambda, (v) => update(v), gsap.ticker, constrain);
    values.current = instance;
    return () => {
      instance.dispose();
      values.current = null;
    };
  }, [lambda, constrain]);

  return useCallback((targets: readonly number[]) => values.current?.set(targets), []);
}
