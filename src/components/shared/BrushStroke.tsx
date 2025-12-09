'use client'

import { useRef, useEffect, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BrushStrokeProps {
  className?: string
  color?: string
  strokeWidth?: number
  animated?: boolean
  duration?: number
  delay?: number
  onAnimationComplete?: () => void
}

/**
 * BrushStroke SVG Component
 *
 * Renders an animated brush stroke SVG using stroke-dashoffset technique.
 * The animation reveals the stroke from left to right with an organic, hand-drawn feel.
 *
 * Features:
 * - Inline SVG for full animation control
 * - CSS-based stroke-dashoffset animation
 * - GSAP-compatible via forwardRef
 * - Responsive and accessible
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BrushStroke />
 *
 * // With GSAP control
 * const strokeRef = useRef<SVGSVGElement>(null)
 * useGSAP(() => {
 *   gsap.from(strokeRef.current?.querySelector('path'), {
 *     strokeDashoffset: 1800,
 *     duration: 1.2,
 *     ease: 'power2.inOut'
 *   })
 * })
 * <BrushStroke ref={strokeRef} animated={false} />
 *
 * // Custom styling
 * <BrushStroke
 *   color="#D4AF37"
 *   strokeWidth={4}
 *   duration={2}
 *   delay={0.5}
 *   onAnimationComplete={() => console.log('Animation done!')}
 * />
 * ```
 */
export const BrushStroke = forwardRef<SVGSVGElement, BrushStrokeProps>(
  function BrushStroke(
    {
      className,
      color = '#D4AF37',
      strokeWidth = 3,
      animated = true,
      duration = 1.5,
      delay = 0,
      onAnimationComplete,
    },
    ref
  ) {
    const pathRef = useRef<SVGPathElement>(null)

    useEffect(() => {
      if (!animated || !pathRef.current) return

      // Calculate stroke-dasharray from path length
      const pathLength = pathRef.current.getTotalLength()

      // Set dasharray and initial dashoffset
      pathRef.current.style.strokeDasharray = pathLength.toString()
      pathRef.current.style.strokeDashoffset = pathLength.toString()

      // Trigger animation by animating dashoffset to 0
      const animationStartTime = Date.now() + delay * 1000

      const animate = () => {
        const now = Date.now()
        const elapsed = now - animationStartTime

        if (elapsed < 0) {
          // Still in delay phase
          requestAnimationFrame(animate)
          return
        }

        const progress = Math.min(elapsed / (duration * 1000), 1)

        // Easing function (easeInOut)
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress

        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = (
            pathLength * (1 - eased)
          ).toString()
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          onAnimationComplete?.()
        }
      }

      requestAnimationFrame(animate)
    }, [animated, duration, delay, onAnimationComplete])

    return (
      <svg
        ref={ref}
        className={cn('w-full h-auto', className)}
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="presentation"
      >
        <path
          ref={pathRef}
          d="M10,50 Q60,25 110,50 T210,50 Q260,65 310,50 T390,50"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="preloader-stroke"
          style={{
            vectorEffect: 'non-scaling-stroke',
          }}
        />
      </svg>
    )
  }
)
