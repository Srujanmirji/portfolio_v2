"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function usePinnedStory(stage: RefObject<HTMLDivElement | null>, animate: (timeline: gsap.core.Timeline) => void) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 64rem) and (min-height: 48rem) and (prefers-reduced-motion: no-preference)", () => {
      const element = stage.current;
      if (!element) return;
      // Enlarged text must remain in normal flow if the composition cannot fit.
      const headerHeight = () => document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      if (element.offsetHeight > window.innerHeight - headerHeight() + 1) return;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: () => `top ${headerHeight()}`,
          end: () => `+=${window.innerHeight * 1.8}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      animate(timeline);

      let alive = true;
      void document.fonts.ready.then(() => {
        if (!alive) return;
        ScrollTrigger.refresh();
      });
      return () => { alive = false; };
    }, stage);
    return () => media.revert();
  }, { scope: stage });
}
