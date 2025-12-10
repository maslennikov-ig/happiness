'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { Compass, Shield, Gauge, Heart } from 'lucide-react'
import { Card, CardIcon, CardTitle, CardDescription } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Philosophy Section Component
 *
 * Displays 4 philosophy cards that represent the core values of the transformation program.
 *
 * Features:
 * - T047: 2x2 grid layout (desktop) / single column (mobile)
 * - T048: GSAP ScrollTrigger batch stagger entrance animation
 * - T049: Motion hover effects with scale and gradient reveal
 *
 * Animations:
 * - Cards fade in and slide up with 0.15s stagger on scroll
 * - Triggers when section is 20% in viewport
 * - Hover: scale to 1.02 with golden shadow increase
 * - Respects prefers-reduced-motion
 *
 * Layout:
 * - Desktop: 2 columns, max-width 4xl
 * - Mobile: 1 column, stacked
 * - Cards use existing Card component with golden accents
 */

const PHILOSOPHY_CARDS = [
  {
    id: 'compass',
    icon: Compass,
    title: 'Понимание себя',
    description: 'Научитесь слышать свои истинные потребности и желания'
  },
  {
    id: 'shield',
    icon: Shield,
    title: 'Внутренняя опора',
    description: 'Создайте фундамент эмоциональной устойчивости'
  },
  {
    id: 'gauge',
    icon: Gauge,
    title: 'Баланс',
    description: 'Найдите гармонию между достижениями и отдыхом'
  },
  {
    id: 'heart',
    icon: Heart,
    title: 'Самоценность',
    description: 'Позвольте себе быть важным без условий'
  }
]

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // T048: GSAP batch stagger entrance animation
  useGSAP(() => {
    if (prefersReducedMotion || !cardsRef.current) return

    const cards = cardsRef.current.children

    // Set initial state (hidden, below viewport)
    gsap.set(cards, { opacity: 0, y: 50 })

    // Batch animation - all cards animate in sequence
    ScrollTrigger.batch(cards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15, // 0.15s delay between each card
          duration: 0.8,
          ease: 'power2.out'
        })
      },
      start: 'top 80%', // Trigger when section is 20% in viewport
      once: true // Only animate once
    })
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] })

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="py-20 md:py-32 bg-bg-primary"
    >
      <div className="container mx-auto px-4">
        {/* Section Title - T047 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Философия программы
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-body">
            Четыре столпа, на которых строится ваша трансформация
          </p>
        </div>

        {/* Cards Grid - T047: 2x2 desktop, 1 col mobile */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
        >
          {PHILOSOPHY_CARDS.map((card) => (
            <motion.div
              key={card.id}
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="h-full group"
            >
              <Card className="h-full p-6 md:p-8 hover:shadow-gold transition-shadow duration-300">
                <CardIcon>
                  <card.icon className="w-8 h-8 text-gold-primary" />
                </CardIcon>
                <CardTitle className="mt-4 mb-2">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
