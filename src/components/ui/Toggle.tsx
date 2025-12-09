'use client'

import { createContext, useContext, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Toggle Component
 *
 * A toggle/chip component with Motion layoutId for smooth highlight animation.
 * Used in the Diagnostic section for signal selection.
 *
 * Features:
 * - Smooth highlight animation between selected items using layoutId
 * - 44px minimum touch target for accessibility
 * - Supports reduced motion preferences
 * - Context-based shared layoutId for ToggleGroup
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState<string[]>([])
 *
 * <ToggleGroup layoutId="diagnostic-signals">
 *   {signals.map((signal) => (
 *     <Toggle
 *       key={signal.id}
 *       isSelected={selected.includes(signal.id)}
 *       onToggle={() => toggleSelection(signal.id)}
 *     >
 *       {signal.title}
 *     </Toggle>
 *   ))}
 * </ToggleGroup>
 * ```
 */

interface ToggleProps {
  children: ReactNode
  isSelected?: boolean
  onToggle?: () => void
  className?: string
  disabled?: boolean
}

interface ToggleGroupProps {
  children: ReactNode
  className?: string
  layoutId?: string // for shared highlight animation
}

// Context for shared layoutId across toggle group
const ToggleGroupContext = createContext<{ layoutId?: string } | null>(null)

/**
 * ToggleGroup Component
 *
 * Wrapper component that provides shared layoutId context for smooth
 * highlight animation between toggles.
 */
export function ToggleGroup({
  children,
  className,
  layoutId = 'toggle-highlight',
}: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ layoutId }}>
      <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
    </ToggleGroupContext.Provider>
  )
}

/**
 * Toggle Component
 *
 * Individual toggle/chip with animated highlight background.
 * Must be used within ToggleGroup for shared layoutId animation.
 */
export function Toggle({
  children,
  isSelected = false,
  onToggle,
  className,
  disabled = false,
}: ToggleProps) {
  const context = useContext(ToggleGroupContext)
  const prefersReducedMotion = useReducedMotion()

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        // Base styles
        'relative min-h-[44px] rounded-full px-4 py-2',
        'text-sm font-medium transition-colors',
        'border-2',
        // Focus styles
        'focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-gold-primary',
        // Selected state
        isSelected
          ? 'border-gold-primary text-gold-text'
          : 'border-gray-200 text-text-secondary hover:border-gray-300',
        // Disabled state
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {/* Animated highlight background */}
      {isSelected && (
        <motion.div
          layoutId={context?.layoutId}
          className="absolute inset-0 -z-10 rounded-full bg-gold-light"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 400, damping: 30 }
          }
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
