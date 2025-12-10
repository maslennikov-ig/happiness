/**
 * Contact Form API Route
 *
 * @description Handles POST requests to /api/contact for contact form submissions.
 * Implements rate limiting, validation, honeypot protection, and Telegram notifications.
 *
 * @module api/contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/schemas';
import { sendToTelegram } from '@/lib/telegram';
import { checkRateLimit } from '@/lib/rate-limit';
import type { Lead, ContactResponse, ContactErrorResponse, ContactErrorCode } from '@/types';

/**
 * POST /api/contact
 *
 * Handles contact form submissions with the following flow:
 * 1. Extracts client IP for rate limiting
 * 2. Checks rate limit (3 requests per minute per IP)
 * 3. Validates request body against contactFormSchema
 * 4. Checks honeypot field for bot protection
 * 5. Sends lead to Telegram for manual follow-up
 * 6. Returns success/error response
 *
 * @param request - Next.js request object with form data
 * @returns JSON response with success status or error details
 *
 * @example
 * ```typescript
 * // Success response (200)
 * { success: true }
 *
 * // Rate limit error (429)
 * { success: false, error: 'RATE_LIMITED', message: 'Слишком много запросов. Попробуйте позже.' }
 * // Headers: { 'Retry-After': '45' }
 *
 * // Validation error (400)
 * { success: false, error: 'VALIDATION_ERROR', message: 'Минимум 2 символа' }
 *
 * // Telegram error (500)
 * { success: false, error: 'TELEGRAM_ERROR', message: 'Не удалось отправить заявку. Попробуйте позже.' }
 * ```
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse | ContactErrorResponse>> {
  try {
    // Get client IP for rate limiting
    // Priority: X-Forwarded-For (first IP) > X-Real-IP > 'unknown'
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown';

    // Check rate limit (3 requests per minute per IP)
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMITED' as ContactErrorCode,
          message: 'Слишком много запросов. Попробуйте позже.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR' as ContactErrorCode,
          message: result.error.issues[0]?.message ?? 'Ошибка валидации',
        },
        { status: 400 }
      );
    }

    const { name, contact, message, website } = result.data;

    // Check honeypot (bots fill hidden fields)
    // Silently succeed to not tip off bots
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Create lead object with current timestamp
    const lead: Lead = {
      name,
      contact,
      message,
      timestamp: new Date().toISOString(),
    };

    // Send to Telegram for manual follow-up
    const telegramResult = await sendToTelegram(lead);

    if (!telegramResult.success) {
      console.error('Telegram send failed:', telegramResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'TELEGRAM_ERROR' as ContactErrorCode,
          message: 'Не удалось отправить заявку. Попробуйте позже.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'UNKNOWN_ERROR' as ContactErrorCode,
        message: 'Произошла ошибка. Попробуйте позже.',
      },
      { status: 500 }
    );
  }
}
