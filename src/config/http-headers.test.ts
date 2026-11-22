import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CACHE_CONTROL,
  UNVERSIONED_ASSET_DIRS,
  VERSIONED_ASSET_DIRS,
  contentSecurityPolicy,
  securityHeaders,
} from "./http-headers";

const prod = { isDev: false, isHttpsDeploy: true };
const local = { isDev: false, isHttpsDeploy: false };
const dev = { isDev: true, isHttpsDeploy: false };

describe("contentSecurityPolicy (DEV-34)", () => {
  it("limita todo al propio origen y bloquea objetos, <base> ajeno y que otro sitio la enmarque", () => {
    const csp = contentSecurityPolicy(prod);
    for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"]) {
      expect(csp).toContain(d);
    }
    expect(csp).not.toMatch(/https?:\/\//); // ningún dominio de terceros
  });

  it("en producción no permite eval ni WebSockets; en desarrollo sí (HMR)", () => {
    expect(contentSecurityPolicy(prod)).not.toContain("unsafe-eval");
    expect(contentSecurityPolicy(prod)).not.toContain("ws:");
    expect(contentSecurityPolicy(dev)).toContain("'unsafe-eval'");
    expect(contentSecurityPolicy(dev)).toContain("ws:");
  });

  it("solo pide subir a HTTPS en el despliegue con HTTPS (en localhost rompería los recursos)", () => {
    expect(contentSecurityPolicy(prod)).toContain("upgrade-insecure-requests");
    expect(contentSecurityPolicy(local)).not.toContain("upgrade-insecure-requests");
  });
});

describe("securityHeaders", () => {
  it("incluye las 6 cabeceras que puntúa securityheaders.com", () => {
    const keys = securityHeaders(prod).map((h) => h.key);
    for (const k of [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
    ]) {
      expect(keys).toContain(k);
    }
  });

  it("HSTS dura al menos un año y no se precarga sin decisión del dueño del dominio", () => {
    const hsts = securityHeaders(prod).find((h) => h.key === "Strict-Transport-Security")!.value;
    expect(Number(hsts.match(/max-age=(\d+)/)![1])).toBeGreaterThanOrEqual(31536000);
    expect(hsts).not.toContain("preload");
  });
});

describe("caché de /public", () => {
  it("cada carpeta de /public está clasificada: versionada (immutable) o no (se revalida)", () => {
    const dirs = readdirSync("public").filter((d) => statSync(join("public", d)).isDirectory());
    const classified = [...VERSIONED_ASSET_DIRS, ...UNVERSIONED_ASSET_DIRS] as string[];
    expect(dirs.filter((d) => !classified.includes(d))).toEqual([]);
  });

  it("los benchmarks (se copian de node_modules con el mismo nombre) no son immutable", () => {
    expect(VERSIONED_ASSET_DIRS as readonly string[]).not.toContain("benchmarks");
    expect(CACHE_CONTROL.revalidate).not.toContain("immutable");
  });
});
