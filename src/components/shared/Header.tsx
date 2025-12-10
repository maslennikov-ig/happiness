'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useSmoothScrollContext } from '@/components/shared/SmoothScroll'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Header Component
 *
 * Premium fixed header that appears after scrolling past the Hero section.
 *
 * Features:
 * - Hidden in Hero section (first viewport)
 * - Slides down with smooth animation when Hero is scrolled past
 * - Fixed position at top with semi-transparent backdrop blur
 * - Logo on left, CTA button on right
 * - Smooth scroll integration for CTA click
 * - Reduced motion support
 * - Skip link target for accessibility
 *
 * Design:
 * - Background: Semi-transparent white with backdrop blur
 * - Height: 64px (h-16)
 * - Logo: Display font with gold text color
 * - CTA: Small button with golden accent
 * - Border bottom with subtle line
 *
 * Behavior:
 * - Uses GSAP ScrollTrigger to detect scroll position
 * - Animates in/out based on Hero section visibility
 * - Respects prefers-reduced-motion for accessibility
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollTo } = useSmoothScrollContext()

  // Show/hide header based on scroll position
  useGSAP(() => {
    if (!headerRef.current) return

    const header = headerRef.current

    // Get Hero section element
    const heroSection = document.getElementById('hero')
    if (!heroSection) {
      console.warn('Header: Hero section not found. Header will remain hidden.')
      return
    }

    // Initially hide header (translate up)
    gsap.set(header, {
      yPercent: -100,
      opacity: 0,
    })

    // Create ScrollTrigger to show/hide header
    const trigger = ScrollTrigger.create({
      trigger: heroSection,
      start: 'bottom top', // When Hero bottom reaches viewport top
      end: 'bottom top',
      onEnter: () => {
        setIsVisible(true)
        // Slide header down
        gsap.to(header, {
          yPercent: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: 'power2.out',
        })
      },
      onLeaveBack: () => {
        setIsVisible(false)
        // Slide header up
        gsap.to(header, {
          yPercent: -100,
          opacity: 0,
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: 'power2.in',
        })
      },
    })

    // Cleanup
    return () => {
      trigger.kill()
    }
  }, { dependencies: [prefersReducedMotion] })

  // Smooth scroll to contact section
  const handleCTAClick = () => {
    scrollTo('#contact', { offset: -80 }) // Offset for header height
  }

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-text-primary focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Fixed Header */}
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'h-16',
          'bg-bg-primary/90 backdrop-blur-sm',
          'border-b border-gold-primary/20',
          'transition-shadow duration-300',
          isVisible && 'shadow-sm'
        )}
        aria-label="Site header"
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => scrollTo('#hero', { duration: 1.2 })}
                className={cn(
                  'font-display text-2xl md:text-3xl text-gold-text',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:rounded-sm',
                  'transition-opacity duration-200 hover:opacity-80'
                )}
                aria-label="Scroll to top"
              >
                Happiness
              </button>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCTAClick}
                aria-label="Scroll to contact form"
              >
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
