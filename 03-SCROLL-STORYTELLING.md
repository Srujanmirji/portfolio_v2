# Scroll Storytelling Specification

## Core Rule

Scrolling is the primary interaction.

Do not build a page where sections simply fade in as the user moves down.

The scroll position controls the composition.

## Hero Sequence

Pin the hero for approximately 150vh to 220vh.

Timeline:

0%:
- Black screen
- Small navigation
- Srujan Mirji appears

20%:
- SRUJAN scales upward
- MIRJI enters from the side

40%:
- Portrait or hero visual appears
- Orange visual element expands

60%:
- Supporting copy enters

80%:
- Hero compresses
- Navigation becomes persistent

100%:
- Hero releases into About

## About Sequence

Pin the section.

A large image occupies the composition.

As the user scrolls:
1. Image scales from 0.8 to 1
2. Headline reveals line by line
3. Keywords move into place
4. Statistics appear
5. Image shifts horizontally
6. Section releases

## Projects, Horizontal Scroll

Create a vertical scroll region that pins the viewport.

Inside it, translate a horizontal project track.

Example:

```text
PROJECTS
-------------------------------------------->

[StudentsMate] [Tanvo] [LiveWall] [HackArena]
```

Each project:
- Starts slightly smaller
- Becomes full scale when active
- Sharpens when active
- Shows metadata
- Reveals CTA

Use GSAP ScrollTrigger with scrub and pin.

## Project Transition

When a project becomes active:
- Scale from 0.82 to 1
- Increase opacity
- Reduce blur
- Move title into alignment
- Reveal metadata
- Animate progress indicator

When leaving:
- Scale down
- Increase blur slightly
- Move backward in depth

## Timeline

Use a vertical progress line.

The line grows based on scroll progress.

Timeline cards enter from alternating directions.

Do not animate every element independently. Group related content into timeline states.

## Lab

Use a free-form visual arrangement.

Cards should move slightly with scroll velocity.

Avoid excessive physics.

## Contact

Pin the final contact section.

Scroll causes:

LET'S
BUILD
IT.

to progressively fill the viewport.

The final orange accent appears last.

## Reduced Motion

Respect `prefers-reduced-motion`.

When enabled:
- Remove large transforms
- Remove parallax
- Remove heavy scrub animations
- Keep opacity and simple transitions
- Maintain readable content order
