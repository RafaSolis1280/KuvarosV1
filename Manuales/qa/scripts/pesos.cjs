// DEV-01 · Mide los pesos del budget en el navegador (bytes que viajan por la red, ya comprimidos):
//   - peso crítico: todo lo descargado hasta la carga completa + 2 s quieto arriba (primer impacto: hero)
//   - peso total: después de recorrer la página entera con la rueda (frames incluidos)
// También devuelve LCP y CLS del navegador y separa el JS.
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node pesos.cjs <url> desktop|mobile
//   desktop: 1440×900 con la GPU real (detect-gpu da el tier del equipo)
//   mobile:  412×823, táctil, user agent de Android (detect-gpu → T2, frames «mobile»)
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3102/";
const MODE = process.argv[3] || "desktop";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    protocolTimeout: 0,
    args: ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  if (MODE === "mobile") {
    await page.emulate({
      viewport: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true },
      userAgent: "Mozilla/5.0 (Linux; Android 14; SM-A556B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36",
    });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setCacheEnabled(false);

  const cdp = await page.createCDPSession();
  await cdp.send("Network.enable");
  const types = new Map();
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, { type: e.type, url: e.response.url }));
  const bytes = { total: 0, js: 0, frames: 0, other: 0 };
  cdp.on("Network.loadingFinished", (e) => {
    const t = types.get(e.requestId) || {};
    bytes.total += e.encodedDataLength;
    if (t.type === "Script") bytes.js += e.encodedDataLength;
    else if (t.url && t.url.includes("/sequences/")) bytes.frames += e.encodedDataLength;
    else bytes.other += e.encodedDataLength;
  });

  await page.evaluateOnNewDocument(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__vitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(URL_, { waitUntil: "load" });
  await wait(2000);
  const critical = { ...bytes };
  const vitals = await page.evaluate(() => window.__vitals);
  const variant = await page.evaluate(() => {
    const e = performance.getEntriesByType("resource").find((r) => r.name.includes("/sequences/"));
    return e ? (e.name.includes("/desktop/") ? "desktop" : "mobile") : "?";
  });

  // Recorrido completo (para el peso total con streaming)
  await page.mouse.move(200, 300);
  for (let k = 0; k < 500; k++) {
    if (MODE === "mobile") await page.evaluate(() => scrollBy(0, 220));
    else await page.mouse.wheel({ deltaY: 300 });
    await wait(45);
    if (k % 20 === 19 && (await page.evaluate(() => scrollY >= document.documentElement.scrollHeight - innerHeight - 2))) break;
  }
  await wait(3000);
  const total = { ...bytes };
  const kb = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v / 1024)]));
  console.log(
    JSON.stringify({ mode: MODE, variant, critico_KB: kb(critical), total_KB: kb(total), lcpMs: Math.round(vitals.lcp), cls: +vitals.cls.toFixed(3) })
  );
  await browser.close();
})();
