// Copia los decodificadores Draco/Basis (three) y los benchmarks de detect-gpu a /public.
// Se ejecuta en `postinstall`. Ref: Manual v2 Parte II §3.
import { cpSync, existsSync, mkdirSync } from "node:fs";

const copies = [
  ["node_modules/three/examples/jsm/libs/draco/gltf", "public/draco"],
  ["node_modules/three/examples/jsm/libs/basis", "public/basis"],
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
