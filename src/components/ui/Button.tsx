'use client'

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Button Component Props
 *
 * Extends standard HTML button attributes with custom variants and features.
 */
export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Show loading spinner and disable interaction */
  isLoading?: boolean
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode
  /** Button content */
  children?: React.ReactNode
}

/**
 * Variant styles for button appearance
 */
const variants = {
  primary:
    'bg-gold-primary text-text-primary hover:bg-gold-muted transition-colors',
  secondary:
    'border-2 border-gold-primary text-gold-text bg-transparent hover:bg-gold-light transition-colors',
  ghost: 'text-gold-text bg-transparent hover:bg-gold-light transition-colors',
}

/**
 * Size styles for button dimensions
 * All sizes meet minimum 44px touch target for accessibility
 */
const sizes = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
}

/**
 * Premium Button Component
 *
 * A luxury button component with golden accents and Motion animations.
 * Features include hover effects, loading states, icons, and accessibility.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" size="md">
 *   Get Started
 * </Button>
 *
 * // Secondary with icon
 * <Button variant="secondary" leftIcon={<ArrowRight />}>
 *   Learn More
 * </Button>
 *
 * // Loading state
 * <Button variant="primary" isLoading>
 *   Submitting...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()

    // Combine disabled state with loading
    const isDisabled = disabled || isLoading

    return (
      <motion.button
        ref={ref}
        whileHover={
          prefersReducedMotion || isDisabled ? undefined : { scale: 1.02 }
        }
        whileTap={
          prefersReducedMotion || isDisabled ? undefined : { scale: 0.98 }
        }
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-full font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-shadow duration-300',

          // Golden glow shadow on hover (only for non-ghost variants)
          variant !== 'ghost' && !isDisabled && 'hover:shadow-gold',

          // Apply variant and size styles
          variants[variant],
          sizes[size],

          // Custom className override
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
            aria-hidden="true"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.span>
        )}

        {/* Left icon (hidden during loading) */}
        {!isLoading && leftIcon && (
          <span className="inline-flex" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text */}
        {children && <span>{children}</span>}

        {/* Right icon (hidden during loading) */}
        {!isLoading && rightIcon && (
          <span className="inline-flex" aria-hidden="true">
            {rightIcon}
          </span>
        )}

        {/* Screen reader text for loading state */}
        {isLoading && <span className="sr-only">Loading...</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
