# Quickstart: Happiness Landing Page

**Feature**: 001-happiness-landing
**Date**: 2025-12-09

## Prerequisites

- Node.js 20+ (LTS)
- pnpm 9+
- Telegram Bot token and chat_id
- Cal.com account with configured event

## Setup

### 1. Clone and Install

```bash
cd /home/me/code/happiness
pnpm install
```

### 2. Environment Variables

Create `.env.local` from template:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Telegram Bot (required)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id

# Cal.com (required)
NEXT_PUBLIC_CALCOM_LINK=https://cal.com/username/event

# Site URL (for OG tags)
NEXT_PUBLIC_SITE_URL=https://happiness.example.com
```

**Getting Telegram credentials:**
1. Message @BotFather → `/newbot` → get token
2. Message your bot, then visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find `chat.id` in the response

### 3. Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, Lenis)
│   ├── page.tsx            # Landing page
│   ├── privacy/page.tsx    # Privacy policy
│   └── api/contact/route.ts # Form submission endpoint
├── components/
│   ├── ui/                 # Reusable atoms (Button, Card, Input)
│   ├── sections/           # Page sections (Hero, Philosophy, etc.)
│   └── shared/             # Layout components (Header, Footer)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (telegram, fonts, rate-limit)
├── animations/             # GSAP timelines, Motion variants
└── types/                  # TypeScript definitions
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | TypeScript type checking |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm prepare` | Setup Husky git hooks |

## Development Guidelines

### Animation Libraries

**GSAP** (Director) - scroll animations, pinning:
```tsx
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useGSAP(() => {
  gsap.to('.element', {
    scrollTrigger: { trigger: '.element', pin: true }
  })
}, { scope: containerRef })
```

**Motion** (Actor) - interactions, hover states:
```tsx
import { motion } from 'motion/react'

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Smooth Scroll (Lenis + GSAP)

Already configured in `layout.tsx`. Access via hook:

```tsx
import { useLenis } from 'lenis/react'

const lenis = useLenis((lenis) => {
  // Called every scroll
})

// Lock scroll (e.g., during preloader)
lenis?.stop()
lenis?.start()
```

### Form Validation (Zod)

```tsx
import { leadSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const form = useForm({
  resolver: zodResolver(leadSchema)
})
```

### Responsive Animations

Use `gsap.matchMedia()`:

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    // Desktop only
  })

  mm.add('(max-width: 767px)', () => {
    // Mobile only
  })

  return () => mm.revert()
})
```

### Accessibility

Always check reduced motion:

```tsx
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
/>
```

## Testing Form Submission

1. Start dev server: `pnpm dev`
2. Fill contact form
3. Check Telegram for message
4. Test rate limiting (3 req/min max)
5. Test honeypot (hidden field)

## Deployment

### Docker (recommended)

```bash
docker build -t happiness .
docker run -p 3000:3000 --env-file .env.local happiness
```

### Manual

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Animations not working on mobile
- Check `gsap.matchMedia()` breakpoints
- Verify touch targets are 44px+
- Test with reduced-motion enabled

### Form not sending to Telegram
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- Check bot has permission to send messages
- Review API route logs

### Scroll issues
- Ensure Lenis is synced with GSAP ticker
- Check for conflicting scroll libraries
- Verify `autoRaf: false` in Lenis options

## Git Hooks (Husky)

Setup after install:
```bash
pnpm prepare
```

Pre-commit hook runs:
- `pnpm lint` - ESLint
- `pnpm type-check` - TypeScript

## SEO & Favicon

Generate favicon set via [RealFaviconGenerator](https://realfavicongenerator.net/):
- Upload logo/icon
- Download package
- Extract to `public/favicon/`

Required files:
- `favicon.ico` (16x16, 32x32)
- `apple-touch-icon.png` (180x180)
- `favicon-32x32.png`
- `favicon-16x16.png`
- `site.webmanifest`

## Resources

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger)
- [Motion (Framer Motion) Docs](https://motion.dev/docs)
- [Lenis Docs](https://github.com/darkroomengineering/lenis)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
