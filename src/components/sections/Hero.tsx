'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Button } from '@/components/ui/Button'
import { HeroStroke } from '@/assets/svg/brush-strokes/hero-stroke'
import { ScrollIndicator } from '@/components/shared/ScrollIndicator'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { scrollToElement, SECTION_IDS } from '@/lib/scroll-utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Hero Section Component
 *
 * Features:
 * - Responsive two-column layout (stacked on mobile)
 * - Text reveal animation with SplitType character stagger
 * - Parallax effects on author photo and decorative brush stroke
 * - Reduced motion support for accessibility
 * - Smooth scroll to contact section on CTA click
 *
 * Layout:
 * - Desktop: Content left, photo right
 * - Mobile: Content on top, photo below
 * - Golden accents throughout
 *
 * Animations:
 * - Title: Characters animate in with stagger (0.02s per char)
 * - Subtitle: Fades in after title
 * - CTA button: Scales in
 * - Photo: Parallax scroll effect (slower than scroll)
 * - Brush stroke: Parallax scroll effect (faster than photo)
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const strokeRef = useRef<HTMLDivElement>(null)
  
  const prefersReducedMotion = useReducedMotion()
  
  // Text reveal animation with SplitType
  useGSAP(() => {
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return
    
    if (prefersReducedMotion) {
      // Simple fade-in for reduced motion preference
      gsap.from([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
      })
      return
    }
    
    // Split title into characters for stagger animation
    const split = new SplitType(titleRef.current, { types: 'chars' })
    
    const tl = gsap.timeline({ delay: 0.3 }) // Small delay after preloader
    
    // Title characters stagger in with 3D rotation
    tl.from(split.chars, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.02,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
    
    // Subtitle fades in
    .from(subtitleRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.3') // Overlap with title animation
    
    // CTA scales in
    .from(ctaRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'back.out(1.7)',
    }, '-=0.4') // Overlap with subtitle animation
    
    // Cleanup SplitType on unmount to prevent memory leaks
    return () => {
      split.revert()
    }
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] })
  
  // Parallax effect for photo and brush stroke (desktop only)
  useGSAP(() => {
    if (prefersReducedMotion || !photoRef.current || !strokeRef.current) return

    // Use matchMedia to disable parallax on mobile for performance
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      // Photo parallax (moves slower than scroll)
      gsap.to(photoRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1, // Smooth scrubbing
        },
      })

      // Stroke parallax (moves faster than photo for depth)
      gsap.to(strokeRef.current, {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8, // Slightly faster scrubbing
        },
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] })
  
  // Smooth scroll to contact section
  const handleCTAClick = () => {
    scrollToElement(SECTION_IDS.CONTACT)
  }
  
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen bg-bg-primary overflow-hidden"
    >
      <div className="container mx-auto px-4 py-20 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="order-2 lg:order-1">
            {/* Nadheader - Small text above title */}
            <p className="text-gold-text text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-body">
              Проект: Твоя новая реальность
            </p>

            {/* Main Title - Large display font */}
            <h1
              ref={titleRef}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6 leading-[1.1]"
            >
              Спасибо, что выбрал себя.
            </h1>

            {/* Manifest/Subtitle - Multi-paragraph manifesto */}
            <div
              ref={subtitleRef}
              className="font-body text-lg md:text-xl text-text-secondary mb-8 max-w-lg leading-relaxed space-y-4"
            >
              <p>
                Ты выбрал быть Счастливым, Стабильным и в Благополучии.
              </p>
              <p>
                Ты привык быть сильным для всех. Привык держать удар. Но здесь тебе не нужно бороться. Выдыхай. Самое сложное позади.
              </p>
              <p>
                Главное решение уже принято. Ты перестал откладывать жизнь на потом. Всё остальное — это просто путь, и тебе не придется идти по нему в одиночку.
              </p>
              <p className="font-medium">
                Теперь я рядом.
              </p>
            </div>

            {/* CTA Button */}
            <div ref={ctaRef}>
              <Button
                size="lg"
                onClick={handleCTAClick}
                aria-label="Scroll to contact form"
              >
                Сделать первый шаг к себе
              </Button>
            </div>

            {/* Handwritten Signature */}
            <div className="mt-12 md:mt-16">
              <p className="font-handwritten text-2xl md:text-3xl text-text-secondary italic">
                Твой Взрослый создал безопасность. Твой Ребенок готов жить.
              </p>
            </div>
          </div>
          
          {/* Photo Column */}
          <div className="relative order-1 lg:order-2">
            {/* Brush stroke decoration (behind photo) */}
            <div
              ref={strokeRef}
              className="absolute -left-10 top-1/2 -translate-y-1/2 w-[120%] opacity-30 pointer-events-none"
              aria-hidden="true"
            >
              <HeroStroke />
            </div>
            
            {/* Author photo placeholder */}
            <div
              ref={photoRef}
              className="relative aspect-[3/4] w-full max-w-md mx-auto lg:ml-auto lg:mr-0 bg-bg-muted rounded-lg overflow-hidden shadow-card"
            >
              {/* Placeholder gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-light/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                <span className="text-sm font-body">Фото автора</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - positioned at bottom center */}
      <ScrollIndicator />
    </section>
  )
}
