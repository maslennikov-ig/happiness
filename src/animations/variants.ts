/**
 * Motion (Framer Motion) Animation Variants
 *
 * Reusable animation configurations for the landing page.
 * Import from 'motion/react' (NOT framer-motion) for Next.js App Router.
 *
 * @see https://motion.dev/docs/react-animation
 */

import type { Variants, Transition } from 'motion/react'

/**
 * Simple fade in animation
 *
 * @example
 * ```tsx
 * <motion.div variants={fadeIn} initial="initial" animate="animate" />
 * ```
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Slide up with fade animation
 * Useful for content that appears from below
 *
 * @example
 * ```tsx
 * <motion.div variants={slideUp} initial="initial" animate="animate" />
 * ```
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * Slide from left with fade animation
 * Useful for side navigation or left-aligned content
 *
 * @example
 * ```tsx
 * <motion.div variants={slideInFromLeft} initial="initial" animate="animate" />
 * ```
 */
export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
}

/**
 * Slide from right with fade animation
 * Useful for right-aligned content or cards
 *
 * @example
 * ```tsx
 * <motion.div variants={slideInFromRight} initial="initial" animate="animate" />
 * ```
 */
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
}

/**
 * Scale up with fade animation
 * Useful for modals, cards, or emphasis elements
 *
 * @example
 * ```tsx
 * <motion.div variants={scaleIn} initial="initial" animate="animate" />
 * ```
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
}

/**
 * Stagger container for animating children with delay
 * Use this on parent elements that contain staggerItem children
 *
 * @example
 * ```tsx
 * <motion.ul variants={staggerContainer} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItem}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Stagger item for children in staggerContainer
 * Use this on child elements within a staggerContainer parent
 *
 * @example
 * ```tsx
 * <motion.li variants={staggerItem}>Content</motion.li>
 * ```
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

/**
 * Button hover effect
 * Use with whileHover and whileTap props
 *
 * @example
 * ```tsx
 * <motion.button
 *   whileHover={buttonHover.whileHover}
 *   whileTap={buttonHover.whileTap}
 * >
 *   Click me
 * </motion.button>
 * ```
 */
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

/**
 * Card hover effect
 * Subtle lift on hover for cards and interactive elements
 *
 * @example
 * ```tsx
 * <motion.div whileHover={cardHover.whileHover}>
 *   Card content
 * </motion.div>
 * ```
 */
export const cardHover = {
  whileHover: {
    y: -5,
    transition: { duration: 0.2 }
  },
}

/**
 * Spring transition configuration
 * Provides smooth, natural motion for animations
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeIn}
 *   initial="initial"
 *   animate="animate"
 *   transition={springTransition}
 * />
 * ```
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

/**
 * Smooth transition configuration
 * Eased motion for gentle animations
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={slideUp}
 *   initial="initial"
 *   animate="animate"
 *   transition={smoothTransition}
 * />
 * ```
 */
export const smoothTransition: Transition = {
  duration: 0.6,
  ease: 'easeInOut',
}

/**
 * Fast transition configuration
 * Quick animations for immediate feedback
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeIn}
 *   initial="initial"
 *   animate="animate"
 *   transition={fastTransition}
 * />
 * ```
 */
export const fastTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}
