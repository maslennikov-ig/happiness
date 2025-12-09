'use client'

import { AnimatePresence, motion } from 'motion/react'

/**
 * App Template with AnimatePresence
 *
 * This template wraps all pages with AnimatePresence for page transitions.
 * Unlike layout.tsx, template.tsx re-mounts for each navigation,
 * making it perfect for entry/exit animations.
 *
 * @example
 * Pages automatically receive fade-in animation when navigating between routes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
