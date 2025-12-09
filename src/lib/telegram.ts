/**
 * Telegram Bot API Integration
 *
 * @description Sends lead notifications to Telegram using Bot API.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.
 *
 * @module lib/telegram
 */

import { Lead } from '@/types';

/**
 * Result of Telegram send operation
 */
interface TelegramResult {
  /** Whether the message was sent successfully */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
}

/**
 * Sends a lead notification to Telegram
 *
 * Formats lead data as a MarkdownV2 message and sends it to the configured
 * Telegram chat using the Bot API. Handles errors gracefully without exposing
 * internal details to the client.
 *
 * @param lead - Lead data from contact form submission
 * @returns Promise resolving to operation result
 *
 * @example
 * ```typescript
 * const result = await sendToTelegram({
 *   name: 'Иван Иванов',
 *   contact: '+79991234567',
 *   message: 'Хочу записаться на диагностику',
 *   timestamp: '2025-12-09T10:30:00.000Z'
 * });
 *
 * if (result.success) {
 *   console.log('Notification sent');
 * } else {
 *   console.error('Failed:', result.error);
 * }
 * ```
 */
export async function sendToTelegram(lead: Lead): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Validate environment variables
  if (!token || !chatId) {
    console.error('Telegram credentials not configured');
    return { success: false, error: 'Telegram not configured' };
  }

  // Format timestamp in Moscow timezone
  const date = new Date(lead.timestamp);
  const formattedDate = date.toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  /**
   * Escapes special characters for MarkdownV2 format
   *
   * MarkdownV2 requires escaping: _ * [ ] ( ) ~ ` > # + - = | { } . !
   */
  const escape = (text: string): string =>
    text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');

  // Build formatted message
  const message = `
🔔 *Новая заявка*

👤 *Имя:* ${escape(lead.name)}
📱 *Контакт:* ${escape(lead.contact)}
💬 *Сообщение:* ${lead.message ? escape(lead.message) : '—'}

🕐 ${formattedDate}
  `.trim();

  try {
    // Send message via Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'MarkdownV2',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return { success: false, error: 'Failed to send message' };
    }

    return { success: true };
  } catch (error) {
    console.error('Telegram send error:', error);
    return { success: false, error: 'Network error' };
  }
}
