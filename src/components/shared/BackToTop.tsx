'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Props for the BackToTop component
 */
export interface BackToTopProps {
  /** Additional CSS classes */
  className?: string
  /** Scroll threshold in viewport heights (default: 0.5 for 50vh) */
  threshold?: number
}

/**
 * BackToTop - Premium floating button for smooth scroll to top
 *
 * A circular button that appears after scrolling past a threshold (50vh by default).
 * Features smooth fade/scale animations, hover effects, and respects user's
 * reduced motion preferences.
 *
 * @example
 * ```tsx
 * <BackToTop />
 * ```
 *
 * @example
 * ```tsx
 * <BackToTop threshold={0.3} className="custom-class" />
 * ```
 */
export function BackToTop({ className, threshold = 0.5 }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Calculate threshold in pixels (50vh = 50% of viewport height)
    const thresholdPx = window.innerHeight * threshold

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollTop > thresholdPx)
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  // Animation variants
  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-12 h-12 rounded-full',
            'bg-gold-primary hover:bg-gold-muted',
            'text-white',
            'shadow-gold',
            'flex items-center justify-center',
            'transition-colors duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2',
            className
          )}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={prefersReducedMotion ? undefined : buttonVariants}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }
          }
          whileTap={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }
          }
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
