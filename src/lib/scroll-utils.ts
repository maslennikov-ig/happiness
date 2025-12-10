/**
 * Centralized Scroll Utilities
 *
 * Provides consistent scroll behavior across the application.
 * Works with Lenis smooth scroll when available, falls back to native behavior.
 *
 * @module scroll-utils
 */

import { logger } from '@/lib/logger'

export interface ScrollToOptions {
  /** Offset in pixels from the target (negative = scroll less, positive = scroll more) */
  offset?: number
  /** Animation duration in seconds (only works with Lenis) */
  duration?: number
  /** Native scroll behavior when Lenis is not available */
  behavior?: ScrollBehavior
}

/**
 * Scroll to a specific element by selector
 *
 * This is a native fallback for components that don't have access to Lenis context.
 * Prefer using `useSmoothScrollContext().scrollTo()` when inside SmoothScrollProvider.
 *
 * @param selector - CSS selector or element ID (with or without #)
 * @param options - Scroll options
 *
 * @example
 * ```ts
 * // Scroll to contact section
 * scrollToElement('#contact')
 *
 * // Scroll with offset for fixed header
 * scrollToElement('contact', { offset: -80 })
 * ```
 */
export function scrollToElement(
  selector: string,
  options: ScrollToOptions = {}
): void {
  // Add # prefix if not present and not a class selector
  const normalizedSelector =
    selector.startsWith('#') || selector.startsWith('.')
      ? selector
      : `#${selector}`

  const element = document.querySelector(normalizedSelector)

  if (!element) {
    logger.warn(`[scroll-utils] Element not found: ${normalizedSelector}`)
    return
  }

  const { offset = 0, behavior = 'smooth' } = options
  const elementRect = element.getBoundingClientRect()
  const absoluteTop = elementRect.top + window.scrollY + offset

  window.scrollTo({
    top: absoluteTop,
    behavior,
  })
}

/**
 * Scroll to top of the page
 *
 * @param options - Scroll options
 *
 * @example
 * ```ts
 * scrollToTop()
 * scrollToTop({ behavior: 'instant' })
 * ```
 */
export function scrollToTop(options: Pick<ScrollToOptions, 'behavior'> = {}): void {
  const { behavior = 'smooth' } = options

  window.scrollTo({
    top: 0,
    behavior,
  })
}

/**
 * Get current scroll position
 *
 * @returns Current vertical scroll position in pixels
 */
export function getScrollPosition(): number {
  return window.scrollY || document.documentElement.scrollTop || 0
}

/**
 * Check if element is in viewport
 *
 * @param element - DOM element to check
 * @param threshold - Percentage of element that must be visible (0-1)
 * @returns True if element is in viewport
 *
 * @example
 * ```ts
 * const section = document.getElementById('contact')
 * if (section && isInViewport(section, 0.5)) {
 *   console.log('Contact section is 50% visible')
 * }
 * ```
 */
export function isInViewport(element: Element, threshold = 0): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  // Calculate how much of the element is visible
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
  const elementHeight = rect.height

  if (elementHeight === 0) return false

  const visibleRatio = visibleHeight / elementHeight

  return visibleRatio > threshold
}

/**
 * Lock body scroll (useful for modals, overlays)
 *
 * @returns Cleanup function to unlock scroll
 *
 * @example
 * ```ts
 * const unlock = lockBodyScroll()
 * // ... show modal
 * unlock() // restore scroll
 * ```
 */
export function lockBodyScroll(): () => void {
  const scrollY = window.scrollY
  const body = document.body

  // Store original styles
  const originalStyles = {
    overflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
  }

  // Lock scroll
  body.style.overflow = 'hidden'
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.width = '100%'

  // Return cleanup function
  return () => {
    body.style.overflow = originalStyles.overflow
    body.style.position = originalStyles.position
    body.style.top = originalStyles.top
    body.style.width = originalStyles.width
    window.scrollTo(0, scrollY)
  }
}

/**
 * Section IDs used throughout the application
 * Centralized for type safety and easy updates
 */
export const SECTION_IDS = {
  HERO: 'hero',
  PHILOSOPHY: 'philosophy',
  TRANSFORMATION: 'transformation',
  DIAGNOSTIC: 'diagnostic',
  ROADMAP: 'roadmap',
  CONTACT: 'contact',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]
