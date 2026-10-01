"use client";

import type { RefObject } from "react";
import { usePinnedStory } from "./usePinnedStory";

export function useContactAnimation(stage: RefObject<HTMLDivElement | null>) {
  usePinnedStory(stage, (timeline) => {
    timeline
      .from(".contact-title", { scale: 0.82, duration: 0.7 }, 0)
      .from(".contact-links", { yPercent: 8, opacity: 0, duration: 0.2 }, 0.55)
      .from(".contact-accent", { scale: 0, duration: 0.15 }, 0.85);
  });
}
