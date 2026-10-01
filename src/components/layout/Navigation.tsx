"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { navigation } from "@/data/sections";
import { Container } from "./Container";
import { SectionProgress } from "./SectionProgress";
import { useActiveSection } from "./useActiveSection";

export function Navigation() {
  const active = useActiveSection();
  const menu = useRef<HTMLDetailsElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const headerSize = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--header-height", `${entry.target.getBoundingClientRect().height}px`);
    });
    if (header.current) headerSize.observe(header.current);
    const close = () => { if (menu.current) menu.current.open = false; };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        close();
        menu.current.querySelector("summary")?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) close();
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    desktop.addEventListener("change", close);
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      headerSize.disconnect();
      document.documentElement.style.removeProperty("--header-height");
      desktop.removeEventListener("change", close);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (menu.current) menu.current.open = false;
    // Keep native hash navigation/history; move keyboard focus without a second scroll.
    document.getElementById(event.currentTarget.hash.slice(1))?.focus({ preventScroll: true });
  }

  const links = navigation.map((id) => (
    <Link key={id} href={`/#${id}`} data-cursor={id === "work" ? "VIEW" : id === "contact" ? "OPEN" : "EXPLORE"} aria-current={active === id ? "location" : undefined} onClick={navigate}>
      {id}
    </Link>
  ));

  return (
    <header ref={header} className="site-header" data-away-from-home={active !== "home"}>
      <Container className="navigation-bar">
        <Link className="brand-mark" href="/#home" data-cursor="EXPLORE" aria-label="Srujan Mirji — introduction" onClick={navigate}>
          SM<span aria-hidden="true">.</span>
        </Link>
        <nav className="desktop-navigation" aria-label="Main navigation">{links}</nav>
        <SectionProgress active={active} />
        <details ref={menu} className="mobile-menu" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
        }}>
          <summary aria-controls="mobile-navigation">
            <span>Menu</span>
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path d="M3 10h14" />
              <path d="M3 10h14" />
            </svg>
          </summary>
          <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{links}</nav>
        </details>
      </Container>
    </header>
  );
}
