"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useHorizontalProjects(stage: RefObject<HTMLDivElement | null>, onActive: (index: number) => void) {
  const navigate = useRef<((index: number) => void) | null>(null);
  useGSAP(() => {
    const element = stage.current;
    if (!element) return;
    const viewport = element.querySelector<HTMLElement>(".projects-viewport")!;
    const track = element.querySelector<HTMLElement>(".project-track")!;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".project-card"));
    if (!cards.length) return;
    element.setAttribute("data-ready", "true");
    let active = -1;
    let wasPinned = false;
    const update = (index: number, pinned: boolean) => {
      if (active === index && wasPinned === pinned) return;
      wasPinned = pinned;
      cards.forEach((card, i) => {
        card.dataset.active = String(i === index);
        card.inert = pinned && i !== index;
      });
      if (index !== active) { active = index; onActive(index); }
    };
    const updateVertical = () => {
      if (navigate.current) return;
      const anchor = window.innerHeight * 0.5;
      let current = 0;
      cards.forEach((card, index) => { if (card.getBoundingClientRect().top <= anchor) current = index; });
      update(current, false);
    };
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const center = window.innerHeight / 2;
      observer = new IntersectionObserver(updateVertical, { rootMargin: `${-center}px 0px ${-(center - 1)}px 0px` });
      cards.forEach((card) => observer.observe(card));
    };
    observe();
    window.addEventListener("resize", observe);

    const media = gsap.matchMedia();
    media.add("(min-width: 64rem) and (min-height: 48rem) and (prefers-reduced-motion: no-preference)", () => {
      element.setAttribute("data-horizontal", "true");
      const header = () => document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      if (element.offsetHeight > window.innerHeight - header() + 1) {
        element.removeAttribute("data-horizontal");
        return;
      }
      // Use layout widths, not transformed bounds: inactive cards scale down.
      const distance = () => Math.max(0, ...cards.map((card) => card.offsetLeft + card.offsetWidth - viewport.clientWidth));
      const offset = (index: number) => Math.min(cards[index].offsetLeft, distance());
      const tween = gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: element, start: () => `top ${header()}`, end: () => `+=${Math.max(distance(), 1)}`,
          pin: true, scrub: true, invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const x = trigger.progress * distance();
            let nearest = 0;
            cards.forEach((_, index) => { if (Math.abs(offset(index) - x) < Math.abs(offset(nearest) - x)) nearest = index; });
            update(nearest, true);
          },
        },
      });
      const trigger = tween.scrollTrigger!;
      navigate.current = (index) => {
        const y = trigger.start + offset(index) / Math.max(distance(), 1) * (trigger.end - trigger.start);
        window.scrollTo({ top: y, behavior: "instant" });
        ScrollTrigger.update();
      };
      update(0, true);
      // ResizeObserver also catches card widths changing without a window resize.
      let frame = 0;
      let width = viewport.clientWidth;
      let trackWidth = track.scrollWidth;
      const size = new ResizeObserver(() => {
        if (width === viewport.clientWidth && trackWidth === track.scrollWidth) return;
        width = viewport.clientWidth;
        trackWidth = track.scrollWidth;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      size.observe(viewport);
      cards.forEach((card) => size.observe(card));
      let touchStartX = 0;
      let touchStartY = 0;
      let touchScrolling = false;
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchScrolling = false;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!touchStartX || e.touches.length !== 1) return;
        const dx = touchStartX - e.touches[0].clientX;
        const dy = touchStartY - e.touches[0].clientY;
        if (!touchScrolling && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
          touchScrolling = true;
        }
        if (touchScrolling) {
          window.scrollBy({ top: dx, behavior: "instant" });
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      };
      const onTouchEnd = () => {
        touchScrolling = false;
        touchStartX = 0;
        touchStartY = 0;
      };
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchmove", onTouchMove, { passive: true });
      viewport.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        navigate.current = null;
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchmove", onTouchMove);
        viewport.removeEventListener("touchend", onTouchEnd);
        size.disconnect();
        cancelAnimationFrame(frame);
        element.removeAttribute("data-horizontal");
        cards.forEach((card) => { card.inert = false; });
      };
    }, stage);
    return () => { media.revert(); observer.disconnect(); window.removeEventListener("resize", observe); element.removeAttribute("data-ready"); };
  }, { scope: stage });
  return navigate;
}
