/**
 * Error Reporting Utility
 *
 * Provides a centralized interface for error reporting to external services.
 * Currently logs to console in production, but can be easily integrated with
 * services like Sentry, LogRocket, Bugsnag, etc.
 *
 * PROJECT DECISION:
 * For this landing page project, console-based error logging is INTENTIONALLY used.
 * This is appropriate because:
 * - Simple landing page with minimal complexity
 * - Low user traffic and error rate expected
 * - VPS deployment with direct server log access
 * - Server logs accessible via Docker/PM2 (see scripts/deploy.sh)
 * - Cost-effective approach for small projects
 * - Can upgrade to Sentry if error monitoring needs increase
 *
 * Server logs can be accessed via:
 * - Docker: docker compose logs happiness
 * - PM2: pm2 logs architecture-happiness
 * - System logs: journalctl -u docker.service -f (if using systemd)
 *
 * Integration Instructions (if upgrading in future):
 *
 * 1. For Sentry (recommended for production apps):
 *    - Install: npm install @sentry/nextjs
 *    - Initialize in instrumentation.ts or _app.tsx
 *    - Uncomment Sentry code below
 *    - Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 *    - Free tier: 5,000 errors/month
 *
 * 2. For LogRocket (session replay + errors):
 *    - Install: npm install logrocket
 *    - Initialize in _app.tsx
 *    - Uncomment LogRocket code below
 *    - Add NEXT_PUBLIC_LOGROCKET_ID to .env.local
 *    - Free tier: 1,000 sessions/month
 *
 * 3. For custom endpoint:
 *    - Implement reportToCustomEndpoint function
 *    - Add API endpoint for receiving errors
 *    - Store in database or forward to monitoring service
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
