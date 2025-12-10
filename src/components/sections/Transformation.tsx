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
    area: 'СЕМЬЯ',
    before: 'Ранняя смерть матери. Нестабильная, токсичная мачеха. Отсутствие защиты и одиночество в родном доме.',
    after: 'Полное отсутствие общения с токсичными людьми. Выстроенные, теплые отношения с отцом. Семья стала местом силы, а не полем битвы.'
  },
  {
    area: 'ОТНОШЕНИЯ',
    before: 'Коллекция фраз, убивающих самооценку («Ты слишком хорошая», «Давай останемся друзьями»). Эмоциональные качели и зависимость.',
    after: 'Выбор партнеров из позиции силы. Счастье — это мой внутренний навык, который больше не зависит от наличия кого-то рядом.'
  },
  {
    area: 'БИЗНЕС',
    before: 'Кассовые разрывы, долги, проблемы с налогами. Предательство бизнес-партнера. Рост через надрыв и кризисы.',
    after: 'Самый сложный продукт на рынке залогового кредитования. Продано > 100 франшиз. Поток клиентов > 3500 в месяц. Рост через систему и спокойствие.'
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
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-text-primary mb-6 uppercase leading-tight">
            Я потратила годы, чтобы перестать «бороться» с жизнью. И начать ею наслаждаться.
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto">
            Всё, что есть в этом проекте — это мой личный путь от тяжелых травм и бизнес-войн к состоянию абсолютной устойчивости.
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
              {TRANSFORMATIONS.map((item, index) => (
                <div
                  key={`before-${index}`}
                  className="bg-white/50 rounded-lg p-4 md:p-6 text-center lg:text-right"
                >
                  <h3 className="font-display text-lg text-text-muted mb-3 uppercase">{item.area}</h3>
                  <p className="text-text-secondary font-body">{item.before}</p>
                </div>
              ))}
            </div>

            {/* After Column */}
            <div ref={afterColRef} className="space-y-4">
              {TRANSFORMATIONS.map((item, index) => (
                <div
                  key={`after-${index}`}
                  className="bg-white rounded-lg p-4 md:p-6 shadow-card text-center lg:text-left"
                >
                  <h3 className="font-display text-lg text-gold-text mb-3 uppercase">
                    {item.area === 'БИЗНЕС' ? 'ДЕЛО ЖИЗНИ' : item.area}
                  </h3>
                  <p className="text-text-primary font-body font-medium">{item.after}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Quote */}
          <div className="mt-16 md:mt-24 text-center max-w-4xl mx-auto">
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-text-primary italic leading-relaxed">
              «Больше нет необходимости падать на дно, чтобы совершить прорыв. Рост идет через стабильность, а не через кризис».
            </blockquote>
          </div>

          {/* Footer Message */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              Я смогла изменить свой подход. Значит, сможешь и ты. Я здесь, чтобы сократить твой путь.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
