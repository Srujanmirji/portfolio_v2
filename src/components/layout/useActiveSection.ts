"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sections, type SectionId } from "@/data/sections";

export function useActiveSection() {
  const pathname = usePathname();
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    if (pathname !== "/") return;
    const elements = sections.map(({ id }) => document.getElementById(id));
    const header = document.querySelector(".site-header");
    const anchor = () => {
      const top = header?.getBoundingClientRect().bottom ?? 0;
      return Math.min(window.innerHeight - 2, top + (window.innerHeight - top) * 0.25);
    };
    let observer: IntersectionObserver;
    const update = () => {
      let current: SectionId = "home";
      elements.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top <= anchor() + 1) {
          current = sections[index].id;
        }
      });
      setActive(current);
    };
    const observe = () => {
      observer?.disconnect();
      const line = anchor();
      observer = new IntersectionObserver(update, {
        rootMargin: `${-line}px 0px ${-(window.innerHeight - line - 1)}px 0px`,
      });
      elements.forEach((element) => { if (element) observer.observe(element); });
      update();
    };
    const frame = requestAnimationFrame(observe);
    // Hydrated controls, fonts and desktop pins can move native hash targets.
    // Restore arrival once at every viewport, without overriding visitor input.
    const initialHash = window.location.hash;
    const input = new AbortController();
    let interacted = false;
    let alive = true;
    let anchorFrame = 0;
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      window.addEventListener(event, () => { interacted = true; }, { once: true, passive: true, signal: input.signal });
    }
    void document.fonts.ready.then(() => {
      if (!alive) return;
      anchorFrame = requestAnimationFrame(() => {
        if (!interacted && initialHash && window.location.hash === initialHash) {
          document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: "instant" });
        }
        input.abort();
      });
    });
    const headerSize = new ResizeObserver(observe);
    if (header) headerSize.observe(header);
    window.addEventListener("resize", observe);
    return () => {
      alive = false;
      input.abort();
      cancelAnimationFrame(anchorFrame);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      headerSize.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [pathname]);

  return pathname === "/" ? active : pathname.startsWith("/work/") ? "work" : null;
}
