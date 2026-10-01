"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { useContactAnimation } from "@/components/motion/useContactAnimation";
import { contactLinks } from "@/data/contact";
import { sections } from "@/data/sections";

export function Contact() {
  const stage = useRef<HTMLDivElement>(null);
  useContactAnimation(stage);

  function toTop(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.getElementById("home")?.focus({ preventScroll: true });
  }

  return <Section id="contact">
    <div ref={stage} className="contact-stage">
      <p className="section-label"><span>07</span> / Contact</p>
      <div className="contact-composition">
        <h2 id="contact-title" className="contact-title" aria-label="Let's build it.">
          <span>Let&apos;s</span><span>build</span><span>it<span className="contact-accent" aria-hidden="true">.</span></span>
        </h2>
        <div className="contact-aside">
          <p className="contact-copy">{sections.find((section) => section.id === "contact")?.description}</p>
          <div className="contact-links">
            <p className="contact-note">Contact details coming soon.</p>
            <ul aria-label="Contact channels">
              {contactLinks.map((contact) => <li key={contact.label}>
                {contact.href ? <a href={contact.href} data-cursor="OPEN">{contact.label}<span aria-hidden="true">↗</span></a>
                  : <><span>{contact.label}</span><span className="contact-pending">Coming soon</span></>}
              </li>)}
            </ul>
          </div>
        </div>
      </div>
      <footer className="contact-footer">
        <p>Srujan Mirji <span>© 2026</span></p>
        <Link href="/#home" onClick={toTop} className="contact-top" data-cursor="EXPLORE">Back to top <span aria-hidden="true">↑</span></Link>
      </footer>
    </div>
  </Section>;
}
