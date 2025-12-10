import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://architecture-happiness.ru'),
  title: 'Архитектура Счастья — Программа трансформации для предпринимателей',
  description: 'Персональная программа для успешных предпринимателей, которые хотят не просто жить — а проживать жизнь в полную силу. Позволь Ребёнку быть счастливым. Пусть Взрослый возьмёт за это ответственность.',
  keywords: ['архитектура счастья', 'трансформация', 'коучинг', 'предприниматели', 'выгорание', 'личностный рост', 'счастье', 'наставничество'],
  authors: [{ name: 'Архитектура Счастья' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://architecture-happiness.ru',
    title: 'Архитектура Счастья — Программа трансформации',
    description: 'Позволь Ребёнку быть счастливым. Пусть Взрослый возьмёт за это ответственность.',
    siteName: 'Архитектура Счастья',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Архитектура Счастья — Программа трансформации',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Архитектура Счастья — Программа трансформации',
    description: 'Позволь Ребёнку быть счастливым. Пусть Взрослый возьмёт за это ответственность.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={fontVariables}>
      <head>
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className="min-h-screen bg-bg-primary font-body text-text-primary antialiased">
        {/* Skip to content link for screen readers - T074 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-white focus:rounded-md focus:outline-none"
        >
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  )
}
