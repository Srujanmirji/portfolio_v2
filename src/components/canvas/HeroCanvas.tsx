"use client";

import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const portrait = element?.parentElement;
    const image = portrait?.querySelector("img");
    if (!element || !portrait || !image) return;
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const allowed = matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let cleanup: ((releaseContext?: boolean) => void) | undefined;
    let generation = 0;
    let visible = false;
    const update = () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      element.dataset.state = "fallback";
      if (!visible || !allowed.matches || device.connection?.saveData || (device.deviceMemory !== undefined && device.deviceMemory <= 2) || navigator.hardwareConcurrency <= 2) return;
      // The DOM image is the loading, failure and accessibility surface.
      void Promise.all([import("./portraitScene"), image.decode()]).then(([scene]) => {
        if (current !== generation || !visible) return;
        cleanup = scene.mountPortraitScene(element, image);
      }).catch(() => { if (current === generation) element.dataset.state = "unavailable"; });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !cleanup) update();
    });
    observer.observe(portrait);
    allowed.addEventListener("change", update);
    update();
    return () => { generation++; cleanup?.(true); observer.disconnect(); allowed.removeEventListener("change", update); };
  }, []);
  return <canvas ref={canvas} className="hero-canvas" aria-hidden="true" data-state="fallback" />;
}
