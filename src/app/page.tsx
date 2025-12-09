'use client'

import { useState } from 'react'
import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'
import { Preloader } from '@/components/sections/Preloader'
import { Hero } from '@/components/sections/Hero'
import { Contact } from '@/components/sections/Contact'

/**
 * Home Page
 *
 * Main landing page with preloader animation and Hero section.
 * Wrapped in SmoothScrollProvider for Lenis smooth scroll.
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <SmoothScrollProvider>
      {/* Preloader - shows first, then fades out */}
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Main content */}
      <main>
        <Hero />
        <Contact />
      </main>
    </SmoothScrollProvider>
  )
}
