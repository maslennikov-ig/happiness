'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Hook that detects if the user is on a mobile device based on viewport width.
 *
 * @returns {boolean} true if viewport width is less than 768px, false otherwise
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileNavigation />
 *       ) : (
 *         <DesktopNavigation />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIsMobile(): boolean {
  // Initialize with false for SSR compatibility
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window.matchMedia is available (client-side only)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Create media query matcher for mobile breakpoint
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    )

    // Set initial value
    setIsMobile(mediaQuery.matches)

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Add event listener for dynamic updates
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobile
}
