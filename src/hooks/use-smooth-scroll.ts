'use client'

import { useEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
  touchMultiplier?: number
  infinite?: boolean
}

export interface SmoothScrollReturn {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
  stop: () => void
  start: () => void
}

/**
 * Hook that integrates Lenis smooth scroll with GSAP ScrollTrigger.
 *
 * Features:
 * - Syncs Lenis with GSAP ticker for smooth animations
 * - Registers ScrollTrigger updates on scroll
 * - Provides scroll control methods (scrollTo, stop, start)
 * - Handles cleanup on unmount
 * - SSR-safe
 *
 * @param {SmoothScrollOptions} options - Configuration options for Lenis
 * @returns {SmoothScrollReturn} Lenis instance and control methods
 *
 * @example
 * ```tsx
 * function App() {
 *   const { lenis, scrollTo, stop, start } = useSmoothScroll()
 *
 *   useEffect(() => {
 *     // Lock scroll during preloader
 *     stop()
 *
 *     const timer = setTimeout(() => {
 *       start()
 *       scrollTo('#hero')
 *     }, 2500)
 *
 *     return () => clearTimeout(timer)
 *   }, [stop, start, scrollTo])
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useSmoothScroll(options?: SmoothScrollOptions): SmoothScrollReturn {
  const lenisRef = useRef<Lenis | null>(null)

  // Initialize Lenis and sync with GSAP
  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return

    // Create Lenis instance with custom options
    const lenis = new Lenis({
      duration: options?.duration ?? 1.2,
      easing: options?.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      touchMultiplier: options?.touchMultiplier ?? 1.5, // Better mobile responsiveness
      infinite: options?.infinite ?? false,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ticker (instead of using autoRaf)
    function update(time: number) {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Disable lag smoothing for better sync

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update)

    // Add lenis classes to html element for CSS styling
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
    }
  }, [options?.duration, options?.easing, options?.touchMultiplier, options?.infinite])

  /**
   * Scroll to a specific target
   * @param {string | number | HTMLElement} target - Target element, selector, or scroll position
   * @param {object} options - Scroll options (offset, duration)
   */
  const scrollTo = useCallback((
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    lenisRef.current?.scrollTo(target, options)
  }, [])

  /**
   * Stop smooth scrolling (useful for preloader or modals)
   */
  const stop = useCallback(() => {
    lenisRef.current?.stop()
    document.documentElement.classList.add('lenis-stopped')
  }, [])

  /**
   * Start/resume smooth scrolling
   */
  const start = useCallback(() => {
    lenisRef.current?.start()
    document.documentElement.classList.remove('lenis-stopped')
  }, [])

  return {
    lenis: lenisRef.current,
    scrollTo,
    stop,
    start,
  }
}
