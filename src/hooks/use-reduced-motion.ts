'use client'

import { useState, useEffect } from 'react'

/**
 * Hook that detects the user's prefers-reduced-motion preference.
 *
 * @returns {boolean} true if the user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  // Initialize with false for SSR compatibility
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window.matchMedia is available (client-side only)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Create media query matcher for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add event listener for dynamic updates
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
