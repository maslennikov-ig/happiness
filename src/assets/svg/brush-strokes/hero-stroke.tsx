/**
 * Hero Brush Stroke SVG Component
 *
 * Golden decorative brush stroke for the Hero section.
 * Positioned behind/around the author photo for visual interest.
 *
 * Usage:
 * ```tsx
 * <HeroStroke className="w-full h-auto opacity-30" />
 * ```
 */

import type { SVGProps } from 'react'

export function HeroStroke(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M50 200Q150 50 300 100T550 200Q450 350 300 300T50 200Z"
        fill="url(#hero-stroke-gradient)"
        opacity="0.6"
      />
      <defs>
        <linearGradient
          id="hero-stroke-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="var(--color-gold-primary)" />
          <stop offset="50%" stopColor="var(--color-gold-muted)" />
          <stop offset="100%" stopColor="var(--color-gold-light)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
