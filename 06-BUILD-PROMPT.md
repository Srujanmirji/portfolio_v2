# Master Build Prompt

You are building the new portfolio website for Srujan Mirji.

The result must feel like a premium interactive digital experience, not a standard developer portfolio.

## Objective

Create a cinematic, scroll-driven portfolio using Next.js, React, TypeScript, GSAP ScrollTrigger, and selective Three.js/WebGL.

The site should communicate:
- AI
- Software
- Product building
- Creative technology
- Hackathons
- Experimentation

## Art Direction

Use a dark editorial visual system.

Background:
`#050505`

Text:
`#F3F1EC`

Muted:
`#8A8A8A`

Accent:
`#FF5A1F`

Secondary accent:
`#D8FF3E`

Typography must be oversized and confident.

Use strong grid alignment, large negative space, thin borders, editorial compositions, layered imagery, and restrained technical details.

## Interaction Direction

Scrolling must drive the story.

Required interactions:
- Pinned hero
- Scroll-scrubbed typography
- Horizontal project section
- Project scale/depth transitions
- Image parallax
- Timeline progression
- Section progress indicator
- Custom desktop cursor
- Smooth page transitions
- Selective WebGL effects

Do not use repetitive fade-in animations as the main interaction language.

## Hero

Build a full-screen opening.

Display:

SRUJAN
MIRJI

AI Engineer · Product Builder · Developer

SCROLL TO ENTER

Use scroll to transform the hero.

The hero should compress into the navigation as the user leaves the section.

## Projects

Create a pinned horizontal scrolling project experience.

Projects:

StudentsMate
Tanvo
LiveWall
HackArena

Each project should feel like a visual case study.

Show:
- Project name
- Short description
- Category
- Technology
- Visual
- View Project CTA

## Project Detail Pages

Each project gets a dedicated route.

Do not make project pages simple markdown pages.

Use:
- Large hero visual
- Animated typography
- Problem
- Solution
- Product screens
- Feature sections
- Architecture
- Tech stack
- Results
- Links

## Motion

Use GSAP ScrollTrigger.

Animations should be:
- Smooth
- Scrubbed
- Intentional
- Reversible
- Performance-conscious

Use transforms instead of layout properties.

Clean up animations when components unmount.

## WebGL

Use WebGL only where it improves the story.

Possible uses:
- Hero visual
- Background distortion
- Project transition
- Contact visual

Do not fill the entire website with unnecessary 3D objects.

## UX

The user should always understand:
- Where they are
- What section they are viewing
- What is interactive
- What happens when they continue scrolling

Keep navigation accessible.

Use semantic HTML.

Support keyboard navigation.

Support reduced-motion preferences.

## Responsive Design

Desktop should be the full cinematic experience.

Tablet should retain the main motion system with reduced complexity.

Mobile should preserve storytelling while reducing heavy WebGL and excessive parallax.

Do not simply shrink desktop.

## Performance

Target:
- Fast initial load
- Lazy-loaded WebGL
- Optimized images
- Minimal blocking JavaScript
- Efficient animation loops
- No unnecessary re-renders

## Quality Bar

Before considering the site complete, check:

1. Does the first 10 seconds feel memorable?
2. Does every major scroll advance the story?
3. Does the project section feel like a case-study experience?
4. Does the typography feel premium?
5. Does the site still work without WebGL?
6. Does mobile remain usable?
7. Are animations smooth?
8. Is the visual system consistent?
9. Are project details easy to understand?
10. Does the website feel like Srujan's personal product rather than a template?

Do not stop at a functional implementation.

Polish spacing, timing, typography, transitions, hover states, loading states, mobile behavior, and micro-interactions until the result feels production-ready.
