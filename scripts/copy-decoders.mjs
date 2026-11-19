// Copia los benchmarks de detect-gpu a /public. Se ejecuta en `postinstall`. Ref: Manual v2 Parte II §3.
// DEV-37: el proyecto es solo-video (sin .glb), así que ya no se copian los decodificadores Draco/Basis.
import { cpSync, existsSync, mkdirSync } from "node:fs";

const copies = [
  ["node_modules/detect-gpu/dist/benchmarks", "public/benchmarks"],
];

for (const [from, to] of copies) {
  if (!existsSync(from)) {
    console.warn(`[copy-decoders] No existe ${from} (¿dependencia sin instalar?). Se omite.`);
    continue;
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-decoders] ${from} → ${to}`);
}
