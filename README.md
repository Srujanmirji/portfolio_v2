# Srujan Mirji — Portfolio V2

Fresh Next.js App Router project implementing the supplied portfolio specification.
Current scope: **Phases 0–13: foundation, core layout, cursor, hero, About, Projects, case studies, Timeline, Lab, Tech Stack, Contact and selective hero WebGL** in [TASKS.md](TASKS.md).

## Run

Node.js 22 or newer; Node.js 24 is used for verification.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables or external services are required.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

With the app running, run the browser checks:

```sh
npx playwright install chromium
npm run test:layout
npm run test:cursor
npm run test:hero
npm run test:about
npm run test:projects
npm run test:cases
npm run test:timeline
npm run test:lab
npm run test:stack
npm run test:contact
npm run test:webgl
```

For an installed Chrome browser, prefix the test commands with `PLAYWRIGHT_CHANNEL=chrome`.
Set `BASE_URL=http://127.0.0.1:3001` when checking a production server on port 3001.

## Source of truth

Read `SRUJAN-PORTFOLIO-PRD.md`, `01-DESIGN-SYSTEM.md`, the architecture,
scroll storytelling, content and build-prompt documents, then `TASKS.md`.
Do not replace their concept with a different portfolio design.

- `src/app/globals.css`: exact palette, semantic Tailwind tokens, type/spacing scale and base styles.
- `src/app/layout.tsx`: server-rendered root, local fonts, initial metadata, skip link and page shell.
- `src/app/page.tsx`: all seven implemented story sections, from Hero through Contact.
- `src/components/sections/Hero.tsx`: supplied portrait, identity and accessible section links.
- `src/components/sections/About.tsx`: approved biography, cropped side-profile portrait, keywords and project CTA.
- `src/components/sections/Projects.tsx`: pinned project track, progress controls and native preview dialog.
- `src/components/projects/`: reusable panels, case-study layout, honest placeholders and token-based styles.
- `src/app/work/[slug]/page.tsx`: four prerendered case-study routes and project metadata.
- `src/app/not-found.tsx`: unknown-route recovery.
- `src/components/motion/`: hero/About/Contact timelines, horizontal project motion, Timeline progress and scoped cleanup.
- `src/components/sections/Timeline.tsx`: server-rendered chronological milestones and project links.
- `src/data/timeline.ts`: supplied draft years, categories and milestone names awaiting owner confirmation.
- `src/data/experiments.ts`: five labelled example entries and the existing LiveWall project.
- `src/components/lab/`: category filters, native details and limited scroll-velocity movement.
- `src/components/sections/TechStack.tsx`: categorized, server-rendered technology lists and honest pending content.
- `src/data/technologies.ts`: technologies evidenced by this repository; additional supplied names await owner confirmation.
- `src/components/sections/Contact.tsx`: final pinned headline sequence, pending contact channels, copyright and native return to the top.
- `src/data/contact.ts`: four contact destinations awaiting owner input.
- `src/components/canvas/`: eligibility wrapper and dynamically imported native portrait shader; DOM image remains the fallback.
- `src/components/layout/`: persistent navigation, section tracking, containers, section wrappers and custom cursor.
- `src/data/projects.ts`: typed, source-backed featured projects; unknown assets, stacks and URLs are null.
- `src/data/sections.ts`: section order, anchor IDs and approved shell copy.
- `src/app/template.tsx`: reduced-motion-aware page arrival transition, without artificial loading delays.
- `src/assets/fonts/`: self-hosted variable WOFF2 fonts and their licenses.
- `docs/FOUNDATION.md`: audit, implementation direction, architecture and missing-content TODOs.
- `docs/QA.md`: phase-by-phase checks and limitations.
- `tests/`: runnable browser checks using Node's test runner and Playwright.

The next task is **Phase 14 — Micro-interactions**. Physical GPU-utilization, thermal and low-power-device checks remain pending. Contact destinations remain owner TODOs. Additional technologies require owner confirmation before display. Real experiment content and assets remain owner TODOs. Timeline dates and milestone visuals remain owner TODOs. Phase 8 content and asset TODOs remain tracked in TASKS.md. Hero, About and Projects use GSAP and ScrollTrigger;
the optional hero WebGL layer now adds a small portrait distortion pass. Project/contact WebGL was evaluated and omitted. Project URLs, contact details,
metrics and screenshots must come from the owner. No placeholder links are published.
About metrics and detailed education/hackathon claims remain owner TODOs.
Search indexing stays disabled until the content and SEO phases are complete.

Desktop hover labels use `data-cursor="VIEW"`, `"OPEN"` or `"EXPLORE"` on interactive
elements. `data-cursor="native"` opts an element out. Native cursors remain available
for touch, keyboard, text entry, narrow screens, disabled controls and reduced motion.
