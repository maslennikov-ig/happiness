'use client'

import { useState } from 'react'
import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'
import { Preloader } from '@/components/sections/Preloader'
import { Hero } from '@/components/sections/Hero'

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

        {/* Placeholder for future sections */}
        <section id="contact" className="min-h-screen bg-bg-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl text-text-primary mb-4">
              Контакты
            </h2>
            <p className="text-text-secondary">
              Форма обратной связи будет здесь (Phase 4)
            </p>
          </div>
        </section>
      </main>
    </SmoothScrollProvider>
  )
}
