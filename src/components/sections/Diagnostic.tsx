'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Toggle, ToggleGroup } from '@/components/ui/Toggle'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Diagnostic Section Component
 *
 * Interactive section allowing users to identify with burnout signals.
 * Features multi-select toggles with smooth highlight animation and
 * expandable descriptions.
 *
 * Features:
 * - 5 diagnostic signals with multi-select capability
 * - Smooth golden highlight animation using Motion layoutId
 * - Expandable descriptions for selected signals
 * - Dynamic CTA based on selection count (2+ selections)
 * - Reduced motion support for accessibility
 * - 44px minimum touch targets for mobile
 *
 * Layout:
 * - Desktop: Centered content with max-width constraints
 * - Mobile: Full-width with proper padding
 * - Expandable cards show descriptions below toggles
 *
 * Animations:
 * - Highlight: Smooth spring animation between selected toggles
 * - Descriptions: Fade and slide in/out with stagger
 * - CTA: Fade in when conditions are met
 */

interface DiagnosticSignal {
  id: string
  title: string
  description: string
}

const DIAGNOSTIC_SIGNALS: DiagnosticSignal[] = [
  {
    id: 'success-no-joy',
    title: 'Успех есть, а радости нет',
    description:
      'Вы достигли многого, но это не приносит удовлетворения. Каждая цель кажется промежуточной, а радость от побед быстро улетучивается.',
  },
  {
    id: 'rest-no-restore',
    title: 'Отдых не восстанавливает',
    description:
      'Даже после отпуска вы чувствуете себя разбитым. Выходные пролетают незаметно, а утро понедельника встречает усталостью.',
  },
  {
    id: 'impostor',
    title: 'Чувствую себя самозванцем',
    description:
      'Несмотря на достижения, вы сомневаетесь в своей компетентности и боитесь разоблачения. Успех кажется случайностью.',
  },
  {
    id: 'disconnected',
    title: 'Близкие стали чужими',
    description:
      'Вы физически присутствуете, но эмоционально отстранены от семьи и друзей. Разговоры кажутся поверхностными, а связь — утраченной.',
  },
  {
    id: 'lost-zest',
    title: 'Потерял вкус к жизни',
    description:
      'То, что раньше вдохновляло, теперь кажется пустым. Жизнь превратилась в монотонную рутину, а будущее не вызывает энтузиазма.',
  },
]

export function Diagnostic() {
  const [selectedSignals, setSelectedSignals] = useState<string[]>([])
  const prefersReducedMotion = useReducedMotion()

  // Toggle signal selection (multi-select)
  const toggleSignal = (id: string) => {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectedCount = selectedSignals.length

  // Smooth scroll to contact section
  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact')
    contactSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="diagnostic"
      className="relative py-20 md:py-32 bg-bg-primary"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4">
            Узнаёте себя?
          </h2>
          <p className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Выберите то, что откликается. Это первый шаг к изменениям.
          </p>
        </div>

        {/* Signal Toggles and Descriptions */}
        <div className="max-w-4xl mx-auto">
          {/* Toggle Group */}
          <ToggleGroup
            layoutId="diagnostic-highlight"
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {DIAGNOSTIC_SIGNALS.map((signal) => {
              const isSelected = selectedSignals.includes(signal.id)
              return (
                <Toggle
                  key={signal.id}
                  isSelected={isSelected}
                  onToggle={() => toggleSignal(signal.id)}
                  className="text-sm md:text-base"
                >
                  {signal.title}
                </Toggle>
              )
            })}
          </ToggleGroup>

          {/* Selected Signal Descriptions */}
          <AnimatePresence mode="sync">
            {selectedSignals.length > 0 && (
              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }
                }
                animate={{ opacity: 1, height: 'auto' }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.3, ease: 'easeInOut' }
                }
                className="space-y-4 overflow-hidden"
              >
                {DIAGNOSTIC_SIGNALS.filter((s) =>
                  selectedSignals.includes(s.id)
                ).map((signal, index) => (
                  <motion.div
                    key={signal.id}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, x: -20 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: 'easeOut',
                          }
                    }
                    className={cn(
                      'bg-white rounded-lg p-6 shadow-card',
                      'border-l-4 border-gold-primary'
                    )}
                  >
                    <h4 className="font-display text-lg md:text-xl text-text-primary mb-2">
                      {signal.title}
                    </h4>
                    <p className="font-body text-text-secondary leading-relaxed">
                      {signal.description}
                    </p>
                  </motion.div>
                ))}

                {/* Dynamic CTA based on selection count */}
                {selectedCount >= 2 && (
                  <motion.div
                    initial={
                      prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.4, delay: 0.2, ease: 'easeOut' }
                    }
                    className="text-center pt-6 mt-4 border-t border-bg-muted"
                  >
                    <p
                      className={cn(
                        'font-body font-medium mb-4',
                        selectedCount >= 4
                          ? 'text-error text-lg'
                          : 'text-gold-text'
                      )}
                    >
                      {selectedCount >= 4
                        ? 'Это серьёзный сигнал. Пора действовать.'
                        : 'Если откликнулось хотя бы два пункта — это повод задуматься.'}
                    </p>
                    <button
                      onClick={handleCTAClick}
                      className={cn(
                        'inline-block px-6 py-3 rounded-full',
                        'font-body font-medium text-white',
                        'bg-gold-primary hover:bg-gold-muted',
                        'transition-colors duration-normal',
                        'shadow-gold hover:shadow-gold-lg',
                        'focus-visible:outline focus-visible:outline-2',
                        'focus-visible:outline-offset-2 focus-visible:outline-gold-primary',
                        'min-h-[44px]' // Touch target
                      )}
                      aria-label="Scroll to contact form for diagnostic consultation"
                    >
                      Записаться на диагностику
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
