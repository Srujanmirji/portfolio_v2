# Technical Architecture

## Stack

Framework:
- Next.js
- React
- TypeScript

Animation:
- GSAP
- ScrollTrigger
- GSAP React integration

3D:
- Three.js
- React Three Fiber
- Drei

Styling:
- Tailwind CSS
- CSS variables

Icons:
- Lucide React

## Principle

DOM should handle:
- Typography
- Navigation
- Content
- Buttons
- Project metadata
- Accessibility
- SEO

Canvas should handle:
- WebGL
- 3D scenes
- Distortion
- Background effects
- Specialized visual transitions

Do not put normal HTML content inside WebGL.

## Suggested Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── work/
│   │   ├── studentsmate/
│   │   ├── tanvo/
│   │   ├── livewall/
│   │   └── hackarena/
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── SectionProgress.tsx
│   │   └── CustomCursor.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Timeline.tsx
│   │   ├── Lab.tsx
│   │   └── Contact.tsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGallery.tsx
│   │   └── ProjectCaseStudy.tsx
│   │
│   ├── motion/
│   │   ├── ScrollText.tsx
│   │   ├── Reveal.tsx
│   │   ├── HorizontalScroll.tsx
│   │   └── Parallax.tsx
│   │
│   └── canvas/
│       ├── Scene.tsx
│       ├── HeroScene.tsx
│       └── Effects.tsx
│
├── data/
│   ├── projects.ts
│   ├── timeline.ts
│   └── experiments.ts
│
└── lib/
    ├── animations.ts
    └── utils.ts
```

## Animation Architecture

Prefer reusable animation hooks and components.

Do not put huge GSAP timelines directly inside page components.

Use:
- `useHeroAnimation`
- `useHorizontalProjects`
- `useTimelineAnimation`
- `useSmoothScroll`

Clean up all ScrollTrigger instances on unmount.

## Performance

Use:
- Dynamic imports for WebGL
- Lazy-loaded project media
- Optimized Next.js images
- `will-change` only where needed
- GPU-friendly transforms
- Avoid layout-triggering animation
- Avoid rendering unnecessary canvas objects
- Keep particle counts conservative

Do not animate `top`, `left`, `width`, or `height` when transform can achieve the same result.

Prefer:
- `transform`
- `opacity`
- CSS clip-path where appropriate

## Mobile

On mobile:
- Keep the storytelling
- Convert horizontal project sections into vertical snap-like sequences if necessary
- Reduce WebGL complexity
- Remove custom cursor
- Reduce parallax
- Keep typography responsive with `clamp()`
