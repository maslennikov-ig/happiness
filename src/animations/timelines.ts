/**
 * GSAP Timeline Configurations
 *
 * Factory functions that return reusable GSAP timeline and ScrollTrigger configurations
 * for scroll-triggered animations across the Happiness landing page.
 *
 * @module animations/timelines
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Base ScrollTrigger configuration options
 */
export interface ScrollTriggerConfig {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  pinSpacing?: boolean
  markers?: boolean
  toggleActions?: string
  once?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

/**
 * Parallax speed presets
 */
export type ParallaxSpeed = 'slow' | 'medium' | 'fast'

/**
 * Reveal animation mode
 */
export type RevealMode = 'once' | 'always'

/**
 * Batch animation configuration
 */
export interface BatchConfig {
  interval?: number
  batchMax?: number
  onEnter?: (elements: Element[]) => void
  onLeave?: (elements: Element[]) => void
  start?: string
  end?: string
  once?: boolean
}

/**
 * Preloader timeline configuration
 */
export interface PreloaderTimelineConfig {
  duration?: number
  strokeDuration?: number
  morphDuration?: number
  fadeOutDuration?: number
  onComplete?: () => void
}

/**
 * Horizontal scroll configuration
 */
export interface HorizontalScrollConfig extends ScrollTriggerConfig {
  container: string | Element
  items: string | NodeListOf<Element>
  snap?: boolean | number
}

// ============================================================================
// Responsive Breakpoint Helper
// ============================================================================

/**
 * Creates a responsive GSAP matchMedia context with standard breakpoints
 *
 * @example
 * ```typescript
 * useGSAP(() => {
 *   const mm = createResponsiveContext()
 *
 *   mm.add('desktop', () => {
 *     // Desktop animations
 *   })
 *
 *   mm.add('mobile', () => {
 *     // Mobile animations
 *   })
 *
 *   return () => mm.revert()
 * })
 * ```
 */
export function createResponsiveContext() {
  const mm = gsap.matchMedia()

  return mm
}

// ============================================================================
// Preloader Timeline
// ============================================================================

/**
 * Creates a GSAP timeline for the preloader animation sequence
 *
 * Animates:
 * 1. Brush stroke draw (stroke-dashoffset)
 * 2. Text morph between words ("КОНТРОЛЬ" → "ТРАНСФОРМАЦИЯ" → "СВОБОДА")
 * 3. Fade out on complete
 *
 * @param config - Preloader configuration options
 * @returns GSAP Timeline
 *
 * @example
 * ```typescript
 * const tl = createPreloaderTimeline({
 *   onComplete: () => {
 *     // Unblock scroll, remove preloader
 *   }
 * })
 * ```
 */
export function createPreloaderTimeline(
  config: PreloaderTimelineConfig = {}
): gsap.core.Timeline {
  const {
    // duration is used implicitly through other durations
    strokeDuration = 1.2,
    morphDuration = 0.6,
    fadeOutDuration = 0.5,
    onComplete,
  } = config

  const tl = gsap.timeline({
    onComplete,
  })

  // 1. Brush stroke draw animation
  tl.from('.preloader-stroke', {
    strokeDashoffset: 1800,
    duration: strokeDuration,
    ease: 'power2.inOut',
  })

  // 2. Text morph sequence (using opacity crossfade)
  tl.to('.preloader-text-1', {
    opacity: 0,
    y: -20,
    duration: morphDuration,
    ease: 'power2.inOut',
  }, `+=${morphDuration * 0.5}`)

  tl.from('.preloader-text-2', {
    opacity: 0,
    y: 20,
    duration: morphDuration,
    ease: 'power2.inOut',
  }, '<')

  tl.to('.preloader-text-2', {
    opacity: 0,
    y: -20,
    duration: morphDuration,
    ease: 'power2.inOut',
  }, `+=${morphDuration * 0.5}`)

  tl.from('.preloader-text-3', {
    opacity: 0,
    y: 20,
    duration: morphDuration,
    ease: 'power2.inOut',
  }, '<')

  // 3. Fade out entire preloader
  tl.to('.preloader', {
    opacity: 0,
    duration: fadeOutDuration,
    ease: 'power2.inOut',
  }, `+=${fadeOutDuration}`)

  return tl
}

// ============================================================================
// Parallax Configuration
// ============================================================================

/**
 * Speed multipliers for parallax effects
 */
const PARALLAX_SPEEDS = {
  slow: 0.3,
  medium: 0.5,
  fast: 0.7,
} as const

/**
 * Creates ScrollTrigger configuration for parallax scrolling effects
 *
 * Use with gsap.to() for smooth parallax on scroll:
 * - slow: Subtle background movement
 * - medium: Mid-layer elements
 * - fast: Foreground elements
 *
 * @param speed - Parallax speed preset
 * @returns ScrollTrigger configuration
 *
 * @example
 * ```typescript
 * gsap.to('.hero-image', {
 *   yPercent: -20,
 *   ease: 'none',
 *   scrollTrigger: {
 *     ...createParallaxConfig('slow'),
 *     trigger: '.hero-section'
 *   }
 * })
 * ```
 */
export function createParallaxConfig(
  speed: ParallaxSpeed = 'medium'
): ScrollTriggerConfig {
  return {
    start: 'top bottom',
    end: 'bottom top',
    scrub: PARALLAX_SPEEDS[speed],
  }
}

// ============================================================================
// Pinned Scroll Configuration
// ============================================================================

/**
 * Creates ScrollTrigger configuration for pinned section animations
 *
 * Pins the section while scroll animations play out.
 * Used for Transformation section (Было → Стало) effect.
 *
 * @param trigger - Element selector or reference
 * @param scrubDuration - Scrub smoothness (0 = instant, 1 = smooth)
 * @returns ScrollTrigger configuration
 *
 * @example
 * ```typescript
 * gsap.timeline({
 *   scrollTrigger: createPinnedScrollConfig('.transformation-section', 1)
 * })
 * .to('.column-before', { opacity: 0.3, filter: 'blur(4px)' })
 * .to('.column-after', { opacity: 1, scale: 1.02 }, '<')
 * ```
 */
export function createPinnedScrollConfig(
  trigger: string | Element,
  scrubDuration: number = 1
): ScrollTriggerConfig {
  return {
    trigger,
    start: 'top top',
    end: '+=100%', // Pin for full viewport height
    pin: true,
    pinSpacing: true,
    scrub: scrubDuration,
  }
}

// ============================================================================
// Reveal Configuration
// ============================================================================

/**
 * Creates ScrollTrigger configuration for fade-in reveal animations
 *
 * Use with gsap.from() or gsap.fromTo() to reveal elements on scroll.
 *
 * @param mode - 'once' plays once, 'always' plays on each scroll
 * @returns ScrollTrigger configuration
 *
 * @example
 * ```typescript
 * gsap.from('.philosophy-card', {
 *   y: 50,
 *   opacity: 0,
 *   duration: 0.8,
 *   stagger: 0.2,
 *   scrollTrigger: {
 *     ...createRevealConfig('once'),
 *     trigger: '.philosophy-section'
 *   }
 * })
 * ```
 */
export function createRevealConfig(
  mode: RevealMode = 'once'
): ScrollTriggerConfig {
  return {
    start: 'top 80%', // Trigger when element is 80% from top
    end: 'bottom 20%',
    toggleActions: mode === 'once'
      ? 'play none none none'
      : 'play reverse play reverse',
    once: mode === 'once',
  }
}

// ============================================================================
// Horizontal Scroll Configuration
// ============================================================================

/**
 * Creates ScrollTrigger configuration for horizontal scroll timeline
 *
 * Pins container and scrolls items horizontally.
 * Used for Roadmap section on desktop.
 *
 * @param config - Horizontal scroll configuration
 * @returns Complete ScrollTrigger configuration with animation
 *
 * @example
 * ```typescript
 * useGSAP(() => {
 *   createHorizontalScrollConfig({
 *     container: '.roadmap-container',
 *     items: '.roadmap-stage',
 *     snap: 1 / (stages.length - 1)
 *   })
 * }, { scope: roadmapRef })
 * ```
 */
export function createHorizontalScrollConfig(
  config: HorizontalScrollConfig
): gsap.core.Timeline {
  const {
    container,
    items,
    snap = false,
    start = 'top top',
    end,
    ...rest
  } = config

  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container

  const itemsEl = typeof items === 'string'
    ? document.querySelectorAll(items)
    : items

  if (!containerEl || !itemsEl) {
    console.warn('Horizontal scroll: container or items not found')
    return gsap.timeline()
  }

  // Calculate total scroll width
  const totalWidth = Array.from(itemsEl).reduce(
    (sum, el) => sum + (el as HTMLElement).offsetWidth,
    0
  )

  const scrollDistance = totalWidth - (containerEl as HTMLElement).offsetWidth

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start,
      end: end || `+=${scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      snap: typeof snap === 'number' ? snap : undefined,
      ...rest,
    },
  })

  // Horizontal scroll animation
  tl.to(itemsEl, {
    x: -scrollDistance,
    ease: 'none',
  })

  return tl
}

// ============================================================================
// Batch Configuration
// ============================================================================

/**
 * Creates ScrollTrigger.batch configuration for stagger animations
 *
 * Animates groups of elements with stagger when they enter viewport.
 * Used for Philosophy cards batch entrance.
 *
 * @param selector - Elements to batch animate
 * @param config - Batch configuration options
 * @returns ScrollTrigger batch instance
 *
 * @example
 * ```typescript
 * createBatchConfig('.philosophy-card', {
 *   interval: 0.1,
 *   batchMax: 2,
 *   onEnter: (elements) => {
 *     gsap.from(elements, {
 *       y: 60,
 *       opacity: 0,
 *       stagger: 0.15,
 *       duration: 0.8,
 *       ease: 'power3.out'
 *     })
 *   }
 * })
 * ```
 */
export function createBatchConfig(
  selector: string,
  config: BatchConfig = {}
): ScrollTrigger[] | undefined {
  const {
    interval = 0.1,
    batchMax = 3,
    onEnter,
    onLeave,
    start = 'top 85%',
    end = 'bottom 15%',
    once = true,
  } = config

  if (typeof window === 'undefined') {
    return undefined
  }

  return ScrollTrigger.batch(selector, {
    interval,
    batchMax,
    onEnter: onEnter || ((elements) => {
      gsap.from(elements, {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })
    }),
    onLeave,
    start,
    end,
    once,
  })
}

// ============================================================================
// Progress Bar Configuration
// ============================================================================

/**
 * Creates ScrollTrigger configuration for progress bar animation
 *
 * Updates progress bar based on scroll position within a section.
 * Used for Roadmap horizontal scroll indicator.
 *
 * @param trigger - Section to track
 * @param progressBar - Progress bar element
 * @returns ScrollTrigger instance
 *
 * @example
 * ```typescript
 * createProgressBarConfig('.roadmap-section', '.roadmap-progress-bar')
 * ```
 */
export function createProgressBarConfig(
  trigger: string | Element,
  progressBar: string | Element
): ScrollTrigger | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const progressEl = typeof progressBar === 'string'
    ? document.querySelector(progressBar)
    : progressBar

  if (!progressEl) {
    console.warn('Progress bar element not found')
    return undefined
  }

  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      gsap.to(progressEl, {
        scaleX: self.progress,
        transformOrigin: 'left',
        ease: 'none',
        duration: 0.1,
      })
    },
  })
}

// ============================================================================
// Reduced Motion Helper
// ============================================================================

/**
 * Checks if user prefers reduced motion and adjusts animation config
 *
 * @returns Boolean indicating reduced motion preference
 *
 * @example
 * ```typescript
 * const shouldAnimate = !prefersReducedMotion()
 *
 * if (shouldAnimate) {
 *   gsap.to(el, { y: 100 })
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Returns adjusted animation duration based on reduced motion preference
 *
 * @param duration - Default duration in seconds
 * @returns Adjusted duration (0 if reduced motion, otherwise original)
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration
}

/**
 * Returns adjusted scrub value based on reduced motion preference
 *
 * @param scrub - Default scrub value
 * @returns false if reduced motion, otherwise original value
 */
export function getAnimationScrub(scrub: number | boolean): number | boolean {
  return prefersReducedMotion() ? false : scrub
}

// ============================================================================
// Cleanup Utilities
// ============================================================================

/**
 * Safely kills all ScrollTrigger instances and reverts GSAP animations
 * Use in cleanup functions (e.g., useEffect return)
 *
 * @example
 * ```typescript
 * useGSAP(() => {
 *   // ... animations
 *
 *   return () => {
 *     killAllScrollTriggers()
 *   }
 * })
 * ```
 */
export function killAllScrollTriggers(): void {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }
}

/**
 * Refreshes all ScrollTrigger instances
 * Call after layout changes or window resize
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   const handleResize = () => {
 *     refreshScrollTriggers()
 *   }
 *
 *   window.addEventListener('resize', handleResize)
 *   return () => window.removeEventListener('resize', handleResize)
 * }, [])
 * ```
 */
export function refreshScrollTriggers(): void {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh()
  }
}
