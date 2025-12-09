/**
 * TypeScript Type Definitions for Happiness Landing Page
 *
 * @description Comprehensive type definitions for a premium personal transformation coaching landing page.
 * Includes types for contact forms, page sections, animations, and API contracts.
 *
 * @module types
 */

import { z } from 'zod';

// ============================================================================
// FORM & LEAD TYPES
// ============================================================================

/**
 * Lead - Contact form submission sent to Telegram
 *
 * Represents a potential client inquiry. No database storage - submissions
 * are sent directly to Telegram for manual follow-up.
 */
export interface Lead {
  /** Full name (2-100 characters) */
  name: string;
  /** Contact method - phone number or Telegram username (5+ characters) */
  contact: string;
  /** Optional message from the user (max 1000 characters) */
  message?: string;
  /** Submission timestamp in ISO 8601 format */
  timestamp: string;
}

/**
 * Zod validation schema for Lead with honeypot protection
 *
 * @remarks
 * - Includes `website` honeypot field that must be empty to prevent bot submissions
 * - Message field accepts empty string or undefined for optional behavior
 */
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
  // Honeypot field - must be empty to pass validation (bot protection)
  website: z.string().max(0).optional()
});

/**
 * Type inference from leadSchema for form validation
 */
export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Form submission status states
 */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Contact form UI state
 *
 * Tracks submission progress and error messages for user feedback.
 */
export interface FormState {
  /** Current form submission status */
  status: FormStatus;
  /** Error message to display to user (undefined if no error) */
  error?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Request payload for contact form API endpoint
 *
 * Sent from client to server for validation and Telegram delivery.
 */
export interface ContactRequest {
  /** User's full name */
  name: string;
  /** Contact method (phone/Telegram) */
  contact: string;
  /** Optional message */
  message?: string;
  /** Honeypot field (should be empty) */
  website?: string;
}

/**
 * Successful API response
 */
export interface ContactResponse {
  /** Operation success indicator */
  success: boolean;
  /** Optional success or informational message */
  message?: string;
}

/**
 * Error codes for contact form API failures
 */
export type ContactErrorCode =
  | 'VALIDATION_ERROR'    // Schema validation failed
  | 'RATE_LIMITED'        // Too many requests from this IP
  | 'TELEGRAM_ERROR'      // Failed to send to Telegram
  | 'UNKNOWN_ERROR';      // Unexpected server error

/**
 * Error response structure for failed API requests
 */
export interface ContactErrorResponse {
  /** Always false for error responses */
  success: false;
  /** Specific error code for client handling */
  error: ContactErrorCode;
  /** Human-readable error message */
  message: string;
}

// ============================================================================
// SECTION & PAGE STRUCTURE TYPES
// ============================================================================

/**
 * Page section identifiers for animation orchestration
 *
 * Each section can be tracked for visibility, scroll progress, and animation state.
 */
export type SectionId =
  | 'preloader'
  | 'hero'
  | 'philosophy'
  | 'transformation'
  | 'diagnostic'
  | 'roadmap'
  | 'contact'
  | 'footer';

/**
 * Page section metadata for scroll-based animations
 *
 * Used by intersection observers and scroll controllers to trigger
 * section-specific animations and track user progress.
 */
export interface Section {
  /** Unique section identifier */
  id: SectionId;
  /** Optional section title for navigation */
  title?: string;
  /** Whether section is currently in viewport */
  isVisible: boolean;
  /** Scroll progress within section (0.0 = top, 1.0 = bottom) */
  progress: number;
}

// ============================================================================
// CONTENT TYPES - PHILOSOPHY SECTION
// ============================================================================

/**
 * Philosophy card identifiers
 */
export type PhilosophyCardId = 'compass' | 'shield' | 'control' | 'care';

/**
 * Icon names from lucide-react library
 */
export type PhilosophyIcon = 'Compass' | 'Shield' | 'Gauge' | 'Heart';

/**
 * Philosophy card data structure
 *
 * Represents one of the four coaching philosophy principles displayed
 * as interactive cards in the Philosophy section.
 */
export interface PhilosophyCard {
  /** Unique card identifier */
  id: PhilosophyCardId;
  /** Lucide icon name for visual representation */
  icon: PhilosophyIcon;
  /** Card title (e.g., "КОМПАС") */
  title: string;
  /** Full description text explaining the principle */
  description: string;
}

// ============================================================================
// CONTENT TYPES - TRANSFORMATION SECTION
// ============================================================================

/**
 * Transformation table row
 *
 * Shows before/after comparison for different life areas affected
 * by the coaching program.
 */
export interface TransformationItem {
  /** Life category (e.g., "СЕМЬЯ", "ОТНОШЕНИЯ", "БИЗНЕС") */
  category: string;
  /** "Before" state description */
  before: string;
  /** "After" state description */
  after: string;
}

// ============================================================================
// CONTENT TYPES - DIAGNOSTIC SECTION
// ============================================================================

/**
 * Diagnostic signal identifiers
 */
export type DiagnosticSignalId =
  | 'groundhog'
  | 'energy'
  | 'draft'
  | 'ceiling'
  | 'game';

/**
 * Interactive diagnostic signal
 *
 * Represents a pain point or life challenge that users can click to
 * explore. State is UI-only and not persisted (per FR-012).
 */
export interface DiagnosticSignal {
  /** Unique signal identifier */
  id: DiagnosticSignalId;
  /** Signal title (e.g., "ДЕНЬ СУРКА (СКУКА)") */
  title: string;
  /** Detailed description of the challenge */
  description: string;
  /** Local UI state - whether signal is currently active/selected */
  isActive: boolean;
}

// ============================================================================
// CONTENT TYPES - ROADMAP SECTION
// ============================================================================

/**
 * Program roadmap stage
 *
 * Represents one stage of the 3-month coaching program timeline.
 */
export interface RoadmapStage {
  /** Week number in program (1-12) */
  week: number;
  /** Stage title */
  title: string;
  /** One-sentence focus area for this stage */
  focus: string;
  /** List of specific actions taken during this stage */
  actions: string[];
  /** Expected outcome or result of completing this stage */
  result: string;
}

// ============================================================================
// CONTENT TYPES - MEETING INFO SECTION
// ============================================================================

/**
 * Meeting point identifiers
 */
export type MeetingPointId = 'coordinates' | 'chemistry' | 'steps';

/**
 * Meeting information point
 *
 * Describes what happens during the initial consultation call.
 */
export interface MeetingPoint {
  /** Unique point identifier */
  id: MeetingPointId;
  /** Point title (e.g., "СВЕРИМ КООРДИНАТЫ") */
  title: string;
  /** Full description text */
  description: string;
}

// ============================================================================
// ANIMATION STATE TYPES
// ============================================================================

/**
 * Preloader animation state
 *
 * Tracks the brush stroke animation progress before main page reveal.
 */
export interface PreloaderState {
  /** Whether preloader animation has completed */
  isComplete: boolean;
  /** Animation progress (0.0 = start, 1.0 = complete) */
  progress: number;
}

/**
 * Scroll direction for animation triggers
 */
export type ScrollDirection = 'up' | 'down';

/**
 * Global scroll state
 *
 * Used by Lenis smooth scroll controller and GSAP ScrollTrigger
 * for coordinated scroll-based animations.
 */
export interface ScrollState {
  /** Current vertical scroll position in pixels */
  scrollY: number;
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Scroll velocity in pixels per second */
  velocity: number;
}

/**
 * User motion preference detection
 *
 * Respects user's OS-level motion preferences for accessibility.
 */
export interface MotionPreference {
  /** Whether user has requested reduced motion (prefers-reduced-motion) */
  prefersReducedMotion: boolean;
}

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Type-safe environment variable definitions
 *
 * Extends Node.js ProcessEnv interface for compile-time validation
 * of required environment variables.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Telegram bot token for API authentication */
      TELEGRAM_BOT_TOKEN: string;
      /** Telegram chat ID for receiving form submissions */
      TELEGRAM_CHAT_ID: string;
      /** Cal.com booking link for scheduling meetings */
      NEXT_PUBLIC_CALCOM_LINK: string;
      /** Public site URL for canonical links and metadata */
      NEXT_PUBLIC_SITE_URL: string;
    }
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract keys from union types
 *
 * Useful for distributed key extraction from discriminated unions.
 */
export type DistributedKeyOf<T> = T extends unknown ? keyof T : never;

/**
 * Strict type extraction
 *
 * Only extracts T if it exactly matches U (bidirectional check).
 */
export type StrictExtract<T, U> = T extends U ? U extends T ? T : never : never;

/**
 * Make all properties required (no optional fields)
 *
 * TypeScript built-in utility type re-exported for convenience.
 */
export type RequiredFields<T> = Required<T>;

/**
 * Make specific properties required
 *
 * @example
 * type User = { name?: string; email?: string; age?: number };
 * type UserWithName = RequireFields<User, 'name'>; // { name: string; email?: string; age?: number }
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 *
 * @example
 * type User = { name: string; email: string; age: number };
 * type UserWithOptionalEmail = PartialFields<User, 'email'>; // { name: string; email?: string; age: number }
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
