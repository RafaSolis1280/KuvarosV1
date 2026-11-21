"use client";

// DEV-24 · Cursor personalizado: un punto mostaza que sigue al puntero y un anillo que lo alcanza con
// inercia (damp()). Crece sobre enlaces y botones y se encoge al hacer clic.
// - Solo con ratón o trackpad ((hover: hover) and (pointer: fine)) y sin prefers-reduced-motion; si no,
//   no se monta nada y queda el cursor del sistema. En campos de texto se ve el cursor del sistema.
// - La posición se lee del store transiente (pointerNDC, que escribe SmoothScrollProvider) en gsap.ticker:
//   ningún setState de React por movimiento (Hard Constraint 1); el estado visual va en data-atributos.
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { damp } from "@/lib/math";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { useExperienceStore } from "@/store/useExperienceStore";
import { CUSTOM_CURSOR } from "@/config/motion";
import "./CustomCursor.css";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a[href], button, [role='button'], summary, label";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    const finePointer = window.matchMedia(FINE_POINTER);
    let stop: (() => void) | null = null;

    const start = () => {
      const html = document.documentElement;
      html.dataset.cursor = "custom";
      const ringPos = { x: -100, y: -100 };
      let seen = false;

      // Posición: del store transiente, en píxeles
      const tick = (_time: number, deltaMs: number) => {
        if (!seen) return;
        const { pointerNDC } = useExperienceStore.getState();
        const x = ((pointerNDC.x + 1) / 2) * window.innerWidth;
        const y = ((1 - pointerNDC.y) / 2) * window.innerHeight;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        const dt = Math.min(deltaMs / 1000, 0.1);
        const nx = damp(ringPos.x, x, CUSTOM_CURSOR.ringLambda, dt);
        const ny = damp(ringPos.y, y, CUSTOM_CURSOR.ringLambda, dt);
        if (Math.abs(nx - ringPos.x) < CUSTOM_CURSOR.restPx && Math.abs(ny - ringPos.y) < CUSTOM_CURSOR.restPx) return;
        ringPos.x = nx;
        ringPos.y = ny;
        ring.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
      };

      // Visibilidad y estado: eventos del DOM → data-atributos (sin re-renders)
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") {
          root.dataset.visible = "false"; // un toque en un equipo híbrido: fuera el cursor
          return;
        }
        if (!seen) {
          seen = true;
          ringPos.x = e.clientX; // el anillo arranca donde está el puntero, sin viajar desde la esquina
          ringPos.y = e.clientY;
          ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
        root.dataset.visible = "true";
      };
      const onOver = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target : null;
        root.dataset.state = target?.closest(TEXT_FIELD) ? "text" : target?.closest(INTERACTIVE) ? "link" : "default";
      };
      const onLeave = () => (root.dataset.visible = "false");
      const onDown = () => (root.dataset.pressed = "true");
      const onUp = () => (root.dataset.pressed = "false");

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        delete html.dataset.cursor;
        root.dataset.visible = "false";
      };
    };

    // Se activa o desactiva si cambia el dispositivo de entrada (p. ej. se conecta un ratón a una tablet)
    const sync = () => {
      const enabled = finePointer.matches && !prefersReducedMotion();
      if (enabled && !stop) stop = start();
      else if (!enabled && stop) {
        stop();
        stop = null;
      }
    };
    sync();
    finePointer.addEventListener("change", sync);
    return () => {
      finePointer.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-custom-cursor
      data-visible="false"
      data-state="default"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 stack-top overflow-hidden"
      style={{ "--cursor-hover-scale": CUSTOM_CURSOR.hoverScale, "--cursor-press-scale": CUSTOM_CURSOR.pressScale } as CSSProperties}
    >
      {/* Cada pieza se centra en su punto con márgenes negativos; el transform solo traslada */}
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div className="cursor-ring -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-ink/60" />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        <div className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
