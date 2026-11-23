// DEV-15 · Mide el acabado del fondo (bloom + grano) con la GPU real del equipo (ANGLE D3D11).
//   1. Qué shaders se compilan (¿llevan los bloques POSTFX y GRAIN?) y en qué tier quedó la página.
//   2. Brillo máximo del fondo en una zona sin texto del hero (para el contraste del texto).
//   3. Huella de los píxeles del video (canvas 2D) en 3 puntos de la historia, con scroll nativo exacto:
//      el efecto no debe cambiar ni un píxel del video.
//   4. FPS medios y percentil 95 del tiempo de frame durante 6 s de scroll continuo con la rueda.
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node fondo-fx.cjs <url con query> [ancho alto dpr]
// Salida: una línea JSON.
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2];
const [W, H, DPR] = [Number(process.argv[3] || 1440), Number(process.argv[4] || 900), Number(process.argv[5] || 1)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const captureShaders = () => {
  window.__shaders = [];
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const original = C.prototype.shaderSource;
    C.prototype.shaderSource = function (shader, src) {
      window.__shaders.push(src);
      return original.call(this, shader, src);
    };
  }
};

async function open(browser, reduce) {
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" }]);
  await page.evaluateOnNewDocument(captureShaders);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 120)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
  await page.goto(URL_, { waitUntil: "load" });
  // El cursor personalizado (punto mostaza) no es parte del fondo: se oculta para medir
  await page.addStyleTag({ content: "[data-custom-cursor]{display:none!important}" });
  await wait(5000);
  return { page, errors };
}

/** Máximo y media de luminancia (0-255 por canal) de una captura PNG, analizada en la propia página */
async function stats(page, base64) {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let max = [0, 0, 0];
    let maxSum = 0;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const s = d[i] + d[i + 1] + d[i + 2];
      sum += s;
      if (s > maxSum) {
        maxSum = s;
        max = [d[i], d[i + 1], d[i + 2]];
      }
    }
    const hex = "#" + max.map((v) => v.toString(16).padStart(2, "0")).join("");
    return { maxColor: hex, mean: +(sum / (d.length / 4) / 3).toFixed(2) };
  }, base64);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
  });

  // 1-2 · Shaders y brillo del fondo (con movimiento: el brillo del puntero y la velocidad cuentan)
  const { page, errors } = await open(browser, false);
  const info = await page.evaluate(() => {
    const frag = window.__shaders.filter((s) => s.includes("uColorAccent"));
    const seq = document.querySelector("canvas[role='img']");
    return {
      backgroundShaders: frag.length,
      withPostFx: frag.filter((s) => s.includes("#define POSTFX")).length,
      sequenceCanvas: seq ? `${seq.width}×${seq.height}` : null,
      webglCanvas: document.querySelectorAll("[data-testid='global-canvas'] canvas").length,
      withGrain: frag.filter((s) => s.includes("#define GRAIN")).length,
    };
  });
  const region = { x: Math.round(W * 0.72), y: Math.round(H * 0.15), width: Math.round(W * 0.26), height: Math.round(H * 0.6) };
  let worst = { maxColor: "#000000", mean: 0 };
  for (let k = 0; k < 10; k++) {
    await page.mouse.move(region.x + (k % 5) * (region.width / 5), region.y + (k % 3) * (region.height / 3), { steps: 4 });
    await wait(400);
    const s = await stats(page, await page.screenshot({ clip: region, encoding: "base64" }));
    const lum = (h) => parseInt(h.slice(1, 3), 16) + parseInt(h.slice(3, 5), 16) + parseInt(h.slice(5, 7), 16);
    if (lum(s.maxColor) > lum(worst.maxColor)) worst = s;
  }

  // 4 · FPS durante 6 s de scroll continuo por la historia
  await page.mouse.move(W / 2, H / 2);
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const loop = (t) => {
      window.__frames.push(t - last);
      last = t;
      if (window.__frames.length < 100000) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  const t0 = Date.now();
  while (Date.now() - t0 < 6000) {
    await page.mouse.wheel({ deltaY: 120 });
    await wait(30);
  }
  const fps = await page.evaluate(() => {
    const f = window.__frames.slice(5);
    const total = f.reduce((a, b) => a + b, 0);
    const sorted = [...f].sort((a, b) => a - b);
    return { avg: +(1000 / (total / f.length)).toFixed(1), p95ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1), frames: f.length };
  });
  await page.close();

  // 3 · Huella del video con scroll nativo exacto (reduced motion: sin Lenis ni inercia)
  const r = await open(browser, true);
  const prints = [];
  for (const share of [0.15, 0.4, 0.65]) {
    await r.page.evaluate((s) => scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * s)), share);
    // Se espera a que el video quede quieto (frame decodificado y mezcla terminada): 3 huellas iguales seguidas
    const print = () =>
      r.page.evaluate(() => {
        const c = document.querySelector("canvas[role='img']");
        const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
        let h = 0;
        for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0;
        return h.toString(16);
      });
    let last = "";
    let same = 0;
    for (let k = 0; k < 40 && same < 3; k++) {
      await wait(500);
      const p = await print();
      same = p === last ? same + 1 : 0;
      last = p;
    }
    prints.push(last);
  }
  await browser.close();
  console.log(JSON.stringify({ url: URL_, viewport: `${W}×${H}@${DPR}`, ...info, backgroundPeak: worst, fps, videoPrints: prints, errors: [...errors, ...r.errors] }));
})();
