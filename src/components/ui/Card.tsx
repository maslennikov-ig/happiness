'use client'

import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cardHover } from '@/animations/variants'

/**
 * Card Component
 *
 * Premium card component with hover gradient reveal effect.
 * Used in Philosophy section to display values with gold tint on hover.
 *
 * @example
 * ```tsx
 * <Card className="group">
 *   <CardIcon>
 *     <Compass className="h-8 w-8 text-gold-primary" />
 *   </CardIcon>
 *   <CardTitle>КОМПАС</CardTitle>
 *   <CardDescription>Найти ответ на "Зачем?"</CardDescription>
 * </Card>
 * ```
 */

export interface CardProps {
  /**
   * Enable hover animation effect
   * @default true
   */
  hover?: boolean
  /**
   * Show gradient overlay on hover
   * @default true
   */
  gradient?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Card content
   */
  children?: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, gradient = true, children }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg bg-white p-6 shadow-card',
          'transition-shadow duration-300',
          hover && 'hover:shadow-lg',
          className
        )}
        whileHover={
          !prefersReducedMotion && hover ? cardHover.whileHover : undefined
        }
      >
        {/* Gradient overlay - revealed on hover */}
        {gradient && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-light/0 to-gold-light/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        )}

        {/* Content wrapper with z-index to appear above gradient */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

/**
 * CardHeader
 *
 * Optional header area for the card.
 * Typically contains title or icon elements.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4 flex flex-col space-y-1.5', className)}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

/**
 * CardContent
 *
 * Main content area of the card.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />
  }
)

CardContent.displayName = 'CardContent'

/**
 * CardIcon
 *
 * Centered icon area at the top of the card.
 * Adds consistent spacing and alignment for icons.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardIcon = forwardRef<HTMLDivElement, CardIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-4 flex items-center justify-center',
          'transition-transform duration-300 group-hover:scale-110',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardIcon.displayName = 'CardIcon'

/**
 * CardTitle
 *
 * Title text for the card.
 * Uses display font with gold color.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'font-display text-xl font-semibold tracking-wide text-gold-text',
          'mb-2 text-center',
          className
        )}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

/**
 * CardDescription
 *
 * Description text for the card.
 * Uses body font with muted color for readability.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-center text-sm text-text-secondary',
        'leading-relaxed',
        className
      )}
      {...props}
    />
  )
})

CardDescription.displayName = 'CardDescription'
