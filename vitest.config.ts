// DEV-38 · Tests unitarios (lógica pura: matemática, secuencias, reveal, configuración, contenido).
// `npm test` los ejecuta una vez; `npx vitest` en modo watch mientras se desarrolla.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
