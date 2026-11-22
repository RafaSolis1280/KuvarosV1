// DEV-27 · Prueba de los 5 escenarios (T3, T2, T1, sin WebGL y reduced motion) con el override de
// desarrollo (`?tier=` / `?nowebgl`, solo en `npm run dev`). Para cada uno mide lo que la política
// debería cambiar y guarda dos capturas: el hero (fondo WebGL) y la mitad de la historia (video).
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node tiers.cjs http://localhost:3000 <carpeta de capturas>
// Salida: una línea JSON por escenario.
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);
const path = require("node:path");

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || ".";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SCENARIOS = [
  { name: "T3", query: "?tier=3" },
  { name: "T2", query: "?tier=2" },
  { name: "T1", query: "?tier=1" },
  { name: "sin-webgl", query: "?nowebgl" },
  { name: "reduced-motion", query: "", reduce: true },
];

async function scenario(browser, { name, query, reduce }) {
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  // DPR 2: así se ve el tope de `dpr` de cada tier en el tamaño del canvas de la secuencia
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" }]);

  const errors = [];
  const info = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 160));
    if (/\[DEV-27\]|\[GPU\]/.test(m.text())) info.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  const frames = { desktop: 0, mobile: 0, failed: 0 };
  page.on("requestfinished", (req) => {
    const m = req.url().match(/\/sequences\/[^/]+\/(desktop|mobile)\//);
    if (m) frames[m[1]]++;
  });
  page.on("requestfailed", (req) => {
    if (req.url().includes("/sequences/")) frames.failed++;
  });

  // ImageBitmaps vivos (ventana deslizante: ≤ 2R+1)
  await page.evaluateOnNewDocument(() => {
    const stats = (window.__bmp = { live: 0, max: 0 });
    const create = window.createImageBitmap.bind(window);
    const alive = new WeakSet();
    window.createImageBitmap = async (...a) => {
      const b = await create(...a);
      alive.add(b);
      stats.live++;
      stats.max = Math.max(stats.max, stats.live);
      return b;
    };
    const close = ImageBitmap.prototype.close;
    ImageBitmap.prototype.close = function () {
      if (alive.has(this)) {
        alive.delete(this);
        stats.live--;
      }
      return close.call(this);
    };
  });

  await page.goto(BASE + "/" + query, { waitUntil: "load" });
  await wait(5000);

  // ¿El fondo se mueve? Dos capturas del hero con 1.5 s de diferencia
  const shot = () => page.screenshot({ clip: { x: 0, y: 500, width: 1280, height: 250 }, encoding: "base64" });
  const a = await shot();
  await wait(1500);
  const b = await shot();
  const backgroundMoves = a !== b;
  // Captura del hero: ahí se ve el fondo WebGL (o su ausencia) con el puntero en el centro
  await page.mouse.move(900, 300);
  await wait(1200);
  await page.screenshot({ path: path.join(OUT, `DEV-27-${name}-hero.webp`), type: "webp", quality: 70 });

  const dom = () =>
    page.evaluate(() => {
      const glHost = document.querySelector("[data-testid='global-canvas']");
      const seq = document.querySelector("canvas[role='img']");
      return {
        webglCanvas: glHost ? glHost.querySelectorAll("canvas").length : 0,
        sequenceCanvasPx: seq ? `${seq.width}×${seq.height}` : null,
        lenis: document.documentElement.classList.contains("lenis"),
        h1: document.querySelector("h1")?.textContent?.trim().slice(0, 40),
      };
    });
  const before = await dom();

  // Recorrido completo con la rueda; captura a mitad de la historia
  await page.mouse.move(640, 400);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let captured = false;
  for (let k = 0; k < 300; k++) {
    await page.mouse.wheel({ deltaY: 300 });
    await wait(40);
    const y = await page.evaluate(() => scrollY);
    if (!captured && y > max * 0.3) {
      await wait(1200);
      await page.screenshot({ path: path.join(OUT, `DEV-27-${name}-historia.webp`), type: "webp", quality: 70 });
      captured = true;
    }
    if (y >= max - 2) break;
  }
  await wait(1500);
  const reachedEnd = await page.evaluate(() => Math.round(scrollY) >= document.documentElement.scrollHeight - innerHeight - 2);

  // CTA de la cabecera desde el final → vuelve a la conversión (#contacto)
  await page.evaluate(() => scrollTo(0, 0));
  await wait(1500);
  await page.click('header a[href="#contacto"]');
  await wait(3000);
  const ctaTop = await page.evaluate(() => Math.round(document.getElementById("contacto").getBoundingClientRect().top));
  const bmp = await page.evaluate(() => window.__bmp);
  await page.close();
  return { name, ...before, backgroundMoves, frames, bitmapsMax: bmp.max, reachedEnd, ctaContactTop: ctaTop, info, errors };
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  for (const s of SCENARIOS) console.log(JSON.stringify(await scenario(browser, s)));
  await browser.close();
})();
