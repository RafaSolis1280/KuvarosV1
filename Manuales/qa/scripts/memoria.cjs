// DEV-26 · Auditoría de memoria en Chrome headless: 10 recorridos completos con la rueda (Lenis activo).
// Mide tras cada recorrido, con GC forzado: heap JS (CDP Performance.getMetrics) y memoria de texturas de
// las secuencias (ImageBitmap vivos: cada uno ocupa ancho × alto × 4 bytes decodificados, en GPU o RAM según
// el navegador), más el búfer de dibujo de los canvas. Uso: node run_memory.cjs <url> <ancho> <alto> [reduce]
// Script CommonJS de QA (fuera de la app): require es lo esperado aquí
// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require(process.env.PUPPETEER_PATH);

(async () => {
  const [url, w, h, mode] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--enable-precise-memory-info", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  if (mode === "reduce") await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  // Contador de ImageBitmap vivos (creados - cerrados) y sus bytes
  await page.evaluateOnNewDocument(() => {
    const live = new Map();
    const stats = { live: 0, bytes: 0, maxLive: 0, maxBytes: 0, created: 0, closed: 0 };
    window.__bitmaps = stats;
    const original = window.createImageBitmap.bind(window);
    window.createImageBitmap = async (...args) => {
      const bmp = await original(...args);
      const bytes = bmp.width * bmp.height * 4;
      live.set(bmp, bytes);
      stats.created++;
      stats.live++;
      stats.bytes += bytes;
      stats.maxLive = Math.max(stats.maxLive, stats.live);
      stats.maxBytes = Math.max(stats.maxBytes, stats.bytes);
      return bmp;
    };
    const close = ImageBitmap.prototype.close;
    ImageBitmap.prototype.close = function () {
      if (live.has(this)) {
        stats.live--;
        stats.bytes -= live.get(this);
        stats.closed++;
        live.delete(this);
      }
      return close.call(this);
    };
  });

  const cdp = await page.createCDPSession();
  await cdp.send("Performance.enable");
  const heap = async () => {
    await cdp.send("HeapProfiler.collectGarbage");
    await new Promise((r) => setTimeout(r, 300));
    const { metrics } = await cdp.send("Performance.getMetrics");
    return metrics.find((m) => m.name === "JSHeapUsedSize").value;
  };
  const snapshot = () =>
    page.evaluate(() => {
      const canvases = [...document.querySelectorAll("canvas")].map((c) => ({ px: c.width * c.height }));
      return {
        bitmaps: { ...window.__bitmaps },
        canvasBytes: canvases.reduce((s, c) => s + c.px * 4, 0),
        canvases: canvases.length,
      };
    });

  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.mouse.move(w / 2, h / 2);
  const initial = { heap: await heap(), ...(await snapshot()) };
  const passes = [];
  for (let i = 1; i <= 10; i++) {
    const t0 = Date.now();
    // Bajar hasta el final y volver a subir con la rueda real
    for (const dir of [1, -1]) {
      let last = -1;
      for (let k = 0; k < 400; k++) {
        await page.mouse.wheel({ deltaY: 360 * dir });
        await new Promise((r) => setTimeout(r, 45));
        if (k % 10 === 9) {
          const y = await page.evaluate(() => scrollY);
          const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
          if ((dir > 0 && y >= max - 2) || (dir < 0 && y <= 2) || y === last) break;
          last = y;
        }
      }
      await new Promise((r) => setTimeout(r, 1200));
    }
    passes.push({ pass: i, seconds: (Date.now() - t0) / 1000, heap: await heap(), ...(await snapshot()) });
  }
  console.log(JSON.stringify({ viewport: [w, h], mode: mode || "full", initial, passes }, null, 1));
  await browser.close();
})();
