# DeepThink Prompt: Technical Architecture Decisions

## Context

I am building a premium landing page for a personal transformation/coaching program. The landing page has 7 sections with complex animations and interactions. I need to make several critical architectural decisions before starting development.

**Tech Stack (already decided):**
- Next.js 14 LTS (App Router)
- React 18 LTS
- TypeScript 5.x
- Tailwind CSS 3.x
- Framer Motion (latest)
- GSAP with ScrollTrigger (latest)
- Lenis for smooth scrolling

**Landing page sections:**
0. Preloader (2-3 sec, text morph + brush stroke animation)
1. Hero (photo parallax, brush strokes, staggered text reveal)
2. Philosophy (4 cards with hover effects, possible 3D tilt)
3. Transformation (before/after table with flip/reveal animation)
4. Diagnostic (5 interactive toggles with highlight effect)
5. Roadmap (timeline, possibly horizontal scroll)
6. Contact (form + Cal.com embed)

---

## Question 1: Animation Architecture - GSAP vs Framer Motion

### Problem Statement

I have two powerful animation libraries: Framer Motion (React-native, declarative) and GSAP (imperative, powerful timelines). I need to decide:

1. Which library to use for which animations?
2. How to organize them to avoid conflicts?
3. How to structure the codebase for maintainability?

### Specific Animations Needed

| Animation | Complexity | Scroll-triggered? | Needs Timeline? |
|-----------|------------|-------------------|-----------------|
| Preloader text morph | High | No | Yes |
| Preloader brush stroke draw | High | No | Yes |
| Hero text stagger reveal | Medium | Yes (on load) | Maybe |
| Hero parallax (photo + brush) | Medium | Yes | No |
| Card hover effects | Low | No | No |
| Card entrance animations | Medium | Yes | No |
| Table flip/reveal | High | Yes | Yes |
| Toggle highlight effect | Low | No | No |
| Timeline build animation | High | Yes | Yes |
| Page transitions | Medium | No | No |

### Questions to Think Through

1. **Division of responsibility:** What's the cleanest way to divide work between GSAP and Framer Motion? Should I use GSAP only for complex timelines and scroll-triggered sequences, while Framer Motion handles component-level animations?

2. **Avoiding conflicts:** Both libraries can manipulate the same DOM elements. How do I prevent them from fighting over control? Should I use refs and ensure only one library touches each element?

3. **Code organization:** Should I create a central animation controller? Custom hooks for each animation type? How to make animations reusable?

4. **Performance:** Running both libraries simultaneously - what are the performance implications? Should I lazy-load GSAP only for sections that need it?

5. **React 18 compatibility:** Are there any gotchas with GSAP and React 18's concurrent features or strict mode?

### Please Provide

1. Recommended division of responsibilities between libraries
2. Code organization pattern (folders, hooks, controllers)
3. Specific recommendations for each animation type listed above
4. Potential pitfalls and how to avoid them
5. Example code structure for a scroll-triggered GSAP animation in React

---

## Question 2: Loading Strategy - Critical Path Optimization

### Problem Statement

The landing page has heavy assets (animations, images, fonts) but must feel fast. I need a loading strategy that:

1. Shows the preloader while critical resources load
2. Doesn't block interactivity longer than necessary
3. Handles the transition from preloader to content smoothly
4. Works well on mobile with potentially slow connections

### Assets Inventory

| Asset Type | Examples | Size Estimate | Critical? |
|------------|----------|---------------|-----------|
| Fonts (3) | Serif, Sans, Script | ~300KB total | Yes (above fold) |
| Hero image | Author photo | ~200KB (optimized) | Yes |
| Brush stroke SVGs | 4-6 variations | ~50KB total | Yes (hero) |
| GSAP library | Core + ScrollTrigger | ~60KB | Yes |
| Framer Motion | Full bundle | ~32KB | Yes |
| Below-fold images | Cards, backgrounds | ~500KB | No |
| Lottie animations | If used | ~100KB | No |

### Questions to Think Through

1. **Preloader timing:** Should the preloader be time-based (always 2-3 sec) or resource-based (until critical assets load)? What if assets load faster/slower than expected?

2. **Font loading strategy:** Use `font-display: swap` and risk FOUT, or `font-display: block` and risk invisible text? Or preload critical fonts?

3. **Image loading:**
   - Hero image: preload in `<head>` or load during preloader?
   - Below-fold images: lazy load with `next/image` or Intersection Observer?
   - Brush strokes: inline SVG vs external files?

4. **JavaScript bundles:**
   - Should GSAP be in the main bundle or dynamically imported?
   - Code-split by section or load everything upfront for smooth scroll animations?

5. **Critical CSS:** What CSS is truly critical for the preloader and initial render?

6. **Hydration:** How to handle React hydration so animations don't "jump" after hydration completes?

### Please Provide

1. Recommended loading sequence (what loads when)
2. Preloader implementation strategy (time vs resource-based)
3. Font loading approach with code example
4. Image loading strategy for each category
5. Bundle splitting recommendations
6. Estimated time-to-interactive targets

---

## Question 3: Mobile UX - Adapting Complex Animations

### Problem Statement

The desktop experience has rich animations, but mobile has constraints:
- Less powerful hardware
- Touch instead of hover
- Smaller viewport
- Potentially slower connections
- Battery considerations

I need to decide how to adapt each animation for mobile without losing the premium feel.

### Animations to Adapt

| Animation | Desktop Behavior | Mobile Concern |
|-----------|------------------|----------------|
| Preloader | Full animation | OK, but optimize |
| Hero parallax | Mouse-driven or scroll | No mouse, touch scroll |
| Card hover effects | Tilt + color change on hover | No hover state |
| Brush stroke parallax | Depth effect on scroll | Performance |
| Table flip animation | Complex 3D transform | Performance |
| Smooth scroll (Lenis) | Buttery smooth | Battery drain? |
| GSAP ScrollTrigger | Many triggers | Performance |

### Questions to Think Through

1. **Hover states:** How to handle hover-dependent interactions on touch devices? Options:
   - Remove them entirely
   - Convert to tap interactions
   - Use first-tap-to-hover, second-tap-to-click pattern
   - Show all states by default

2. **Parallax on mobile:** Should parallax be:
   - Disabled entirely (static positioning)
   - Simplified (fewer layers, smaller movement)
   - Replaced with different effect (fade, scale)

3. **Performance thresholds:** Should I detect device capability and serve different animation levels? How? (GPU detection, fps monitoring, `prefers-reduced-motion`?)

4. **Smooth scroll:** Is Lenis worth the overhead on mobile? Should I disable it below certain breakpoint?

5. **Touch interactions:** How to make the interactive diagnostic section (toggles/sliders) feel native on mobile?

6. **Testing strategy:** How to test animations across different mobile devices? What's the lowest-spec device I should target?

### Please Provide

1. Animation adaptation matrix (what to keep, simplify, or remove per breakpoint)
2. Technical approach for detecting device capability
3. Recommended touch interaction patterns
4. Performance optimization techniques for mobile
5. Testing checklist for mobile animations
6. Fallback strategies for low-powered devices

---

## Output Format

Please structure your response as:

```markdown
# DeepThink Results: Technical Architecture

## 1. Animation Architecture (GSAP vs Framer Motion)
### Recommended Division
...
### Code Organization
...
### Per-Animation Recommendations
...
### Pitfalls & Solutions
...
### Example Code
...

## 2. Loading Strategy
### Loading Sequence
...
### Preloader Implementation
...
### Font Strategy
...
### Image Strategy
...
### Bundle Splitting
...

## 3. Mobile UX Adaptations
### Animation Matrix
...
### Detection Approach
...
### Touch Patterns
...
### Performance Techniques
...
### Testing Checklist
...

## Summary: Key Decisions
1. ...
2. ...
3. ...
```

---

## Additional Context

**Target Performance:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Performance Score > 90 (Lighthouse)

**Target Devices:**
- Desktop: Modern Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari 15+, Chrome Android (last 2 versions)
- Minimum: iPhone 11, mid-range Android (2020+)

**Design Philosophy:**
"Premium feel over quantity of animations. Better to have 3 perfect animations than 10 mediocre ones."
