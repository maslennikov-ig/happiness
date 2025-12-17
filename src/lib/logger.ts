/**
 * Centralized logging utility
 *
 * Provides environment-aware logging that automatically strips console statements
 * in production builds while preserving them in development.
 *
 * PROJECT DECISION - Server Logging Strategy:
 * Server-side logging is configured to be error-focused and production-appropriate:
 * - Client logs: Disabled in production (strips debug noise)
 * - Server logs: Configurable via LOG_LEVEL environment variable
 * - Current usage: ONLY errors are logged (no verbose debug logs in codebase)
 * - Default: 'error' level in production (minimal noise)
 * - VPS deployment: Logs accessible via Docker/PM2
 *
 * Log Level Configuration:
 * Set LOG_LEVEL environment variable to control server-side logging verbosity:
 * - 'error' (default in production): Only errors (recommended for production)
 * - 'warn': Errors + warnings
 * - 'info': Errors + warnings + info
 * - 'debug': All logs (recommended for development debugging)
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * // Client-side (development only)
 * logger.log('Debug info:', data)
 * logger.warn('Warning message')
 * logger.error('Error occurred:', error)
 *
 * // Server-side (respects LOG_LEVEL)
 * logger.server.debug('Verbose debug info')  // Only if LOG_LEVEL=debug
 * logger.server.log('Info message')          // Only if LOG_LEVEL=info or debug
 * logger.server.warn('Warning message')      // Only if LOG_LEVEL=warn, info, or debug
 * logger.server.error('API error:', error)   // Always logs (all levels)
 * ```
 */

const isDevelopment = process.env.NODE_ENV === 'development'

// Server log level configuration
type LogLevel = 'error' | 'warn' | 'info' | 'debug'
const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || (isDevelopment ? 'debug' : 'error')

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const currentLogLevel = logLevels[LOG_LEVEL] || logLevels.error

function shouldLog(level: LogLevel): boolean {
  return currentLogLevel >= logLevels[level]
}

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
   * Server-side logger with configurable log levels
   * Use for API routes, server components, and backend errors
   * Respects LOG_LEVEL environment variable
   */
  server: {
    /**
     * Debug level logging (only if LOG_LEVEL=debug)
     */
    debug: (...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.log('[SERVER:DEBUG]', ...args)
      }
    },
    /**
     * Info level logging (only if LOG_LEVEL=info or debug)
     */
    log: (...args: unknown[]) => {
      if (shouldLog('info')) {
        console.log('[SERVER]', ...args)
      }
    },
    /**
     * Warning level logging (only if LOG_LEVEL=warn, info, or debug)
     */
    warn: (...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn('[SERVER]', ...args)
      }
    },
    /**
     * Error level logging (always logs regardless of LOG_LEVEL)
     */
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
