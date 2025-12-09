'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSmoothScroll, type SmoothScrollReturn } from '@/hooks/use-smooth-scroll'

// Context type - using control methods from the hook
interface SmoothScrollContextValue {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
  stop: () => void
  start: () => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)

// Provider props
interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Provider component that initializes Lenis smooth scroll at the app level.
 *
 * Wraps the app and provides scroll control context to all child components.
 * Must be used in a Client Component boundary.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <SmoothScrollProvider>
 *           {children}
 *         </SmoothScrollProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { scrollTo, stop, start } = useSmoothScroll()

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

/**
 * Hook to consume smooth scroll context.
 *
 * Provides access to scroll control methods (scrollTo, stop, start).
 * Must be used within a SmoothScrollProvider.
 *
 * @throws {Error} If used outside SmoothScrollProvider
 * @returns {SmoothScrollContextValue} Scroll control methods
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * import { useSmoothScrollContext } from '@/components/shared/SmoothScroll'
 *
 * export function Navigation() {
 *   const { scrollTo } = useSmoothScrollContext()
 *
 *   return (
 *     <button onClick={() => scrollTo('#contact', { offset: -100 })}>
 *       Contact
 *     </button>
 *   )
 * }
 * ```
 */
export function useSmoothScrollContext() {
  const context = useContext(SmoothScrollContext)
  if (!context) {
    throw new Error('useSmoothScrollContext must be used within SmoothScrollProvider')
  }
  return context
}

// Re-export the full return type from the hook for advanced use cases
export type { SmoothScrollReturn as SmoothScrollControls }
