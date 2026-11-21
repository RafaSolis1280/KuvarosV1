// Coherencia de la configuración con los assets y el contenido reales: si alguien exporta frames
// nuevos, cambia un id o mueve un tramo, el test lo avisa antes de que llegue al navegador.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_TIER, GPU_STRICT_POLICIES, tierFromGPU } from "@/config/gpu-policy";
import { SEQUENCES } from "@/config/sequences";
import { CONTACT_SECTION_ID } from "@/config/site";
import { PRODUCTO } from "@/content/producto";
import { frameUrl } from "@/lib/sequence/frames";

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

  for (const seq of Object.values(SEQUENCES)) {
    for (const variant of ["desktop", "mobile"] as const) {
      it(`${seq.id}/${variant}: los frames en disco coinciden con totalFrames del manifiesto`, () => {
        const dir = join(publicDir, seq.basePath, variant);
        if (!existsSync(dir)) return; // sin assets (clon sin LFS) el sitio usa el fallback
        const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
        expect(files).toHaveLength(seq.totalFrames[variant]);
        expect(existsSync(join(publicDir, frameUrl(seq.basePath, variant, 0)))).toBe(true);
        expect(existsSync(join(publicDir, frameUrl(seq.basePath, variant, seq.totalFrames[variant] - 1)))).toBe(true);
      });
    }
  }

  it("los ids de progreso y las anclas son únicos", () => {
    const seqs = Object.values(SEQUENCES);
    expect(new Set(seqs.map((s) => s.id)).size).toBe(seqs.length);
    expect(new Set(seqs.map((s) => s.anchorId)).size).toBe(seqs.length);
  });
});

describe("contenido", () => {
  it("el CTA de la cabecera apunta a la sección de conversión", () => {
    expect(PRODUCTO.cta.hrefHeader).toBe(`#${CONTACT_SECTION_ID}`);
  });

  it("cada ingrediente tiene un tramo válido dentro del video y van en orden", () => {
    let prevStart = -1;
    for (const ing of PRODUCTO.ingredientes) {
      const [a, b] = ing.rango;
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
      expect(a).toBeLessThan(b);
      expect(a).toBeGreaterThan(prevStart);
      prevStart = a;
    }
  });

  it("los ids de ingredientes y las etiquetas de la ficha no se repiten (son keys de React)", () => {
    const ids = PRODUCTO.ingredientes.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const labels = PRODUCTO.packaging.especificaciones.map((e) => e.etiqueta);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
