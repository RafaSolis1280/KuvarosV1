// DEV-14 · Verificación de las partículas (con el override de tiers de DEV-27: correr contra `npm run dev`).
// Por tier: draw calls por frame del Canvas WebGL y cuántos puntos dibuja el de partículas (debe ser
// gpuPolicy.maxParticles). Con reduced motion: dos capturas del fondo con 1.5 s de diferencia (deben ser
// iguales: partículas y fondo quietos). Además guarda una captura del hero por tier.
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node particulas.cjs <url base> <carpeta de capturas>
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);
const path = require("node:path");

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || ".";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const countDraws = () => {
  window.__draws = [];
  let current = [];
  const POINTS = 0;
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const arrays = C.prototype.drawArrays;
    C.prototype.drawArrays = function (mode, first, count) {
      current.push(mode === POINTS ? `points:${count}` : `arrays:${count}`);
      return arrays.call(this, mode, first, count);
    };
    const elements = C.prototype.drawElements;
    C.prototype.drawElements = function (mode, count, type, offset) {
      current.push(`elements:${count}`);
      return elements.call(this, mode, count, type, offset);
    };
  }
  const tick = () => {
    if (current.length) window.__draws.push(current.join(","));
    current = [];
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
  });
  for (const [name, query, reduce] of [["T3", "?tier=3", false], ["T2", "?tier=2", false], ["T1", "?tier=1", false], ["reduced-motion", "?tier=3", true]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" }]);
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 120)));
    await page.evaluateOnNewDocument(countDraws);
    await page.goto(BASE + "/" + query, { waitUntil: "load" });
    await page.addStyleTag({ content: "[data-custom-cursor],[data-preloader]{display:none!important}" });
    await wait(5000);
    const frames = await page.evaluate(() => window.__draws.slice(-30));
    const typical = [...new Set(frames)];
    const clip = { x: 1000, y: 120, width: 420, height: 640 };
    const a = await page.screenshot({ clip, encoding: "base64" });
    await wait(1500);
    const b = await page.screenshot({ clip, encoding: "base64" });
    await page.screenshot({ path: path.join(OUT, `DEV-14-${name}.webp`), type: "webp", quality: 80, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log(JSON.stringify({ escenario: name, drawCallsPorFrame: typical, fondoSeMueve: a !== b, errores: errors }));
    await page.close();
  }
  await browser.close();
})();
