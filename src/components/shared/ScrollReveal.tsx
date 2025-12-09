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
 * Props for the ScrollReveal component
 */
export interface ScrollRevealProps {
  /** Content to be revealed on scroll */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Animation type to use */
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn'
  /** Animation duration in seconds */
  duration?: number
  /** Delay before animation starts in seconds */
  delay?: number
  /** Stagger time between children animations in seconds */
  stagger?: number
  /** Whether to play animation only once */
  once?: boolean
  /** Viewport threshold (0-1) to trigger animation */
  threshold?: number
  /** Disable animation (e.g., for reduced motion) */
  disabled?: boolean
}

/**
 * Animation preset configurations
 * Each preset defines initial (from) and final (to) animation states
 */
const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
  },
  slideLeft: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0 },
  },
  slideRight: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0 },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
  },
}

/**
 * ScrollReveal - Wrapper component that reveals children on scroll
 *
 * Uses GSAP ScrollTrigger to animate children when they come into view.
 * Supports multiple animation presets, staggering, and reduced motion preferences.
 *
 * @example
 * ```tsx
 * <ScrollReveal animation="slideUp" delay={0.2}>
 *   <h2>Section Title</h2>
 * </ScrollReveal>
 *
 * <ScrollReveal animation="fadeIn" stagger={0.1}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  className,
  animation = 'slideUp',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  once = true,
  threshold = 0.2,
  disabled = false,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Get animation preset
  const preset = animations[animation]

  useGSAP(
    () => {
      // Skip animation if disabled or user prefers reduced motion
      if (disabled || prefersReducedMotion) {
        // Ensure elements are visible if animations are disabled
        if (containerRef.current) {
          gsap.set(containerRef.current.children.length > 0 && stagger > 0
            ? containerRef.current.children
            : containerRef.current, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          })
        }
        return
      }

      if (!containerRef.current) return

      // Determine targets: individual children for stagger, or container itself
      const targets = stagger > 0 && containerRef.current.children.length > 0
        ? Array.from(containerRef.current.children)
        : containerRef.current

      // Set initial state to prevent flash of unstyled content
      gsap.set(targets, preset.from)

      // Create scroll-triggered animation
      gsap.fromTo(
        targets,
        preset.from,
        {
          ...preset.to,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${100 - threshold * 100}%`,
            // Toggle actions: onEnter onLeave onEnterBack onLeaveBack
            toggleActions: once
              ? 'play none none none'
              : 'play reverse play reverse',
            // Uncomment for debugging:
            // markers: true,
          },
        }
      )
    },
    {
      scope: containerRef,
      dependencies: [
        animation,
        duration,
        delay,
        stagger,
        once,
        threshold,
        disabled,
        prefersReducedMotion,
      ],
    }
  )

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  )
}
