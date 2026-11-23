// DEV-13 · Verificación del preloader en Chrome headless, con la GPU real.
// Por perfil (desktop sin límites; móvil con Fast 4G o Slow 4G y CPU ×4) mide:
//   - critico_ms: cuándo termina la carga crítica (marca `kuvaros:critical-done`, desde el inicio de la navegación)
//   - el panel: estado a lo largo del tiempo (loading → ready → hidden)
//   - frames: cuántos se descargaron de la red, si alguno se pidió dos veces y cuántos vinieron del caché
//   - tareas largas (> 50 ms) mientras se descarga en segundo plano, y el máximo de ImageBitmaps vivos (DEV-26)
//   - primer scroll: tiempos de frame (rAF) del primer gesto de scroll tras la carga crítica
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node preloader.cjs <url> desktop|fast4g|slow4g
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3102/";
const PROFILE = process.argv[3] || "desktop";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const NETWORK = {
  // Valores de los perfiles de Chrome DevTools (kbps → bytes/s)
  fast4g: { latency: 60, downloadThroughput: (9000 * 1024) / 8, uploadThroughput: (1500 * 1024) / 8 },
  slow4g: { latency: 150, downloadThroughput: (1600 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    protocolTimeout: 0,
    args: ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  const mobile = PROFILE !== "desktop";
  if (mobile) {
    await page.emulate({
      viewport: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true },
      userAgent: "Mozilla/5.0 (Linux; Android 14; SM-A556B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36",
    });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setCacheEnabled(true);
  const cdp = await page.createCDPSession();
  await cdp.send("Network.enable");
  await cdp.send("Network.clearBrowserCache");
  if (NETWORK[PROFILE]) {
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...NETWORK[PROFILE] });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }

  const frameNet = new Map(); // url → descargas reales (no caché)
  let frameCached = 0;
  const variants = new Set();
  const methods = new Map(); // requestId → método (la sonda HEAD de la secuencia no es una descarga)
  cdp.on("Network.requestWillBeSent", (e) => methods.set(e.requestId, e.request.method));
  cdp.on("Network.responseReceived", (e) => {
    const u = e.response.url;
    if (!u.includes("/sequences/") || methods.get(e.requestId) === "HEAD") return;
    variants.add(u.includes("/desktop/") ? "desktop" : "mobile");
    if (e.response.fromDiskCache || e.response.fromPrefetchCache || e.response.fromServiceWorker || e.response.fromMemoryCache) frameCached++;
    else if (e.type !== "Preflight") frameNet.set(u, (frameNet.get(u) || 0) + 1);
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 150)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 150)));

  await page.evaluateOnNewDocument(() => {
    window.__long = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }))).observe({ type: "longtask", buffered: true });
    const stats = (window.__bmp = { live: 0, max: 0 });
    const create = window.createImageBitmap.bind(window);
    const alive = new WeakSet();
    window.createImageBitmap = async (...a) => {
      const b = await create(...a);
      alive.add(b);
      stats.max = Math.max(stats.max, ++stats.live);
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

  await page.goto(URL_, { waitUntil: "domcontentloaded" });
  // Estado del panel en el tiempo
  const timeline = [];
  const t0 = Date.now();
  let critical = null;
  while (Date.now() - t0 < 15000) {
    const s = await page.evaluate(() => {
      const p = document.querySelector("[data-preloader]");
      const m = performance.getEntriesByName("kuvaros:critical-done")[0];
      return { panel: p ? p.dataset.state : "—", critico: m ? Math.round(m.startTime) : null };
    });
    if (!timeline.length || timeline[timeline.length - 1].panel !== s.panel) timeline.push({ ms: Date.now() - t0, panel: s.panel });
    if (s.critico != null) critical = s.critico;
    if (critical != null && s.panel === "hidden") break;
    await wait(100);
  }

  // Primer scroll justo después: tiempos de frame (rAF) durante 2 s de rueda / toque
  await page.evaluate(() => {
    window.__ft = [];
    let last = performance.now();
    const loop = (t) => {
      window.__ft.push(+(t - last).toFixed(1));
      last = t;
      if (window.__ft.length < 2000) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  const s0 = Date.now();
  await page.mouse.move(200, 400);
  while (Date.now() - s0 < 2000) {
    if (mobile) await page.evaluate(() => scrollBy(0, 30));
    else await page.mouse.wheel({ deltaY: 120 });
    await wait(30);
  }
  const ft = await page.evaluate(() => window.__ft.slice(2));

  // Espera a que termine la descarga en segundo plano
  const s1 = Date.now();
  while (Date.now() - s1 < (PROFILE === "slow4g" ? 60000 : 20000)) {
    if (await page.evaluate(() => performance.getEntriesByName("kuvaros:stream-done").length > 0)) break;
    await wait(250);
  }
  const res = await page.evaluate(() => ({
    streamDone: Math.round(performance.getEntriesByName("kuvaros:stream-done")[0]?.startTime ?? -1),
    h1: document.querySelector("h1")?.textContent?.trim(),
    long: window.__long,
    bitmapsMax: window.__bmp.max,
    lcp: Math.round(performance.getEntriesByType("largest-contentful-paint").at(-1)?.startTime ?? -1),
  }));
  await browser.close();

  const sorted = [...ft].sort((a, b) => a - b);
  const dupes = [...frameNet.entries()].filter(([, n]) => n > 1).map(([u]) => u.split("/sequences/")[1]);
  console.log(
    JSON.stringify({
      perfil: PROFILE,
      critico_ms: critical,
      panel: timeline,
      frames: { red: frameNet.size, duplicados: dupes, deCache: frameCached, variantes: [...variants] },
      streamDone_ms: res.streamDone,
      tareasLargas: res.long.length,
      tareaMasLarga_ms: res.long.reduce((m, e) => Math.max(m, e.d), 0),
      bitmapsMax: res.bitmapsMax,
      primerScroll: { frames: ft.length, mediana_ms: sorted[Math.floor(sorted.length / 2)], p95_ms: sorted[Math.floor(sorted.length * 0.95)], max_ms: sorted.at(-1), mayores50ms: ft.filter((x) => x > 50).length },
      primerScrollSerie: ft.slice(0, 120),
      lcp_ms: res.lcp,
      errores: errors,
    })
  );
})();
