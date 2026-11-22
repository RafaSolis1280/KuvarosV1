// DEV-01 · Control del budget de JS inicial, sobre el build de producción (correr después de `npm run build`).
// Lee los <script> que el HTML prerenderizado de "/" pide al cargar, los comprime con gzip (nivel 6, el
// habitual de un servidor) y con brotli (lo que sirve Vercel) y los compara con PERFORMANCE_BUDGET.
// Sale con código 1 si se pasa del budget móvil (el más estricto: el bundle es el mismo en los dos).
//
// Uso: npm run budget   (o: node Manuales/qa/scripts/budget-js.mjs)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const BUDGET_FILE = "src/config/budget.ts";
const html = readFileSync(".next/server/app/index.html", "utf8");
const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[^"']+\.js/g) ?? [])];
if (chunks.length === 0) {
  console.error("[budget] No se encontraron scripts en .next/server/app/index.html: ¿falta `npm run build`?");
  process.exit(2);
}

let raw = 0;
let gzip = 0;
let brotli = 0;
for (const url of chunks) {
  const buf = readFileSync(join(".next", url.replace("/_next/", "")));
  raw += buf.length;
  gzip += gzipSync(buf, { level: 6 }).length;
  brotli += brotliCompressSync(buf).length;
}

// Los límites se leen del archivo de configuración (fuente única) sin compilar TypeScript
const source = readFileSync(BUDGET_FILE, "utf8");
const [, desktop, mobile] = source.match(/initialJsGzipKB:\s*\{\s*desktop:\s*(\d+),\s*mobile:\s*(\d+)/) ?? [];
const kb = (n) => (n / 1024).toFixed(1);
console.log(`[budget] JS inicial de "/": ${chunks.length} archivos · ${kb(raw)} KB sin comprimir · ${kb(gzip)} KB gzip · ${kb(brotli)} KB brotli`);
console.log(`[budget] Límite (gzip): desktop ${desktop} KB · móvil ${mobile} KB → margen móvil ${(Number(mobile) - gzip / 1024).toFixed(1)} KB`);
if (gzip / 1024 > Number(mobile)) {
  console.error("[budget] ❌ Se pasa del budget de JS inicial. Cargar lo nuevo con dynamic import o quitar peso.");
  process.exit(1);
}
console.log("[budget] ✅ Dentro del budget");
