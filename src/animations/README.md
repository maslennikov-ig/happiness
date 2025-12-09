# Animations

Reusable animation configurations for the Happiness landing page.

- **Motion Variants** (`variants.ts`): For hover states, layout animations, and component transitions
- **GSAP Timelines** (`timelines.ts`): For scroll-triggered animations, pinning, and complex sequences

## Installation

The variants are already set up. Just import them:

```tsx
import { fadeIn, slideUp, springTransition } from '@/animations/variants'
import { motion } from 'motion/react'
```

## Available Variants

### Basic Animations

#### fadeIn
Simple fade in/out animation.

```tsx
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
  exit="exit"
>
  Content
</motion.div>
```

#### slideUp
Slide up from below with fade.

```tsx
<motion.div
  variants={slideUp}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

#### slideInFromLeft / slideInFromRight
Slide in from left or right with fade.

```tsx
<motion.div variants={slideInFromLeft} initial="initial" animate="animate">
  Left content
</motion.div>

<motion.div variants={slideInFromRight} initial="initial" animate="animate">
  Right content
</motion.div>
```

#### scaleIn
Scale up from 90% with fade.

```tsx
<motion.div variants={scaleIn} initial="initial" animate="animate">
  Modal or card content
</motion.div>
```

### Stagger Animations

Animate children with delays for a cascading effect.

```tsx
<motion.ul
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map(item => (
    <motion.li key={item.id} variants={staggerItem}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Hover Effects

#### buttonHover
Scale effect for buttons.

```tsx
<motion.button
  whileHover={buttonHover.whileHover}
  whileTap={buttonHover.whileTap}
>
  Click me
</motion.button>
```

#### cardHover
Subtle lift for cards.

```tsx
<motion.div whileHover={cardHover.whileHover}>
  Card content
</motion.div>
```

### Transitions

#### springTransition
Smooth, natural spring motion.

```tsx
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
  transition={springTransition}
/>
```

#### smoothTransition
Gentle eased motion (0.6s).

```tsx
<motion.div
  variants={slideUp}
  initial="initial"
  animate="animate"
  transition={smoothTransition}
/>
```

#### fastTransition
Quick animations (0.3s) for immediate feedback.

```tsx
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
  transition={fastTransition}
/>
```

## Scroll-Triggered Animations

Use with `whileInView` for scroll-triggered animations:

```tsx
<motion.div
  variants={slideUp}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, margin: "-100px" }}
  transition={springTransition}
>
  Content appears when scrolled into view
</motion.div>
```

## Combining with GSAP

Motion is for hover/tap interactions and layout animations. Use GSAP for scroll-triggered timelines and pinning.

```tsx
// Wrapper pattern: GSAP handles scroll entrance, Motion handles interactions
<div ref={gsapRef}>
  <motion.div
    whileHover={cardHover.whileHover}
    whileTap={{ scale: 0.98 }}
  >
    Content
  </motion.div>
</div>
```

## Accessibility

Consider reduced motion preferences:

```tsx
import { useReducedMotion } from 'motion/react'

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : slideUp}
      initial="initial"
      animate="animate"
    >
      Content
    </motion.div>
  )
}
```

## GSAP Timelines

For scroll-triggered animations, pinning, and complex sequences. See full documentation in [timelines.ts](./timelines.ts).

### Quick Start

```tsx
import { useGSAP } from '@gsap/react'
import {
  createParallaxConfig,
  createRevealConfig,
  createPinnedScrollConfig
} from '@/animations/timelines'
import gsap from 'gsap'
import { useRef } from 'react'
```

### Available Configurations

- **`createPreloaderTimeline`** - Preloader animation sequence
- **`createParallaxConfig`** - Parallax scroll effects (slow/medium/fast)
- **`createPinnedScrollConfig`** - Pinned section animations
- **`createRevealConfig`** - Fade-in reveals on scroll (once/always)
- **`createHorizontalScrollConfig`** - Horizontal scroll timelines
- **`createBatchConfig`** - Batch stagger animations
- **`createProgressBarConfig`** - Progress bar animations
- **`createResponsiveContext`** - Responsive animation breakpoints

### Example: Parallax Hero

```tsx
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to('.hero-image', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        ...createParallaxConfig('slow'),
        trigger: '.hero-section'
      }
    })
  }, { scope: containerRef })

  return <section ref={containerRef} className="hero-section">...</section>
}
```

### Example: Pinned Transformation

```tsx
export function TransformationSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: createPinnedScrollConfig('.transformation-section', 1)
    })

    tl.to('.column-before', { opacity: 0.3, filter: 'blur(4px)' })
      .to('.column-after', { opacity: 1, scale: 1.02 }, '<')
  }, { scope: containerRef })

  return <section ref={containerRef}>...</section>
}
```

### Example: Horizontal Roadmap (Desktop Only)

```tsx
export function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = createResponsiveContext()

    mm.add('(min-width: 1024px)', () => {
      createHorizontalScrollConfig({
        container: '.roadmap-container',
        items: '.roadmap-stage',
        snap: 1 / 5
      })
    })

    mm.add('(max-width: 1023px)', () => {
      gsap.from('.roadmap-stage', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: '.roadmap-container', start: 'top 80%' }
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return <section ref={containerRef}>...</section>
}
```

## Performance Tips

1. Use `layoutId` for shared element transitions
2. Prefer `transform` and `opacity` (GPU-accelerated)
3. Avoid animating `width`, `height`, or `top`/`left`
4. Use `will-change` sparingly (Motion handles this automatically)
5. For scroll animations with complex timelines, use GSAP instead

## Lenis + GSAP Integration

GSAP ScrollTrigger must be synced with Lenis smooth scroll:

```tsx
// In root layout
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export function RootLayout({ children }) {
  const lenisRef = useRef()

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
