interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Configuration
const MAX_REQUESTS = 3
const WINDOW_MS = 60 * 1000 // 1 minute

/**
 * Clean up expired rate limit entries (on-demand cleanup for serverless compatibility)
 * This is called during each rate limit check to prevent memory leaks
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}

/**
 * Check if request is allowed under rate limit
 *
 * Uses sliding window algorithm with in-memory storage.
 *
 * DEPLOYMENT ARCHITECTURE DECISION:
 * This application is deployed to a single VPS server (not serverless).
 * In-memory rate limiting is INTENTIONALLY used and is appropriate for this architecture.
 *
 * Current deployment details:
 * - Single server VPS with PM2/Docker
 * - No horizontal scaling planned
 * - Deployed at: https://archihappy.ru
 * - Deployment method: See scripts/deploy.sh and .github/workflows/deploy.yml
 *
 * This implementation is suitable for:
 * - Development and testing
 * - Single-server deployments (current architecture) ✅
 *
 * NOT suitable for (would require Redis/distributed storage):
 * - Serverless/distributed deployments (Vercel, AWS Lambda, etc.)
 * - Horizontal scaling scenarios with multiple instances
 *
 * If deployment architecture changes to serverless/multi-instance, consider:
 * - @upstash/ratelimit with Redis (recommended for Vercel)
 * - Vercel Edge Config
 * - Cloudflare Rate Limiting
 * - Other distributed rate limiting solutions
 *
 * @param ip - Client IP address
 * @returns Object with allowed status and optional retry delay
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()

  // Clean up expired entries on-demand (serverless-compatible)
  cleanupExpiredEntries(now)

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
