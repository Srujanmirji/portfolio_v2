"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import portrait from "../../../srujan-portfolio-portrait-assets/srujan-hero.png";
import { Section } from "@/components/layout/Section";
import { useHeroAnimation } from "@/components/motion/useHeroAnimation";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  useHeroAnimation(stage);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.getElementById(event.currentTarget.hash.slice(1))?.focus({ preventScroll: true });
  }

  return (
    <Section id="home" className="home-section">
      <div ref={stage} className="hero-stage">
        <p className="hero-positioning">AI Engineer · Product Builder · Developer</p>
        <div className="hero-composition">
          <h1 id="home-title" className="hero-name" aria-label="Srujan Mirji">
            <span className="hero-first-name">Srujan</span>
            <span className="hero-last-name">Mirji<span aria-hidden="true">.</span></span>
          </h1>
          <div className="hero-visual">
            <span className="hero-accent" aria-hidden="true" />
            <div className="hero-portrait">
              <Image src={portrait} alt="Srujan Mirji in a black shirt and sunglasses, lit by warm orange light."
                fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 85vw" preload />
              <HeroCanvas />
            </div>
          </div>
        </div>
        <div className="hero-footer">
          <p className="hero-description">I build AI-powered products, software, and digital experiences.</p>
          <div className="hero-actions">
            <Link href="/#about" className="hero-scroll" data-cursor="EXPLORE" onClick={navigate}>
              Scroll to enter <span aria-hidden="true">↓</span>
            </Link>
            <Link href="/#work" data-cursor="VIEW" onClick={navigate}>
              View work <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
