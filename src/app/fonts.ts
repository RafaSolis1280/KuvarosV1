// DEV-08 · Tipografías de marca (Manual de marca, Página 5). next/font las descarga en el build y las sirve
// desde el propio dominio (sin peticiones a Google en el navegador) con métricas de fallback → sin CLS.
// · Secundaria (oficial): League Spartan (licencia SIL OFL 1.1).
// · Primaria / display: el manual no da el nombre (está en curvas). Bree Serif (OFL) es un PROVISIONAL cercano
//   al wordmark de los empaques; se reemplaza por la fuente real con next/font/local cuando ART-04 la entregue.
// Las variables CSS que declaran se usan en el @theme de globals.css (--font-display / --font-sans).
import { Bree_Serif, League_Spartan } from "next/font/google";

export const fontDisplay = Bree_Serif({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-display" });
export const fontSans = League_Spartan({ subsets: ["latin", "latin-ext"], variable: "--font-kuvaros-sans" });

/** Clases que registran las variables de las dos familias en <html> */
export const fontVariables = `${fontDisplay.variable} ${fontSans.variable}`;
