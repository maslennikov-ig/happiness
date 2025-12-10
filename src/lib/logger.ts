/**
 * Centralized logging utility
 *
 * Provides environment-aware logging that automatically strips console statements
 * in production builds while preserving them in development.
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * // These will only log in development
 * logger.log('Debug info:', data)
 * logger.warn('Warning message')
 * logger.error('Error occurred:', error)
 *
 * // Server-side logging (always logs)
 * logger.server.error('API error:', error)
 * ```
 */

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Client-side logger (strips logs in production)
 */
export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Log error messages (development only)
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },

  /**
   * Server-side logger (always logs for debugging production issues)
   * Use for API routes, server components, and backend errors
   */
  server: {
    log: (...args: unknown[]) => {
      console.log('[SERVER]', ...args)
    },
    warn: (...args: unknown[]) => {
      console.warn('[SERVER]', ...args)
    },
    error: (...args: unknown[]) => {
      console.error('[SERVER]', ...args)
    },
  },
}

/**
 * Type-safe error logging helper
 * Extracts useful information from Error objects
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : ''

  if (error instanceof Error) {
    logger.error(`${prefix} ${error.name}:`, error.message)
    if (isDevelopment && error.stack) {
      logger.error('Stack trace:', error.stack)
    }
  } else {
    logger.error(`${prefix} Unknown error:`, error)
  }
}

/**
 * Server-side error logging (always logs)
 */
export function logServerError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : ''

  if (error instanceof Error) {
    logger.server.error(`${prefix} ${error.name}:`, error.message)
    if (error.stack) {
      logger.server.error('Stack trace:', error.stack)
    }
  } else {
    logger.server.error(`${prefix} Unknown error:`, error)
  }
}
