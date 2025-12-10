'use client'

import { useState } from 'react'
import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Preloader } from '@/components/sections/Preloader'
import { Hero } from '@/components/sections/Hero'
import { Philosophy } from '@/components/sections/Philosophy'
import { Transformation } from '@/components/sections/Transformation'
import { Diagnostic } from '@/components/sections/Diagnostic'
import { Roadmap } from '@/components/sections/Roadmap'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/shared/Header'
import { BackToTop } from '@/components/shared/BackToTop'

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

      {/* Header - appears after scrolling past Hero */}
      <Header />

      {/* Main content */}
      <main id="main-content">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <Philosophy />
        </ErrorBoundary>
        <ErrorBoundary>
          <Transformation />
        </ErrorBoundary>
        <ErrorBoundary>
          <Diagnostic />
        </ErrorBoundary>
        <ErrorBoundary>
          <Roadmap />
        </ErrorBoundary>
        <ErrorBoundary>
          <Contact />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to top button - appears after 50vh scroll */}
      <BackToTop />
    </SmoothScrollProvider>
  )
}
