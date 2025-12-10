import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

/**
 * Footer Component
 *
 * Premium footer for Happiness landing page with:
 * - Logo and branding
 * - Telegram contact link
 * - Copyright information
 * - Privacy policy link
 *
 * Design:
 * - Dark background (bg-bg-dark)
 * - Two-row layout (logo + telegram | copyright + privacy)
 * - Responsive spacing and typography
 * - Hover states with gold accent
 */
export function Footer() {
  // Telegram contact link - configured via environment variable
  const telegramUsername = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'username'
  const telegramLink = `https://t.me/${telegramUsername}`

  return (
    <footer className="bg-bg-dark py-12 md:py-16" aria-labelledby="footer-heading">
      <span id="footer-heading" className="sr-only">
        Footer
      </span>

      <div className="container mx-auto px-4">
        {/* Top Row: Logo + Telegram Link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          {/* Logo */}
          <div>
            <span className="font-display text-2xl md:text-3xl text-white">
              Happiness
            </span>
          </div>

          {/* Telegram Contact Link */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-gold-primary transition-colors duration-300 group"
            aria-label="Написать в Telegram"
          >
            <MessageCircle
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="text-sm md:text-base font-medium">
              Написать в Telegram
            </span>
          </a>
        </div>

        {/* Divider */}
        <hr className="border-white/10 my-8" aria-hidden="true" />

        {/* Bottom Row: Copyright + Privacy Link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm md:text-base">
          {/* Copyright */}
          <p className="text-white/70">
            © {new Date().getFullYear()} Happiness. Все права защищены.
          </p>

          {/* Privacy Policy Link */}
          <Link
            href="/privacy"
            className="text-white/70 hover:text-gold-primary transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
