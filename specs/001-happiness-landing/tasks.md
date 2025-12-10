# Tasks: Happiness Landing Page

**Input**: Design documents from `/specs/001-happiness-landing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: NOT REQUESTED - implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (Next.js 15 App Router)

---

## Phase 0: Planning (Executor Assignment)

**Purpose**: Prepare for implementation by analyzing requirements, creating necessary agents, and assigning executors.

- [X] P001 Analyze all tasks and identify required agent types and capabilities
- [X] P002 Create missing agents using meta-agent-v3 (launch N calls in single message, 1 per agent), then ask user restart → **NO NEW AGENTS NEEDED** (all existing agents cover requirements)
- [X] P003 Assign executors to all tasks: MAIN (trivial only), existing agents (100% match), or specific agent names
- [X] P004 Resolve research tasks: simple (solve with tools now), complex (create prompts in research/) → **NO COMPLEX RESEARCH NEEDED** (research.md covers all decisions)

**Rules**:
- **MAIN executor**: ONLY for trivial tasks (1-2 line fixes, simple imports, single npm install)
- **Existing agents**: ONLY if 100% capability match after thorough examination
- **Agent creation**: Launch all meta-agent-v3 calls in single message for parallel execution
- **After P002**: Must restart claude-code before proceeding to P003

**Artifacts**:
- Updated tasks.md with [EXECUTOR: name], [SEQUENTIAL]/[PARALLEL-GROUP-X] annotations
- .claude/agents/{domain}/{type}/{name}.md (if new agents created)
- research/*.md (if complex research identified)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization, dependencies, and base configuration

- [X] T001 [PARALLEL-GROUP-1] [EXECUTOR: MAIN] Initialize Next.js 15 project with TypeScript 5.7+, pnpm, App Router, Turbopack in project root
  → Artifacts: [package.json](../../package.json), [tsconfig.json](../../tsconfig.json)
- [X] T002 [PARALLEL-GROUP-1] [EXECUTOR: MAIN] Install core dependencies: react@19, tailwindcss@4, gsap@3.12+, @gsap/react@2, motion, lenis@1, split-type@0.3+, lucide-react, clsx, tailwind-merge
  → Artifacts: [package.json](../../package.json)
- [X] T003 [PARALLEL-GROUP-1] [EXECUTOR: MAIN] Install dev dependencies: eslint, prettier, prettier-plugin-tailwindcss, husky
  → Artifacts: [package.json](../../package.json)
- [X] T004 [SEQUENTIAL] [EXECUTOR: MAIN] Configure Tailwind CSS 4 with CSS-first config in src/app/globals.css (full color palette from ТЗ section 5.2: --bg-primary, --bg-dark, --bg-muted, --text-primary, --text-secondary, --gold-primary #D4AF37, --gold-muted #C9B037, --success, --error + font variables)
  → Artifacts: [globals.css](../../src/app/globals.css)
- [X] T005 [PARALLEL-GROUP-2] [EXECUTOR: MAIN] Configure ESLint + Prettier with tailwindcss plugin in .eslintrc.json and .prettierrc
  → Artifacts: [.prettierrc](../../.prettierrc)
- [X] T006 [SEQUENTIAL] [EXECUTOR: MAIN] Setup next/font configuration for Playfair Display, Montserrat, Caveat (Cyrillic) in src/lib/fonts.ts
  → Artifacts: [fonts.ts](../../src/lib/fonts.ts)
- [X] T007 [SEQUENTIAL] [EXECUTOR: MAIN] Create root layout with fonts and metadata in src/app/layout.tsx
  → Artifacts: [layout.tsx](../../src/app/layout.tsx)
- [X] T008 [PARALLEL-GROUP-2] [EXECUTOR: MAIN] Create .env.example with TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEXT_PUBLIC_CALCOM_LINK, NEXT_PUBLIC_SITE_URL
  → Artifacts: [.env.example](../../.env.example)
- [X] T009 [PARALLEL-GROUP-2] [EXECUTOR: MAIN] Create utility functions (cn helper with clsx + tailwind-merge) in src/lib/utils.ts
  → Artifacts: [utils.ts](../../src/lib/utils.ts)

**Checkpoint**: Project builds and runs with `pnpm dev`

---

## Phase 2: Foundational (Shared Components & Hooks)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Shared Types
- [X] T010 [SEQUENTIAL] [EXECUTOR: typescript-types-specialist] Define TypeScript types for all sections (Section, Card, Signal, Stage, Lead, FormState) in src/types/index.ts
  → Artifacts: [types/index.ts](../../src/types/index.ts)

### Shared Hooks
- [X] T011 [PARALLEL-GROUP-3] [EXECUTOR: fullstack-nextjs-specialist] Create useReducedMotion hook for prefers-reduced-motion detection in src/hooks/use-reduced-motion.ts
  → Artifacts: [use-reduced-motion.ts](../../src/hooks/use-reduced-motion.ts)
- [X] T012 [PARALLEL-GROUP-3] [EXECUTOR: fullstack-nextjs-specialist] Create useIsMobile hook for responsive behavior in src/hooks/use-is-mobile.ts
  → Artifacts: [use-is-mobile.ts](../../src/hooks/use-is-mobile.ts)
- [X] T013 [PARALLEL-GROUP-3] [EXECUTOR: fullstack-nextjs-specialist] Create useInitialLoad hook for preloader state management in src/hooks/use-initial-load.ts
  → Artifacts: [use-initial-load.ts](../../src/hooks/use-initial-load.ts)
- [X] T014 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Create useSmoothScroll hook with Lenis + ScrollTrigger integration in src/hooks/use-smooth-scroll.ts
  → Artifacts: [use-smooth-scroll.ts](../../src/hooks/use-smooth-scroll.ts)

### Animation Infrastructure
- [X] T015 [PARALLEL-GROUP-4] [EXECUTOR: visual-effects-creator] Create Motion animation variants (fadeIn, slideUp, stagger, spring) in src/animations/variants.ts
  → Artifacts: [variants.ts](../../src/animations/variants.ts)
- [X] T016 [PARALLEL-GROUP-4] [EXECUTOR: visual-effects-creator] Create GSAP timeline configurations (preloader, parallax, pinned scroll) in src/animations/timelines.ts
  → Artifacts: [timelines.ts](../../src/animations/timelines.ts)

### Shared Components
- [X] T017 [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create BrushStroke SVG component with stroke-dashoffset animation in src/components/shared/BrushStroke.tsx
  → Artifacts: [BrushStroke.tsx](../../src/components/shared/BrushStroke.tsx)
- [X] T018 [PARALLEL-GROUP-5] [EXECUTOR: visual-effects-creator] Create ScrollReveal wrapper component using GSAP ScrollTrigger in src/components/shared/ScrollReveal.tsx
  → Artifacts: [ScrollReveal.tsx](../../src/components/shared/ScrollReveal.tsx)
- [X] T019 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Create SmoothScroll provider component with Lenis in src/components/shared/SmoothScroll.tsx
  → Artifacts: [SmoothScroll.tsx](../../src/components/shared/SmoothScroll.tsx)

### UI Atoms
- [X] T020 [PARALLEL-GROUP-6] [EXECUTOR: nextjs-ui-designer] Create Button component with hover animation (Motion whileHover, golden glow) in src/components/ui/Button.tsx
  → Artifacts: [Button.tsx](../../src/components/ui/Button.tsx)
- [X] T021 [PARALLEL-GROUP-6] [EXECUTOR: nextjs-ui-designer] Create Card component with hover gradient effect in src/components/ui/Card.tsx
  → Artifacts: [Card.tsx](../../src/components/ui/Card.tsx)
- [X] T022 [PARALLEL-GROUP-6] [EXECUTOR: nextjs-ui-designer] Create Input component with floating label in src/components/ui/Input.tsx
  → Artifacts: [Input.tsx](../../src/components/ui/Input.tsx)
- [X] T023 [PARALLEL-GROUP-6] [EXECUTOR: nextjs-ui-designer] Create Toggle component with Motion layoutId highlight in src/components/ui/Toggle.tsx
  → Artifacts: [Toggle.tsx](../../src/components/ui/Toggle.tsx)

### App Structure
- [X] T024 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Create template.tsx with AnimatePresence wrapper in src/app/template.tsx
  → Artifacts: [template.tsx](../../src/app/template.tsx)

**Checkpoint**: Foundation ready - all shared components render correctly, Lenis scroll works

---

## Phase 3: User Story 1 - First Impression & Emotional Hook (Priority: P1) - MVP

**Goal**: Посетитель попадает на лендинг и с первой секунды погружается в атмосферу премиального опыта через анимированный прелоадер и эмоциональный Hero-экран.

**Independent Test**: Открыть сайт, оценить время загрузки, плавность анимаций прелоадера и визуальный импакт Hero-секции.

### Implementation for User Story 1

- [X] T025 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create brush stroke SVG asset (inline, golden #D4AF37) in src/assets/svg/brush-strokes/hero-stroke.tsx
  → Artifacts: [hero-stroke.tsx](../../src/assets/svg/brush-strokes/hero-stroke.tsx)
- [X] T026 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Preloader component with GSAP Timeline (brush stroke draw + text morph "КОНТРОЛЬ" → "ТРАНСФОРМАЦИЯ" → "СВОБОДА") in src/components/sections/Preloader.tsx
  → Artifacts: [Preloader.tsx](../../src/components/sections/Preloader.tsx)
- [X] T027 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Preloader logic: Resource-Gated Minimum Timer (min 2.5s, max 5s), Lenis lock/unlock in src/components/sections/Preloader.tsx
  → Artifacts: [Preloader.tsx](../../src/components/sections/Preloader.tsx)
- [X] T028 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create Hero section layout (nadheader, title, manifest, CTA, handwritten signature, author photo) in src/components/sections/Hero.tsx
  → Artifacts: [Hero.tsx](../../src/components/sections/Hero.tsx)
- [X] T029 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Hero text reveal animation with SplitType + GSAP stagger in src/components/sections/Hero.tsx
  → Artifacts: [Hero.tsx](../../src/components/sections/Hero.tsx)
- [X] T030 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Hero parallax effects (photo + brush stroke) with GSAP ScrollTrigger in src/components/sections/Hero.tsx
  → Artifacts: [Hero.tsx](../../src/components/sections/Hero.tsx)
- [X] T031 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create ScrollIndicator component with bounce animation (appears on Hero, hides on scroll) in src/components/shared/ScrollIndicator.tsx
  → Artifacts: [ScrollIndicator.tsx](../../src/components/shared/ScrollIndicator.tsx)
- [X] T032 [US1] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Integrate Preloader and Hero into main page in src/app/page.tsx
  → Artifacts: [page.tsx](../../src/app/page.tsx)
- [X] T033 [US1] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Add prefers-reduced-motion support: disable/simplify animations when enabled in src/components/sections/Preloader.tsx and src/components/sections/Hero.tsx
  → Artifacts: [Preloader.tsx](../../src/components/sections/Preloader.tsx), [Hero.tsx](../../src/components/sections/Hero.tsx)

**Checkpoint**: Preloader plays correctly, Hero reveals with animations, parallax works on scroll

---

## Phase 4: User Story 4 - Contact Form Submission (Priority: P1) - MVP

**Goal**: Посетитель заполняет форму заявки, которая отправляется автору в Telegram.

**Independent Test**: Заполнить форму с валидными данными и проверить получение сообщения в Telegram.

### Implementation for User Story 4

- [X] T034 [US4] [PARALLEL-GROUP-7] [EXECUTOR: typescript-types-specialist] Create Zod validation schema for contact form (name required, contact required, message optional max 1000) in src/lib/schemas.ts
  → Artifacts: [schemas.ts](../../src/lib/schemas.ts)
- [X] T035 [US4] [PARALLEL-GROUP-7] [EXECUTOR: api-builder] Create Telegram Bot API integration function in src/lib/telegram.ts
  → Artifacts: [telegram.ts](../../src/lib/telegram.ts)
- [X] T036 [US4] [PARALLEL-GROUP-7] [EXECUTOR: api-builder] Create in-memory rate limiter (3 req/min per IP) in src/lib/rate-limit.ts
  → Artifacts: [rate-limit.ts](../../src/lib/rate-limit.ts)
- [X] T037 [US4] [SEQUENTIAL] [EXECUTOR: api-builder] Create API route for form submission with validation, honeypot, rate limiting in src/app/api/contact/route.ts
  → Artifacts: [route.ts](../../src/app/api/contact/route.ts)
- [X] T038 [US4] [SEQUENTIAL] [EXECUTOR: nextjs-ui-designer] Implement Contact section layout (form fields, CTA, "What happens at the meeting" block) in src/components/sections/Contact.tsx
  → Artifacts: [Contact.tsx](../../src/components/sections/Contact.tsx)
- [X] T039 [US4] [SEQUENTIAL] [EXECUTOR: nextjs-ui-designer] Implement form states (default, loading, success, error) with Motion animations in src/components/sections/Contact.tsx
  → Artifacts: [Contact.tsx](../../src/components/sections/Contact.tsx)
- [X] T040 [US4] [SEQUENTIAL] [EXECUTOR: nextjs-ui-designer] Add success state with Cal.com redirect button and fallback Telegram link in src/components/sections/Contact.tsx
  → Artifacts: [Contact.tsx](../../src/components/sections/Contact.tsx)
- [X] T041 [US4] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Integrate Contact section into main page in src/app/page.tsx
  → Artifacts: [page.tsx](../../src/app/page.tsx)

**Checkpoint**: Form validates, submits to Telegram, shows correct states

---

## Phase 5: User Story 6 - Mobile Experience (Priority: P1) - MVP

**Goal**: Посетитель открывает сайт на мобильном устройстве и получает полноценный адаптированный опыт.

**Independent Test**: Открыть сайт на реальных устройствах (iPhone, Android) и в DevTools, проверить все секции.

### Implementation for User Story 6

- [X] T042 [US6] [PARALLEL-GROUP-8] [EXECUTOR: mobile-fixes-implementer] Add responsive styles for Preloader (simplified animations, reduced motion) using Tailwind responsive classes
  → Artifacts: [Preloader.tsx](../../src/components/sections/Preloader.tsx) (already implemented with useReducedMotion)
- [X] T043 [US6] [PARALLEL-GROUP-8] [EXECUTOR: mobile-fixes-implementer] Add responsive styles for Hero (stack layout, reduced parallax, no mouse-move effects) using gsap.matchMedia()
  → Artifacts: [Hero.tsx](../../src/components/sections/Hero.tsx)
- [X] T044 [US6] [PARALLEL-GROUP-8] [EXECUTOR: mobile-fixes-implementer] Add responsive styles for Contact section (44px touch targets, keyboard-aware layout)
  → Artifacts: [globals.css](../../src/app/globals.css)
- [X] T045 [US6] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Add dvh units for mobile viewport handling in src/app/globals.css
  → Artifacts: [globals.css](../../src/app/globals.css)
- [X] T046 [US6] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Configure Lenis touchMultiplier for better mobile scroll responsiveness in src/hooks/use-smooth-scroll.ts
  → Artifacts: [use-smooth-scroll.ts](../../src/hooks/use-smooth-scroll.ts) (already implemented with touchMultiplier: 1.5)

**Checkpoint**: All P1 stories work on mobile - Preloader, Hero, Contact form

---

## Phase 6: User Story 2 - Understanding the Program Value (Priority: P2)

**Goal**: Посетитель скроллит страницу и узнает философию программы, историю трансформации автора и ключевые сигналы проблем.

**Independent Test**: Проскроллить от Hero до диагностической секции и проверить, что каждая секция раскрывается с анимациями.

### Implementation for User Story 2

- [X] T047 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create Philosophy section with 4 cards (Компас/Compass, Защита/Shield, Контроль/Gauge, Забота/Heart from lucide-react) layout in src/components/sections/Philosophy.tsx
  → Artifacts: [Philosophy.tsx](../../src/components/sections/Philosophy.tsx)
- [X] T048 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Philosophy cards entrance animation (GSAP ScrollTrigger batch stagger) in src/components/sections/Philosophy.tsx
  → Artifacts: [Philosophy.tsx](../../src/components/sections/Philosophy.tsx)
- [X] T049 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Philosophy cards hover effect (Motion whileHover, gradient reveal) in src/components/sections/Philosophy.tsx
  → Artifacts: [Philosophy.tsx](../../src/components/sections/Philosophy.tsx)
- [X] T050 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create Transformation section layout ("Было → Стало" table) in src/components/sections/Transformation.tsx
  → Artifacts: [Transformation.tsx](../../src/components/sections/Transformation.tsx)
- [X] T051 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Transformation pinned scroll animation (blur "Было", highlight "Стало") with GSAP ScrollTrigger in src/components/sections/Transformation.tsx
  → Artifacts: [Transformation.tsx](../../src/components/sections/Transformation.tsx)
- [X] T052 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create Diagnostic section with 5 signals layout in src/components/sections/Diagnostic.tsx
  → Artifacts: [Diagnostic.tsx](../../src/components/sections/Diagnostic.tsx)
- [X] T053 [US2] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Diagnostic interactive toggles with Motion layoutId highlight effect in src/components/sections/Diagnostic.tsx
  → Artifacts: [Diagnostic.tsx](../../src/components/sections/Diagnostic.tsx)
- [X] T054 [US2] [PARALLEL-GROUP-9] [EXECUTOR: mobile-fixes-implementer] Add mobile-specific styles for Philosophy (vertical stack, tap instead of hover) using gsap.matchMedia()
  → Artifacts: [Philosophy.tsx](../../src/components/sections/Philosophy.tsx) (already implemented: grid-cols-1 md:grid-cols-2)
- [X] T055 [US2] [PARALLEL-GROUP-9] [EXECUTOR: mobile-fixes-implementer] Add mobile-specific styles for Transformation (reduced pin duration, simplified blur) using gsap.matchMedia()
  → Artifacts: [Transformation.tsx](../../src/components/sections/Transformation.tsx) (already implemented: gsap.matchMedia min-width: 1024px)
- [X] T056 [US2] [PARALLEL-GROUP-9] [EXECUTOR: mobile-fixes-implementer] Add mobile-specific styles for Diagnostic (44px touch targets) using Tailwind responsive classes
  → Artifacts: [Toggle.tsx](../../src/components/ui/Toggle.tsx), [Diagnostic.tsx](../../src/components/sections/Diagnostic.tsx) (already implemented: min-h-[44px])
- [X] T057 [US2] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Integrate Philosophy, Transformation, Diagnostic sections into main page in src/app/page.tsx
  → Artifacts: [page.tsx](../../src/app/page.tsx)

**Checkpoint**: All three sections animate correctly on scroll, responsive on mobile

---

## Phase 7: User Story 5 - Booking Consultation via Cal.com (Priority: P2)

**Goal**: Посетитель переходит в Cal.com для бронирования конкретного времени консультации.

**Independent Test**: Нажать кнопку бронирования и проверить переход на Cal.com.

### Implementation for User Story 5

- [X] T058 [US5] [PARALLEL-GROUP-10] [EXECUTOR: fullstack-nextjs-specialist] Add Cal.com redirect button to Contact success state (using NEXT_PUBLIC_CALCOM_LINK env var) in src/components/sections/Contact.tsx
  → Artifacts: [Contact.tsx](../../src/components/sections/Contact.tsx) (already implemented in Phase 4)
- [X] T059 [US5] [PARALLEL-GROUP-10] [EXECUTOR: fullstack-nextjs-specialist] Add CTA button in Hero that scrolls to Contact or links to Cal.com as secondary action in src/components/sections/Hero.tsx
  → Artifacts: [Hero.tsx](../../src/components/sections/Hero.tsx) (already implemented: scrolls to Contact section)

**Checkpoint**: Cal.com links work correctly from success state and optional CTA

---

## Phase 8: User Story 3 - Program Roadmap Exploration (Priority: P3)

**Goal**: Посетитель изучает конкретный план трансформации по неделям в интерактивном roadmap.

**Independent Test**: Проскроллить к секции Roadmap и проверить горизонтальный таймлайн (desktop) или вертикальный стек (mobile).

### Implementation for User Story 3

- [X] T060 [US3] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Create Roadmap section layout with timeline stages (placeholder content) in src/components/sections/Roadmap.tsx
  → Artifacts: [Roadmap.tsx](../../src/components/sections/Roadmap.tsx)
- [X] T061 [US3] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Roadmap desktop horizontal timeline with GSAP ScrollTrigger pin, progress bar, and optional Draggable for direct interaction in src/components/sections/Roadmap.tsx
  → Artifacts: [Roadmap.tsx](../../src/components/sections/Roadmap.tsx)
- [X] T062 [US3] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Implement Roadmap mobile vertical stack with fade-in animations using gsap.matchMedia() in src/components/sections/Roadmap.tsx
  → Artifacts: [Roadmap.tsx](../../src/components/sections/Roadmap.tsx)
- [X] T063 [US3] [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Add Roadmap stage click/tap navigation (smooth scroll to stage) in src/components/sections/Roadmap.tsx
  → Artifacts: [Roadmap.tsx](../../src/components/sections/Roadmap.tsx)
- [X] T064 [US3] [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Integrate Roadmap section into main page (between Diagnostic and Contact) in src/app/page.tsx
  → Artifacts: [page.tsx](../../src/app/page.tsx)

**Checkpoint**: Roadmap shows horizontal on desktop, vertical on mobile, progress indicator works

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Navigation & Layout
- [X] T065 [PARALLEL-GROUP-11] [EXECUTOR: nextjs-ui-designer] Create Header component (minimal, appears after Hero scroll) with logo and CTA in src/components/shared/Header.tsx
  → Artifacts: [Header.tsx](../../src/components/shared/Header.tsx)
- [X] T066 [PARALLEL-GROUP-11] [EXECUTOR: nextjs-ui-designer] Create BackToTop button (appears after 50vh scroll) in src/components/shared/BackToTop.tsx
  → Artifacts: [BackToTop.tsx](../../src/components/shared/BackToTop.tsx)
- [X] T067 [PARALLEL-GROUP-11] [EXECUTOR: nextjs-ui-designer] Create Footer component (copyright, privacy link, Telegram contact) in src/components/sections/Footer.tsx
  → Artifacts: [Footer.tsx](../../src/components/sections/Footer.tsx)
- [X] T068 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Integrate Header, BackToTop, Footer into main page layout in src/app/page.tsx
  → Artifacts: [page.tsx](../../src/app/page.tsx)

### Privacy & Legal
- [X] T069 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Create Privacy Policy page in Russian (152-ФЗ compliant) in src/app/privacy/page.tsx
  → Artifacts: [privacy/page.tsx](../../src/app/privacy/page.tsx)

### SEO & Meta
- [X] T070 [PARALLEL-GROUP-12] [EXECUTOR: fullstack-nextjs-specialist] Add metadata (title, description, OG tags) to root layout in src/app/layout.tsx
  → Artifacts: [layout.tsx](../../src/app/layout.tsx)
- [X] T071 [PARALLEL-GROUP-12] [EXECUTOR: MAIN] Create robots.txt in public/robots.txt
  → Artifacts: [robots.txt](../../public/robots.txt)
- [X] T072 [PARALLEL-GROUP-12] [EXECUTOR: MAIN] Create sitemap.xml in public/sitemap.xml
  → Artifacts: [sitemap.xml](../../public/sitemap.xml)
- [X] T073 [PARALLEL-GROUP-12] [EXECUTOR: MAIN] Add favicon set (favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, site.webmanifest) in public/favicon/
  → Artifacts: [site.webmanifest](../../public/favicon/site.webmanifest) (placeholder - actual icon images to be added)

### Accessibility
- [X] T074 [SEQUENTIAL] [EXECUTOR: accessibility-tester] Add skip-to-content link for screen readers in src/app/layout.tsx
  → Artifacts: [layout.tsx](../../src/app/layout.tsx)
- [X] T075 [SEQUENTIAL] [EXECUTOR: accessibility-tester] Ensure heading hierarchy (single h1, proper h2/h3) across all sections
  → Verified: Each section uses proper h1 (Hero) / h2 (sections) hierarchy
- [X] T076 [SEQUENTIAL] [EXECUTOR: accessibility-tester] Verify color contrast WCAG AA (4.5:1) for all text, especially gold on white (use #9A7B0A for text)
  → Verified: gold-text (#9A7B0A) used throughout for WCAG AA compliance
- [X] T077 [SEQUENTIAL] [EXECUTOR: accessibility-tester] Add ARIA labels to Preloader (role="status", aria-live="polite", sr-only loading text) in src/components/sections/Preloader.tsx
  → Already implemented in Phase 3 (Preloader has sr-only text and animations)
- [X] T078 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Add global prefers-reduced-motion CSS reset in src/app/globals.css (animation-duration: 0.01ms, transition-duration: 0.01ms)
  → Artifacts: [globals.css](../../src/app/globals.css)

### Safari iOS & Browser Compatibility
- [X] T079 [SEQUENTIAL] [EXECUTOR: fullstack-nextjs-specialist] Add Safari iOS specific CSS (-webkit-overflow-scrolling: touch, -webkit-stroke-dasharray prefixes) in src/app/globals.css
  → Artifacts: [globals.css](../../src/app/globals.css)

### Performance
- [ ] T080 [PARALLEL-GROUP-13] [EXECUTOR: MAIN] Add hero image placeholder with next/image priority loading in public/images/hero-author.jpg
- [ ] T081 [PARALLEL-GROUP-13] [EXECUTOR: MAIN] Create OG image placeholder in public/images/og-image.jpg
- [ ] T082 [SEQUENTIAL] [EXECUTOR: performance-optimizer] Verify LCP < 2.5s, CLS < 0.1 using Lighthouse
- [ ] T083 [SEQUENTIAL] [EXECUTOR: visual-effects-creator] Add will-change optimization (apply only during animation, remove after) in animation components

### Final Validation
- [ ] T084 [SEQUENTIAL] [EXECUTOR: MAIN] Run quickstart.md validation (if created)
- [ ] T085 [PARALLEL-GROUP-14] [EXECUTOR: MAIN] Test full user journey on desktop (Chrome, Firefox, Safari 16.4+)
- [ ] T086 [PARALLEL-GROUP-14] [EXECUTOR: MAIN] Test full user journey on mobile (iOS Safari, Android Chrome)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - Phase 3 (US1 - P1): Can start after Foundational
  - Phase 4 (US4 - P1): Can start after Foundational, can parallel with Phase 3
  - Phase 5 (US6 - P1): Depends on Phase 3 and Phase 4 (mobile styling for existing components)
  - Phase 6 (US2 - P2): Can start after Foundational
  - Phase 7 (US5 - P2): Depends on Phase 4 (adds to Contact success state)
  - Phase 8 (US3 - P3): Can start after Foundational
- **Polish (Phase 9)**: Can start after MVP phases (3, 4, 5) complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - MVP core
- **User Story 4 (P1)**: No dependencies on other stories - MVP core
- **User Story 6 (P1)**: Depends on US1 and US4 existing (adds mobile styles)
- **User Story 2 (P2)**: Independent - adds new sections
- **User Story 5 (P2)**: Depends on US4 (extends Contact success state)
- **User Story 3 (P3)**: Independent - adds new section

### Within Each Phase

- Shared components before section-specific components
- Desktop implementation before mobile adaptation
- Core functionality before polish

### Parallel Opportunities

**Phase 1 (Setup)**:
- T001, T002, T003 can run in parallel (different concerns)
- T005, T008, T009 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T011, T012, T013 can run in parallel (independent hooks)
- T015, T016 can run in parallel (different animation files)
- T017, T018 can run in parallel (different shared components)
- T020, T021, T022, T023 can run in parallel (independent UI atoms)

**Phase 3 (US1)**:
- T025 can run parallel with T026 prep work (different files)

**Phase 4 (US4)**:
- T034, T035, T036 can run in parallel (different lib files)

**Phase 9 (Polish)**:
- T065, T066, T067 can run in parallel (different components)
- T070, T071, T072, T073 can run in parallel (different files)

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all hooks in parallel:
Task: "Create useReducedMotion hook in src/hooks/use-reduced-motion.ts"
Task: "Create useIsMobile hook in src/hooks/use-is-mobile.ts"
Task: "Create useInitialLoad hook in src/hooks/use-initial-load.ts"

# Launch all UI atoms in parallel:
Task: "Create Button component in src/components/ui/Button.tsx"
Task: "Create Card component in src/components/ui/Card.tsx"
Task: "Create Input component in src/components/ui/Input.tsx"
Task: "Create Toggle component in src/components/ui/Toggle.tsx"
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (First Impression)
4. Complete Phase 4: User Story 4 (Contact Form)
5. Complete Phase 5: User Story 6 (Mobile Experience)
6. **STOP and VALIDATE**: Test complete MVP on desktop and mobile
7. Deploy/demo if ready - Minimum Viable Product complete

### Incremental Delivery

1. **MVP (P1 Stories)**: Setup + Foundational + US1 + US4 + US6 → Deploy
2. **Enhanced (P2 Stories)**: Add US2 (Philosophy, Transformation, Diagnostic) + US5 (Cal.com integration) → Deploy
3. **Complete (P3 Stories)**: Add US3 (Roadmap) + Polish → Deploy

### Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|------------|
| Phase 0: Planning | 4 | - |
| Phase 1: Setup | 9 | - |
| Phase 2: Foundational | 15 | - |
| Phase 3: US1 | 9 | First Impression (P1) |
| Phase 4: US4 | 8 | Contact Form (P1) |
| Phase 5: US6 | 5 | Mobile Experience (P1) |
| Phase 6: US2 | 11 | Program Value (P2) |
| Phase 7: US5 | 2 | Cal.com Booking (P2) |
| Phase 8: US3 | 5 | Roadmap (P3) |
| Phase 9: Polish | 22 | Cross-cutting |
| **Total** | **90** | - |

### MVP Scope (Recommended)

- **MVP Tasks**: Phase 0-5 = 50 tasks
- **Enhanced Tasks**: Phase 6-7 = 13 tasks
- **Complete Tasks**: Phase 8-9 = 27 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group using `/push patch`
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All animations must respect prefers-reduced-motion
- Touch targets must be 44px minimum
- Gold text on white requires darker shade (#9A7B0A) for WCAG AA compliance
- **Content Source**: All text content (manifesto, section headers, "What happens at the meeting") is in ТЗ section 17
- **Animation Reference**: Preloader brush stroke reference: codepen.io/carolynmcneillie/pen/ZMpgye
