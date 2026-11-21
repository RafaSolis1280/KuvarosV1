import { describe, expect, it } from "vitest";
import { hexToRgba } from "@/lib/color";
import { BRAND_COLORS } from "@/config/brand";

describe("hexToRgba", () => {
  it("convierte los colores de marca", () => {
    expect(hexToRgba(BRAND_COLORS.beigeClaro, 0.25)).toBe("rgba(221,209,183,0.25)");
    expect(hexToRgba("#000", 1)).toBe("rgba(0,0,0,1)");
  });

  it("rechaza valores que no son hex", () => {
    expect(() => hexToRgba("rojo", 1)).toThrow();
  });
});
