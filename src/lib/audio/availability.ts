// DEV-16 · Qué archivos de audio del manifiesto existen de verdad en /public. Solo para el servidor: se
// evalúa al prerenderizar (build), así que la página no hace peticiones de prueba ni deja 404 en consola.
// Mientras ART-15 no entregue el audio, la lista viene vacía y el control de sonido no se muestra.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ASSET_MANIFEST } from "@/config/gpu-policy";

export function availableAudio(sources: readonly string[]): string[] {
  return sources.filter((src) => existsSync(join(process.cwd(), "public", src)));
}

/** El loop ambiente del manifiesto que existe (lo usan la cabecera, DEV-16, y el preloader, DEV-13) */
export function ambientAudio(): string[] {
  return availableAudio(ASSET_MANIFEST.audio.ambient);
}
