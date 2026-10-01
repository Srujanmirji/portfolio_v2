"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cursor.current;
    const label = element?.querySelector("span");
    if (!element || !label) return;
    const allowed = matchMedia("(min-width: 48rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let visible = false;
    let x = 0;
    let y = 0;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      visible = false;
      element.style.transition = "none";
      element.dataset.visible = "false";
      element.dataset.pressed = "false";
      delete document.documentElement.dataset.customCursor;
    };
    const render = () => {
      frame = 0;
      const target = document.elementFromPoint(x, y);
      if (!allowed.matches || !target || target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), button:disabled, [aria-disabled="true"], [data-cursor="native"]')) {
        hide();
        return;
      }
      const action = target.closest('a[href], button, summary, [role="button"], [data-cursor]');
      const requested = action?.closest("[data-cursor]")?.getAttribute("data-cursor");
      const text = action ? (requested === "VIEW" || requested === "EXPLORE" ? requested : "OPEN") : "";
      if (label.textContent !== text) label.textContent = text;
      element.dataset.interactive = String(Boolean(action));
      // Snap the first position; interpolate only after the pointer is on the page.
      if (visible) element.style.removeProperty("transition");
      else element.style.transition = "none";
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.dataset.visible = "true";
      document.documentElement.dataset.customCursor = "true";
      visible = true;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !allowed.matches) { hide(); return; }
      x = event.clientX;
      y = event.clientY;
      schedule();
    };
    const scroll = () => { if (visible) schedule(); };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") hide(); };
    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      element.dataset.pressed = "true";
    };
    const pointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        element.dataset.pressed = "false";
      }
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", pointerDown, { passive: true });
    document.addEventListener("pointerup", pointerUp, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    allowed.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("scroll", scroll, true);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      allowed.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={cursor} className="custom-cursor" aria-hidden="true">
      <div className="cursor-disc" />
      <span className="cursor-label" />
    </div>
  );
}
