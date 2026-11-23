// DEV-01 · El peso de cada video entra en el budget. Si se exporta un master más pesado (ART-10), este
// test lo avisa antes del merge.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PERFORMANCE_BUDGET } from "./budget";
import { ASSET_MANIFEST, type SequenceVariant } from "./gpu-policy";

const folderKB = (dir: string) => readdirSync(dir).reduce((sum, f) => sum + statSync(join(dir, f)).size, 0) / 1024;

describe("Performance Budget (DEV-01)", () => {
  for (const sequence of Object.values(ASSET_MANIFEST.sequences)) {
    for (const variant of ["desktop", "mobile"] as SequenceVariant[]) {
      it(`${sequence.basePath}/${variant} pesa ≤ ${PERFORMANCE_BUDGET.sequenceKB[variant] / 1024} MB`, () => {
        const dir = join("public", sequence.basePath, variant);
        expect(folderKB(dir)).toBeLessThanOrEqual(PERFORMANCE_BUDGET.sequenceKB[variant]);
      });
    }
  }

  it("el budget móvil nunca es más laxo que el de desktop", () => {
    const b = PERFORMANCE_BUDGET;
    for (const key of ["initialJsGzipKB", "criticalKB", "totalKB", "sequenceKB"] as const) {
      expect(b[key].mobile).toBeLessThanOrEqual(b[key].desktop);
    }
    expect(b.fps.mobile).toBeLessThanOrEqual(b.fps.desktop);
  });
});
