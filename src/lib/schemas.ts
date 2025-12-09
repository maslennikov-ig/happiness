/**
 * Form Validation Schemas
 *
 * @description Enhanced Zod schemas for contact form validation with data sanitization.
 * Used for both client-side form validation (react-hook-form) and server-side API validation.
 *
 * @module schemas
 */

import { z } from 'zod';

/**
 * Contact form validation schema
 *
 * Enhanced version of leadSchema from types/index.ts with additional sanitization:
 * - `.trim()` on name and contact for cleaner data
 * - `.transform()` on message to convert empty strings to undefined
 * - Honeypot field validation for bot protection
 *
 * @remarks
 * - Error messages are in Russian (user-facing)
 * - `website` field is a honeypot - bots fill it, humans don't see it
 * - Empty message field is transformed to undefined for cleaner API payload
 *
 * @example
 * ```ts
 * import { contactFormSchema } from '@/lib/schemas';
 *
 * const result = contactFormSchema.safeParse({
 *   name: '  Иван Петров  ',
 *   contact: '@ivan_telegram',
 *   message: '',
 *   website: ''
 * });
 *
 * if (result.success) {
 *   console.log(result.data.name); // "Иван Петров" (trimmed)
 *   console.log(result.data.message); // undefined (empty string transformed)
 * }
 * ```
 */
export const contactFormSchema = z.object({
  /**
   * User's full name
   * - Required: 2-100 characters
   * - Automatically trimmed to remove leading/trailing whitespace
   */
  name: z.string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов')
    .trim(),

  /**
   * Contact method - phone number or Telegram username
   * - Required: minimum 5 characters
   * - Automatically trimmed
   * - Accepts phone numbers (e.g., "+79001234567") or Telegram usernames (e.g., "@username")
   */
  contact: z.string()
    .min(5, 'Введите телефон или Telegram')
    .trim(),

  /**
   * Optional message from the user
   * - Maximum 1000 characters
   * - Empty strings are transformed to undefined
   * - Allows both optional() and literal empty string for form flexibility
   */
  message: z.string()
    .max(1000, 'Максимум 1000 символов')
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),

  /**
   * Honeypot field for bot protection
   * - Must be empty (max 0 characters) to pass validation
   * - Hidden from users with CSS
   * - Bots typically auto-fill all fields, triggering this validation
   */
  website: z.string()
    .max(0, 'Bot detected')
    .optional()
});

/**
 * Inferred TypeScript type from contactFormSchema
 *
 * Use this type for form data, API payloads, and function parameters.
 *
 * @example
 * ```ts
 * import { ContactFormData } from '@/lib/schemas';
 *
 * async function submitForm(data: ContactFormData) {
 *   // data.name: string
 *   // data.contact: string
 *   // data.message: string | undefined
 *   // data.website: string | undefined
 * }
 * ```
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
