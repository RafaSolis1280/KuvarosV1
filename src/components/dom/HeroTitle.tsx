"use client";

// DEV-18 · Titular del hero con tipografía cinética. El <h1> se renderiza en el servidor con su texto
// completo (SEO, LCP y lectores de pantalla); en el navegador SplitText lo divide en líneas y letras y
// las letras suben desde debajo de su línea con la curva de la marca. Al terminar se deshace la división
// (el DOM vuelve a ser el del servidor). Sin animación con prefers-reduced-motion.
// Ver HeroTitle.css para el estado antes de que cargue JavaScript.
import { useEffect, useRef } from "react";
import { gsap, SplitText, CustomEase } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { HERO_TITLE } from "@/config/motion";
import "./HeroTitle.css";

interface Props {
  linea1: string;
  /** Parte destacada en mostaza */
  destacado: string;
  className?: string;
}

export default function HeroTitle({ linea1, destacado, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = ref.current;
    if (!title) return;
    if (prefersReducedMotion()) {
      title.dataset.split = "true"; // sin animación: visible tal como vino del servidor
      return;
    }

    const ease = CustomEase.create("hero-title", HERO_TITLE.ease);
    const split = SplitText.create(title, {
      type: "lines,chars",
      mask: "lines",
      linesClass: "hero-title-line",
      // Si cambian el ancho o la fuente (next/font termina de cargar), se vuelve a dividir y la
      // animación devuelta continúa donde iba
      autoSplit: true,
      onSplit: (self) => {
        const tween = gsap.from(self.chars, {
          yPercent: HERO_TITLE.fromYPercent,
          duration: HERO_TITLE.duration,
          stagger: HERO_TITLE.stagger,
          delay: HERO_TITLE.delay,
          ease,
          // Al terminar, el DOM vuelve a ser el texto del servidor (sin spans ni máscaras)
          onComplete: () => {
            self.revert();
            self.kill();
          },
        });
        // Las letras ya están en su estado inicial (immediateRender): se puede mostrar el titular
        title.dataset.split = "true";
        return tween;
      },
    });

    return () => {
      split.revert();
      split.kill();
    };
  }, []);

  return (
    <h1 ref={ref} data-hero-title className={className}>
      {linea1} <span className="text-accent">{destacado}</span>
    </h1>
  );
}
