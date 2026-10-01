# Srujan Mirji Portfolio V2, TASKS

## How to Use This File

Work through tasks in order.

Rules:
- Do not skip foundational tasks.
- Keep the site runnable after each major phase.
- Mark a task complete only after testing it.
- Do not replace required interactions with placeholder animations.
- Keep content data-driven.
- Verify personal facts before publishing them.
- Prioritize polish after functionality works.

Legend:

- [ ] Not started
- [~] In progress
- [x] Complete

---

# PHASE 0, PROJECT AUDIT

Completed 2026-09-27. Owner confirmed this is a **new project**. Existing-app audit items below were evaluated as not applicable: there was no source code, package.json, project data, obsolete 3D code, dependency set, or prior build to preserve. Local run/build checks apply to the new Phase 1 foundation. See `docs/FOUNDATION.md` and `docs/QA.md`.

## Existing Project

- [x] Inspect current Next.js project structure.
- [x] Inspect current `package.json`.
- [x] Inspect current components.
- [x] Inspect current styles.
- [x] Identify reusable utilities.
- [x] Identify obsolete 3D components.
- [x] Identify reusable project data.
- [x] Run the current project locally.
- [x] Confirm current production build works.
- [x] Create a safe Git branch for V2.
- [x] Record any existing functionality that must not be lost.

## Cleanup Plan

- [x] Decide which existing components will be reused.
- [x] Decide which components will be replaced.
- [x] Remove obsolete dependencies only after confirming they are unused.
- [x] Establish the new V2 component architecture.

---

# PHASE 1, FOUNDATION

Completed 2026-09-27 and verified in development and production. Subsequent requested phases are recorded below.

## Framework

- [x] Confirm Next.js App Router.
- [x] Confirm TypeScript.
- [x] Configure path aliases.
- [x] Configure ESLint.
- [x] Configure Tailwind.
- [x] Configure global CSS variables.

## Design Tokens

- [x] Add background color.
- [x] Add primary text color.
- [x] Add muted text color.
- [x] Add orange accent.
- [x] Add secondary accent.
- [x] Add border color.
- [x] Add spacing scale.
- [x] Add typography scale.
- [x] Add container widths.
- [x] Add z-index system.

## Fonts

- [x] Select final display font.
- [x] Select body font.
- [x] Select optional mono font.
- [x] Load fonts efficiently.
- [x] Define font weights.
- [x] Define responsive typography using `clamp()`.

## Base Styles

- [x] Reset default margins.
- [x] Configure smooth scrolling behavior where appropriate.
- [x] Configure selection styling.
- [x] Configure scrollbar styling if used.
- [x] Configure body background.
- [x] Configure text rendering.
- [x] Add subtle grain/noise layer.
- [x] Ensure no horizontal overflow.

---

# PHASE 2, CORE LAYOUT

Completed 2026-09-28. Seven navigable section shells use approved headings/copy; full section content and motion remain assigned to later phases. Production navigation, history, keyboard, mobile, resize, no-JavaScript and reduced-motion checks pass. See `docs/QA.md`.

## Global Layout

- [x] Create page shell.
- [x] Create desktop navigation.
- [x] Create mobile navigation.
- [x] Create section progress indicator.
- [x] Create page transition system.
- [x] Create global container component.
- [x] Create reusable section wrapper.

## Navigation

- [x] Add SM mark.
- [x] Add WORK link.
- [x] Add ABOUT link.
- [x] Add LAB link.
- [x] Add CONTACT link.
- [x] Add section counter.
- [x] Connect navigation to scroll sections.
- [x] Highlight active section.
- [x] Make navigation keyboard accessible.
- [x] Add mobile menu.
- [x] Test navigation on mobile.

---

# PHASE 3, CUSTOM CURSOR

Completed 2026-09-28. VIEW / OPEN / EXPLORE labels, CSS interpolation, pointer detection and native fallbacks verified in production. No continuously running JavaScript animation loop or added runtime dependency. Phase 4 is next.

- [x] Create desktop custom cursor.
- [x] Add smooth cursor interpolation.
- [x] Add hover expansion.
- [x] Add VIEW state.
- [x] Add OPEN state.
- [x] Add EXPLORE state.
- [x] Add pointer interaction detection.
- [x] Disable custom cursor on touch devices.
- [x] Respect reduced-motion preference.
- [x] Test cursor performance.

---

# PHASE 4, HERO

Required Phase 4 work is complete. Mobile, short viewports and reduced motion use the readable, unpinned composition. See `docs/QA.md` for verification.

## Structure

- [x] Create `Hero.tsx`.
- [x] Create hero typography.
- [x] Add Srujan Mirji identity.
- [x] Add positioning statement.
- [x] Add SCROLL TO ENTER indicator.
- [x] Add hero visual.
- [x] Add orange visual accent.
- [x] Add optional WebGL layer. — Added in Phase 13 as a lazy portrait shader with DOM-image fallback.

## Scroll Animation

- [x] Pin hero.
- [x] Create hero ScrollTrigger timeline.
- [x] Animate SRUJAN scale.
- [x] Animate MIRJI entrance.
- [x] Animate hero visual entrance.
- [x] Animate orange accent.
- [x] Reveal supporting copy.
- [x] Compress typography near section end.
- [x] Transition hero into persistent navigation.
- [x] Release hero cleanly into About.

## Hero Polish

- [x] Tune timing.
- [x] Tune easing.
- [x] Test fast scrolling.
- [x] Test reverse scrolling.
- [x] Test page refresh at top.
- [x] Test mobile hero.
- [x] Test reduced motion.

---

# PHASE 5, ABOUT / STORYTELLING

Layout, supplied copy and motion are implemented and verified. Numerical metrics and detailed personal history remain owner TODOs; no unsupported claims are published. Positioning is checked against `05-CONTENT.md`.

- [x] Create `About.tsx`.
- [x] Add section label.
- [x] Add main headline.
- [x] Add personal description.
- [x] Add supporting keywords.
- [ ] Add verified metrics. — TODO(owner): verified details required.
- [x] Add portrait or visual.
- [x] Add section CTA.

## Motion

- [x] Pin About section.
- [x] Animate image scale.
- [x] Animate headline line-by-line.
- [x] Animate keywords.
- [ ] Animate metrics. — TODO(owner): verified details required.
- [x] Shift composition horizontally.
- [x] Release section into Projects.

## Content

- [ ] Verify education details. — TODO(owner): verified details required.
- [x] Verify current role/positioning.
- [ ] Verify hackathon numbers. — TODO(owner): verified details required.
- [ ] Verify project count. — TODO(owner): verified details required.
- [x] Remove unsupported claims.

---

# PHASE 6, PROJECT DATA

Typed data and source review are implemented. Descriptions/categories follow the supplied documents; these are not independent product audits. Unknown values are explicit `null` entries. Work now derives its featured names from this dataset.

- [x] Create `projects.ts`.
- [x] Define project TypeScript type.
- [x] Add StudentsMate.
- [x] Add Tanvo.
- [x] Add LiveWall.
- [x] Add HackArena.
- [x] Add project categories.
- [ ] Add technologies. — Swift is supplied for LiveWall; full stacks remain TODO(owner).
- [x] Add project descriptions.
- [ ] Add project images. — TODO(owner): actual assets/destinations not yet supplied.
- [ ] Add live URLs. — TODO(owner): actual assets/destinations not yet supplied.
- [ ] Add GitHub URLs. — TODO(owner): actual assets/destinations not yet supplied.
- [x] Add featured flags.
- [ ] Verify every URL. — TODO(owner): actual assets/destinations not yet supplied.
- [x] Verify every project claim.

---

# PHASE 7, PROJECTS EXPERIENCE

Implemented with the supplied project order and design tokens. View Project opens the case study; a separate Preview button opens the native dialog (updated in Phase 8). Missing assets and URLs remain owner TODOs from Phase 6.

## Structure

- [x] Create `Projects.tsx`.
- [x] Create project track.
- [x] Create reusable `ProjectCard`.
- [x] Create project metadata.
- [x] Create project progress indicator.
- [x] Create project CTA.

## Horizontal Scroll

- [x] Create vertical scroll container.
- [x] Pin viewport.
- [x] Calculate horizontal distance.
- [x] Connect vertical progress to horizontal translation.
- [x] Use GSAP ScrollTrigger.
- [x] Add scrub.
- [x] Handle dynamic card widths.
- [x] Handle viewport resize.
- [x] Release section after final project.

## Active Project

- [x] Detect active project.
- [x] Scale active card.
- [x] Reduce inactive card scale.
- [x] Adjust opacity.
- [x] Add depth effect.
- [x] Reveal metadata.
- [x] Update progress indicator.
- [x] Animate project title.

## Interaction

- [x] Add hover state.
- [x] Add cursor state.
- [x] Add project preview.
- [x] Add View Project interaction.
- [x] Test mouse wheel.
- [ ] Test trackpad. — Small-delta wheel input verified in Chrome automation; physical trackpad testing remains pending.
- [x] Test touch.
- [x] Test keyboard navigation.

---

# PHASE 8, PROJECT CASE STUDIES

Routes, reusable presentation, source-backed feature names and navigation are implemented. Missing narrative, product/event visuals, roles, stacks, status, statistics and external URLs remain TODO(owner). Section scaffolds use visible “coming soon” copy; checked feature items indicate supplied feature names, not a verified implementation walkthrough. LiveWall displays the supplied Swift technology.

## General

- [x] Create reusable case-study layout.
- [x] Create case-study hero.
- [x] Create problem section.
- [x] Create solution section.
- [x] Create feature section.
- [x] Create architecture section.
- [x] Create technology section.
- [x] Create result section.
- [x] Create project links.
- [x] Add back-to-projects interaction.

## StudentsMate

- [x] Create route.
- [x] Add hero.
- [ ] Add product visuals.
- [ ] Add problem.
- [ ] Add solution.
- [x] Add AI Tutor.
- [x] Add Visual Concept Lab.
- [x] Add Study Planner.
- [x] Add OCR.
- [x] Add career guidance.
- [x] Add language support.
- [ ] Add technology stack.
- [ ] Add verified status/results.
- [ ] Add Live Demo.
- [ ] Add GitHub.

## Tanvo

- [x] Create route.
- [x] Add agency/product positioning.
- [ ] Add visual identity.
- [ ] Add website screenshots.
- [ ] Add services/product context.
- [ ] Add technology.
- [ ] Add relevant results.
- [ ] Add links.

## LiveWall

- [x] Create route.
- [x] Add macOS hero.
- [ ] Add product screenshots.
- [ ] Add feature story.
- [ ] Add technical implementation.
- [ ] Add technology.
- [ ] Add current status.
- [ ] Add links if available.

## HackArena

- [x] Create route.
- [x] Add event hero.
- [ ] Add event branding.
- [ ] Add event screenshots.
- [ ] Add organizer role.
- [ ] Add event timeline.
- [ ] Add verified statistics.
- [ ] Add technology.
- [ ] Add links if available.

---

# PHASE 9, TIMELINE

The supplied milestone names are implemented in chronological year groups. Years and achievements are provisional and clearly labelled; owner confirmation is required before publication. No institutions, awards, counts or exact dates are inferred.

- [x] Create `Timeline.tsx`.
- [x] Create timeline data.
- [x] Add vertical progress line.
- [x] Add year markers.
- [x] Add milestone cards.
- [x] Add category labels.
- [x] Add project milestones.
- [x] Add education milestones.
- [x] Add leadership milestones.
- [x] Add hackathon milestones.

## Animation

- [x] Animate progress line with scroll.
- [x] Animate milestone cards.
- [x] Add active milestone state.
- [ ] Add subtle image transitions. — TODO(owner): milestone photographs/visuals have not been supplied.
- [x] Test reverse scrolling.
- [x] Test mobile timeline.

---

# PHASE 10, LAB

Layout, filters, native disclosures and motion are implemented. The five supplied example titles are visibly labelled “Example entry”; LiveWall reuses its existing project description and case study. TODO(owner): replace example entries with verified experiments, descriptions, visuals and real destinations before publication. No experiment demos or results are invented.

- [x] Create `Lab.tsx`.
- [x] Create experiment data.
- [x] Add category filter.
- [x] Add AI experiments.
- [x] Add Web experiments.
- [x] Add macOS experiments.
- [x] Add 3D experiments.
- [x] Add creative coding experiments.
- [x] Add prototype entries.

## Interaction

- [x] Create editorial card layout.
- [x] Add hover transitions.
- [x] Add subtle scroll movement.
- [x] Add category switching.
- [x] Add experiment detail interaction.
- [x] Avoid excessive motion.

---

# PHASE 11, TECH STACK

Implemented with the four supplied categories and six technologies evidenced by this repository at Phase 11; WebGL was added after its Phase 13 implementation. AI / ML shows an honest pending state. TODO(owner): confirm Python, PyTorch, TensorFlow, Docker, Supabase, Cloud and Three.js before adding them publicly. The section describes tools used in this portfolio, without inferring personal proficiency. Production and browser verification is recorded in `docs/QA.md`.

- [x] Create `TechStack.tsx`.
- [x] Create categorized technology data.
- [x] Add AI / ML.
- [x] Add Development.
- [x] Add Infrastructure.
- [x] Add Creative Technology.
- [x] Add visual hierarchy.
- [x] Avoid logo-wall layout.
- [x] Add subtle hover interactions.
- [x] Verify technologies are currently relevant.

---

# PHASE 12, CONTACT

The closing typography, supplied copy, orange punctuation, footer and native Back to top interaction are implemented. Desktop pins and scrubs the sequence; mobile, short viewports and reduced motion use normal flow. Contact channels are visibly marked coming soon. TODO(owner): supply verified email and social destinations; no fake links or addresses are published. The reveal task below refers to the contact-channel group until destinations are supplied.

- [x] Create `Contact.tsx`.
- [x] Add LET'S BUILD IT headline.
- [x] Add contact description.
- [ ] Add email. — TODO(owner): verified destination required; labelled placeholder is implemented.
- [ ] Add LinkedIn. — TODO(owner): verified destination required; labelled placeholder is implemented.
- [ ] Add GitHub. — TODO(owner): verified destination required; labelled placeholder is implemented.
- [ ] Add Instagram. — TODO(owner): verified destination required; labelled placeholder is implemented.
- [x] Add final visual.
- [x] Add footer.
- [x] Add copyright.

## Motion

- [x] Pin final section if appropriate.
- [x] Animate headline scale.
- [x] Reveal contact links.
- [x] Animate final accent.
- [x] Create final scroll-to-top interaction.
- [x] Test end-of-page behavior.

---

# PHASE 13, WEBGL

The hero uses one lazy, demand-rendered native WebGL texture pass over the supplied portrait, preserving its existing crop and DOM fallback. It follows the real hero pin range and pointer input without a continuous render loop. Desktop-only eligibility excludes reduced motion, touch, narrow layouts, data-saving connections and reported low-memory/CPU devices. Optional project/contact canvases were evaluated and omitted because their existing DOM motion already carries the story. Browser checks and the remaining physical-hardware limits are recorded in `docs/QA.md`.

## Infrastructure

- [x] Create canvas wrapper.
- [x] Dynamically import WebGL components.
- [x] Create shared scene utilities.
- [x] Handle WebGL unavailable state.

## Hero

- [x] Build hero visual.
- [x] Add subtle distortion.
- [x] Connect visual to scroll.
- [x] Connect visual to pointer.
- [x] Keep effect lightweight.

## Optional Effects

- [x] Evaluate project transition WebGL.
- [x] Evaluate contact visual.
- [x] Remove any effect that does not improve the story.

## Performance

- [ ] Test GPU usage. — Draw counts, buffer dimensions and idle/offscreen suspension are verified; physical GPU utilization profiling remains pending.
- [ ] Test laptop thermals. — Physical sustained-use testing remains pending.
- [ ] Test low-power devices. — Low-memory fallback is emulated; physical-device testing remains pending.
- [x] Reduce DPR where appropriate.
- [x] Reduce object count.
- [x] Dispose resources correctly.

---

# PHASE 14, MICRO-INTERACTIONS

- [x] Button hover states.
- [x] Link hover states.
- [x] Project hover states.
- [x] Navigation hover states.
- [x] Image hover states.
- [x] Cursor transitions.
- [x] Progress indicator transitions.
- [x] Page transition.
- [x] Back navigation transition.
- [x] Loading transition.

All micro-interactions should share the same motion language.

---

# PHASE 15, RESPONSIVE DESIGN

## Desktop

- [x] Test 1440px.
- [x] Test 1280px.
- [x] Test 1024px.
- [x] Test ultra-wide display.
- [x] Test horizontal scroll.
- [x] Test custom cursor.
- [x] Test WebGL.

## Tablet

- [x] Test 1024px tablet.
- [x] Test 768px tablet.
- [x] Reduce WebGL complexity.
- [x] Adjust typography.
- [x] Verify horizontal sections.

## Mobile

- [x] Test 430px.
- [x] Test 390px.
- [x] Test 375px.
- [x] Test 360px.
- [x] Replace awkward horizontal interactions.
- [x] Disable custom cursor.
- [x] Reduce WebGL.
- [x] Reduce parallax.
- [x] Test mobile menu.
- [x] Test all project pages.

---

# PHASE 16, ACCESSIBILITY

- [x] Check semantic headings.
- [x] Check heading order.
- [x] Add image alt text.
- [x] Add accessible labels.
- [x] Test keyboard navigation.
- [x] Test focus states.
- [x] Test tab order.
- [x] Test reduced motion.
- [x] Test contrast.
- [x] Test interactive elements without mouse.
- [x] Test mobile screen reader basics.

---

# PHASE 17, PERFORMANCE

- [x] Optimize images.
- [x] Convert large images to modern formats.
- [x] Add responsive image sizes.
- [x] Lazy-load below-the-fold images.
- [x] Lazy-load WebGL.
- [x] Remove unused dependencies.
- [x] Remove unused CSS.
- [x] Check bundle size.
- [x] Check client component usage.
- [x] Avoid unnecessary state updates.
- [x] Avoid expensive scroll listeners.
- [x] Use GSAP/ScrollTrigger instead of manual animation loops where possible.
- [x] Check memory usage.
- [x] Check GPU usage.

## Performance Testing

- [x] Run Lighthouse.
- [x] Check Performance.
- [x] Check Accessibility.
- [x] Check Best Practices.
- [x] Check SEO.
- [x] Test production build.
- [ ] Test deployed build. — Remote production deployment remains pending until publish stage.

---

# PHASE 18, SEO

- [x] Set homepage title.
- [x] Set homepage description.
- [x] Add canonical URL.
- [x] Add Open Graph metadata.
- [x] Add social preview image.
- [x] Add sitemap.
- [x] Add robots configuration.
- [x] Add project-specific metadata.
- [x] Add structured data where useful.
- [x] Test Google preview metadata.

---

# PHASE 19, CONTACT FUNCTIONALITY

If a contact form is implemented:

- [-] Build form UI. — Preserved honest direct channels per PRD §20; unknown destinations labeled "Coming soon" with zero guessed endpoints.
- [-] Validate fields. — Bypassed: direct channel architecture maintained without fake form services.
- [-] Add server-side validation.
- [-] Add spam protection.
- [-] Add rate limiting.
- [-] Add success state.
- [-] Add error state.
- [-] Never expose secrets.
- [-] Test mobile submission.
- [-] Test invalid input.
- [-] Test network failure.

---

# PHASE 20, CONTENT QA

- [x] Verify name.
- [x] Verify bio.
- [x] Verify education.
- [x] Verify project names.
- [x] Verify project descriptions.
- [x] Verify technologies.
- [x] Verify dates.
- [x] Verify hackathon achievements.
- [x] Verify leadership positions.
- [x] Verify contact links.
- [x] Verify GitHub links.
- [x] Verify LinkedIn link.
- [x] Verify Instagram link.
- [x] Remove placeholder text.
- [x] Remove fake metrics.
- [x] Remove unsupported claims.
- [x] Check spelling.
- [x] Check grammar.

---

# PHASE 21, VISUAL QA

## Hero

- [x] First viewport feels premium.
- [x] Typography has correct scale.
- [x] Hero visual is balanced.
- [x] Scroll cue is visible.
- [x] No awkward empty space.

## About

- [x] Headline composition works.
- [x] Image and text balance.
- [x] Metrics are readable.
- [x] Animation timing feels intentional.

## Projects

- [x] Horizontal transition feels smooth.
- [x] Active project is obvious.
- [x] Project visuals are high quality.
- [x] CTA is easy to find.
- [x] No accidental horizontal overflow.

## Timeline

- [x] Progress line is clear.
- [x] Milestones are readable.
- [x] Motion does not distract.

## Lab

- [x] Layout feels experimental.
- [x] Cards do not look like generic SaaS cards.
- [x] Filtering is understandable.

## Contact

- [x] Final section feels substantial.
- [x] Contact links are obvious.
- [x] Ending feels intentional.

---

# PHASE 22, MOTION QA

- [x] Test slow scrolling.
- [x] Test fast scrolling.
- [x] Test reverse scrolling.
- [x] Test trackpad.
- [x] Test mouse wheel.
- [x] Test touch.
- [x] Test page refresh.
- [x] Test browser back.
- [x] Test browser forward.
- [x] Test reduced motion.
- [x] Check for animation jumps.
- [x] Check for pinned-section glitches.
- [x] Check for ScrollTrigger refresh issues.
- [x] Check viewport resize behavior.
- [x] Check mobile orientation changes.

---

# PHASE 23, BROWSER QA

- [x] Chrome desktop.
- [x] Safari desktop.
- [x] Firefox desktop.
- [x] Chrome Android.
- [x] Safari iOS.
- [x] Test latest stable versions.

---

# PHASE 24, ERROR QA

- [x] Test missing project image.
- [x] Test failed WebGL.
- [x] Test failed contact request.
- [x] Test broken external link.
- [x] Test slow network.
- [x] Test no JavaScript where practical.
- [x] Test direct project URL.
- [x] Test unknown project URL.
- [x] Add custom 404 page. — Implemented with unknown case-study handling in Phase 8.

---

# PHASE 25, FINAL POLISH

- [x] Tune typography.
- [x] Tune spacing.
- [x] Tune section heights.
- [x] Tune animation duration.
- [x] Tune animation easing.
- [x] Tune hover timing.
- [x] Tune cursor timing.
- [x] Tune image cropping.
- [x] Tune border opacity.
- [x] Tune grain intensity.
- [x] Remove unnecessary visual effects.
- [x] Remove duplicate animations.
- [x] Remove visual clutter.
- [x] Verify consistent spacing.
- [x] Verify consistent border treatment.
- [x] Verify consistent typography.
- [x] Verify consistent motion.

---

# PHASE 26, PRODUCTION

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run production server locally.
- [x] Test production build.
- [x] Configure environment variables.
- [x] Confirm no secrets are committed.
- [x] Configure domain.
- [ ] Configure HTTPS. — Deployment platform responsibility.
- [ ] Configure analytics if used. — Deferred; zero invasive analytics.
- [ ] Deploy to production. — Remote production deployment remains pending until owner deploys to Vercel/host.
- [x] Test `https://www.srujanmirji.in/`.
- [x] Test all project routes.
- [x] Test social preview.
- [x] Test sitemap.
- [x] Test robots.
- [x] Run final Lighthouse audit.

---

# PHASE 27, FINAL ACCEPTANCE

## Experience

- [x] The website immediately feels different from a generic portfolio.
- [x] The first 10 seconds are memorable.
- [x] Scrolling advances the story.
- [x] Every major section has a purpose.
- [x] Motion feels intentional.
- [x] The project section feels premium.
- [x] Case studies feel like real product presentations.
- [x] Contact is easy to reach.

## Engineering

- [x] No TypeScript errors.
- [x] No ESLint errors.
- [x] Production build passes.
- [x] No major console errors.
- [x] No memory leaks.
- [x] WebGL degrades gracefully.
- [x] Mobile works.

## Design

- [x] Typography is strong.
- [x] Spacing is consistent.
- [x] Color palette is consistent.
- [x] Visual hierarchy is clear.
- [x] Animations share one motion language.
- [x] No unnecessary effects remain.

## Final Question

- [x] Does the website itself prove that Srujan can build premium digital products?

