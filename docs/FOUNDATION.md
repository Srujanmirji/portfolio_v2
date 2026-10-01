# Phase 0 — audit

The workspace initially contained the PRD, TASKS.md, six specification documents,
and three supplied portrait compositions. It had no package.json, source code,
Git repository, utilities, project data, running app, or existing build to preserve.
The owner confirmed this is a new project and explicitly scoped this work to Phases 0 and 1.

An initial investigation of public V1 code was discarded after that clarification.
No V1 implementation, repository history, remote, contacts, screenshots, project data,
or external project assets are part of this foundation.

- Git: fresh local repository on `feat/portfolio-v2`; no remote configured.
- Reuse: the supplied specifications and portrait source files, unchanged.
- Replace/remove: no pre-existing app or dependencies; cleanup is not applicable.
- Preserve: all original documents and assets. Do not render the editorial composite as a webpage.
- Baseline: the new development server and production build are the first runnable versions.
- The additional global rule files referenced at `~/.Codex/rules/ecc/web/` were absent;
  the supplied instructions and frontend-ui skill govern implementation.

# Phase 1 — implementation direction

This records choices within the approved system, not a redesign.

| Token | Value | Role |
| --- | --- | --- |
| Background | `#050505` | Primary canvas |
| Foreground | `#F3F1EC` | Body and display text |
| Muted | `#8A8A8A` | Secondary copy and metadata |
| Accent | `#FF5A1F` | Controlled orange emphasis |
| Secondary accent | `#D8FF3E` | Focus and selection |
| Border | `#30302E` | Decorative 1px dividers; never a control's only boundary |

**Type:** Geist Sans for display (600) and body (400), Geist Mono for metadata (400).
Both are local Latin variable WOFF2 files (100–900), loaded through `next/font/local`
with swap and preload. No Google Fonts requests occur during builds or page views.
Font provenance: Google Fonts' Geist v5 and Geist Mono v6 Latin variable distributions,
downloaded on 2026-09-27; SIL Open Font Licenses are included beside the binaries.
Scale: 12 / 14 / 16px, fluid 20–32px lead, 48–128px section, 72–272px display.
Body line height 1.6; display 0.88 with tight tracking as specified.

**Layout:** full-viewport identity with oversized left-aligned type, a quiet rule,
and asymmetric supporting copy on a 12-column desktop grid; mobile stacks in reading order.

```text
Desktop                            Mobile
┌───────────────────────────┐      ┌────────────────┐
│ AI · Software · Product   │      │ AI · Software… │
│                           │      │                │
│ SRUJAN                    │      │ SRUJAN         │
│ MIRJI.                    │      │ MIRJI.         │
│                           │      │                │
│ ───────────────────────── │      │ ────────────── │
│ Roles        Product copy │      │ Roles          │
└───────────────────────────┘      │ Product copy   │
                                   └────────────────┘
```

**Signature:** the oversized identity will become the portrait-led, scroll-scrubbed
composition in Phase 4. This phase establishes its typography and contrast without
substituting a placeholder animation for the specified sequence.

Spacing uses a 4px base; fluid page gutters use `clamp()`; the wide container caps at
1600px and reading measure at 65ch. Content/navigation/overlay/cursor/focus layers
have named z-index tokens. The grain is static at 2.5% opacity, non-interactive,
and below keyboard focus. Only the dark theme is specified.

# Architecture for subsequent phases

- `src/app`: server components and route-level metadata by default.
- `src/components/layout`: navigation, progress and cursor in Phases 2–3.
- `src/components/sections`: narrative sections as their phases arrive.
- `src/components/motion`: scoped GSAP/ScrollTrigger integration, reversible and cleaned up.
- `src/components/projects`: reusable case-study presentations.
- `src/components/canvas`: lazy optional WebGL with static fallback.
- `src/data`: verified projects, timeline and experiments independent of UI.

Create these modules when used, rather than adding empty scaffolding. Do not hide DOM
content inside a canvas. Do not add shadcn components or animation libraries before a
phase needs them. Use `cn()` when conditional Tailwind classes are introduced.

# Phases 2–3 — layout and cursor

The owner subsequently requested the next phases. `PageShell`, `Container` and `Section`
now provide the reusable layout. Navigation follows the specified SM / WORK / ABOUT / LAB /
CONTACT arrangement, with a 01–07 counter and segmented section progress. Native `<details>`
provides the mobile disclosure; client behavior adds Escape, outside-click and focus handling.
An IntersectionObserver tracks the visible section, accounting for the actual header height.
Observers and document listeners clean up on unmount.

Seven section shells supply real anchor destinations using only the approved headings/copy.
These are navigation scaffolding, not completed About, Projects, Timeline, Lab, Stack or
Contact experiences. Their media, verified facts, case studies and motion remain in Phases 4–12.
Route-level arrivals use the Next.js template lifecycle and a short CSS opacity transition;
hash changes do not replay a page transition. Reduced motion disables it.

The cursor uses a decorative, non-interactive DOM layer. CSS interpolates its position and
circle scale; pointer events are coalesced into a single pending animation frame. There is no
continuous JavaScript animation loop, no React state update per pointer event, and no new
runtime library. Hover labels are annotations on real links, not substitutes for visible labels.
`data-cursor="native"` opts out. Touch/coarse input, screens below 48rem, text editing, disabled
controls and reduced motion retain native pointers. Tab, Escape, blur and leaving the window
also restore the native cursor. CSS and event listeners both enforce the motion preference.

# Content TODOs — owner supplied only

- [ ] StudentsMate, Tanvo, LiveWall and HackArena: actual screenshots, final demo/repository URLs,
  technologies, personal role, architecture, current status and outcomes.
- [ ] Education, dates, leadership roles, hackathon achievements and any numerical claims.
- [ ] Lab experiments and their assets, categories, status and destinations.
- [ ] Relevant, genuinely used technology list.
- [ ] Final email, GitHub, LinkedIn and Instagram destinations.
- [x] Hero uses the main pose from the supplied `srujan-hero.png`, cropped in CSS without altering the source.
- [x] About uses the lower-right side-profile pose from the supplied sheet, cropped in CSS.

Keep these as editorial TODOs until provided. Never turn unknown destinations into
`#`, `example.com`, guessed URLs, or apparently functional buttons.

The static foundation uses only identity and positioning copy explicitly supplied in
`05-CONTENT.md`. Full SEO, social previews, sitemap and indexing belong to Phase 18.

# Phase 4 — Hero

The hero replaces the identity baseline. Its scoped GSAP timeline pins for 180vh on
viewports at least 64rem wide and 48rem tall when motion is permitted and the content fits.
Identity scales/enters at 20%, portrait and orange accent reveal at 40%, supporting
copy at 60%, and the composition compresses at 80% before releasing into About.
Navigation remains persistent. Mobile, short viewports, reduced motion and no-JavaScript
render the complete composition in normal flow.

The portrait is a Next Image static import with responsive optimization and preload.
CSS crops the primary pose from the original sheet; no generated imagery or new claims.
Hash links jump directly so rapid navigation does not compete with a smooth-scroll animation.
Initial section links are restored after pin measurement unless the visitor has interacted.
Media changes and unmount revert the timeline and pin. WebGL remains optional until Phase 13.

# Phase 5 — About / Storytelling

About uses the exact headline, biography and five keywords from `05-CONTENT.md`.
The existing portrait sheet supplies the side-profile image; a CSS viewport crops it
without altering the original. The image is optimized by Next Image and lazy loaded.
The 12-column desktop composition places the portrait left and headline right; mobile
reads headline, portrait, biography, keywords and a real link to Work.

`usePinnedStory` now owns the lifecycle shared by Hero and About: scoped matchMedia,
180vh pinning, viewport-fit guard, refresh, initial hash restoration and cleanup.
Section-specific hooks own only their timelines. About scales the image from 0.8 to 1,
reveals the headline line by line, moves the keyword group into place, then shifts the
portrait horizontally before release. Mobile/reduced motion keep all content visible.

TODO(owner): education specifics, hackathon numbers and project metrics are not verified.
No metric UI or count-up animation is rendered until those facts are supplied.

# Phase 6 — Project Data

`src/data/projects.ts` defines the four projects in the PRD's featured order.
The Work shell derives its list from this array. No project routes or new project UI
are introduced before their assigned phases.

| Field | Source / handling |
| --- | --- |
| Slugs, featured order | Site architecture and PRD project chapters |
| Titles, descriptions | Exact `05-CONTENT.md` project copy |
| Categories | Supplied tags; LiveWall's Desktop category comes from PRD §15 |
| Technologies | Swift is explicitly supplied for LiveWall; other stacks are `null` |
| Image, live URL, GitHub URL | `null` until real assets and owner-approved destinations are supplied |

The StudentsMate stack in PRD §32 is an example of the data shape, so it is not treated
as a verified implementation claim. A project image requires a source, descriptive alt
text and intrinsic dimensions. URLs are typed as HTTPS; GitHub links require the GitHub
host. Those type constraints are not verification that a destination exists or belongs
to the owner. Verify supplied destinations before publication.

Null means unknown: consumers must omit unavailable links/technology lists and show
an honest media placeholder. Never turn null into `#`, an invented URL, stock product
screenshot, or a claim that no repository exists. Personal role, architecture, features,
status and outcomes remain case-study content TODOs for Phase 8.

# Phase 7 — Projects Experience

Projects reads the featured dataset in its supplied order. Desktop vertical scrolling
drives a pinned horizontal track; offsets come from actual card layout widths. A
ResizeObserver refreshes distance when those widths change. The nearest panel scales
from 0.82 to 1, aligns its title and reveals metadata; progress buttons offer direct
keyboard access. Inactive panels are inert while horizontal motion is enabled.

Mobile, short viewports and reduced motion use normal vertical flow. Without JavaScript,
all four projects remain readable and unavailable preview controls stay hidden.
View Project opens a native dialog with Escape, focus restoration and background
inertness supplied by the browser. Native cursors remain visible in the dialog.
No placeholder links or fabricated screenshots are rendered. Phase 8 will add the
case-study routes; verified content and real destinations remain owner TODOs.

# Phase 8 — Project Case Studies

The four `/work/[slug]` routes are prerendered from the existing project dataset.
They share a Server Component layout: oversized title, supplied positioning, category
metadata, large media area and nine numbered chapters. The desktop composition uses
the established 12-column grid; mobile follows the same reading order vertically.
Known feature names live in optional `Project.caseStudy` content, which also accepts
verified narrative fields. Unprovided details remain visibly pending. StudentsMate's
eight feature names come from PRD §13; Swift is the only supplied LiveWall technology.

View Project is now a real link usable without JavaScript. Preview remains a separate
native dialog and also links to the case study. Both ends of the detail page link back
to `/#work`. Persistent navigation marks Work active on project routes. Unknown slugs
return a real 404 with a recovery link. Metadata uses the supplied project description;
search indexing remains disabled until the SEO phase. No new dependency was needed.

TODO(owner): context, problems, solutions, personal contribution, feature walkthroughs,
architecture, full technology stacks, verified results/status, event statistics/timeline,
real screenshots/branding/photography and external destinations. Those content items
remain unchecked in TASKS.md; page structure is ready for them.

# Phase 9 — Timeline

`timeline.ts` transcribes the nine supplied milestones into chronological 2024–2026
groups. The years are explicitly provisional on screen and in accessible labels; the
owner must confirm dates and achievements before publication. No exact date, numerical
achievement, institution or additional personal history is invented.

The Server Component renders the heading, ordered groups and two real project links.
`TimelineMotion` is the browser-only leaf. Its scoped GSAP context animates the central
line with scroll and moves each year group from alternating directions on desktop.
Mobile keeps a left rail and moves groups a short distance from the same direction.
One current year receives the active state; milestones stay readable and accessible.
No additional pin or scroll hijacking is introduced. Reduced motion/no JavaScript
show all content in normal flow; media changes and route unmount restore styles.

Motion distances and typography use existing theme tokens. Project progress selectors
now wrap at enlarged text sizes so that the whole page remains within its viewport.
Milestone image transitions remain TODO(owner) until real visual assets are supplied.

# Phase 10 — Lab

The Lab uses the supplied heading, five example titles and PRD categories. Example
entries are explicitly labelled; LiveWall reuses its existing project description and
case-study route. No fabricated demo, screenshot, technology claim or result is added.

A Server Component owns the section/heading; the interactive leaf renders filters and
the loose editorial grid. Category buttons expose a single pressed state and a live
result count. Filtering is immediate; an empty-category message is available if the
dataset later changes. Native details provide exploration with keyboard, touch and
no JavaScript; unavailable content says it is coming soon. Without JavaScript, filters
stay hidden and all entries/disclosures remain readable.

Desktop cards occupy unequal spans in the existing 12-column grid. Mobile stacks in
reading order. The group shifts at most one spacing-token unit with scroll velocity
and returns to rest on scroll end. Motion is disabled on touch/narrow screens and for
reduced motion. GSAP owns cleanup; category changes and disclosure toggles refresh
measurements for downstream sections. No new dependency was added.

TODO(owner): real experiments, descriptions, visuals, verified statuses and external
URLs. Supplied example titles are presentation placeholders, not claims of finished
projects. Remaining source-backed portfolio content follows in later phases.

# Phase 11 — Tech Stack

A Server Component uses the existing Section wrapper, type scale, spacing tokens and
12-column composition. The heading occupies five columns; four quiet category rows
occupy the right half. Narrow layouts stack in reading order. Lists wrap naturally,
including enlarged text. Fine-pointer hover changes only a row's thin border; no
logo wall, invented controls, JavaScript animation or dependency is added.

The data follows PRD §19 / 05-CONTENT.md categories. TypeScript, React, Next.js,
Node.js, Git and GSAP are evidenced by this repository. The visible note qualifies
that scope. AI / ML uses a coming-soon state; the other supplied technologies remain
owner TODOs until genuine current use is confirmed. No proficiency levels are inferred.

Mobile inspection found that Lab's hydrated filter height shifted downstream native
hash targets. Initial anchor restoration now belongs to the shared section hook at
all viewport sizes, after fonts and layout initialize. Visitor input cancels it;
route cleanup removes listeners and scheduled work. The pinned-story hook retains
font-triggered measurement refresh without duplicate anchor restoration.

# Phase 12 — Contact

The final section uses the supplied LET'S / BUILD / IT headline and contact copy.
An asymmetric 12-column composition separates oversized type from a quiet channel
list. The orange punctuation is the final visual accent. A footer carries the supplied
name/copyright and a native Back to top link that also restores keyboard focus to Home.
Mobile preserves the three-line headline and stacks the content. Type fits the available
width at enlarged text sizes; contact/footer rows wrap rather than clipping.

`useContactAnimation` reuses the existing scoped `usePinnedStory` implementation.
Desktop scroll progressively scales the headline, reveals the channel group and brings
in the orange punctuation last. Reverse scroll restores the sequence. The last pin
ends at the document bottom with the footer in view. Short/narrow layouts, enlarged
compositions that cannot fit and reduced-motion preferences retain readable normal
flow. No JavaScript also preserves every channel label and the return link.

Typed contact data leaves all four destinations null until owner confirmation. Null
entries render as labelled coming-soon text; supplied destinations can render native
links. There is no invented address, empty anchor, form, service or added dependency.
The completed Contact removes the final section shell and its unused styles. Existing
regression checks now expect four desktop pins and verify their route cleanup.

TODO(owner): verified email, LinkedIn, GitHub and Instagram destinations.

# Phase 13 — Selective WebGL

The supplied hero portrait remains the visual source and accessible DOM image. A
canvas overlays only that image, matching its object-fit cover / left-center crop.
One textured fullscreen triangle introduces a small UV distortion controlled by the
existing hero pin's progress and eased pointer input. Text, navigation, copy, accent
and story structure remain DOM-owned. There are no new objects, particles or effects
behind other sections. Project and Contact canvases were evaluated and omitted: their
existing transitions and closing composition already communicate the story.

The wrapper dynamically imports the scene module only when the portrait is in view
and the device supports the desktop/fine-pointer/no-reduced-motion eligibility rule.
Reported memory of 2GB or less, two or fewer CPU cores and data-saving connections
also preserve the DOM image. The native WebGL pass needs no Three.js/R3F/Drei dependency
for this two-dimensional texture operation; the browser platform covers this scope.

The scene utility owns shader compilation, a single texture/buffer/program, crop
uniforms, capped buffer resizing and disposal. Pixel density is capped at 1.5, or 1
on reported moderate-memory/CPU devices. Antialiasing, depth and stencil attachments
are disabled. Drawing happens on invalidation, coalesced to one animation frame;
there is no idle loop or React render per frame. Intersection/document visibility
checks stop drawing and pointer tweens when hidden or offscreen. Media changes delete
resources while preserving the reusable context; route unmount releases the context.

Loading, unsupported contexts, failed imports/image decoding, shader/texture failures
and context loss keep the DOM image visible. Late async work cannot create a scene
after unmount or an eligibility change. WebGL is now a repository-backed technology
in the Stack; Three.js remains unconfirmed and is not added to the public list.

Texture setup and disposal were checked against the primary references:
[MDN textures](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL),
[MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices),
and [context loss](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context).
Physical GPU utilization, laptop thermals and low-power hardware remain unverified.
