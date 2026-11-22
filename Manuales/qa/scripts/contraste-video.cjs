// DEV-29 · Auditoría de contraste del texto que flota sobre el video, en Chrome headless (velocidad real).
// Recorre la sección fijada en STEPS pasos y, para cada texto visible (opacidad efectiva ≥ 0.99), mide el
// fondo real: píxeles del canvas de la secuencia bajo el texto (promediados por bloques del tamaño del
// desenfoque si está dentro de un panel de vidrio) compuestos con el color del panel. Devuelve el peor
// contraste de cada texto y los que no llegan a 4.5:1 (3:1 si es texto grande).
// Requiere puppeteer-core (no es dependencia del proyecto: viene con `npx lighthouse`) y el build corriendo:
//   PUPPETEER_PATH=<ruta a node_modules/puppeteer-core> STEPS=100 node contraste-video.cjs http://localhost:3102/ 1440 900
// Script CommonJS de QA (fuera de la app): require es lo esperado aquí
// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require(process.env.PUPPETEER_PATH);
const AUDIT = async (STEPS_ARG, WAIT_ARG) => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  const toRGBA = (css) => {
    pctx.clearRect(0, 0, 1, 1);
    pctx.fillStyle = "rgba(0,0,0,0)";
    pctx.fillStyle = css;
    pctx.fillRect(0, 0, 1, 1);
    const d = pctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const lin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = ([r, g, b, a], [R, G, B]) => [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)];
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const effOpacity = (el) => {
    let o = 1;
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden") return 0;
      o *= +s.opacity;
    }
    return o;
  };

  const pin = document.querySelector(".pin-spacer");
  const canvas = pin.querySelector("canvas");
  const cctx = canvas.getContext("2d");
  const start = pin.getBoundingClientRect().top + scrollY;
  const end = start + pin.offsetHeight - innerHeight;
  const worst = new Map();
  const STEPS = STEPS_ARG;

  for (let k = 0; k <= STEPS; k++) {
    window.scrollTo(0, Math.round(start + ((end - start) * k) / STEPS));
    await wait(WAIT_ARG);
    const crect = canvas.getBoundingClientRect();
    const sx = canvas.width / crect.width;
    const sy = canvas.height / crect.height;
    const texts = [...pin.querySelectorAll("*")].filter(
      (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !el.closest(".sr-only") && el.getClientRects().length
    );
    for (const el of texts) {
      if (effOpacity(el) < 0.99) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.bottom < 0 || r.top > innerHeight) continue;
      const cs = getComputedStyle(el);
      // Panel de vidrio: el ancestro con backdrop-filter (y su color de fondo)
      let panel = null;
      for (let n = el; n && n !== pin; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.backdropFilter && s.backdropFilter !== "none") {
          panel = { color: toRGBA(s.backgroundColor), blurPx: parseFloat(s.backdropFilter.replace(/[^0-9.]/g, "")) || 0 };
          break;
        }
      }
      // Región del canvas bajo el texto (en píxeles del canvas)
      const x0 = Math.max(0, Math.floor((r.left - crect.left) * sx));
      const y0 = Math.max(0, Math.floor((r.top - crect.top) * sy));
      const w = Math.max(1, Math.min(canvas.width - x0, Math.ceil(r.width * sx)));
      const h = Math.max(1, Math.min(canvas.height - y0, Math.ceil(r.height * sy)));
      const data = cctx.getImageData(x0, y0, w, h).data;
      // Con vidrio: promedio por bloques del tamaño del desenfoque (≈ lo que se ve detrás); sin vidrio: píxel a píxel
      const block = panel ? Math.max(1, Math.round(panel.blurPx * 2 * sx)) : 1;
      let brightest = [0, 0, 0];
      let brightestL = -1;
      for (let by = 0; by < h; by += block) {
        for (let bx = 0; bx < w; bx += block) {
          let R = 0, G = 0, B = 0, n = 0;
          for (let y = by; y < Math.min(h, by + block); y++) {
            for (let x = bx; x < Math.min(w, bx + block); x++) {
              const i = (y * w + x) * 4;
              R += data[i]; G += data[i + 1]; B += data[i + 2]; n++;
            }
          }
          const px = [R / n, G / n, B / n];
          const L = lum(px);
          if (L > brightestL) { brightestL = L; brightest = px; }
        }
      }
      const bg = panel ? over(panel.color, brightest) : brightest;
      const fg = over(toRGBA(cs.color), bg);
      const size = parseFloat(cs.fontSize);
      const bold = +cs.fontWeight >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const c = ratio(fg, bg);
      const key = el.tagName + ":" + el.textContent.trim().slice(0, 28);
      const prev = worst.get(key);
      if (!prev || c < prev.c) worst.set(key, { c: +c.toFixed(2), need: large ? 3 : 4.5, size, step: k, panel: !!panel, bgL: +lum(bg).toFixed(3) });
    }
  }
  const rows = [...worst.entries()].map(([k, v]) => ({ text: k, ...v, ok: v.c >= v.need }));
  return { w: innerWidth, total: rows.length, fails: rows.filter((r) => !r.ok), min: rows.sort((a, b) => a.c - b.c).slice(0, 8) };
};
(async () => {
  const [url, w, h] = [process.argv[2], +process.argv[3], +process.argv[4]];
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.setDefaultTimeout(0); await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  const res = await page.evaluate(AUDIT, +(process.env.STEPS || 120), +(process.env.WAIT || 650));
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
