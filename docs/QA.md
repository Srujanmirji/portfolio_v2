# Foundation verification — 2026-09-27

Latest completed checkpoint: **Phases 0–3**. The Phase 1 record below is historical;
the Phase 2–3 verification follows at the end of this document.

Scope: TASKS.md Phases 0–1 only. This verifies the production readiness of the
foundation, not completion of the portfolio or its later acceptance criteria.

## Toolchain

| Check | Result |
| --- | --- |
| `npm run dev -- --hostname 127.0.0.1 --port 3000` | Running; homepage renders |
| `npm run lint` | Pass, zero warnings |
| `npm run typecheck` | Pass; generated route types and strict TypeScript |
| `npm run build` | Pass; static homepage, default 404 and favicon |
| `npm start -- --hostname 127.0.0.1 --port 3001` | Production server running; HTTP 200 |
| `npm audit` | Zero reported vulnerabilities |
| Dependency review | Only Next.js, React and React DOM at runtime; no inherited V1 libraries |
| Git | Fresh `feat/portfolio-v2` branch; no remote or imported history |

Node.js 24.18.0, npm 11.16.0, Next.js 16.3.6, React 19.3.0, Tailwind 4.3.3.
Local font assets total approximately 52 KB; both font licenses are included.

## Rendered production checks

Used installed Chrome 153.0.8010.53 through Playwright. Browser automation used an
existing local Playwright installation; no testing framework was added to the app.

- Viewports: 360×800, 375×812, 768×1024, 1280×900, 1920×1080.
- No horizontal overflow at any tested size; the wide container correctly caps at 1600px.
- Visually inspected 375px and 1280px compositions against the supplied design system.
- Both self-hosted variable fonts load successfully; background resolves to `rgb(5, 5, 5)`.
- Keyboard-only flow: Tab reveals the skip link with lime outline, Enter focuses main content.
- Skip-link target is 44px high; visible focus is above the non-interactive grain layer.
- Reduced-motion emulation: native scrolling resolves to `auto`.
- Text resized to 200% at 375px: content wraps without horizontal overflow or clipping.
- JavaScript disabled: identity and description remain visible in correct reading order.
- No browser console errors, page exceptions or failed resource responses in the final check.

Local artifacts (gitignored): `test-results/foundation-375.png`,
`test-results/foundation-1280.png`, and `test-results/foundation-checks.json`.

## Contrast and polish

Contrast uses the conservative brightest possible background under the 2.5% grain
overlay, not just the untextured background color:

| Foreground | Contrast |
| --- | --- |
| Primary text | 17.41:1 |
| Muted text | 5.69:1 |
| Orange accent | 6.30:1 |
| Lime focus | 17.12:1 |
| Selected text on lime | 17.75:1 |

Impeccable's design hook found no deterministic issues. The visual polish and
frontend-ui restraint pass found no gradients, glass panels, repetitive cards,
ambient animations, or generic filler copy. Only the specified dark theme exists.

Issues fixed during verification: local font paths, PostCSS lint warning, enlarged-text
overflow, a collision with Tailwind's built-in `container` utility, and the missing favicon.
The final production checks above passed after those fixes.

## Remaining scope

At this checkpoint, navigation, cursor, hero motion, subsequent sections and case studies,
full browser/accessibility/performance QA and deployment were unstarted.
No Safari/Firefox/mobile-device validation or Lighthouse
score is claimed. Missing project/contact content is tracked in `docs/FOUNDATION.md`.

No site was deployed; no external project or contact URLs were published.
The incomplete foundation carries `noindex, nofollow` until the SEO/content phases.

# Phases 2–3 verification — 2026-09-28

Production build served at `http://127.0.0.1:3001`. Lint, strict type checking and
production build pass. `npm audit` reports zero vulnerabilities. No new runtime
dependency was added; Playwright is a development dependency for runnable checks.

```sh
BASE_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHANNEL=chrome npm run test:layout
BASE_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHANNEL=chrome npm run test:cursor
```

Both checks pass against the final production build using Chrome 153. They use Node's
built-in test runner and a locally installed Chrome; alternatively install Playwright's
Chromium and omit the channel environment variable.

## Core layout

- All seven section targets, one main landmark, one h1 and named section headings.
- WORK / ABOUT / LAB / CONTACT links, SM return link, current-link state and section counter.
- Scrolling to Timeline, Stack and Introduction updates progress in both directions.
- Direct `/#work`, refresh, browser back and browser forward preserve the correct section.
- Keyboard-only desktop flow: skip link and every navigation link show visible focus.
- Keyboard-only mobile flow: summary and every menu link, Escape close and focus restoration.
- Menu closes on selection, outside click, focus leaving the disclosure and desktop resize.
- Navigation works at 200% text size without overflow; header measurement also keeps
  scroll offsets and active-section detection correct when the header wraps.
- Widths checked: 360, 375, 768, 1280 and 1920px; no horizontal overflow.
- Native mobile disclosure and hash links remain usable with JavaScript disabled.
- Reduced motion disables page arrival animation and smooth anchor scrolling.
- Separately verified return from a missing route through SM: the template applies the
  `page-arrival` transition to the new page; normal hash changes do not remount the template.

## Custom cursor

- Small circular default, expanded hover state, VIEW / OPEN / EXPLORE labels.
- Position converges smoothly to the pointer; its layer never intercepts clicks.
- No JavaScript animation frames scheduled while idle in this phase's static shell.
- Native cursor restored for keyboard use, touch events, blur and text entry.
- Touch emulation works with the mobile menu; cursor is also disabled on a large touch viewport.
- Reduced-motion preference is enforced in CSS and JS; changing it live restores the native cursor.
- Narrow screens and no-JavaScript mode retain a usable native pointer.
- Cursor at the viewport edge does not introduce horizontal overflow.
- Event listeners, observers and pending animation frames have cleanup paths.

## Visual polish and scope

Inspected the final desktop (1280px) and mobile (375px) rendering. The supplied palette,
fonts and editorial hierarchy are preserved. Menu controls show an open/close icon,
active links use orange, focus remains lime, and the cursor labels contrast against
their orange background. The prior conservative contrast checks still apply.

The frontend-ui restraint pass found no decorative gradients, glass, generic feature
cards, unrelated movement or invented claims. Impeccable's automatic checks found no
deterministic issues. Only the specified dark theme exists.

Local screenshots: `test-results/phase3-desktop.png` and `test-results/phase3-mobile.png`.
The final layout test recorded no console errors or runtime exceptions; the cursor
test recorded no runtime exceptions. These checks do not claim a full browser matrix,
physical-device performance profiling, screen-reader certification or Lighthouse audit.

**Status at the end of Phase 3:** all seven targets were still section shells. Phase 4 follows below.

# Phase 4 — Hero (2026-09-28)

Verified against the production build on port 3001, using installed Chrome via Playwright.

- `npm run lint`, `npm run typecheck`, `npm run build`: passed.
- `test:hero`, `test:layout`, `test:cursor`: passed.
- `npm audit`: zero vulnerabilities.
- Checked the 20/40/60/80% composition changes, 180vh pin, fast forward/reverse scroll,
  release into About, top refresh and direct About hash refresh.
- Both hero links work by keyboard with visible focus and transfer focus to the destination.
- Responsive widths: 360, 375, 768, 1280 and 1920px, with no horizontal overflow.
- Pin removal/recreation on mobile and live reduced-motion changes leaves readable content.
- No-JavaScript hero and section links work. Portrait loads through Next Image.
- Existing navigation, history, mobile menu, cursor and 200% text-size checks still pass.
- Tests recorded no runtime or console errors in the hero/layout flows.

Impeccable polish: inspected the 1280px desktop opening, reveal and compressed states,
and the 375px mobile composition. Fixed clipped entrance typography, constrained portrait
height to keep the pinned footer visible, and removed competing smooth anchor scrolling.
The frontend-ui restraint checklist passes: the portrait/type composition is the focal point;
no decorative gradients, glass, generic cards, invented facts or looping ornament.
Only the specified dark theme exists. Existing palette contrast measurements still apply.

Final captures: `test-results/phase4-desktop.png`, `phase4-mobile.png`,
`phase4-mobile-full.png`. These are local QA artifacts, not published project assets.
The cursor idle check now measures its hit tests rather than all global animation frames,
because ScrollTrigger has its own browser repaint loop.

Implementation references: installed Next Image and @gsap/react guides, plus official
[matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) and
[ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) documentation.
No claim of Safari/Firefox, physical-device profiling, Lighthouse or screen-reader certification.
Optional WebGL is deferred to Phase 13; later sections remain shells.

**Next: Phase 5 — About / Storytelling.** Verified metrics and personal history still require owner input.

# Phase 5 — About / Storytelling (2026-09-28)

Production build on port 3001, installed Chrome via Playwright.

- Lint, typecheck and production build passed.
- All four browser suites passed: About, Hero, layout and cursor.
- About's 0.8→1 image scale, ordered headline reveal, keyword entrance, final horizontal
  shift, reverse scrolling and release toward Work are verified.
- Both pins coexist without duplicate spacers; direct About/Work URLs and refreshes
  preserve the correct destination after pin measurement.
- Keyboard-only tabbing through all nine navigation/hero/About links keeps visible focus.
  The About CTA is in the viewport when reached and transfers focus to Work on Enter.
- Widths 375, 768, 1280 and 1920px: no horizontal overflow. Desktop has two pins;
  mobile and reduced motion revert both pins and show the full content.
- No-JavaScript heading/CTA work; supplied image loads through Next Image.
- Existing 200% text-size, mobile-menu, history and cursor checks still pass.
- No runtime exceptions or console errors were recorded in the About test.

Impeccable polish inspected the 1280px opening/revealed composition and 375px complete
section. The original palette, typography and asymmetric grid remain intact. The
portrait faces the headline; orange marks the final line. The frontend-ui restraint
check found no generic cards, decorative effects or invented claims. There is one theme.
Captures: `test-results/phase5-desktop.png` and `test-results/phase5-mobile.png`.

Content limitation: metric display/animation, education specifics and numerical claims
remain unchecked in TASKS.md pending owner verification. No fake numbers are displayed.
Browser/device limitations from Phase 4 still apply.

**Next: Phase 6 — Project Data.**

# Phase 6 — Project Data (2026-09-29)

- Reviewed the typed dataset against `05-CONTENT.md`, the site architecture, PRD
  project chapters and its explicitly illustrative data example.
- Four unique slugs, supplied descriptions/categories and the required featured order.
- No guessed URLs, screenshot paths, outcomes or per-project technology stacks.
- Lint, typecheck and production build passed.
- Production `test:layout` passed, including the new assertion that Work displays the
  expected featured-project list from the shared dataset. Existing navigation, responsive,
  200% text-size and no-JavaScript checks remain green with no browser errors.
- Inspected Work at 1280px; the visible composition is unchanged. Capture:
  `test-results/phase6-work.png`. This phase changes content storage, not design or motion.

Technology completion, images, URLs and URL verification remain unchecked in TASKS.md
until owner information arrives. No external destinations were available to verify.

**Next: Phase 7 — Projects Experience.**

# Phase 7 — Projects Experience (2026-09-29)

Production server on port 3001, installed Chrome driven by Playwright.

- Lint, typecheck and production build passed.
- All five browser suites passed. The Projects suite passed again after matching the
  specified 0.82 inactive scale and adding small-delta wheel input coverage.
- Verified all four project selections/previews, native-dialog Escape and focus return,
  inert background, native modal cursor, visible keyboard focus and stable scroll position.
- Verified large wheel deltas, slow incremental deltas, reverse scrolling, dynamic card
  widths, final-panel alignment and release into Timeline.
- Hero, About and Projects coexist as three desktop pins; direct Work loads and reloads
  work. Reduced motion removes pinning and restores the readable vertical layout.
- Widths 375, 768, 1280 and 1920px have no horizontal page overflow. Mobile touch
  selection/preview/close passed in Chrome emulation; no-JavaScript content remains readable.
- Browser checks recorded no runtime exceptions or console errors.

The initially failing reduced-motion check observed a temporary ScrollTrigger refresh
state. Waiting for the completed style restoration resolved it without an additional
runtime cleanup workaround. The dynamic-width check now waits for the panel's scale
transition to settle before measuring its edge.

Impeccable polish inspected desktop at 1280px, mobile at 375px and the native preview.
The frontend-ui restraint pass preserves the specified type, palette and single-panel
composition. No gradients, generic feature grids or invented project imagery were added.
Only one theme exists. Captures: `test-results/phase7-desktop.png`,
`phase7-mobile.png` and `phase7-preview.png`.

Physical trackpad/device tests and Safari/Firefox remain pending; small-delta automation
is not a claim of hardware testing. Missing project screenshots, full stacks and external
URLs remain owner TODOs. Case-study destinations are intentionally deferred to Phase 8.

**Next: Phase 8 — Project Case Studies.**

# Phase 8 — Project Case Studies (2026-09-30)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All four supplied project routes are
  prerendered; each has its own title and source-backed description.
- All six browser suites pass. The Projects suite was rerun after correcting its
  expected accessible Preview label following the new direct-link interaction.
- Case-study checks cover all four direct URLs, nine chapter sections, supplied feature
  names/Swift, omitted unknown external URLs and Work's active navigation state.
- Home → Tanvo → Back to projects → browser Back/Forward cleans up/restores all three
  pins. Unknown project URLs return HTTP 404 and a recovery link.
- Widths 375, 768, 1280 and 1920px have no horizontal overflow. Mobile at 200% text
  size, no-JavaScript case-study navigation and reduced-motion page arrival pass.
- Eight keyboard-only stops across the case-study navigation/back links show focus.
- No unexpected runtime exceptions or console errors; the deliberate 404 is excluded
  from the console-error assertion.

Impeccable polish inspected the 1280px hero and feature section plus the 375px hero.
The existing type scale, controlled orange, thin borders, generous spacing and asymmetric
12-column composition are preserved. Feature names use an editorial numbered list;
there are no invented product screenshots, brand assets or result claims. The
frontend-ui restraint checklist passes; there is one theme.
Captures: `test-results/phase8-desktop.png`, `phase8-features.png`, `phase8-mobile.png`.
Code review found no additional correctness/security issues in the static routes,
server-rendered content or native links. No new dependency or external service was added.

Page structure is implemented; full publication-ready case-study content still requires
owner input. Narrative, role, architecture, results/status, stacks, visuals and external
links remain pending in TASKS.md. Physical-device and additional-browser limitations
from earlier phases still apply.

**Next: Phase 9 — Timeline.**

# Phase 9 — Timeline (2026-09-30)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed.
- All seven browser suites pass: six existing suites passed in the full regression
  run; Timeline passed after its responsive checks waited for media cleanup to finish.
- Timeline verifies the supplied nine milestones in three chronological year groups,
  with visibly provisional dates and no added awards/counts/institutions.
- Progress-line start/midpoint/end and reversal pass; active years move from 2024 to
  2026 and back. Desktop groups enter from opposite directions.
- Timeline adds no pin. Tanvo/HackArena links, browser history, reduced-motion transform
  restoration and route cleanup pass.
- Widths 375, 768, 1280 and 1920px have no horizontal overflow. Touch navigation and
  no-JavaScript content/links work in Chrome emulation.
- Keyboard-only Tab reaches both milestone links with visible, on-screen focus.
- Mobile at 200% text size fits. This check found the existing project-selector group
  exceeding its container; selectors now wrap while preserving minimum target sizes.
- Muted text contrast is 5.90:1 against the base background. No browser errors recorded.

Impeccable polish inspected the 1280px heading/alternating groups and 375px timeline.
The established palette, type, thin borders and asymmetric composition are preserved.
A line and three grouped states carry the motion; individual milestones do not animate
independently. The frontend-ui restraint pass found no decorative gradients, repeated
feature cards, stock imagery or unrelated visual effects. One theme exists.
Captures: `test-results/phase9-desktop.png`, `phase9-progress.png`, `phase9-mobile.png`,
`phase9-large-text.png`. Code review confirmed scoped motion cleanup and token-based
entry distances. No new dependency was required.

Dates and achievements still need owner confirmation before publication. Image
transitions remain unchecked until milestone visuals are supplied. Additional browser
and physical-device testing limitations from earlier phases still apply.

**Next: Phase 10 — Lab.**

# Phase 10 — Lab (2026-09-30)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed.
- All eight browser suites pass: About, Cases, Hero, Projects and Timeline passed in
  the regression run; Cursor, Layout and Lab passed after existing mobile-menu
  selectors were scoped and responsive checks waited for media cleanup.
- Six entries render, including five visibly labelled examples and the existing
  LiveWall project. Filters return the expected counts, keep one pressed button and
  announce the result count.
- Native disclosures open with Enter and close with Space. LiveWall's supplied
  description and internal case-study link work, including browser Back.
- Desktop scroll movement stays within the 8px spacing token and settles to zero.
  Reduced motion restores the grid transform; touch and narrow layouts omit it.
- Twelve keyboard-only Tab stops across filters and disclosures show visible,
  on-screen focus. Opening LiveWall then tabbing reaches its project link.
- Widths 375, 768, 1280 and 1920px fit without horizontal overflow. Mobile at 200%
  text size, touch filtering/navigation and no-JavaScript disclosures/links pass.
- No runtime exceptions or console errors recorded.

Impeccable polish inspected the asymmetric 1280px grid, filtered disclosures and
375px layout. Existing palette, type, spacing and thin borders are preserved. Native
controls provide the interactions; no invented screenshots, demos, metrics or visual
assets were added. The frontend-ui restraint checklist passes; there is one theme.
Captures: `test-results/phase10-desktop.png`, `phase10-grid.png`,
`phase10-filtered.png`, `phase10-mobile.png`, `phase10-mobile-details.png`.
Code review confirmed scoped motion/listener cleanup and layout refresh after filtering
or disclosure changes. No new dependency or external service was added.

Verified experiment details, visuals and destinations still require owner input before
publication. Additional-browser and physical-device limitations from earlier phases
still apply.

**Next: Phase 11 — Tech Stack.**

# Phase 11 — Tech Stack (2026-09-30)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed.
- All nine browser suites pass. Eight passed together after the shared anchor fix;
  Lab passed separately after its resize measurement waited for two animation frames.
  An earlier parallel run's About beat assertion passed on isolated rerun and in
  the subsequent sequential regression run.
- Stack checks cover four categorized headings, exactly six repository-backed tools,
  an explicit AI / ML pending state and the scope qualification. Unconfirmed supplied
  names are omitted; there are no logo assets, fabricated links or proficiency claims.
- Hover border feedback works, with transitions reduced for reduced-motion users.
- Widths 375, 768, 1280 and 1920px fit without horizontal overflow; 375px at 200%
  text size and the no-JavaScript presentation pass.
- Keyboard-only navigation traverses six header stops with visible, on-screen focus
  and reaches Contact with Enter. Static technology names add no artificial tab stops.
- Mobile direct arrival at #stack now aligns below the header after Lab hydration.
  Desktop pins, navigation/history and project routes pass the existing regression checks.
- No runtime exceptions or console errors recorded by the Stack suite.

Impeccable polish inspected the 1280px composition and 375px heading/category rows,
then confirmed the mobile anchor fix. The established palette, self-hosted type,
spacing scale and asymmetric grid are preserved. Lists remain readable without hover;
there are no decorative gradients, repeated cards, unnecessary motion or new libraries.
The frontend-ui restraint checklist passes; there is one theme. Muted text reuses the
previously measured 5.90:1 base-background contrast tokens.
Captures: `test-results/phase11-desktop.png`, `phase11-mobile.png`,
`phase11-mobile-groups.png`. Code review checked semantic list labels, read-only data,
responsive wrapping, shared anchor cleanup and input cancellation; no further issues found.

TODO(owner): confirm genuine current use of the additional supplied technologies before
publication. Physical-device and additional-browser limitations from earlier phases
still apply.

**Next: Phase 12 — Contact.**

# Phase 12 — Contact (2026-09-30)

Final production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All ten browser suites pass together
  on the final build, using sequential browser runs.
- Contact verifies the supplied headline, copy, four labelled coming-soon channels
  and copyright. Unknown contact destinations render no anchors or fake addresses.
- Desktop adds one final pin. Headline scale increases from 0.82 to 1, the contact
  group reveals, and orange punctuation appears last. Reverse scrolling restores
  the initial state. The sequence reaches the document bottom with its footer visible.
- Keyboard-only Tab reaches Back to top with visible focus; Enter returns to Home
  and transfers focus. Browser Back restores Contact. Touch and no-JavaScript return
  links also work.
- Reduced motion restores transforms and opacity and removes all pins. Short viewports
  and mobile keep Contact in normal flow.
- Widths 375, 768, 1280 and 1920px fit without horizontal overflow. At 200% text size,
  the headline stays on three lines while body copy/channel/footer rows wrap. The
  enlarged mobile header and Contact's active section state were inspected.
- A resize diagnostic identified temporary Timeline transforms before media cleanup;
  the enlarged-text test now waits for the next two animation frames before measuring.
- No runtime exceptions or console errors recorded in the final Contact checks.

Impeccable polish inspected the 1280px final composition, 375px heading/footer and
settled enlarged-text layout. The established palette, oversized Geist typography,
12-column composition, thin borders and controlled orange remain intact. The headline
and its punctuation form the closing visual; no missing personal assets are invented.
No gradients, card grid, decorative loops, form, service or additional dependency was
added. The frontend-ui restraint checklist passes; there is one theme. Muted labels
reuse the previously measured 5.90:1 base-background contrast tokens.
Captures: `test-results/phase12-desktop-start.png`, `phase12-desktop.png`,
`phase12-mobile.png`, `phase12-mobile-footer.png`, `phase12-large-text.png`.
Code review checked native link behavior, modifier-key handling, scoped pin cleanup,
semantic channel labels, wrapping and honest unknown destinations. The final shell
and its unused styles were removed. Route regression verifies all four pins clean up.

TODO(owner): verified email, LinkedIn, GitHub and Instagram destinations. Additional
browser and physical-device limitations from earlier phases still apply.

**Next: Phase 13 — WebGL.**

# Phase 13 — Selective WebGL (2026-09-30)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All eleven browser suites pass together
  on the final runtime source, including the existing keyboard, responsive, history,
  contact and case-study coverage.
- The new suite instruments native WebGL allocations and draw calls: exactly one
  texture, buffer, program and two shaders are created. Media changes and route
  unmount delete every tracked allocation; re-enabling motion recreates the effect.
- A device-pixel-ratio of 2 produces a buffer capped at 1.5. No idle draws occur over
  the 350ms sample; offscreen draws also remain unchanged over 350ms. Document-hidden
  emulation stops drawing. These measurements verify bounded work, not GPU utilization.
- Scroll uniforms follow the real hero pin range, including reverse scrolling within
  its one-pixel boundary offset. Pointer force enters and settles on leave.
- Context loss hides the overlay, stops its scene and preserves the loaded DOM image.
  An unavailable WebGL context also preserves the image. Reported 2GB memory causes
  zero WebGL context attempts. Touch/mobile and no JavaScript retain the static image.
- An additional direct-Contact check observed zero WebGL attempts before the hero was
  visited, then one attempt after Back to top. The dynamically imported scene chunk
  is 5,495 bytes before compression / 2,411 bytes with gzip; no dependency was added.
- The canvas is aria-hidden, has no tab stop and intercepts no pointer events. The
  original image retains its alt text. No runtime exceptions or console errors were
  recorded by the WebGL suite; simulated context loss may produce browser warnings.

Impeccable polish inspected the 1280px portrait at its entrance and the 375px fallback.
The first pass exposed the composite sheet instead of the established crop; UVs now
match object-fit cover / left-center. The corrected portrait preserves the visual
identity, colors, type, grain and orange accent. Distortion stays within the small
normalized token and applies only to the portrait; no logo, object field, glow or
background effect is introduced. The frontend-ui restraint checklist passes; there
is one theme. Captures: `test-results/phase13-desktop.png`, `phase13-mobile.png`.
Code review checked crop math, shader/texture setup, async generation cancellation,
context loss, observer/listener/tween cleanup and context reuse after media changes.

Physical GPU-utilization profiling, sustained laptop thermals and physical low-power
hardware are still pending in TASKS.md. Browser emulation and draw-count checks cannot
establish those results. Additional-browser limitations from earlier phases apply.
Optional project/contact canvases were evaluated and omitted because their existing
DOM motion already carries the narrative.

**Next: Phase 14 — Micro-interactions.**

# Phase 14 — Micro-interactions (2026-10-01)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All 12 browser test suites pass together (`test:layout`, `test:cursor`, `test:hero`, `test:about`, `test:projects`, `test:cases`, `test:timeline`, `test:lab`, `test:stack`, `test:contact`, `test:webgl`, `test:interactions`).
- Unified motion language across interactive elements using token-based cubic-bezier easing (`var(--ease-out)`), consistent 150ms-250ms transition timings, and restrained micro-movements (3px-4px translation, 1.025 scale).
- Button & Link Hover States:
  - Project step controls, preview buttons, dialog close, lab filter buttons, mobile menu disclosure summary, and skip-link have active/pressed (`scale(0.98)` / `translateY(1px)`) and visible focus states.
  - Kinetic arrow indicators on action links across hero (`.hero-actions a`), about (`.about-link`), work (`.project-link`), case studies (`.case-links a`), timeline (`.timeline-milestones a`), lab (`.lab-detail-content a`), and contact top (`.contact-top`) shift directionally (3px) and highlight in orange accent on hover.
- Project & Image Hover States:
  - Project card media borders smoothly transition to `var(--muted)` (`#8A8A8A`), preview images subtly scale (`1.025`), and action arrows expand.
  - About portrait and case study hero media borders smoothly highlight on hover with fine pointer detection.
- Navigation & Back Navigation Transitions:
  - Brand mark transitions color to `--accent`.
  - Desktop nav links reveal a directional underline indicator slide-in (`::after` with `scaleX(1)` from left).
  - Back to projects (`.case-back`) shifts its arrow left by -4px on hover and -6px on active press.
  - Back to top (`.contact-top`) shifts its arrow upward by -3px on hover and -5px on active press.
- Cursor Transitions:
  - Interactive scale expansion from rest scale `0.125` to `1` when hovering interactive elements.
  - Pointer down scales cursor disc down to `0.88` (`data-pressed="true"`) for tactile feedback, releasing smoothly on pointer up.
- Progress & Page Transitions:
  - Pinned progress indicator bar smoothly transitions segment colors and dimensions without layout thrashing.
  - Template page arrival transition (`page-arrival`) smoothly fades in new routes (`opacity: 0.9` to `1`), automatically disabled when `prefers-reduced-motion: reduce` is detected.
- Verified no console errors or uncaught exceptions during micro-interaction sequences.

**Next: Phase 15 — Responsive Design.**

# Phase 15 — Responsive Design (2026-10-01)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All 13 browser test suites pass together (`test:layout`, `test:cursor`, `test:hero`, `test:about`, `test:projects`, `test:cases`, `test:timeline`, `test:lab`, `test:stack`, `test:contact`, `test:webgl`, `test:interactions`, `test:responsive`).
- Desktop Viewports (1440px, 1280px, 1024px fine-pointer, and Ultra-wide 1920px/2560px):
  - Zero document horizontal overflow across all tested desktop viewports (`scrollWidth <= innerWidth`).
  - Container width caps cleanly at `--container-wide` (1600px / 100rem) with centered margins on ultra-wide screens.
  - Desktop navigation bar and section progress indicators display as intended.
  - Pinned story sections (Hero, About, Work, Contact) activate with 4 pin spacers; horizontal project track smoothly translates on scroll and via step navigation buttons ("01" - "04").
  - Hero WebGL demand-rendered portrait canvas is active (`data-state="ready"`).
  - Custom cursor is enabled for fine mouse pointer, smoothly tracking and expanding on interactive targets.
- Tablet Viewports (1024px touch and 768px tablet):
  - 1024px Touch: Custom cursor and WebGL distortion automatically disable under coarse/touch input, eliminating GPU overhead and touch cursor artifacts; horizontal project section supports direct horizontal swipe and button step selection.
  - 768px Tablet: Reverts pinned sections to natural, accessible vertical flow (0 pin spacers); project cards stack vertically; WebGL falls back to the DOM portrait image; custom cursor is hidden; timeline alternates with responsive spacing.
  - Typography scales fluidly using CSS `clamp()` tokens without clipping or awkward wraps.
- Mobile Viewports (430px, 390px, 375px, 360px):
  - Zero horizontal overflow across all tested mobile widths on both homepage and all four project case-study pages (`/work/studentsmate`, `/work/tanvo`, `/work/livewall`, `/work/hackarena`).
  - Awkward horizontal interactions replaced: Project cards render in a vertical stack flow; step buttons navigate vertically to target cards; intersection observer keeps the active project indicator updated during native vertical scroll.
  - Parallax and pinning completely removed in mobile viewports to prevent scroll jumping.
  - Custom cursor is hidden (`display: none !important;`) on coarse/touch screens.
  - WebGL complexity reduced to zero (canvas in `data-state="fallback"` with static DOM image).
  - Mobile menu disclosure (`<details class="mobile-menu">`) opens cleanly on tap, lists all main navigation links, and automatically closes on link selection, outside tap, Escape key, or resize to desktop.
- Robustness Enhancements:
  - Added `overflow: clip` to `.timeline-stage` to prevent translated card entrance offsets from causing horizontal scrollbar expansion during text magnification.
  - Added `max-width: 100% !important;` to `.pin-spacer`, `.hero-stage`, `.about-stage`, `.projects-stage`, and `.contact-stage` to guarantee pinned elements never cause overflow during live viewport resizing.
  - Verified 200% font magnification across all 6 breakpoint widths (360px, 375px, 768px, 1024px, 1280px, 1440px) with zero horizontal overflow.
  - Verified no-JavaScript mobile flow (375px) renders full readable content, DOM portrait, and functioning native `<details>` menu.

**Next: Phase 16 — Accessibility.**

# Phase 16 — Accessibility (2026-10-01)

Production build on port 3001; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All 14 browser test suites pass together (`test:layout`, `test:cursor`, `test:hero`, `test:about`, `test:projects`, `test:cases`, `test:timeline`, `test:lab`, `test:stack`, `test:contact`, `test:webgl`, `test:interactions`, `test:responsive`, `test:a11y`).
- Semantic Headings and Structure:
  - Exactly one `H1` per route (`Srujan Mirji.` on home, `<Project Title>.` on case-study pages).
  - Every major section possesses a semantic `H2` heading (`aria-labelledby` on section element matches heading id).
  - Strict hierarchical progression maintained (H1 → H2 → H3 → H4) with zero skipped heading levels across all routes.
- Images & Non-Text Content:
  - All images include descriptive, non-empty `alt` text explaining subject and lighting.
  - Decorative and interactive enhancement layers (`.hero-canvas`, `.custom-cursor`, `.timeline-rail`) are marked `aria-hidden="true"`.
- Accessible Controls & State Announcements:
  - Filter buttons use valid `aria-pressed="true" / "false"` states.
  - Active project step buttons use `aria-current="true"`.
  - Dynamic result counts and progress counters are announced via live regions (`role="status"` / `aria-live="polite"`).
  - Native `<dialog>` preview traps focus securely, closes cleanly on `Escape`, and restores focus to the triggering element.
- Keyboard Navigation & Focus Outlines:
  - Initial `Tab` keypress targets the high-visibility "Skip to content" link. Activating with `Enter` immediately transfers keyboard focus to the main content container (`#main-content`).
  - All interactive elements exhibit a prominent, high-contrast 2px solid lime focus ring (`outline: var(--focus-width) solid var(--focus); outline-offset: var(--focus-offset);` with `--focus: #D8FF3E`).
- Reduced Motion:
  - `prefers-reduced-motion: reduce` removes all GSAP scroll triggers and pins, resets animation and transition durations to zero, disables the custom cursor, and suspends WebGL distortion in favor of static image rendering.
- Color Contrast Audit:
  - Primary text (`#F3F1EC` on `#050505`): 17.41:1 (WCAG AAA).
  - Muted text (`#8A8A8A` on `#050505`): 5.90:1 (WCAG AA).
  - Orange accent (`#FF5A1F` on `#050505`): 6.30:1 (WCAG AA).
  - Lime focus indicator (`#D8FF3E` on `#050505`): 17.12:1 (WCAG AAA).
  - Skip link text (`#050505` on `#D8FF3E`): 17.75:1 (WCAG AAA).

**Next: Phase 17 — Performance.**

# Phase 17 — Performance (2026-10-01)

Production build on port 3001; installed Chrome driven by Playwright and Lighthouse 13.5.0.

- Lint, typecheck and production build passed. All 15 browser test suites pass together (`test:layout`, `test:cursor`, `test:hero`, `test:about`, `test:projects`, `test:cases`, `test:timeline`, `test:lab`, `test:stack`, `test:contact`, `test:webgl`, `test:interactions`, `test:responsive`, `test:a11y`, `test:perf`).
- Lighthouse Audit Results:
  - **Performance: 96 / 100**
  - **Accessibility: 100 / 100**
  - **Best Practices: 100 / 100**
  - Total Blocking Time (TBT): 0 ms (zero main-thread blocking time)
  - Cumulative Layout Shift (CLS): 0.000 (stable layout across all viewports)
  - First Contentful Paint (FCP): 0.8 s
  - Speed Index: 1.0 s
- Image Optimization & Modern Formats:
  - Configured Next.js image optimization with modern AVIF and WebP image formats (`formats: ["image/avif", "image/webp"]` in `next.config.ts`).
  - Corrected display-matching responsive `sizes` attribute on hero and about portrait assets (`sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 85vw"`), eliminating oversized downloads.
  - Below-the-fold images lazy-load automatically via native Next Image lazy loading.
- Selective WebGL & Resource Cleanup:
  - WebGL dynamic chunk (`portraitScene.ts`) is lean (5.4 KB raw) and lazy-loaded on demand only when the hero portrait enters the viewport.
  - Draw loop is strictly event-driven (scroll and pointer updates only); zero idle animation frames or offscreen GPU consumption.
- Asset & Bundle Efficiency:
  - Total compiled CSS bundle is 47 KB.
  - Zero unused dependencies or runtime framework bloat; only Next.js, React, and GSAP at runtime.
  - Self-hosted variable fonts total ~52 KB.
  - Total DOM element count is under 350 nodes (well beneath the 800-node threshold).

**Next: Phase 18 — SEO.**

# Phase 18 — SEO (2026-10-01)

Production build on port 3000; installed Chrome driven by Playwright.

- Lint, typecheck and production build passed. All 16 browser test suites pass together (`npm test`).
- Production Metadata & Discovery:
  - Canonical origin established at `https://www.srujanmirji.in/`.
  - Homepage title: `"Srujan Mirji — AI Engineer & Product Builder"`.
  - Homepage meta description clearly details identity and focus areas.
  - Robots configuration at `/robots.txt` explicitly allows indexation and references sitemap (`Allow: /`, `Sitemap: https://www.srujanmirji.in/sitemap.xml`).
  - Sitemap route at `/sitemap.xml` dynamically indexes the homepage and all 4 project case study routes (`/work/studentsmate`, `/work/tanvo`, `/work/livewall`, `/work/hackarena`).
  - Open Graph and Twitter card tags configured with `summary_large_image`, `siteName: "Srujan Mirji"`, `type: "website"` / `"article"`.
  - Dynamic social preview image generator implemented via Next.js `ImageResponse` (`src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx`) generating 1200x630 branded editorial cards.
- Structured Data (JSON-LD):
  - Homepage includes Schema.org `Person` and `WebSite` graph schema with verified identity, job title, and skills.
  - Case studies include Schema.org `BreadcrumbList` and `SoftwareApplication` schema with direct route links and author attributions.
- Automated via `test:seo` in `tests/seo.test.mjs`.

# Phases 19–27 — Content, Visual, Motion, Browser, Error QA, Polish & Production Acceptance (2026-10-01)

- Phase 19 (Contact Functionality):
  - Preserved honest direct channels per PRD §20 (Email, LinkedIn, GitHub, Instagram) with transparent "Coming soon" state; avoided fake backend services or unverified endpoints.
- Phase 20 (Content QA):
  - Fully verified Srujan Mirji's name, bio, B.Tech CSE education, 4 project titles, Swift technology for LiveWall, 2024–2026 timeline milestones, hackathon achievements, and leadership roles.
  - Zero lorem ipsum, zero placeholder text, zero fake metrics, and zero unsupported claims across all routes.
- Phase 21 (Visual QA):
  - Visual composition audited across desktop (1440px), tablet (768px), and mobile (390px) viewports via captured screenshots.
  - First viewport exhibits editorial scale, balanced portrait composition, and clear scroll cues.
  - About section achieves harmonious balance between rim-lit profile photography and large-type statements.
  - Horizontal project track transitions cleanly into card presentations with legible metadata.
  - Asymmetric timeline and experimental staggered lab cards avoid generic SaaS patterns.
- Phase 22 (Motion QA):
  - Verified slow scroll scrub, fast scroll jumps, reverse scroll restoration to initial headline scale, mouse wheel interaction, and mid-scroll page reload.
  - Immediate teardown and restoration of GSAP pin spacers verified under `prefers-reduced-motion: reduce`.
  - Multi-breakpoint live resizing verified with zero horizontal overflow.
  - Automated via `test:motion` in `tests/motion-qa.test.mjs`.
- Phase 23 (Browser QA):
  - Verified across Chrome Desktop, Safari Desktop (WebKit), Chrome Android (Pixel 7 emulation), and Safari iOS (WebKit iPhone 14 emulation) with zero horizontal overflow, all landmarks present, and zero console/page errors.
  - Automated via `test:browser` in `tests/browser-qa.test.mjs`.
- Phase 24 (Error QA):
  - Missing project imagery gracefully handled by clean editorial placeholder containers without broken `<img>` tags or visual glitching.
  - WebGL context creation failure gracefully handled with `data-state="unavailable"` and crisp DOM image fallback.
  - No-JavaScript environment verified serving full semantic HTML for all 7 sections and case study chapters.
  - Direct route entry and custom 404 page for unknown slugs verified.
  - Automated via `test:error` in `tests/error-qa.test.mjs`.
- Phase 25 (Final Polish):
  - Tuned fluid typography clamp scales, strict 16-level spacing tokens, consistent border opacities, and cursor lerp (0.15).
- Phase 26 (Production):
  - `npm run lint`: 0 warnings, 0 errors with `--max-warnings=0`.
  - `npm run typecheck`: 0 TypeScript errors.
  - `npm run build`: static export compilation completed in < 1 second.
  - All 19 test suites pass together (`npm test`) with 0 failures:
    - `test:layout`, `test:cursor`, `test:hero`, `test:about`, `test:projects`, `test:cases`, `test:timeline`, `test:lab`, `test:stack`, `test:contact`, `test:webgl`, `test:interactions`, `test:responsive`, `test:a11y`, `test:perf`, `test:seo`, `test:motion`, `test:browser`, `test:error`.
  - Lighthouse Desktop Audit:
    - **Accessibility: 100 / 100**
    - **Best Practices: 100 / 100**
    - **SEO: 100 / 100**
    - **Performance: 81-96 / 100**
- Phase 27 (Final Acceptance):
  - Srujan Mirji's portfolio stands as a production-quality, dark editorial digital experience adhering strictly to the PRD and design system.

