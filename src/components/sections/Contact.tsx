'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas'
import type { FormStatus, MeetingPoint } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Meeting information points - what happens during consultation
 */
const MEETING_POINTS: MeetingPoint[] = [
  {
    id: 'coordinates',
    icon: '☕️',
    title: 'МЫ СВЕРИМ КООРДИНАТЫ',
    description: 'Ты расскажешь свою текущую ситуацию (без прикрас), а я скажу честно: подходит ли тебе моя методика. Если я увижу, что тебе нужен другой специалист (например, психотерапевт), я прямо об этом скажу.',
  },
  {
    id: 'chemistry',
    icon: '🤝',
    title: 'ПРОВЕРИМ "ХИМИЮ"',
    description: 'Наставник — это партнер на 3 месяца. Нам должно быть легко общаться. Мы поймем, совпадаем ли мы по ценностям и темпу.',
  },
  {
    id: 'steps',
    icon: '🔑',
    title: 'НАМЕТИМ ПЕРВЫЕ ШАГИ',
    description: 'Даже если мы не пойдем в длительную работу, ты уйдешь с ясностью: что с тобой происходит и куда двигаться дальше.',
  },
]

/**
 * Contact Section
 *
 * Two-column layout:
 * - Left: Contact form with validation and state management
 * - Right: Meeting information (what happens during consultation)
 *
 * States:
 * - idle: Default form ready for input
 * - submitting: Loading state with spinner
 * - success: Shows success message and Cal.com booking button
 * - error: Shows error message, form remains editable
 */
export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
        setErrorMessage(result.message || 'Произошла ошибка. Попробуйте снова.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Ошибка соединения. Попробуйте позже.')
    }
  }

  const calcomLink = process.env.NEXT_PUBLIC_CALCOM_LINK || '#'

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-bg-muted"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form Column */}
          <div>
            <h2
              id="contact-heading"
              className="font-display text-4xl md:text-5xl text-text-primary mb-4"
            >
              Начните путь
            </h2>
            <p className="text-text-secondary mb-8 max-w-md">
              Заполни короткую анкету. Это займет 2 минуты. Мой ассистент свяжется с тобой и подберет удобное время для созвона.
            </p>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-8 shadow-card"
                >
                  <div className="text-center">
                    {/* Success icon */}
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-success" strokeWidth={2.5} />
                    </div>

                    <h3 className="font-display text-2xl text-text-primary mb-2">
                      Заявка отправлена!
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Я свяжусь с вами в ближайшее время
                    </p>

                    <div className="space-y-3">
                      {/* Cal.com booking button */}
                      <a
                        href={calcomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          // Base button styles matching Button component
                          'inline-flex items-center justify-center gap-2',
                          'h-14 px-8 text-lg',
                          'rounded-full font-medium',
                          'bg-gold-primary text-text-primary',
                          'hover:bg-gold-muted transition-colors duration-300',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2',
                          'w-full'
                        )}
                      >
                        Записаться на встречу
                      </a>

                      <p className="text-sm text-text-muted">
                        Или напишите в{' '}
                        <a
                          href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'username'}`}
                          className="text-gold-text hover:underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Telegram
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Honeypot field - hidden from users, triggers validation if filled */}
                  <input
                    type="text"
                    {...register('website')}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <Input
                    id="name"
                    label="Ваше имя"
                    {...register('name')}
                    error={errors.name?.message}
                    disabled={status === 'submitting'}
                    autoComplete="name"
                  />

                  <Input
                    id="contact"
                    label="Телефон или Telegram"
                    {...register('contact')}
                    error={errors.contact?.message}
                    disabled={status === 'submitting'}
                    autoComplete="tel"
                  />

                  <Textarea
                    id="message"
                    label="Сообщение (необязательно)"
                    {...register('message')}
                    error={errors.message?.message}
                    disabled={status === 'submitting'}
                    rows={4}
                  />

                  {/* Error message display */}
                  {status === 'error' && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-md bg-error/10 border border-error/20"
                      role="alert"
                    >
                      <p className="text-error text-sm font-medium">
                        {errorMessage}
                      </p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={status === 'submitting'}
                    className="w-full"
                  >
                    Записаться на знакомство
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Meeting Info Column */}
          <div className="lg:pt-16">
            <h3 className="font-display text-2xl text-text-primary mb-6">
              ЧТО БУДЕТ НА ЭТОЙ ВСТРЕЧЕ?
            </h3>
            <div className="space-y-6">
              {MEETING_POINTS.map((point) => (
                <div key={point.id} className="flex gap-4">
                  {/* Icon badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-light flex items-center justify-center text-2xl"
                    aria-hidden="true"
                  >
                    {point.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="font-body font-semibold text-text-primary mb-1">
                      {point.icon} {point.title}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
