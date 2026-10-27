"use client";

import { useEffect } from "react";

/** Czy element (albo jego rodzic) sam przewija się w tę stronę – wtedy kółko należy do niego, nie do strony. */
function scrollsItself(start: EventTarget | null, dy: number) {
  for (let el = start instanceof Element ? start : null; el && el !== document.documentElement; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight) return true;
    }
  }
  return false;
}

/**
 * Płynne przewijanie kółkiem myszy (to samo podejście co Lenis): zbieramy przesunięcie z kółka i dojeżdżamy
 * do celu z wygładzeniem. Strona dalej przewija się natywnie, więc sticky i animacje sterowane przewijaniem
 * działają bez zmian. Dotyk, klawiatura i ograniczony ruch zostają przy zwykłym przewijaniu.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let target = window.scrollY;
    let current = target;
    let animating = false;
    let raf = 0;
    let last = 0;

    const stop = () => {
      animating = false;
      cancelAnimationFrame(raf);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      current += (target - current) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - current) < 0.5) {
        current = target;
        animating = false;
      }
      window.scrollTo({ top: current, behavior: "instant" });
      if (animating) raf = requestAnimationFrame(frame);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || scrollsItself(event.target, event.deltaY)) return;
      event.preventDefault();
      if (!animating) target = current = window.scrollY;
      const unit = event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? window.innerHeight : 1;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.min(max, Math.max(0, target + event.deltaY * unit));
      if (!animating) {
        animating = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    // Stronę przewinęło coś innego (klawiatura, kotwica, trasa makiety) – oddajemy mu ster.
    const onScroll = () => {
      if (animating && Math.abs(window.scrollY - current) > 2) stop();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
