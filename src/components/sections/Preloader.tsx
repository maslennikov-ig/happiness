'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { BrushStroke } from '@/components/shared/BrushStroke'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useSmoothScrollContext } from '@/components/shared/SmoothScroll'
import { logger } from '@/lib/logger'

/**
 * Preloader Component
 *
 * Displays an animated preloader with brush stroke and text transformation.
 * Features:
 * - Brush stroke draw animation (1.2s)
 * - Two-phase text sequence:
 *   1. КОНТРОЛЬ. ДИСЦИПЛИНА. РЕЗУЛЬТАТ. (strict, during brush stroke)
 *   2. ТЫ ГОТОВ ПРИНЯТЬ РЕШЕНИЕ СТАТЬ СЧАСТЛИВЫМ? (emotional, after brush stroke)
 * - Resource-gated minimum timer (2500ms minimum, 5000ms maximum)
 * - Smooth scroll locking during animation
 * - Full reduced motion support
 *
 * Animation sequence:
 * 1. Lock Lenis scroll
 * 2. Show first text (strict)
 * 3. Brush stroke draws
 * 4. Transform to second text (emotional question)
 * 5. Hold briefly
 * 6. Fade out entire preloader
 * 7. Unlock Lenis scroll
 * 8. Call onComplete callback
 *
 * @example
 * ```tsx
 * <Preloader onComplete={() => console.log('Preloader finished')} />
 * ```
 */

interface PreloaderProps {
  /** Callback fired when preloader animation completes and fades out */
  onComplete?: () => void
}

/** Text phases to display during preloader */
const TEXT_PHASES = {
  STRICT: 'КОНТРОЛЬ. ДИСЦИПЛИНА. РЕЗУЛЬТАТ.',
  EMOTIONAL: 'ТЫ ГОТОВ ПРИНЯТЬ РЕШЕНИЕ СТАТЬ СЧАСТЛИВЫМ?',
} as const

/** Minimum display time in milliseconds (ensures smooth experience) */
const MIN_DISPLAY_TIME = 2500

/** Maximum display time in milliseconds (safety timeout) */
const MAX_DISPLAY_TIME = 5000

export function Preloader({ onComplete }: PreloaderProps) {
  // Refs for GSAP animation targets
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const brushRef = useRef<SVGSVGElement>(null)

  // State for component lifecycle
  const [isComplete, setIsComplete] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'strict' | 'emotional'>('strict')

  // Accessibility and scroll control
  const prefersReducedMotion = useReducedMotion()
  const { stop, start } = useSmoothScrollContext()

  // Timing state (using refs to avoid stale closures)
  const startTimeRef = useRef<number>(0)
  const animationCompleteRef = useRef(false)

  // Initialize start time and lock scroll on mount
  useEffect(() => {
    startTimeRef.current = Date.now()
    stop()
    return () => {
      start()
    }
  }, [stop, start])

  /**
   * Handles preloader completion with minimum timer enforcement
   * Ensures preloader displays for at least MIN_DISPLAY_TIME
   */
  const handleComplete = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed)

    setTimeout(() => {
      animationCompleteRef.current = true

      // Fade out entire preloader
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsComplete(true)
          start() // Unlock Lenis scroll
          onComplete?.() // Notify parent
        },
      })
    }, remainingTime)
  }, [start, onComplete])

  /**
   * Main animation timeline
   * Orchestrates brush stroke and text transformation sequence
   */
  useGSAP(
    () => {
      if (!containerRef.current || !textRef.current) return

      // Reduced motion: simplified experience
      if (prefersReducedMotion) {
        setCurrentPhase('emotional') // Show final text only
        setTimeout(handleComplete, 1000)
        return
      }

      const tl = gsap.timeline()

      // Phase 1: STRICT text appears and brush stroke draws (1.2s)
      tl.to(
        {},
        {
          duration: 1.2, // Wait for brush stroke to complete
          onStart: () => setCurrentPhase('strict'),
        }
      )

      // Transition from strict to emotional text
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      })
        .call(() => setCurrentPhase('emotional'))
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '>'
        )
        .to({}, { duration: 0.8 }) // Hold emotional question

      // Trigger completion handler
      tl.call(handleComplete)
    },
    {
      scope: containerRef,
      dependencies: [prefersReducedMotion, handleComplete],
    }
  )

  /**
   * Safety timeout to force completion if animation hangs
   * Prevents indefinite loading state
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!animationCompleteRef.current) {
        logger.warn('Preloader: Safety timeout triggered at', MAX_DISPLAY_TIME, 'ms')
        handleComplete()
      }
    }, MAX_DISPLAY_TIME)

    return () => clearTimeout(timeout)
  }, [handleComplete])

  // Remove from DOM once complete
  if (isComplete) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50',
        'flex flex-col items-center justify-center',
        'bg-bg-primary'
      )}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Brush Stroke Animation */}
      <div className="relative w-64 md:w-80 mb-8">
        <BrushStroke
          ref={brushRef}
          animated={!prefersReducedMotion}
          duration={1.2}
          color="#D4AF37"
          strokeWidth={3}
        />
      </div>

      {/* Transforming Text */}
      <span
        ref={textRef}
        className={cn(
          'font-display text-2xl md:text-3xl lg:text-4xl',
          'uppercase tracking-wider',
          'text-text-primary text-center px-4 max-w-4xl',
          currentPhase === 'strict' && 'tracking-widest',
          currentPhase === 'emotional' && 'tracking-wide'
        )}
      >
        {currentPhase === 'strict' ? TEXT_PHASES.STRICT : TEXT_PHASES.EMOTIONAL}
      </span>

      {/* Screen reader announcement */}
      <span className="sr-only">Загрузка...</span>
    </div>
  )
}
