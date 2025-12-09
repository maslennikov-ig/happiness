# Preloader Component

## Overview

The `Preloader` component provides an animated loading screen with brush stroke animation and morphing text sequence. It integrates with Lenis smooth scroll to lock/unlock scrolling during the animation.

**Location**: `/home/me/code/happiness/src/components/sections/Preloader.tsx`

## Features

- **Brush Stroke Animation**: Animated SVG brush stroke that draws from left to right (1.2s)
- **Text Morphing**: Cycles through three Russian words with smooth fade transitions:
  - КОНТРОЛЬ (Control)
  - ТРАНСФОРМАЦИЯ (Transformation)
  - СВОБОДА (Freedom)
- **Resource-Gated Timer**: Minimum 2500ms display, maximum 5000ms safety timeout
- **Scroll Locking**: Integrates with Lenis smooth scroll context to lock/unlock scrolling
- **Reduced Motion Support**: Simplified experience for users who prefer reduced motion
- **Accessibility**: Proper ARIA attributes and screen reader support

## Animation Sequence

1. Lock Lenis scroll (via `useSmoothScrollContext().stop()`)
2. Brush stroke draws over 1.2s
3. First word (КОНТРОЛЬ) appears during brush animation
4. Fade to second word (ТРАНСФОРМАЦИЯ) with 0.6s transition
5. Fade to third word (СВОБОДА) with 0.6s transition
6. Hold final word for 0.3s
7. Fade out entire preloader (0.5s)
8. Unlock Lenis scroll (via `start()`)
9. Call `onComplete` callback
10. Remove component from DOM

## Props

```typescript
interface PreloaderProps {
  /** Callback fired when preloader animation completes and fades out */
  onComplete?: () => void
}
```

## Usage

### Basic Setup

The Preloader requires `SmoothScrollProvider` to be set up in your layout:

```tsx
// app/layout.tsx
'use client'

import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
```

### Simple Integration

```tsx
'use client'

import { useState } from 'react'
import { Preloader } from '@/components/sections/Preloader'

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true)

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      <main>
        {/* Your page content */}
      </main>
    </>
  )
}
```

### Advanced Integration (Session Storage)

Only show preloader on first visit:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Preloader } from '@/components/sections/Preloader'

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(false)

  useEffect(() => {
    // Check if user has seen preloader this session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader')

    if (!hasSeenPreloader) {
      setShowPreloader(true)
    }
  }, [])

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('hasSeenPreloader', 'true')
    setShowPreloader(false)
  }

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <main>
        {/* Your page content */}
      </main>
    </>
  )
}
```

## Configuration

### Timing Constants

Adjust timing in the component source:

```typescript
const MIN_DISPLAY_TIME = 2500  // Minimum display time in ms
const MAX_DISPLAY_TIME = 5000  // Maximum display time (safety timeout)
```

### Text Sequence

Modify the words displayed:

```typescript
const WORDS = ['КОНТРОЛЬ', 'ТРАНСФОРМАЦИЯ', 'СВОБОДА'] as const
```

### Brush Stroke Style

Customize brush stroke appearance:

```tsx
<BrushStroke
  color="#D4AF37"      // Gold color
  strokeWidth={3}       // Thickness
  duration={1.2}        // Animation duration
/>
```

## Styling

The component uses Tailwind CSS classes and respects the design system:

- **Background**: `bg-bg-primary` (#fafaf9 - stone-50)
- **Text**: `font-display` (Playfair Display), `text-text-primary`
- **Brush Color**: #D4AF37 (Gold)

### Responsive Sizes

- Mobile: `text-3xl` (30px), `w-64` (256px brush width)
- Desktop: `text-4xl` (36px), `w-80` (320px brush width)

## Accessibility

### ARIA Attributes

```tsx
<div
  aria-live="polite"
  aria-busy="true"
  role="status"
>
  {/* ... */}
  <span className="sr-only">Загрузка...</span>
</div>
```

### Reduced Motion

When `prefers-reduced-motion: reduce` is detected:

- Skips brush stroke animation
- Shows only final word (СВОБОДА)
- Quick fade out after 1s
- Still respects minimum timer

## Performance

### Bundle Impact

- **GSAP**: Already in project dependencies
- **BrushStroke**: Reused component, minimal overhead
- **Component Size**: ~5KB minified

### Animation Performance

- Uses GSAP for timeline orchestration
- CSS opacity/transform for smooth 60fps animations
- GPU-accelerated where possible
- Cleanup via `useGSAP` hook prevents memory leaks

### Safety Features

1. **Maximum Timeout**: Forces completion at 5000ms if animation hangs
2. **Minimum Timer**: Ensures smooth experience (no flash)
3. **Scroll Lock**: Prevents awkward scroll states during animation
4. **Cleanup**: Proper useEffect cleanup for scroll lock

## Integration with Other Components

### BrushStroke Component

The Preloader uses the shared `BrushStroke` component:

```tsx
import { BrushStroke } from '@/components/shared/BrushStroke'
```

**BrushStroke Features**:
- forwardRef for GSAP control
- Built-in stroke-dashoffset animation
- Configurable duration, delay, color
- onAnimationComplete callback

### SmoothScroll Context

Required for scroll locking:

```tsx
import { useSmoothScrollContext } from '@/components/shared/SmoothScroll'

const { stop, start } = useSmoothScrollContext()

// Lock scroll
stop()

// Unlock scroll
start()
```

## Troubleshooting

### Preloader Not Appearing

1. Ensure `SmoothScrollProvider` is set up in layout
2. Check that component is rendered conditionally
3. Verify state management (useState/useEffect)

### Scroll Not Locking

1. Confirm `SmoothScrollProvider` wraps the app
2. Check browser console for context errors
3. Verify Lenis is initialized properly

### Animation Issues

1. Check `prefers-reduced-motion` setting in browser
2. Verify GSAP is installed and imported
3. Look for console errors during animation
4. Check that refs are properly attached

### Text Not Changing

1. Inspect `currentWord` state in React DevTools
2. Check GSAP timeline timing
3. Verify text array is correct

## Example: Full Integration

```tsx
// app/providers.tsx
'use client'

import { SmoothScrollProvider } from '@/components/shared/SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      {children}
    </SmoothScrollProvider>
  )
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Preloader } from '@/components/sections/Preloader'

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader')
    if (!hasSeenPreloader) {
      setShowPreloader(true)
    }
  }, [])

  const handleComplete = () => {
    sessionStorage.setItem('hasSeenPreloader', 'true')
    setShowPreloader(false)
  }

  // Avoid hydration mismatch
  if (!mounted) return null

  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}

      <main className="min-h-screen">
        <section className="h-screen flex items-center justify-center">
          <h1 className="font-display text-6xl">Счастье как навык</h1>
        </section>
      </main>
    </>
  )
}
```

## Related Documentation

- [BrushStroke Component](../shared/BRUSH_STROKE.md)
- [SmoothScroll Setup](../shared/SMOOTH_SCROLL.md)
- [GSAP Timelines](/home/me/code/happiness/src/animations/timelines.ts)
- [Animation Variants](/home/me/code/happiness/src/animations/variants.ts)
