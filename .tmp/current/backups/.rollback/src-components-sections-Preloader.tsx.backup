'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { BrushStroke } from '@/components/shared/BrushStroke'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useSmoothScrollContext } from '@/components/shared/SmoothScroll'

/**
 * Preloader Component
 *
 * Displays an animated preloader with brush stroke and morphing text sequence.
 * Features:
 * - Brush stroke draw animation (1.2s)
 * - Text morphing: КОНТРОЛЬ → ТРАНСФОРМАЦИЯ → СВОБОДА
 * - Resource-gated minimum timer (2500ms minimum, 5000ms maximum)
 * - Smooth scroll locking during animation
 * - Full reduced motion support
 *
 * Animation sequence:
 * 1. Lock Lenis scroll
 * 2. Brush stroke draws
 * 3. Text cycles through three words with fade transitions
 * 4. Hold final word briefly
 * 5. Fade out entire preloader
 * 6. Unlock Lenis scroll
 * 7. Call onComplete callback
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

/** Text sequence to display during preloader */
const WORDS = ['КОНТРОЛЬ', 'ТРАНСФОРМАЦИЯ', 'СВОБОДА'] as const

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
  const [currentWord, setCurrentWord] = useState(0)

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
   * Orchestrates brush stroke and text morph sequence
   */
  useGSAP(
    () => {
      if (!containerRef.current || !textRef.current) return

      // Reduced motion: simplified experience
      if (prefersReducedMotion) {
        setCurrentWord(2) // Show final word only
        setTimeout(handleComplete, 1000)
        return
      }

      const tl = gsap.timeline()

      // Brush stroke animation happens automatically in BrushStroke component
      // We just need to orchestrate the text sequence timing

      // Word 1: КОНТРОЛЬ (appears during brush stroke)
      tl.to(
        {},
        {
          duration: 1.2, // Wait for brush stroke to complete
          onStart: () => setCurrentWord(0),
        }
      )

      // Transition to word 2: ТРАНСФОРМАЦИЯ
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      })
        .call(() => setCurrentWord(1))
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          '>'
        )
        .to({}, { duration: 0.6 }) // Hold

      // Transition to word 3: СВОБОДА
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      })
        .call(() => setCurrentWord(2))
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          '>'
        )
        .to({}, { duration: 0.3 }) // Hold final word

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
        console.warn('Preloader: Safety timeout triggered at', MAX_DISPLAY_TIME, 'ms')
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

      {/* Morphing Text */}
      <span
        ref={textRef}
        className={cn(
          'font-display text-3xl md:text-4xl',
          'uppercase tracking-widest',
          'text-text-primary'
        )}
      >
        {WORDS[currentWord]}
      </span>

      {/* Screen reader announcement */}
      <span className="sr-only">Загрузка...</span>
    </div>
  )
}
