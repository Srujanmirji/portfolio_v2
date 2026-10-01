"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import portraits from "../../../srujan-portfolio-portrait-assets/srujan-hero.png";
import { Section } from "@/components/layout/Section";
import { useAboutAnimation } from "@/components/motion/useAboutAnimation";
import { sections } from "@/data/sections";

export function About() {
  const stage = useRef<HTMLDivElement>(null);
  useAboutAnimation(stage);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.getElementById("work")?.focus({ preventScroll: true });
  }

  return (
    <Section id="about">
      <div ref={stage} className="about-stage">
        <p className="section-label"><span>02</span> / About</p>
        <div className="about-composition">
          <h2 id="about-title" className="about-title" aria-label="Ideas into real products.">
            {sections[1].heading.split("\n").map((line) => (
              <span className="about-line" key={line}><span>{line}</span></span>
            ))}
          </h2>
          <div className="about-portrait">
            <Image src={portraits} alt="Side profile of Srujan Mirji, with orange light outlining his black shirt."
              sizes="(min-width: 1024px) 1120px, 850px" />
          </div>
        </div>
        <div className="about-footer">
          <p className="about-description">{sections[1].description}</p>
          <div className="about-details">
            <ul className="about-keywords" aria-label="Areas of interest">
              {["AI", "Development", "Products", "Community", "Experiments"].map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
            {/* TODO(owner): verified education, hackathon and project metrics. Never publish guessed numbers. */}
            <Link href="/#work" className="about-link" data-cursor="VIEW" onClick={navigate}>
              View projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
