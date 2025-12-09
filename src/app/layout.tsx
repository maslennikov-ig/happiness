import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Программа трансформации | Счастье как навык',
  description:
    'Персональная программа трансформации для успешных предпринимателей. 12 недель работы над собой с опытным наставником.',
  keywords: [
    'трансформация',
    'коучинг',
    'наставничество',
    'личностный рост',
    'предприниматель',
  ],
  authors: [{ name: 'Happiness Coach' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'Программа трансформации | Счастье как навык',
    description:
      'Персональная программа трансформации для успешных предпринимателей.',
    siteName: 'Happiness',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Программа трансформации | Счастье как навык',
    description:
      'Персональная программа трансформации для успешных предпринимателей.',
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
      <body className="min-h-screen bg-bg-primary font-body text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
