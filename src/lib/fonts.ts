import { Playfair_Display, Montserrat, Caveat } from 'next/font/google'

/**
 * Display font - Playfair Display
 * Used for headings and hero text
 * Supports Cyrillic subset for Russian content
 */
export const playfairDisplay = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

/**
 * Body font - Montserrat
 * Used for body text and UI elements
 * Supports Cyrillic subset for Russian content
 */
export const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

/**
 * Handwritten font - Caveat
 * Used for signatures and personal touches
 * Supports Cyrillic subset for Russian content
 */
export const caveat = Caveat({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-handwritten',
  weight: ['400', '500', '600', '700'],
})

/**
 * Combined font class names for applying to html element
 */
export const fontVariables = `${playfairDisplay.variable} ${montserrat.variable} ${caveat.variable}`
