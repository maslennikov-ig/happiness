# Transformation Section - Key Code Snippets

## 1. Component Structure

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}
```

## 2. Data Model

```tsx
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
```

## 3. Pinned Scroll Animation (Core Logic)

```tsx
// Desktop-only pinned scroll animation
useGSAP(() => {
  if (prefersReducedMotion || !containerRef.current) return

  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',           // Pin when section reaches top
        end: '+=150%',              // Keep pinned for 150% vh
        pin: true,                  // Enable section pinning
        scrub: 1,                   // Smooth scroll-linked animation
      }
    })

    // Blur "Before" column
    tl.to(beforeColRef.current, {
      filter: 'blur(4px)',
      opacity: 0.5,
      ease: 'none'
    }, 0)

    // Scale "After" column
    tl.to(afterColRef.current, {
      scale: 1.02,
      ease: 'none'
    }, 0)

    // Fill progress bar
    if (progressRef.current) {
      tl.to(progressRef.current, {
        scaleY: 1,
        ease: 'none'
      }, 0)
    }
  })

  return () => mm.revert()
}, { scope: sectionRef, dependencies: [prefersReducedMotion] })
```

## 4. Layout Structure

```tsx
<section ref={sectionRef} id="transformation" className="min-h-screen bg-bg-muted py-20 md:py-32">
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

    <div ref={containerRef} className="max-w-5xl mx-auto relative">

      {/* Progress Indicator (desktop only) */}
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-white/30">
        <div ref={progressRef} className="w-full bg-gold-primary origin-top"
             style={{ height: '100%', transform: 'scaleY(0)' }} />
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
            <div key={`before-${item.id}`}
                 className="bg-white/50 rounded-lg p-4 md:p-6 text-center lg:text-right">
              <p className="text-text-secondary font-body">{item.before}</p>
            </div>
          ))}
        </div>

        {/* After Column */}
        <div ref={afterColRef} className="space-y-4">
          {TRANSFORMATIONS.map((item) => (
            <div key={`after-${item.id}`}
                 className="bg-white rounded-lg p-4 md:p-6 shadow-card text-center lg:text-left">
              <p className="text-text-primary font-body font-medium">{item.after}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
```

## 5. Integration (page.tsx)

```tsx
import { Transformation } from '@/components/sections/Transformation'

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <Preloader onComplete={() => setIsLoading(false)} />
      <main>
        <Hero />
        <Transformation />  {/* ← New section */}
        <Diagnostic />
        <Contact />
      </main>
    </SmoothScrollProvider>
  )
}
```

## 6. Customization Examples

### Adjust Pin Duration
```tsx
scrollTrigger: {
  end: '+=200%',  // Pin for longer (200% viewport height)
}
```

### Increase Blur Effect
```tsx
tl.to(beforeColRef.current, {
  filter: 'blur(8px)',  // More intense blur
  opacity: 0.3,         // Fade more
})
```

### Add Scale Animation to Progress Bar
```tsx
tl.to(progressRef.current, {
  scaleY: 1,
  width: '4px',  // Make progress bar thicker
  ease: 'power2.out'
})
```

### Add Card Stagger on Scroll
```tsx
// Animate cards individually with stagger
tl.to(beforeColRef.current.children, {
  opacity: 0.3,
  scale: 0.98,
  stagger: 0.1,  // 0.1s delay between each card
}, 0)
```

## 7. Accessibility Pattern

```tsx
const prefersReducedMotion = useReducedMotion()

useGSAP(() => {
  if (prefersReducedMotion || !containerRef.current) return
  // Animation code only runs if user doesn't prefer reduced motion
})
```

## 8. Responsive Pattern

```tsx
const mm = gsap.matchMedia()

// Desktop animations
mm.add('(min-width: 1024px)', () => {
  // Complex pinned scroll animations
})

// Mobile automatically gets simple layout (no animations)
```

## Key Features

1. **Client-side only**: Uses 'use client' directive
2. **Type-safe**: Full TypeScript support with proper ref types
3. **Accessible**: Respects prefers-reduced-motion
4. **Responsive**: Desktop pinning, mobile stacking
5. **Performant**: Desktop-only animations, GPU-accelerated transforms
6. **Clean**: useGSAP handles all cleanup automatically
