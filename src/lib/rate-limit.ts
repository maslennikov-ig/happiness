interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Configuration
const MAX_REQUESTS = 3
const WINDOW_MS = 60 * 1000 // 1 minute

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Check if request is allowed under rate limit
 *
 * Uses sliding window algorithm with in-memory storage.
 * Not suitable for distributed deployments (use Redis instead).
 *
 * @param ip - Client IP address
 * @returns Object with allowed status and optional retry delay
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // No existing entry or window expired - allow and start new window
  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true }
  }

  // Within window - check count
  if (entry.count < MAX_REQUESTS) {
    entry.count++
    return { allowed: true }
  }

  // Rate limited - return retry time in seconds
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
  return { allowed: false, retryAfter }
}

/**
 * Reset rate limit for an IP (for testing)
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip)
}
