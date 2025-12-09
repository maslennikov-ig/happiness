# Research: Happiness Landing Page

**Date**: 2025-12-09
**Feature**: 001-happiness-landing

## Library Decisions

### Animation Libraries

#### GSAP 3.12+ (Director)

**Decision**: Use GSAP for scroll-triggered animations, pinning, and SVG animations
**Rationale**:
- Industry standard for complex scroll animations
- ScrollTrigger plugin provides pinning, scrub, and snap features required by spec
- SVG stroke-dashoffset animation for brush stroke preloader
- Excellent performance and browser support

**Key Patterns**:
```typescript
// ScrollTrigger with timeline and pinning
gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    pin: true,
    start: 'top top',
    end: '+=500',
    scrub: 1
  }
})

// @gsap/react integration
import { useGSAP } from '@gsap/react'

useGSAP(() => {
  gsap.to('.element', { x: 100 })
}, { scope: containerRef })
```

**Alternatives Rejected**:
- Locomotive Scroll: Less flexible pinning, larger bundle
- AOS: Too simple for complex scroll animations

---

#### Motion (ex-Framer Motion)

**Decision**: Use Motion for hover states, layout animations, and component transitions
**Rationale**:
- React-native integration with declarative API
- whileHover, whileTap, whileInView props match spec requirements
- layoutId for smooth shared element transitions
- AnimatePresence for exit animations

**Key Patterns**:
```tsx
// Import for Next.js App Router
import { motion, AnimatePresence } from 'motion/react'

// Gesture animations
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// Scroll-triggered with variants
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>

// Layout animations with shared elements
<AnimatePresence>
  {isOpen && <motion.div layoutId="modal" />}
</AnimatePresence>
```

**Alternatives Rejected**:
- React Spring: Less declarative, steeper learning curve
- Anime.js: Not React-focused

---

#### Lenis 1.x (Smooth Scroll)

**Decision**: Use Lenis for smooth scrolling with GSAP ScrollTrigger integration
**Rationale**:
- Lightweight and performant
- Official React package (lenis/react)
- Designed to work with GSAP ScrollTrigger
- Supports scroll locking for preloader

**Key Patterns**:
```tsx
// GSAP + Lenis integration
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'

function App() {
  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    // Sync with GSAP ticker
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => gsap.ticker.remove(update)
  }, [])

  return <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
}

// Lock scroll during preloader
lenisRef.current?.lenis?.stop()
lenisRef.current?.lenis?.start()
```

**Alternatives Rejected**:
- Locomotive Scroll: Heavier, more opinionated
- Native CSS scroll-behavior: Doesn't integrate with ScrollTrigger

---

#### SplitType 0.3+

**Decision**: Use SplitType for text splitting animations
**Rationale**:
- Free alternative to GSAP's SplitText plugin
- Works well with GSAP stagger animations
- Splits text into chars, words, lines

**Key Patterns**:
```typescript
import SplitType from 'split-type'

const split = new SplitType('.hero-text', { types: 'chars,words,lines' })
gsap.from(split.chars, {
  y: 100,
  opacity: 0,
  skewY: 7,
  stagger: 0.05,
  ease: 'power4.out'
})
```

---

### UI Libraries

#### Tailwind CSS 4.x

**Decision**: Use Tailwind CSS 4 with CSS-first configuration
**Rationale**:
- Latest version with improved performance
- CSS-first config (no tailwind.config.js needed for basics)
- Supports Cyrillic content well

**Key Changes in v4**:
```css
/* CSS-first configuration */
@import "tailwindcss";

@theme {
  --color-gold-primary: #D4AF37;
  --color-gold-muted: #C9B037;
  --font-family-display: 'Playfair Display', serif;
}

/* Important modifier at end */
.class { @apply flex!; } /* NOT !flex */

/* outline-hidden instead of outline-none */
.class { @apply outline-hidden; }
```

---

#### Lucide Icons

**Decision**: Use Lucide React for iconography
**Rationale**:
- MIT license, tree-shakeable
- Good icon selection for Philosophy cards
- TypeScript support

**Icons Mapping**:
- COMPASS: `<Compass />`
- SHIELD: `<Shield />`
- CONTROL: `<Gauge />` or `<Target />`
- CARE: `<Heart />` or `<HandHeart />`

---

### Form & Validation

#### Zod + React Hook Form

**Decision**: Zod for validation schemas, React Hook Form for form state
**Rationale**:
- Type-safe validation with TypeScript inference
- Server-side validation reuse
- Minimal re-renders with React Hook Form

**Schema**:
```typescript
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(100),
  contact: z.string().min(5, 'Введите телефон или Telegram'),
  message: z.string().max(1000, 'Максимум 1000 символов').optional(),
  website: z.string().max(0).optional() // honeypot
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

---

### Integrations

#### Telegram Bot API

**Decision**: Direct API call from Next.js API route
**Rationale**:
- No additional dependencies needed
- Simple sendMessage endpoint
- Bot token and chat_id from env vars

**Implementation**:
```typescript
// lib/telegram.ts
export async function sendToTelegram(data: ContactFormData) {
  const message = `
🆕 Новая заявка!

👤 Имя: ${data.name}
📱 Контакт: ${data.contact}
📝 О ситуации:
${data.message || 'Не указано'}

🕐 ${new Date().toLocaleString('ru-RU')}
  `

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    }
  )

  if (!response.ok) {
    throw new Error('Telegram API error')
  }

  return response.json()
}
```

---

#### Cal.com

**Decision**: Redirect to Cal.com (not embed)
**Rationale**:
- Simpler integration, no widget loading issues
- More reliable on mobile
- Easier maintenance

**Implementation**:
```typescript
const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK

// After form success, show button
<a href={CALCOM_LINK} target="_blank" rel="noopener noreferrer">
  Выбрать время встречи
</a>
```

---

## Technical Decisions

### Animation Architecture: Director & Actor Pattern

| Responsibility | Library | Use Cases |
|---------------|---------|-----------|
| Director (scroll control) | GSAP + ScrollTrigger | Pinning, scrub animations, timelines |
| Actor (interactions) | Motion | Hover, tap, layout, presence |

**Wrapper Pattern** to avoid conflicts:
```tsx
<div ref={gsapRef}>           {/* GSAP: scroll entrance */}
  <motion.div whileHover>     {/* Motion: interaction */}
    Content
  </motion.div>
</div>
```

---

### Responsive Animation Strategy

Using `gsap.matchMedia()` for responsive animations:

```typescript
useGSAP(() => {
  const mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    // Desktop: horizontal scroll with pin
    gsap.to('.roadmap', { xPercent: -100, scrollTrigger: { pin: true } })
  })

  mm.add('(max-width: 767px)', () => {
    // Mobile: vertical stack with fade-in
    gsap.from('.roadmap-item', { y: 50, opacity: 0, stagger: 0.1 })
  })

  return () => mm.revert()
})
```

---

### Performance Optimizations

1. **Font Loading**: `next/font` with `display: 'swap'`
2. **Hero Image**: `<Image priority loading="eager" />`
3. **Brush Strokes**: Inline SVG (not img tags)
4. **Cal.com**: Redirect (not embed) - no widget bundle
5. **Animations**: GPU-accelerated transforms only
6. **will-change Management**: Add before animation, remove after
   ```typescript
   // Add will-change before animation
   element.style.willChange = 'transform, opacity'

   // Remove after animation completes
   gsap.to(element, {
     onComplete: () => { element.style.willChange = 'auto' }
   })
   ```
7. **Core Web Vitals Targets**:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

### Accessibility

1. **Reduced Motion**:
```tsx
const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? {} : { y: 0 }}
/>
```

2. **Touch Targets**: Minimum 44px
3. **Color Contrast**: Text gold (#9A7B0A) instead of decorative gold (#D4AF37)
4. **Skip Link**: For screen readers
5. **Heading Hierarchy**: Single h1, semantic structure

---

---

### Mobile Viewport Units

**Decision**: Use `dvh` (dynamic viewport height) instead of `vh`
**Rationale**: Prevents "jumps" when iOS Safari address bar hides/shows

```css
/* Hero section full height */
.hero {
  min-height: 100dvh; /* NOT 100vh */
}

/* Fallback for older browsers */
@supports not (min-height: 100dvh) {
  .hero {
    min-height: 100vh;
  }
}
```

---

### Safari iOS Specifics

```css
/* Smooth scroll on iOS */
html {
  -webkit-overflow-scrolling: touch;
}

/* SVG animation prefixes */
.brush-stroke {
  -webkit-stroke-dasharray: 1800;
  -webkit-stroke-dashoffset: 1800;
  stroke-dasharray: 1800;
  stroke-dashoffset: 1800;
}
```

---

### Lenis Mobile Configuration

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 1.5, // Increased for mobile responsiveness (default: 1)
})
```

---

## Unknowns Resolved

| Unknown | Resolution |
|---------|------------|
| GSAP + Lenis conflict | Sync via gsap.ticker, disable autoRaf |
| Motion import path | Use `motion/react` for Next.js App Router |
| Tailwind 4 config | CSS-first with @theme directive |
| Form validation | Zod + React Hook Form, server-side revalidation |
| Cal.com integration | Redirect (not embed) for reliability |
| Reduced motion | useReducedMotion hook + conditional animations |
| Mobile viewport | Use dvh instead of vh for iOS |
| Safari animations | Add -webkit- prefixes for stroke properties |
| Mobile scroll feel | Lenis touchMultiplier: 1.5 |

---

## Dependencies Summary

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^11.0.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.0.0",
    "split-type": "^0.3.0",
    "lenis": "^1.0.0",
    "lucide-react": "^0.400.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "vitest": "^2.0.0",
    "@playwright/test": "^1.45.0"
  }
}
```
