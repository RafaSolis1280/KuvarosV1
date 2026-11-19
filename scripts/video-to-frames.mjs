// ART-10 · Convierte el video master de la hamburguesa en las dos secuencias WebP del contrato
// (CLAUDE.md §2): desktop 1600 px y mobile 800 px, con EXACTAMENTE el mismo número de frames.
//
// Uso:  npm run frames -- <video> [--frames 120] [--out public/sequences/hero_explode] [--quality 78]
// Requiere ffmpeg y ffprobe en el PATH (Windows: `winget install Gyan.FFmpeg`).
//
// Recordatorio: la caché de /sequences es `immutable`. Si ya hubo un deploy con frames,
// exportar a una carpeta NUEVA (p. ej. hero_explode_v2) y actualizar ASSET_MANIFEST.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
// El video es el primer argumento que no es una opción ni el valor de una opción
const input = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

if (!input || !existsSync(input)) {
  console.error("Uso: npm run frames -- <video.mp4|mov> [--frames 120] [--out public/sequences/hero_explode] [--quality 78]");
  process.exit(1);
}

const frames = Number(opt("frames", "120"));
const outDir = opt("out", "public/sequences/hero_explode");
const quality = opt("quality", "78");

const run = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

let duration;
try {
  duration = Number(
    run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", input]).trim()
  );
} catch {
  console.error("[frames] No se encontró ffprobe/ffmpeg en el PATH. Instalar: winget install Gyan.FFmpeg");
  process.exit(1);
}
if (!duration || Number.isNaN(duration)) {
  console.error("[frames] No se pudo leer la duración del video.");
  process.exit(1);
}

// fps exacto para obtener `frames` imágenes a lo largo de todo el video
const fps = frames / duration;
console.log(`[frames] ${input} · ${duration.toFixed(2)} s → ${frames} frames (fps efectivo ${fps.toFixed(3)})`);

for (const [variant, width] of [["desktop", 1600], ["mobile", 800]]) {
  const dir = join(outDir, variant);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  run("ffmpeg", [
    "-v", "error", "-y", "-i", input,
    "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-frames:v", String(frames),
    "-c:v", "libwebp", "-quality", quality, "-compression_level", "6",
    join(dir, "frame_%04d.webp"),
  ]);
  const count = readdirSync(dir).filter((f) => f.endsWith(".webp")).length;
  console.log(`[frames] ${variant}: ${count} frames en ${dir}`);
  if (count !== frames) {
    console.warn(`[frames] ⚠ Se esperaban ${frames}. Actualizar totalFrames en src/config/gpu-policy.ts a ${count}.`);
  }
}

console.log("[frames] Listo. Revisar el peso total (budget del Manual) y registrar el asset en LICENCIAS.md.");
