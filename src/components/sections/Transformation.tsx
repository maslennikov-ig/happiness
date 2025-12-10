'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Transformation data: Before/After comparison
 */
const TRANSFORMATIONS = [
  {
    id: 1,
    before: 'Вечная усталость и выгорание',
    after: 'Энергия и осознанный темп жизни'
  },
  {
    id: 2,
    before: 'Тревога о будущем',
    after: 'Уверенность и спокойствие'
  },
  {
    id: 3,
    before: 'Работа 24/7 без результата',
    after: 'Продуктивность без надрыва'
  },
  {
    id: 4,
    before: 'Отношения на автопилоте',
    after: 'Глубокие связи с близкими'
  },
  {
    id: 5,
    before: '«Надо» вместо «хочу»',
    after: 'Жизнь по своим правилам'
  }
]

/**
 * Transformation Section Component
 *
 * Features:
 * - Two-column layout comparing "Before" and "After" states
 * - Desktop: Pinned scroll animation with blur/highlight effects
 * - Mobile: Simple stacked layout without pin
 * - Golden divider between columns
 * - Progress indicator during scroll
 * - Reduced motion support
 *
 * Layout:
 * - Desktop: Two columns with center divider, section pins while scrolling
 * - Mobile: Stacked cards without pin animation
 * - Golden accent throughout
 *
 * Animations (Desktop only):
 * - Section pins for 150% viewport height
 * - "Было" column gradually blurs (blur(4px) + opacity 0.5)
 * - "Стало" column scales up (1.02x)
 * - Progress bar fills from top to bottom
 * - Smooth scrubbing (scrub: 1)
 */
export function Transformation() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeColRef = useRef<HTMLDivElement>(null)
  const afterColRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion()

  // Pinned scroll animation (desktop only)
  useGSAP(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const mm = gsap.matchMedia()

    // Desktop only: pinned scroll animation
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%', // Pin for 150% of viewport height
          pin: true,
          scrub: 1, // Smooth scroll-linked animation
          // markers: true, // Uncomment for debugging
        }
      })

      // Blur "Было" column as user scrolls
      tl.to(beforeColRef.current, {
        filter: 'blur(4px)',
        opacity: 0.5,
        ease: 'none'
      }, 0)

      // Highlight "Стало" column - subtle scale increase
      tl.to(afterColRef.current, {
        scale: 1.02,
        ease: 'none'
      }, 0)

      // Progress bar fills from top to bottom
      if (progressRef.current) {
        tl.to(progressRef.current, {
          scaleY: 1,
          ease: 'none'
        }, 0)
      }
    })

    return () => mm.revert()
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] })

  return (
    <section
      ref={sectionRef}
      id="transformation"
      className="min-h-screen bg-bg-muted py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            История трансформации
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            От того, как есть сейчас, к тому, как может быть
          </p>
        </div>

        {/* Transformation Table */}
        <div
          ref={containerRef}
          className="max-w-5xl mx-auto relative"
        >
          {/* Progress Indicator - Center vertical line (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-white/30">
            <div
              ref={progressRef}
              className="w-full bg-gold-primary origin-top"
              style={{ height: '100%', transform: 'scaleY(0)' }}
            />
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 mb-8">
            <div className="text-center lg:text-right">
              <span className="font-display text-2xl text-text-muted">Было</span>
            </div>
            <div className="text-center lg:text-left">
              <span className="font-display text-2xl text-gold-text">Стало</span>
            </div>
          </div>

          {/* Transformation Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
            {/* Before Column */}
            <div ref={beforeColRef} className="space-y-4">
              {TRANSFORMATIONS.map((item) => (
                <div
                  key={`before-${item.id}`}
                  className="bg-white/50 rounded-lg p-4 md:p-6 text-center lg:text-right"
                >
                  <p className="text-text-secondary font-body">{item.before}</p>
                </div>
              ))}
            </div>

            {/* After Column */}
            <div ref={afterColRef} className="space-y-4">
              {TRANSFORMATIONS.map((item) => (
                <div
                  key={`after-${item.id}`}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-card text-center lg:text-left"
                >
                  <p className="text-text-primary font-body font-medium">{item.after}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
