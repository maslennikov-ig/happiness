# Implementation Plan: Happiness Landing Page

**Branch**: `001-happiness-landing` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-happiness-landing/spec.md`

## Summary

Premium landing page for personal transformation coaching program with WOW-effect animations (GSAP + Motion), contact form to Telegram Bot API, and Cal.com booking integration. Target audience: successful entrepreneurs 35-50 years old seeking personal transformation.

## Technical Context

**Language/Version**: TypeScript 5.7+, React 19.x
**Framework**: Next.js 15.x (App Router, Turbopack)
**Primary Dependencies**: Tailwind CSS 4.x, GSAP 3.12+, Motion (ex-Framer Motion), Lenis 1.x, SplitType 0.3+
**Storage**: N/A (Telegram for form data, no database)
**Testing**: Vitest + Playwright (E2E)
**Target Platform**: Web (Modern browsers: Safari 16.4+, Chrome 111+, Firefox 128+)
**Project Type**: Web application (frontend only with API routes)
**Performance Goals**: LCP <2.5s, CLS <0.1, Lighthouse >90, 60fps animations
**Constraints**: Offline degradation (basic content without JS), prefers-reduced-motion support, 44px touch targets
**Scale/Scope**: Single page landing + /privacy page, ~7 sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Context-First Development | ✅ PASS | ТЗ и spec полностью изучены |
| II. Single Source of Truth | ✅ PASS | Types will be in src/types/, shared components in src/components/shared/ |
| III. Library-First Development | ✅ PASS | Using established libraries (GSAP, Motion, Lenis, SplitType) per ТЗ |
| IV. Code Reuse & DRY | ✅ PASS | Shared components (BrushStroke, ScrollReveal) planned |
| V. Strict Type Safety | ✅ PASS | TypeScript strict mode, Zod for form validation |
| VI. Atomic Task Execution | ✅ PASS | Tasks will be atomic (one section/component per task) |
| VII. Quality Gates | ✅ PASS | Type-check + build required before commit |
| VIII. Progressive Specification | ✅ PASS | Following Spec→Plan→Tasks→Implement flow |
| IX. Error Handling | ✅ PASS | Form errors typed, fallback Telegram link on API failure |
| X. Observability | ⚠️ N/A | Analytics out of scope for MVP |
| XI. Accessibility | ✅ PASS | WCAG AA, keyboard nav, reduced-motion, 44px touch targets |

**Security Requirements:**
- No hardcoded credentials: ✅ Env vars for TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
- Input validation: ✅ Zod schemas for form
- Rate limiting: ✅ 3 req/min per IP
- Honeypot: ✅ Anti-spam field

## Project Structure

### Documentation (this feature)

```text
specs/001-happiness-landing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx          # Root layout + fonts + Lenis provider
│   ├── page.tsx            # Main landing page
│   ├── privacy/
│   │   └── page.tsx        # Privacy policy page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts    # Telegram form submission endpoint
│   ├── globals.css         # Global styles + Tailwind
│   └── template.tsx        # AnimatePresence wrapper
├── components/
│   ├── ui/                 # Atoms (Motion-based)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Toggle.tsx
│   │   └── Input.tsx
│   ├── sections/           # Page sections (GSAP + Motion)
│   │   ├── Preloader.tsx
│   │   ├── Hero.tsx
│   │   ├── Philosophy.tsx
│   │   ├── Transformation.tsx
│   │   ├── Diagnostic.tsx
│   │   ├── Roadmap.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── shared/
│       ├── BrushStroke.tsx
│       ├── ScrollReveal.tsx
│       ├── SmoothScroll.tsx
│       ├── Header.tsx
│       ├── ScrollIndicator.tsx  # Bounce animation on Hero
│       └── BackToTop.tsx
├── hooks/
│   ├── use-initial-load.ts
│   ├── use-is-mobile.ts
│   ├── use-reduced-motion.ts
│   └── use-smooth-scroll.ts
├── lib/
│   ├── telegram.ts         # Telegram Bot API integration
│   ├── fonts.ts            # next/font configuration
│   ├── rate-limit.ts       # In-memory rate limiter
│   └── utils.ts            # cn() and helpers
├── animations/
│   ├── variants.ts         # Motion variants
│   └── timelines.ts        # GSAP timeline configs
├── types/
│   └── index.ts            # Shared TypeScript types
└── assets/
    └── svg/
        └── brush-strokes/  # Inline SVG brush strokes

public/
├── images/
│   ├── hero-author.jpg     # Author photo (placeholder → real)
│   └── og-image.jpg        # Social sharing image
├── fonts/                  # Fallback fonts (if needed)
├── favicon/                # Favicon set (16x16, 32x32, apple-touch-icon)
├── robots.txt              # SEO: crawling rules
└── sitemap.xml             # SEO: page index

tests/
├── e2e/
│   ├── landing.spec.ts     # Full page E2E tests
│   └── form.spec.ts        # Form submission tests
└── unit/
    ├── rate-limit.test.ts
    └── telegram.test.ts
```

**Structure Decision**: Next.js 15 App Router with colocated components. Sections in `components/sections/`, reusable atoms in `components/ui/`, shared layout components in `components/shared/`. All types centralized in `src/types/`.

## Complexity Tracking

> No Constitution violations. All principles satisfied.
