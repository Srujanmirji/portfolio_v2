"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function TimelineMotion({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 48rem)" }, (context) => {
      const element = stage.current;
      if (!element || !context.conditions?.motion) return;
      const groups = Array.from(element.querySelectorAll<HTMLElement>(".timeline-year-group"));
      let active = -1;
      const update = () => {
        let current = 0;
        groups.forEach((group, index) => { if (group.getBoundingClientRect().top <= innerHeight * 0.5) current = index; });
        if (current === active) return;
        active = current;
        groups.forEach((group, index) => {
          group.setAttribute("data-active", String(index === current));
          if (index === current) group.setAttribute("aria-current", "step");
          else group.removeAttribute("aria-current");
        });
      };
      element.setAttribute("data-animated", "true");
      const distance = getComputedStyle(element).getPropertyValue("--timeline-enter-distance").trim();
      gsap.fromTo(".timeline-progress", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: element, start: "top center", end: "bottom center", scrub: true, onUpdate: update },
      });
      groups.forEach((group, index) => gsap.fromTo(group.querySelector(".timeline-card"), {
        x: context.conditions?.desktop && index % 2 ? `-${distance}` : distance,
      }, {
        x: 0, ease: "none",
        scrollTrigger: { trigger: group, start: "top 85%", end: "top 60%", scrub: true },
      }));
      update();
      return () => {
        element.removeAttribute("data-animated");
        groups.forEach((group) => { group.removeAttribute("data-active"); group.removeAttribute("aria-current"); });
      };
    }, stage);
    return () => media.revert();
  }, { scope: stage });
  return <div ref={stage} className="timeline-stage">{children}</div>;
}
