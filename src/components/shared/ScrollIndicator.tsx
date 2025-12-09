'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Props for the ScrollIndicator component
 */
export interface ScrollIndicatorProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * ScrollIndicator - Animated scroll indicator for Hero section
 *
 * Displays a mouse icon with animated scroll dot that appears on page load
 * and fades out when the user starts scrolling. Uses GSAP for smooth animations
 * and respects user's reduced motion preferences.
 *
 * @example
 * ```tsx
 * <section className="relative min-h-screen">
 *   <div className="hero-content">...</div>
 *   <ScrollIndicator />
 * </section>
 * ```
 */
export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const dot = dotRef.current

      // Bounce animation for the scroll dot (disabled if reduced motion)
      if (dot && !prefersReducedMotion) {
        gsap.to(dot, {
          y: 12,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      }

      // Gentle bounce animation for entire container (disabled if reduced motion)
      if (!prefersReducedMotion) {
        gsap.to(container, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      }

      // Hide indicator when user scrolls down
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -100',
        onEnter: () => {
          gsap.to(container, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            pointerEvents: 'none',
          })
        },
        onLeaveBack: () => {
          gsap.to(container, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            pointerEvents: 'auto',
          })
        },
      })
    },
    {
      scope: containerRef,
      dependencies: [prefersReducedMotion],
    }
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted',
        className
      )}
      aria-hidden="true"
    >
      {/* Mouse icon */}
      <div className="w-6 h-10 rounded-full border-2 border-current relative overflow-hidden">
        {/* Animated scroll dot */}
        <div
          ref={dotRef}
          className="w-1.5 h-1.5 bg-gold-primary rounded-full absolute top-2 left-1/2 -translate-x-1/2"
        />
      </div>

      {/* Down arrow */}
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  )
}
