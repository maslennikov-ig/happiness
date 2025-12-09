# Data Model: Happiness Landing Page

**Date**: 2025-12-09
**Feature**: 001-happiness-landing

## Overview

This landing page is stateless on the backend - no database storage. All form submissions go directly to Telegram. This document defines TypeScript types for frontend components and API contracts.

## Entities

### Lead (Contact Form Submission)

Represents a form submission sent to Telegram.

```typescript
// src/types/index.ts

export interface Lead {
  name: string          // Required, 2-100 chars
  contact: string       // Required, 5+ chars (phone or telegram)
  message?: string      // Optional, max 1000 chars
  timestamp: string     // ISO 8601 format
}

// Zod schema for validation
import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),
  contact: z.string()
    .min(5, 'Введите телефон или Telegram'),
  message: z.string()
    .max(1000, 'Максимум 1000 символов')
    .optional()
    .or(z.literal('')),
  // Honeypot field - must be empty
  website: z.string().max(0).optional()
})

export type LeadInput = z.infer<typeof leadSchema>
```

**Lifecycle**:
1. User fills form → Client validation (Zod)
2. Submit → API route validation (Zod)
3. Rate limit check → Block if exceeded
4. Honeypot check → Silent reject if filled
5. Send to Telegram → Success/Error response

---

### Section

Represents a page section for animation orchestration.

```typescript
export type SectionId =
  | 'preloader'
  | 'hero'
  | 'philosophy'
  | 'transformation'
  | 'diagnostic'
  | 'roadmap'
  | 'contact'
  | 'footer'

export interface Section {
  id: SectionId
  title?: string
  isVisible: boolean    // In viewport state
  progress: number      // 0-1 scroll progress within section
}
```

---

### Philosophy Card

Represents a card in the Philosophy section.

```typescript
export interface PhilosophyCard {
  id: 'compass' | 'shield' | 'control' | 'care'
  icon: 'Compass' | 'Shield' | 'Gauge' | 'Heart'
  title: string         // e.g., "КОМПАС"
  description: string   // Full description text
}

// Content data
export const philosophyCards: PhilosophyCard[] = [
  {
    id: 'compass',
    icon: 'Compass',
    title: 'КОМПАС',
    description: 'Найти ответ на "Зачем?"'
  },
  {
    id: 'shield',
    icon: 'Shield',
    title: 'ЗАЩИТА',
    description: 'Построить безопасные стены (PERMA)'
  },
  {
    id: 'control',
    icon: 'Gauge',
    title: 'КОНТРОЛЬ',
    description: 'Взять ответственность (40% = действия)'
  },
  {
    id: 'care',
    icon: 'Heart',
    title: 'ЗАБОТА',
    description: 'Внедрять новое без насилия'
  }
]
```

---

### Transformation Item

Represents a row in the Transformation table.

```typescript
export interface TransformationItem {
  category: string      // e.g., "СЕМЬЯ", "ОТНОШЕНИЯ", "БИЗНЕС"
  before: string        // "Было" state
  after: string         // "Стало" state
}

export const transformationItems: TransformationItem[] = [
  {
    category: 'СЕМЬЯ',
    before: '...',      // Content from spec
    after: '...'
  },
  // ... more items
]
```

---

### Diagnostic Signal

Represents an interactive signal in the Diagnostic section.

```typescript
export interface DiagnosticSignal {
  id: string
  title: string         // e.g., "ДЕНЬ СУРКА (СКУКА)"
  description: string
  isActive: boolean     // Local UI state only, not persisted
}

export const diagnosticSignals: DiagnosticSignal[] = [
  { id: 'groundhog', title: 'ДЕНЬ СУРКА (СКУКА)', description: '...', isActive: false },
  { id: 'energy', title: 'ЭНЕРГОДЕФИЦИТ', description: '...', isActive: false },
  { id: 'draft', title: 'ЖИЗНЬ НА ЧЕРНОВИК', description: '...', isActive: false },
  { id: 'ceiling', title: 'СТЕКЛЯННЫЙ ПОТОЛОК', description: '...', isActive: false },
  { id: 'game', title: 'ЧУЖАЯ ИГРА', description: '...', isActive: false }
]
```

**Note**: Diagnostic state is UI-only, not collected or stored per FR-012.

---

### Roadmap Stage

Represents a stage in the program roadmap.

```typescript
export interface RoadmapStage {
  week: number          // Week number
  title: string         // Stage title
  focus: string         // One sentence focus
  actions: string[]     // What we do
  result: string        // Expected outcome
}

// Placeholder until client provides content
export const roadmapStages: RoadmapStage[] = [
  {
    week: 1,
    title: 'Название этапа',
    focus: 'Фокус этапа',
    actions: ['Пункт 1', 'Пункт 2'],
    result: 'Результат этапа'
  },
  // ... more stages (content from client)
]
```

---

### Form State

Represents contact form UI state.

```typescript
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface FormState {
  status: FormStatus
  error?: string        // Error message for display
}
```

---

### Meeting Info

Represents the "What happens at the meeting" section.

```typescript
export interface MeetingPoint {
  id: string
  title: string         // e.g., "СВЕРИМ КООРДИНАТЫ"
  description: string   // Full text
}

export const meetingPoints: MeetingPoint[] = [
  {
    id: 'coordinates',
    title: 'СВЕРИМ КООРДИНАТЫ',
    description: 'Ты расскажешь свою текущую ситуацию...'
  },
  {
    id: 'chemistry',
    title: 'ПРОВЕРИМ "ХИМИЮ"',
    description: 'Наставник — это партнер на 3 месяца...'
  },
  {
    id: 'steps',
    title: 'НАМЕТИМ ПЕРВЫЕ ШАГИ',
    description: 'Даже если мы не пойдем в длительную работу...'
  }
]
```

---

## API Types

### Contact Form API

```typescript
// Request
export interface ContactRequest {
  name: string
  contact: string
  message?: string
  website?: string      // Honeypot
}

// Response
export interface ContactResponse {
  success: boolean
  message?: string      // Success or error message
}

// Error codes
export type ContactErrorCode =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'TELEGRAM_ERROR'
  | 'UNKNOWN_ERROR'

export interface ContactErrorResponse {
  success: false
  error: ContactErrorCode
  message: string
}
```

---

## Animation State Types

```typescript
// Preloader state
export interface PreloaderState {
  isComplete: boolean
  progress: number      // 0-1
}

// Scroll state for sections
export interface ScrollState {
  scrollY: number
  direction: 'up' | 'down'
  velocity: number
}

// Reduced motion preference
export interface MotionPreference {
  prefersReducedMotion: boolean
}
```

---

## Environment Variables

```typescript
// Type-safe env vars
declare namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    NEXT_PUBLIC_CALCOM_LINK: string
    NEXT_PUBLIC_SITE_URL: string
  }
}
```

---

## Relationships

```
Lead (form submission)
  └── Validates via leadSchema
  └── Sends to Telegram Bot API
  └── Returns ContactResponse

Section (page structure)
  └── Contains PhilosophyCard[] (4 items)
  └── Contains TransformationItem[] (3 items)
  └── Contains DiagnosticSignal[] (5 items, UI-only state)
  └── Contains RoadmapStage[] (N items from client)
  └── Contains MeetingPoint[] (3 items)
```

---

## State Management

No global state management needed. All state is:
1. **Local component state** (React useState)
2. **Form state** (React Hook Form)
3. **Animation state** (GSAP/Motion internal)
4. **Scroll state** (Lenis internal)

Server state is fire-and-forget (Telegram API).
