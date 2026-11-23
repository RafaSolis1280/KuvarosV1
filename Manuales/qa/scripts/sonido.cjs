// DEV-16 · Prueba del sonido ambiente (SoundController) en Chrome headless.
// Instrumenta Web Audio antes de que cargue la página (AudioContext, filtro low-pass y volumen) y comprueba:
//   1. Antes de pulsar: ningún AudioContext creado y ninguna petición a /audio (opt-in).
//   2. Al pulsar (ratón y teclado): se crea el contexto, suena (volumen → 0.4) y aria-pressed = true.
//   3. El corte del low-pass sube con el scroll rápido y vuelve a ~400 Hz en reposo.
//   4. Con la pestaña oculta el contexto se suspende; al volver, se reanuda.
//   5. Al silenciar: volumen → 0 y el contexto se suspende tras el fundido.
//   6. Si el archivo de audio falla (404 simulado), el botón desaparece y no hay errores de JS.
// Requiere que /public/audio tenga el audio (si no, el botón no existe y el script lo informa).
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node sonido.cjs <url>
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3000/";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const instrument = () => {
  const audio = (window.__audio = { contexts: [], filters: [], gains: [] });
  const Original = window.AudioContext;
  window.AudioContext = class extends Original {
    constructor(...args) {
      super(...args);
      audio.contexts.push(this);
    }
  };
  const createBiquad = Original.prototype.createBiquadFilter;
  Original.prototype.createBiquadFilter = function () {
    const node = createBiquad.call(this);
    audio.filters.push(node);
    return node;
  };
  const createGain = Original.prototype.createGain;
  Original.prototype.createGain = function () {
    const node = createGain.call(this);
    audio.gains.push(node);
    return node;
  };
};

const state = (page) =>
  page.evaluate(() => {
    const a = window.__audio;
    const btn = document.querySelector("[data-sound-toggle]");
    return {
      boton: btn ? { ariaLabel: btn.getAttribute("aria-label"), pressed: btn.getAttribute("aria-pressed") } : null,
      contextos: a.contexts.length,
      estado: a.contexts[0]?.state ?? null,
      corteHz: a.filters[0] ? Math.round(a.filters[0].frequency.value) : null,
      volumen: a.gains[0] ? +a.gains[0].gain.value.toFixed(2) : null,
    };
  });

async function open(browser, { failAudio = false } = {}) {
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const errors = [];
  const audioRequests = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errors.push(m.text().slice(0, 160)));
  if (failAudio) {
    await page.setRequestInterception(true);
    page.on("request", (req) => (req.url().includes("/audio/") ? req.respond({ status: 404, body: "" }) : req.continue()));
  }
  page.on("request", (req) => req.url().includes("/audio/") && audioRequests.push(req.url().split("/").pop()));
  await page.evaluateOnNewDocument(instrument);
  await page.goto(URL_, { waitUntil: "load" });
  await wait(4000);
  return { page, errors, audioRequests };
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    protocolTimeout: 0,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const out = {};
  const { page, errors, audioRequests } = await open(browser);
  out["1 · antes de pulsar"] = { ...(await state(page)), peticionesAudio: [...audioRequests] };
  if (!out["1 · antes de pulsar"].boton) {
    console.log(JSON.stringify({ ...out, nota: "sin botón: no hay audio en /public/audio", errors }, null, 1));
    return browser.close();
  }

  await page.click("[data-sound-toggle]");
  await wait(2500);
  out["2 · tras pulsar"] = { ...(await state(page)), peticionesAudio: [...audioRequests] };

  // Scroll rápido con la rueda: el corte sube; quieto: vuelve a bajar
  await page.mouse.move(720, 450);
  let maxCut = 0;
  for (let k = 0; k < 25; k++) {
    await page.mouse.wheel({ deltaY: 500 });
    await wait(40);
    maxCut = Math.max(maxCut, (await state(page)).corteHz);
  }
  out["3 · corte máximo con scroll rápido (Hz)"] = maxCut;
  await wait(3000);
  out["3 · corte en reposo tras 3 s (Hz)"] = (await state(page)).corteHz;

  // Pestaña oculta y de vuelta
  const setHidden = (hidden) =>
    page.evaluate((h) => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => h });
      document.dispatchEvent(new Event("visibilitychange"));
    }, hidden);
  await setHidden(true);
  await wait(500);
  out["4 · pestaña oculta"] = (await state(page)).estado;
  await setHidden(false);
  await wait(500);
  out["4 · pestaña visible otra vez"] = (await state(page)).estado;

  // Silenciar con el teclado (foco en el botón + Enter)
  await page.focus("[data-sound-toggle]");
  await page.keyboard.press("Enter");
  await wait(1500);
  out["5 · silenciado con Enter"] = await state(page);
  out["errores de JS"] = errors;
  await page.close();

  // 6 · El archivo falla
  const f = await open(browser, { failAudio: true });
  await f.page.click("[data-sound-toggle]");
  await wait(2500);
  out["6 · audio con 404"] = { ...(await state(f.page)), errores: f.errors };
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
