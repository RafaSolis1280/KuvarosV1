// DEV-13 · Botones del preloader con ratón y teclado, y que el panel no tape el titular.
//   - «Entrar con sonido» (solo si hay audio en /public/audio): clic y tecla Espacio → el panel se va y el
//     sonido de DEV-16 arranca (AudioContext en marcha, botón de la cabecera con aria-pressed=true).
//   - «Saltar»: clic y tecla Enter → el panel se va y el foco pasa al contenido (#contenido).
//   - Escape cierra el panel. Sin audio el panel se va solo al terminar la carga crítica.
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node preloader-botones.cjs <url>
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3102/";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const instrumentAudio = () => {
  window.__ctx = [];
  const Original = window.AudioContext;
  window.AudioContext = class extends Original {
    constructor(...a) {
      super(...a);
      window.__ctx.push(this);
    }
  };
};

async function open(browser, { w = 1440, h = 900 } = {}) {
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: w, height: h });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 150)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 150)));
  await page.evaluateOnNewDocument(instrumentAudio);
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForSelector("[data-preloader]");
  await wait(300);
  return { page, errors };
}

const state = (page) =>
  page.evaluate(() => {
    const p = document.querySelector("[data-preloader]");
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const pr = p.getBoundingClientRect();
    const overlap = !(pr.bottom <= h1.top || pr.top >= h1.bottom || pr.right <= h1.left || pr.left >= h1.right);
    return {
      panel: p.dataset.state,
      botones: [...p.querySelectorAll("button")].map((b) => b.textContent.trim()),
      tapaTitular: overlap,
      foco: document.activeElement?.id || document.activeElement?.tagName,
      sonido: document.querySelector("[data-sound-toggle]")?.getAttribute("aria-pressed") ?? "sin botón",
      audio: window.__ctx[0]?.state ?? "sin contexto",
    };
  });

/** Tab hasta el botón del panel con ese texto (máx. 30 pasos) */
async function tabTo(page, text) {
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    const t = await page.evaluate(() => (document.activeElement?.closest("[data-preloader]") ? document.activeElement.textContent.trim() : ""));
    if (t === text) return true;
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, protocolTimeout: 0, args: ["--no-sandbox"] });
  const out = {};

  let { page, errors } = await open(browser);
  out["al cargar"] = await state(page);
  const conSonido = out["al cargar"].botones.includes("Entrar con sonido");

  if (conSonido) {
    await page.click("[data-preloader-action='sound']");
    await wait(2500);
    out["clic «Entrar con sonido»"] = await state(page);
    await page.close();

    ({ page } = await open(browser));
    out["teclado: Tab hasta «Entrar con sonido»"] = await tabTo(page, "Entrar con sonido");
    await page.keyboard.press("Space");
    await wait(2500);
    out["teclado: Espacio"] = await state(page);
    await page.close();
    ({ page } = await open(browser));
  } else {
    await wait(2500);
    out["sin audio: se va solo al terminar"] = await state(page);
    await page.close();
    ({ page } = await open(browser));
  }

  await page.click("[data-preloader-action='skip']");
  await wait(600);
  out["clic «Saltar»"] = await state(page);
  await page.close();

  ({ page } = await open(browser));
  out["teclado: Tab hasta «Saltar»"] = await tabTo(page, "Saltar");
  await page.keyboard.press("Enter");
  await wait(600);
  out["teclado: Enter en «Saltar»"] = await state(page);
  await page.close();

  ({ page } = await open(browser));
  await tabTo(page, "Saltar");
  await page.keyboard.press("Escape");
  await wait(600);
  out["Escape"] = (await state(page)).panel;
  await page.close();

  const m = await open(browser, { w: 375, h: 812 });
  out["375 px"] = await state(m.page);
  await m.page.close();

  out["errores"] = errors;
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
