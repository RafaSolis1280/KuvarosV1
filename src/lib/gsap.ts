// DEV-38 · Punto único de entrada a GSAP: registra los plugins una sola vez para toda la app.
// Importar siempre desde aquí (`import { gsap, ScrollTrigger } from "@/lib/gsap"`), no desde "gsap".
// DEV-18: SplitText (titular cinético) y CustomEase (curvas cubic-bezier de la marca).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export { gsap, ScrollTrigger, SplitText, CustomEase };
