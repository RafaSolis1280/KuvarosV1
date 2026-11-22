import { describe, expect, it, vi } from "vitest";
import { disableWebGL, parseDevOverrides } from "./dev-overrides";

describe("parseDevOverrides", () => {
  it("lee el tier forzado (solo 1, 2 o 3)", () => {
    expect(parseDevOverrides("?tier=1").tier).toBe(1);
    expect(parseDevOverrides("?tier=3").tier).toBe(3);
    expect(parseDevOverrides("?tier=0").tier).toBeNull();
    expect(parseDevOverrides("?tier=4").tier).toBeNull();
    expect(parseDevOverrides("?tier=alto").tier).toBeNull();
    expect(parseDevOverrides("").tier).toBeNull();
  });

  it("activa «sin WebGL» con ?nowebgl, salvo que valga 0 o false", () => {
    expect(parseDevOverrides("?nowebgl").noWebGL).toBe(true);
    expect(parseDevOverrides("?nowebgl=1").noWebGL).toBe(true);
    expect(parseDevOverrides("?nowebgl=0").noWebGL).toBe(false);
    expect(parseDevOverrides("?nowebgl=false").noWebGL).toBe(false);
    expect(parseDevOverrides("?tier=2").noWebGL).toBe(false);
  });

  it("combina los dos", () => {
    expect(parseDevOverrides("?tier=2&nowebgl")).toEqual({ tier: 2, noWebGL: true });
  });
});

describe("disableWebGL", () => {
  it("bloquea los contextos WebGL, deja pasar el 2D y se puede deshacer", () => {
    const ctx2d = { kind: "2d" };
    const original = vi.fn((type: string) => (type === "2d" ? ctx2d : { kind: type }));
    const proto = { getContext: original } as unknown as HTMLCanvasElement;
    const getContext = (type: string) => (proto.getContext as unknown as (t: string) => unknown)(type);

    const restore = disableWebGL(proto);
    expect(getContext("webgl")).toBeNull();
    expect(getContext("webgl2")).toBeNull();
    expect(getContext("experimental-webgl")).toBeNull();
    expect(getContext("2d")).toBe(ctx2d);

    restore();
    expect(proto.getContext).toBe(original);
  });
});
