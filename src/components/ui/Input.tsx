'use client'

import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(
      !!(props.value || props.defaultValue)
    )

    // Label floats when focused or has value
    const isFloating = isFocused || hasValue || props.value !== undefined

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={id}
          className={cn(
            // Base styles - 44px minimum height for touch targets
            'peer h-[44px] w-full rounded-md border bg-transparent px-4 pt-4 pb-2 text-base outline-none',
            // Transition
            'transition-colors duration-[var(--duration-normal)]',
            // Default state
            'border-text-muted text-text-primary placeholder:text-transparent',
            // Focus state - golden accent
            'focus:border-gold-primary focus:ring-1 focus:ring-gold-primary',
            // Error state
            error && 'border-error focus:border-error focus:ring-error',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-muted',
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={cn(
            // Base styles
            'absolute left-4 pointer-events-none',
            // Transition
            'transition-all duration-[var(--duration-normal)] ease-out',
            // Floating position (when focused or has value)
            isFloating
              ? 'top-1 text-xs font-medium text-gold-text'
              : 'top-1/2 -translate-y-1/2 text-base text-text-secondary',
            // Error state color
            error && !isFocused && isFloating && 'text-error',
            // Focus state - always golden when floating
            isFocused && isFloating && 'text-gold-primary'
          )}
        >
          {label}
        </label>

        {/* Error/helper text with animation */}
        <AnimatePresence mode="wait">
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              id={error ? `${id}-error` : `${id}-helper`}
              className={cn(
                'mt-1.5 text-sm',
                error ? 'text-error' : 'text-text-secondary'
              )}
              role={error ? 'alert' : undefined}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(
      !!(props.value || props.defaultValue)
    )

    // Label floats when focused or has value
    const isFloating = isFocused || hasValue || props.value !== undefined

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(
            // Base styles - minimum 44px height maintained with padding
            'peer min-h-[120px] w-full rounded-md border bg-transparent px-4 pt-6 pb-2 text-base outline-none resize-y',
            // Transition
            'transition-colors duration-[var(--duration-normal)]',
            // Default state
            'border-text-muted text-text-primary placeholder:text-transparent',
            // Focus state - golden accent
            'focus:border-gold-primary focus:ring-1 focus:ring-gold-primary',
            // Error state
            error && 'border-error focus:border-error focus:ring-error',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-muted disabled:resize-none',
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={cn(
            // Base styles
            'absolute left-4 pointer-events-none',
            // Transition
            'transition-all duration-[var(--duration-normal)] ease-out',
            // Floating position (when focused or has value)
            isFloating
              ? 'top-2 text-xs font-medium text-gold-text'
              : 'top-6 text-base text-text-secondary',
            // Error state color
            error && !isFocused && isFloating && 'text-error',
            // Focus state - always golden when floating
            isFocused && isFloating && 'text-gold-primary'
          )}
        >
          {label}
        </label>

        {/* Error/helper text with animation */}
        <AnimatePresence mode="wait">
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              id={error ? `${id}-error` : `${id}-helper`}
              className={cn(
                'mt-1.5 text-sm',
                error ? 'text-error' : 'text-text-secondary'
              )}
              role={error ? 'alert' : undefined}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
