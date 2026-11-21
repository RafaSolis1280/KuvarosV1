import { describe, expect, it, vi } from "vitest";
import { useExperienceStore } from "@/store/useExperienceStore";
import { GPU_STRICT_POLICIES } from "@/config/gpu-policy";

describe("useExperienceStore", () => {
  it("setSequenceProgress publica el progreso por id y no notifica si no cambió", () => {
    const listener = vi.fn();
    const unsubscribe = useExperienceStore.subscribe(listener);
    const { setSequenceProgress } = useExperienceStore.getState();

    setSequenceProgress("a", 0.5);
    setSequenceProgress("a", 0.5);
    setSequenceProgress("b", 0.1);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(useExperienceStore.getState().sequenceProgress).toMatchObject({ a: 0.5, b: 0.1 });
    unsubscribe();
  });

  it("downgradeGPUTier baja de a un tier y se detiene en T1", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { setGPUTier, downgradeGPUTier } = useExperienceStore.getState();
    setGPUTier(3);
    downgradeGPUTier();
    expect(useExperienceStore.getState().gpuPolicy).toBe(GPU_STRICT_POLICIES[2]);
    downgradeGPUTier();
    downgradeGPUTier();
    expect(useExperienceStore.getState().gpuPolicy).toBe(GPU_STRICT_POLICIES[1]);
    warn.mockRestore();
  });
});
