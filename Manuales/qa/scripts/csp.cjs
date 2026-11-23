// DEV-34 · Comprueba que la Content-Security-Policy no rompe nada: recorre la página entera con la
// rueda (frames, benchmarks de detect-gpu, shader WebGL), usa el CTA y, si el formulario está en la
// página, lo envía con datos válidos. Cuenta las violaciones de CSP (evento securitypolicyviolation)
// y los errores de consola.
//
// Uso:   PUPPETEER_PATH=<ruta a puppeteer-core> node csp.cjs <url> [reduce] [gpu]
//        «gpu» usa la GPU real (ANGLE D3D11): así detect-gpu descarga sus benchmarks (con SwiftShader no).
/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require(process.env.PUPPETEER_PATH);

const URL_ = process.argv[2] || "http://localhost:3102/";
const REDUCE = process.argv.includes("reduce");
const REAL_GPU = process.argv.includes("gpu");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    protocolTimeout: 0,
    args: ["--no-sandbox", ...(REAL_GPU ? ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] : ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: REDUCE ? "reduce" : "no-preference" }]);

  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  const responses = { frames: 0, benchmarks: 0, failed: 0, api: null };
  page.on("requestfinished", (req) => {
    const u = req.url();
    if (u.includes("/sequences/")) responses.frames++;
    if (u.includes("/benchmarks/")) responses.benchmarks++;
  });
  page.on("requestfailed", () => responses.failed++);
  page.on("response", (res) => {
    if (res.url().includes("/api/contacto")) responses.api = res.status();
  });
  await page.evaluateOnNewDocument(() => {
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      window.__csp.push(`${e.violatedDirective} ← ${e.blockedURI || "inline"} (${e.sourceFile || "?"}:${e.lineNumber})`)
    );
  });

  await page.goto(URL_, { waitUntil: "load" });
  await wait(4000);
  const webgl = await page.evaluate(() => document.querySelectorAll("[data-testid='global-canvas'] canvas").length);

  // Recorrido completo con la rueda
  await page.mouse.move(720, 450);
  for (let k = 0; k < 400; k++) {
    await page.mouse.wheel({ deltaY: 300 });
    await wait(35);
    if (k % 20 === 19) {
      const end = await page.evaluate(() => scrollY >= document.documentElement.scrollHeight - innerHeight - 2);
      if (end) break;
    }
  }
  await wait(1500);
  const reachedEnd = await page.evaluate(() => scrollY >= document.documentElement.scrollHeight - innerHeight - 2);

  // CTA de la cabecera
  await page.evaluate(() => scrollTo(0, 0));
  await wait(1200);
  await page.click('header a[href="#contacto"]');
  await wait(2500);
  const ctaOk = await page.evaluate(() => Math.abs(document.getElementById("contacto").getBoundingClientRect().top - 72) < 4);

  // Formulario (solo si el build tiene servicio de envío)
  let formSent = "sin formulario en este build";
  if (await page.$("form")) {
    const fields = await page.$$eval("form input, form textarea", (els) =>
      els.filter((e) => e.type !== "hidden" && e.tabIndex !== -1).map((e) => ({ name: e.name, type: e.type || e.tagName }))
    );
    for (const f of fields) {
      const value = f.type === "email" ? "prueba@ejemplo.com" : f.type === "tel" ? "+591 70000000" : "Mensaje de prueba de la CSP, con más de veinte caracteres.";
      await page.type(`form [name="${f.name}"]`, value);
    }
    await page.click('form button[type="submit"]');
    await wait(2500);
    formSent = await page.evaluate(() => document.querySelector("form [role='status']")?.textContent?.trim() || "?");
  }

  const csp = await page.evaluate(() => window.__csp);
  console.log(
    JSON.stringify({ url: URL_, reduce: REDUCE, realGpu: REAL_GPU, webglCanvas: webgl, reachedEnd, ctaOk, responses, formSent, cspViolations: csp, errors }, null, 1)
  );
  await browser.close();
})();
