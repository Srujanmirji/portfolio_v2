"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiments, experimentCategories, type ExperimentCategory } from "@/data/experiments";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LabExperiments() {
  const stage = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<ExperimentCategory | "All">("All");
  const visible = experiments.filter((entry) => category === "All" || entry.categories.includes(category));

  useGSAP(() => {
    const element = stage.current;
    if (!element) return;
    element.setAttribute("data-ready", "true");
    const media = gsap.matchMedia();
    media.add("(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const grid = element.querySelector<HTMLElement>(".lab-grid")!;
      const distance = parseFloat(getComputedStyle(grid).getPropertyValue("--lab-motion-distance")) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const duration = parseFloat(getComputedStyle(grid).getPropertyValue("--duration-base")) / 1000;
      const shift = gsap.quickTo(grid, "y", { duration, ease: "power2.out" });
      const settle = () => shift(0);
      ScrollTrigger.create({
        trigger: grid, start: "top bottom", end: "bottom top",
        onUpdate: (trigger) => shift(gsap.utils.clamp(-distance, distance, trigger.getVelocity() / innerHeight * distance)),
        onLeave: settle, onLeaveBack: settle,
      });
      ScrollTrigger.addEventListener("scrollEnd", settle);
      return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
    }, stage);
    // Filtering changes the document height and downstream section positions.
    ScrollTrigger.refresh();
    return () => { media.revert(); element.removeAttribute("data-ready"); };
  }, { scope: stage, dependencies: [category], revertOnUpdate: true });

  return <div ref={stage} className="lab-stage">
    <div className="lab-filter" role="group" aria-label="Experiment categories">
      {(["All", ...experimentCategories] as const).map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)} data-cursor="EXPLORE">{name}</button>)}
    </div>
    <p className="lab-count" role="status" aria-live="polite" aria-atomic="true">{visible.length} {visible.length === 1 ? "entry" : "entries"}</p>
    <div className="lab-grid">
      {visible.map((entry) => <article className="lab-card" key={entry.id} aria-labelledby={`experiment-${entry.id}`}>
        <div className="lab-card-meta"><p>{entry.categories.join(" · ")}</p><span>{entry.projectSlug ? "Project" : "Example entry"}</span></div>
        <h3 id={`experiment-${entry.id}`}>{entry.title}</h3>
        <details className="lab-details" onToggle={() => ScrollTrigger.refresh()}>
          <summary data-cursor="EXPLORE">Explore<span className="sr-only"> {entry.title}</span></summary>
          <div className="lab-detail-content">
            <p>{entry.description ?? "Experiment details, visuals, and links are coming soon."}</p>
            {entry.projectSlug && <Link href={`/work/${entry.projectSlug}`} data-cursor="VIEW">View project <span aria-hidden="true">↗</span></Link>}
          </div>
        </details>
      </article>)}
      {!visible.length && <p className="lab-empty">Experiments in this category are coming soon.</p>}
    </div>
  </div>;
}
