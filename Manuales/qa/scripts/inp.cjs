// DEV-28 · INP de laboratorio (Interaction to Next Paint) con interacciones reales en un móvil emulado.
// Lighthouse en modo navegación no mide INP: aquí se registran las entradas `event` del navegador
// (PerformanceObserver, umbral 16 ms) y se agrupan por interactionId. INP = la interacción más lenta
// (con menos de 50 interacciones, la definición de web.dev usa el peor caso).
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node inp.cjs <url> [cpu=4]
// Interacciones: toques en el CTA de la cabecera y en el logo, teclado (Tab y Enter en el enlace
// «Saltar al contenido») y, si el formulario está en la página, escribir en cada campo y enviarlo vacío
// (validación con mensajes de error) y completo.
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3102/";
const CPU = Number(process.argv[3] || 4);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    protocolTimeout: 0,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  // Móvil de gama media (perfil de Lighthouse): 412×823, DPR 1.75, táctil, CPU ×4
  await page.emulate({
    viewport: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true },
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36",
  });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const cdp = await page.createCDPSession();
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });

  await page.evaluateOnNewDocument(() => {
    window.__events = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.interactionId) window.__events.push({ id: e.interactionId, name: e.name, duration: e.duration, target: e.target?.tagName });
      }
    }).observe({ type: "event", durationThreshold: 16, buffered: true });
  });

  await page.goto(URL_, { waitUntil: "load" });
  await wait(6000); // hidratación + carga diferida del Canvas con la CPU ralentizada

  // Toque por coordenadas (el scrollIntoView automático de puppeteer se pelea con Lenis)
  const tapElement = async (el) => {
    const box = await el.evaluate((node) => {
      const r = node.getBoundingClientRect();
      if (r.top < 80 || r.bottom > innerHeight) scrollTo({ top: scrollY + r.top - innerHeight / 3, behavior: "instant" });
      const n = node.getBoundingClientRect();
      return { x: n.left + n.width / 2, y: n.top + n.height / 2 };
    });
    await wait(600);
    await page.touchscreen.tap(box.x, box.y);
    await wait(1200);
  };
  const tap = async (selector) => {
    const el = await page.$(selector);
    if (!el) return false;
    await tapElement(el);
    return true;
  };
  const done = [];
  if (await tap('header a[href="#contacto"]')) done.push("tap CTA cabecera");
  if (await tap('header a[href="#inicio"]')) done.push("tap logo");
  // Teclado: desde el principio del documento, el primer Tab llega a «Saltar al contenido» (ancla interna).
  // Solo se pulsa Enter si el foco está en un ancla interna: un enlace externo sacaría la página del sitio.
  await page.evaluate(() => {
    document.activeElement?.blur();
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
    document.body.removeAttribute("tabindex");
  });
  await page.keyboard.press("Tab");
  await wait(400);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("href") ?? "");
  if (focused.startsWith("#")) {
    await page.keyboard.press("Enter");
    await wait(1500);
    done.push(`Tab + Enter (${focused})`);
  }

  const form = await page.$("form");
  if (form) {
    await tap('form button[type="submit"]');
    done.push("enviar vacío (errores)");
    const fields = await page.$$("form input:not([type=hidden]):not([tabindex='-1']), form textarea");
    for (const f of fields) {
      await tapElement(f);
      await page.keyboard.type("Hola Kuvaros 123", { delay: 60 });
      await wait(300);
    }
    done.push(`escribir en ${fields.length} campos`);
  }

  await wait(1000);
  const events = await page.evaluate(() => window.__events);
  const byId = new Map();
  for (const e of events) {
    const prev = byId.get(e.id);
    if (!prev || e.duration > prev.duration) byId.set(e.id, e);
  }
  const worst = [...byId.values()].sort((a, b) => b.duration - a.duration);
  console.log(
    JSON.stringify({
      url: URL_,
      cpu: CPU,
      interacciones: done,
      interaccionesMedidas: byId.size,
      inpMs: worst[0] ? Math.round(worst[0].duration) : 0,
      peores: worst.slice(0, 5).map((e) => `${e.name}@${e.target}:${Math.round(e.duration)}ms`),
    })
  );
  await browser.close();
})();
