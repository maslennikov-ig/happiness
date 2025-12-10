'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

/**
 * Type definition for a single roadmap stage
 */
interface RoadmapStage {
  /** Week number (1-8) */
  week: number
  /** Stage title */
  title: string
  /** Stage description */
  description: string
}

/**
 * Roadmap data: 8-week transformation program
 */
const ROADMAP_STAGES: RoadmapStage[] = [
  {
    week: 1,
    title: 'Аудит',
    description: 'Глубокий анализ текущей ситуации и постановка целей'
  },
  {
    week: 2,
    title: 'Фундамент',
    description: 'Работа с базовыми установками и убеждениями'
  },
  {
    week: 3,
    title: 'Энергия',
    description: 'Восстановление ресурсного состояния'
  },
  {
    week: 4,
    title: 'Фокус',
    description: 'Определение приоритетов и устранение отвлекающих факторов'
  },
  {
    week: 5,
    title: 'Отношения',
    description: 'Работа с ключевыми связями и коммуникацией'
  },
  {
    week: 6,
    title: 'Привычки',
    description: 'Внедрение новых паттернов поведения'
  },
  {
    week: 7,
    title: 'Интеграция',
    description: 'Закрепление изменений в повседневной жизни'
  },
  {
    week: 8,
    title: 'Выпуск',
    description: 'Подведение итогов и план самостоятельного развития'
  }
]

/**
 * Roadmap Section Component
 *
 * Features:
 * - Desktop: Horizontal timeline with GSAP ScrollTrigger pin (200% viewport)
 * - Mobile: Vertical stack with fade-in stagger animation
 * - Progress bar fills as user scrolls through stages
 * - Click/tap navigation to scroll to specific stage
 * - Keyboard arrow navigation (left/right) on desktop
 * - Golden accent for current stage highlight
 * - Reduced motion support
 * - Full accessibility with focus indicators and screen reader support
 *
 * Layout:
 * - Desktop (lg+): Horizontal scrolling timeline pinned for comfortable reading
 * - Mobile: Vertical stacked cards, each animates in on scroll
 *
 * Animations (Desktop only):
 * - Section pins for 200% viewport height
 * - Progress bar fills from 0 to 100% as user scrolls
 * - Current stage scales up (1.05x) with golden border
 * - Smooth scrubbing (scrub: 1)
 */
export function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const mobileCardsRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  const [currentStage, setCurrentStage] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  // Desktop: Pinned horizontal timeline animation
  useGSAP(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const mm = gsap.matchMedia()

    // Desktop only: pinned horizontal scroll
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%', // Pin for 200% of viewport height
          pin: true,
          scrub: 1, // Smooth scroll-linked animation
          // markers: true, // Uncomment for debugging
          onUpdate: (self) => {
            // Update current stage based on scroll progress
            const progress = self.progress
            const stageIndex = Math.floor(progress * ROADMAP_STAGES.length)
            setCurrentStage(Math.min(stageIndex, ROADMAP_STAGES.length - 1))
          }
        }
      })

      // Store ScrollTrigger instance for navigation
      scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger

      // Progress bar fills from left to right
      if (progressBarRef.current) {
        tl.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none'
        }, 0)
      }
    })

    // Mobile: vertical stagger fade-in
    mm.add('(max-width: 1023px)', () => {
      if (!mobileCardsRef.current) return

      const cards = mobileCardsRef.current.children

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mobileCardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    return () => mm.revert()
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] })

  // Keyboard navigation: left/right arrows (desktop only)
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only on desktop
      if (window.innerWidth < 1024) return

      if (e.key === 'ArrowLeft' && currentStage > 0) {
        navigateToStage(currentStage - 1)
      } else if (e.key === 'ArrowRight' && currentStage < ROADMAP_STAGES.length - 1) {
        navigateToStage(currentStage + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStage, prefersReducedMotion])

  /**
   * Navigate to specific stage by index
   * Smooth scroll to the corresponding section position
   */
  const navigateToStage = (index: number) => {
    if (!scrollTriggerRef.current) return

    // Calculate scroll position for target stage
    const progress = index / (ROADMAP_STAGES.length - 1)
    const start = scrollTriggerRef.current.start
    const end = scrollTriggerRef.current.end
    const targetScroll = start + (end - start) * progress

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 0.8,
      ease: 'power2.inOut'
    })
  }

  /**
   * Handle stage card click/tap
   */
  const handleStageClick = (index: number) => {
    if (window.innerWidth >= 1024) {
      navigateToStage(index)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className="min-h-screen bg-bg-primary py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Дорожная карта программы
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            8 недель трансформации: пошаговый путь к осознанной жизни
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div
          ref={containerRef}
          className="hidden lg:block max-w-6xl mx-auto relative"
        >
          {/* Progress Bar Background */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-white/30">
            <div
              ref={progressBarRef}
              className="h-full bg-gold-primary origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          {/* Stage Cards - Horizontal Layout */}
          <div
            ref={cardsRef}
            className="flex gap-6 justify-between"
          >
            {ROADMAP_STAGES.map((stage, index) => (
              <button
                key={stage.week}
                onClick={() => handleStageClick(index)}
                className={cn(
                  'flex-1 min-w-[200px] bg-white rounded-lg p-6 shadow-card transition-all duration-300',
                  'hover:shadow-gold cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-primary',
                  currentStage === index && 'ring-2 ring-gold-primary scale-105 shadow-gold'
                )}
                aria-label={`Неделя ${stage.week}: ${stage.title}`}
                aria-current={currentStage === index ? 'step' : undefined}
              >
                {/* Week Number */}
                <div className="flex justify-center mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-display text-lg',
                      'transition-colors duration-300',
                      currentStage === index
                        ? 'bg-gold-primary text-white'
                        : 'bg-gold-light text-gold-text'
                    )}
                  >
                    {stage.week}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl md:text-2xl text-text-primary mb-3 text-center">
                  {stage.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm text-center leading-relaxed">
                  {stage.description}
                </p>
              </button>
            ))}
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between mt-8">
            {ROADMAP_STAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToStage(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-gold-primary',
                  currentStage === index
                    ? 'bg-gold-primary scale-125'
                    : 'bg-white/50 hover:bg-gold-light'
                )}
                aria-label={`Перейти к неделе ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Hint */}
          <div className="text-center mt-8 text-text-muted text-sm">
            Используйте клавиши ← → для навигации
          </div>
        </div>

        {/* Mobile: Vertical Stack */}
        <div
          ref={mobileCardsRef}
          className="lg:hidden space-y-6"
        >
          {ROADMAP_STAGES.map((stage) => (
            <div
              key={stage.week}
              className="bg-white rounded-lg p-6 shadow-card"
            >
              {/* Week Number */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-primary text-white flex items-center justify-center font-display text-lg">
                  {stage.week}
                </div>
                <h3 className="font-display text-xl text-text-primary">
                  {stage.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
