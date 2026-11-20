// ART-10 · Convierte un video master (o un tramo de él) en las dos secuencias WebP del contrato
// (CLAUDE.md §2): desktop 1600 px y mobile 800 px, con EXACTAMENTE el mismo número de frames.
//
// Uso:  npm run frames -- <video> [--frames 120|native] [--start 0] [--end <s>]
//                                  [--out public/sequences/hero_explode] [--quality 78]
//   --frames native   usa los frames reales del tramo (fps del video): sin cuadros duplicados.
//   --start / --end   segundos del tramo a exportar (un mismo master puede alimentar varias secuencias).
// Nunca se agranda el video: si el master es más angosto que 1600 px, desktop queda con su ancho nativo.
// Requiere ffmpeg y ffprobe en el PATH (Windows: `winget install Gyan.FFmpeg`).
//
// Recordatorio: la caché de /sequences es `immutable`. Si ya hubo un deploy con frames,
// exportar a una carpeta NUEVA (p. ej. hero_explode_v2) y actualizar ASSET_MANIFEST.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
// El video es el primer argumento que no es una opción ni el valor de una opción
const input = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

if (!input || !existsSync(input)) {
  console.error(
    "Uso: npm run frames -- <video.mp4|mov> [--frames 120|native] [--start 0] [--end <s>] [--out public/sequences/hero_explode] [--quality 78]"
  );
  process.exit(1);
}

const outDir = opt("out", "public/sequences/hero_explode");
const quality = opt("quality", "78");

const run = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

let probe;
try {
  probe = run("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,r_frame_rate:format=duration",
    "-of", "json", input,
  ]);
} catch {
  console.error("[frames] No se encontró ffprobe/ffmpeg en el PATH. Instalar: winget install Gyan.FFmpeg");
  process.exit(1);
}
const info = JSON.parse(probe);
const duration = Number(info.format?.duration);
const srcWidth = Number(info.streams?.[0]?.width);
const [num, den] = String(info.streams?.[0]?.r_frame_rate ?? "0/1").split("/").map(Number);
const srcFps = den ? num / den : 0;
if (!duration || Number.isNaN(duration)) {
  console.error("[frames] No se pudo leer la duración del video.");
  process.exit(1);
}

const start = Math.max(0, Number(opt("start", "0")));
const end = Math.min(duration, Number(opt("end", String(duration))));
const span = end - start;
if (!(span > 0)) {
  console.error(`[frames] Tramo inválido: --start ${start} --end ${end} (duración del video ${duration.toFixed(2)} s).`);
  process.exit(1);
}

const framesOpt = opt("frames", "120");
const frames = framesOpt === "native" ? Math.round(span * srcFps) : Number(framesOpt);
if (!frames || Number.isNaN(frames)) {
  console.error(`[frames] --frames inválido: ${framesOpt}`);
  process.exit(1);
}

// fps exacto para obtener `frames` imágenes a lo largo de todo el tramo
const fps = frames / span;
console.log(
  `[frames] ${input} · tramo ${start.toFixed(2)}-${end.toFixed(2)} s (${span.toFixed(2)} s) → ${frames} frames (fps efectivo ${fps.toFixed(3)}, origen ${srcFps.toFixed(3)})`
);

for (const [variant, target] of [["desktop", 1600], ["mobile", 800]]) {
  const width = srcWidth ? Math.min(target, srcWidth) : target;
  if (srcWidth && srcWidth < target) {
    console.warn(`[frames] ⚠ ${variant}: el master mide ${srcWidth} px (< ${target}); se exporta a ${width} px sin agrandar.`);
  }
  const dir = join(outDir, variant);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  run("ffmpeg", [
    "-v", "error", "-y",
    "-ss", String(start), "-to", String(end), "-i", input,
    "-an",
    "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-frames:v", String(frames),
    "-c:v", "libwebp", "-quality", quality, "-compression_level", "6",
    join(dir, "frame_%04d.webp"),
  ]);
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const mb = files.reduce((acc, f) => acc + statSync(join(dir, f)).size, 0) / 1024 / 1024;
  console.log(`[frames] ${variant}: ${files.length} frames · ${mb.toFixed(2)} MB en ${dir}`);
  if (files.length !== frames) {
    console.warn(`[frames] ⚠ Se esperaban ${frames}. Actualizar totalFrames en src/config/gpu-policy.ts a ${files.length}.`);
  }
}

console.log("[frames] Listo. Revisar el peso total (budget del Manual) y registrar el asset en LICENCIAS.md.");
