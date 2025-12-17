'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Toggle, ToggleGroup } from '@/components/ui/Toggle'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { scrollToElement, SECTION_IDS } from '@/lib/scroll-utils'

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
  subtitle?: string // Optional subtitle in parentheses (e.g., "СКУКА")
  description: string
  signal: string // The actual signal text (italicized)
}

const DIAGNOSTIC_SIGNALS: DiagnosticSignal[] = [
  {
    id: 'groundhog-day',
    title: 'ДЕНЬ СУРКА',
    subtitle: 'СКУКА',
    description:
      'Ты просыпаешься, и тебе уже всё понятно наперед. Сценарий один: работа, дом, задачи. Внешне декорации меняются, доход растет, но драйва нет.',
    signal:
      'Твой Внутренний Ребенок перестал играть, потому что игра стала слишком серьезной.',
  },
  {
    id: 'energy-deficit',
    title: 'ЭНЕРГОДЕФИЦИТ',
    description:
      'У тебя есть амбиции, но к обеду батарейка садится. Ты «вывозишь» на силе воли и кофе. Выходные не восстанавливают, ты не живешь, а «отлеживаешься».',
    signal: 'Взрослый тратит больше, чем успевает восполнять.',
  },
  {
    id: 'draft-life',
    title: 'ЖИЗНЬ НА ЧЕРНОВИК',
    description:
      'Синдром «отложенного счастья». Кажется, что сейчас — репетиция. Настоящая жизнь начнется, когда заработаешь X денег, достроишь дом, вырастут дети.',
    signal: 'Ты запрещаешь себе радость «здесь и сейчас».',
  },
  {
    id: 'glass-ceiling',
    title: 'СТЕКЛЯННЫЙ ПОТОЛОК',
    description:
      'Ты уперся в стену. Делаешь больше действий, больше работаешь, но прорыва нет. Система не пускает тебя на новый уровень.',
    signal:
      'Ты пытаешься пробить стену головой, вместо того чтобы найти дверь (состояние легкости).',
  },
  {
    id: 'others-game',
    title: 'ЧУЖАЯ ИГРА',
    description:
      'Внешне — успешный фасад. Внутри — ощущение, что ты проживаешь не свою жизнь и стал удобным для всех, кроме себя.',
    signal: 'Маска приросла к лицу, контакт с настоящим «Я» потерян.',
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
    scrollToElement(SECTION_IDS.CONTACT)
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
            ГДЕ ТЕРЯЕТСЯ ТВОЯ ЭНЕРГИЯ?
          </h2>
          <p className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Честный чек-ап: найди пункты, в которых узнаешь себя.
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
              const displayTitle = signal.subtitle
                ? `${signal.title} (${signal.subtitle})`
                : signal.title
              return (
                <Toggle
                  key={signal.id}
                  isSelected={isSelected}
                  onToggle={() => toggleSignal(signal.id)}
                  className="text-sm md:text-base"
                >
                  {displayTitle}
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
                    <h4 className="font-display text-lg md:text-xl text-text-primary mb-3">
                      {signal.subtitle
                        ? `${signal.title} (${signal.subtitle})`
                        : signal.title}
                    </h4>
                    <p className="font-body text-text-secondary leading-relaxed mb-3">
                      {signal.description}
                    </p>
                    <p className="font-body text-text-secondary leading-relaxed italic text-sm border-l-2 border-gold-muted pl-3">
                      {signal.signal}
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

          {/* Summary Block - Always visible */}
          <div className="mt-12 pt-8 border-t border-bg-muted">
            <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed text-center max-w-3xl mx-auto">
              «Если ты узнал себя хотя бы в одном пункте — это не значит, что с
              тобой что-то не так. Это значит, что твоя старая стратегия
              перестала работать. Пришло время сменить топливо: с &quot;Надо&quot; на
              &quot;Хочу&quot;».
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
