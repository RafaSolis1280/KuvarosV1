// Coherencia de la configuración con los assets y el contenido reales: si alguien exporta frames
// nuevos, cambia un id o mueve un tramo, el test lo avisa antes de que llegue al navegador.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_TIER, GPU_STRICT_POLICIES, tierFromGPU } from "@/config/gpu-policy";
import { PRODUCT_STORY } from "@/config/sequences";
import { CONTACT_SECTION_ID } from "@/config/site";
import { PRODUCTO } from "@/content/producto";
import { frameUrl } from "@/lib/sequence/frames";
import { beatRanges } from "@/lib/sequence/timeline";

describe("tierFromGPU (detect-gpu → política del sitio)", () => {
  it("tier 0 desactiva WebGL y usa la política T1", () => {
    expect(tierFromGPU({ tier: 0 })).toEqual({ tier: 1, webglAvailable: false });
  });
  it("tier 1 → T1, tier 2 → T2, tier 3 → T3", () => {
    expect(tierFromGPU({ tier: 1 }).tier).toBe(1);
    expect(tierFromGPU({ tier: 2 }).tier).toBe(2);
    expect(tierFromGPU({ tier: 3 }).tier).toBe(3);
  });
  it("un móvil nunca pasa de T2 aunque su GPU sea tier 3", () => {
    expect(tierFromGPU({ tier: 3, isMobile: true })).toEqual({ tier: 2, webglAvailable: true });
  });
  it("el tier por defecto existe en las políticas", () => {
    expect(GPU_STRICT_POLICIES[DEFAULT_TIER].tier).toBe(DEFAULT_TIER);
  });
});

describe("secuencias", () => {
  const publicDir = join(process.cwd(), "public");

  for (const clip of PRODUCT_STORY.clips) {
    for (const variant of ["desktop", "mobile"] as const) {
      it(`${clip.basePath}/${variant}: los frames en disco coinciden con totalFrames del manifiesto`, () => {
        const dir = join(publicDir, clip.basePath, variant);
        if (!existsSync(dir)) return; // sin assets (clon sin LFS) el sitio usa el fallback
        const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
        expect(files).toHaveLength(clip.totalFrames[variant]);
        expect(existsSync(join(publicDir, frameUrl(clip.basePath, variant, 0)))).toBe(true);
        expect(existsSync(join(publicDir, frameUrl(clip.basePath, variant, clip.totalFrames[variant] - 1)))).toBe(true);
      });
    }
  }
});

describe("contenido", () => {
  it("el CTA de la cabecera apunta a la sección de conversión", () => {
    expect(PRODUCTO.cta.hrefHeader).toBe(`#${CONTACT_SECTION_ID}`);
  });

  it("cada capítulo de la historia apunta a beats que existen y en orden", () => {
    const ranges = beatRanges(PRODUCT_STORY.beats);
    let prevEnd = 0;
    for (const c of PRODUCTO.historia.capitulos) {
      expect(ranges[c.desde]).toBeDefined();
      expect(ranges[c.hasta]).toBeDefined();
      expect(ranges[c.desde][0]).toBeCloseTo(prevEnd);
      expect(ranges[c.hasta][1]).toBeGreaterThan(ranges[c.desde][0]);
      prevEnd = ranges[c.hasta][1];
    }
    expect(prevEnd).toBeCloseTo(1); // los capítulos cubren toda la historia
  });

  it("cada ficha de ingrediente tiene una posición dentro de la pantalla", () => {
    for (const ing of PRODUCTO.ingredientes) {
      expect(ing.ancla.x).toBeGreaterThanOrEqual(0);
      expect(ing.ancla.x).toBeLessThan(100);
      expect(ing.ancla.y).toBeGreaterThanOrEqual(0);
      expect(ing.ancla.y).toBeLessThan(100);
    }
  });

  it("los ids de ingredientes y las etiquetas de la ficha no se repiten (son keys de React)", () => {
    const ids = PRODUCTO.ingredientes.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const labels = PRODUCTO.packaging.especificaciones.map((e) => e.etiqueta);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
