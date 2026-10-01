"use client";

import type { RefObject } from "react";
import { usePinnedStory } from "./usePinnedStory";

export function useHeroAnimation(stage: RefObject<HTMLDivElement | null>) {
  usePinnedStory(stage, (timeline) => {
    // Timeline positions map to the PRD's scroll beats.
    timeline
      .from(".hero-first-name", { scale: 0.86, duration: 0.2 }, 0)
      .from(".hero-last-name", { xPercent: 18, duration: 0.2 }, 0)
      .from(".hero-portrait", { opacity: 0, yPercent: 8, scale: 0.94, duration: 0.2 }, 0.2)
      .from(".hero-accent", { scaleY: 0, duration: 0.2 }, 0.2)
      .from(".hero-description", { opacity: 0, yPercent: 25, duration: 0.2 }, 0.4)
      .to(".hero-name", { scale: 0.78, yPercent: -12, duration: 0.2 }, 0.6)
      .to(".hero-visual", { scale: 0.92, duration: 0.2 }, 0.6)
      .to({}, { duration: 0.2 }, 0.8);
  });
}
