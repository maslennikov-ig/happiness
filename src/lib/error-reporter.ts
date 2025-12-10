/**
 * Error Reporting Utility
 *
 * Provides a centralized interface for error reporting to external services.
 * Currently logs to console in production, but can be easily integrated with
 * services like Sentry, LogRocket, Bugsnag, etc.
 *
 * Integration Instructions:
 *
 * 1. For Sentry:
 *    - Install: npm install @sentry/nextjs
 *    - Initialize in instrumentation.ts or _app.tsx
 *    - Uncomment Sentry code below
 *    - Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 *
 * 2. For LogRocket:
 *    - Install: npm install logrocket
 *    - Initialize in _app.tsx
 *    - Uncomment LogRocket code below
 *    - Add NEXT_PUBLIC_LOGROCKET_ID to .env.local
 *
 * 3. For custom endpoint:
 *    - Implement reportToCustomEndpoint function
 *    - Add API endpoint for receiving errors
 */

import { logger } from '@/lib/logger'

interface ErrorContext {
  componentStack?: string
  [key: string]: unknown
}

/**
 * Report error to configured error tracking service
 *
 * @param error - The error to report
 * @param context - Additional context about the error
 */
export function reportError(error: Error, context?: ErrorContext): void {
  // In development, always log to console
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error reported:', error, context)
    return
  }

  // Production error reporting

  // Option 1: Sentry (recommended)
  // Uncomment when Sentry is configured
  /*
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, {
      contexts: context ? { react: context } : undefined,
    })
  }
  */

  // Option 2: LogRocket
  // Uncomment when LogRocket is configured
  /*
  if (typeof window !== 'undefined' && window.LogRocket) {
    window.LogRocket.captureException(error, {
      tags: context,
    })
  }
  */

  // Option 3: Custom endpoint
  // Uncomment and implement when custom endpoint is ready
  /*
  reportToCustomEndpoint(error, context).catch(err => {
    logger.server.error('Failed to report error:', err)
  })
  */

  // Fallback: Log to console (production)
  // This ensures errors aren't silently lost
  logger.server.error('Error occurred:', {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
  })
}

/**
 * Example custom endpoint implementation
 */
/*
async function reportToCustomEndpoint(
  error: Error,
  context?: ErrorContext
): Promise<void> {
  await fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      name: error.name,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }),
  })
}
*/

// Type augmentation for global error services (optional)
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: { contexts?: Record<string, unknown> }) => void
    }
    LogRocket?: {
      captureException: (error: Error, context?: { tags?: Record<string, unknown> }) => void
    }
  }
}
