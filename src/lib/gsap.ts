// DEV-38 · Punto único de entrada a GSAP: registra ScrollTrigger una sola vez para toda la app.
// Importar siempre desde aquí (`import { gsap, ScrollTrigger } from "@/lib/gsap"`), no desde "gsap".
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
