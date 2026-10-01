"use client";

import type { RefObject } from "react";
import { usePinnedStory } from "./usePinnedStory";

export function useAboutAnimation(stage: RefObject<HTMLDivElement | null>) {
  usePinnedStory(stage, (timeline) => {
    timeline
      .from(".about-portrait", { scale: 0.8, duration: 0.2 }, 0)
      .from(".about-line > span", { yPercent: 110, stagger: 0.12, duration: 0.16 }, 0.1)
      .from(".about-keywords", { xPercent: 8, opacity: 0, duration: 0.2 }, 0.62)
      .to(".about-portrait", { xPercent: 6, duration: 0.18 }, 0.82);
  });
}
