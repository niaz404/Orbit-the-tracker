/**
 * Framer Motion Animation Philosophy & Reusable Variants
 *
 * Rules:
 * - Subtle movements (4-8px max for micro-interactions, 12-16px for page/modal entrances).
 * - Fast transitions (150ms - 250ms for UI elements, 300ms max for large views).
 * - High-end easing curves (custom ease-out / Apple & Linear style timing).
 * - Zero intrusive bouncing or distracting perpetual animations.
 */

// Precision easing curves
export const ease = {
  smooth: [0.16, 1, 0.3, 1], // Linear / Vercel style snappy ease-out
  inOut: [0.4, 0, 0.2, 1],
  standard: [0.2, 0, 0, 1],
};

// Common duration presets (in seconds)
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.22,
  gentle: 0.3,
};

// Reusable transition configs
export const transitions = {
  fast: { duration: duration.fast, ease: ease.smooth },
  normal: { duration: duration.normal, ease: ease.smooth },
  gentle: { duration: duration.gentle, ease: ease.smooth },
  springSnappy: { type: "spring", stiffness: 450, damping: 35 },
};

/**
 * Standard Framer Motion Variants
 */

// Simple fade
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Subtle upward entrance for cards, list items, and panels
export const slideUp = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: transitions.fast,
  },
};

// Scale & fade for modals, dialogs, popovers, and dropdowns
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.fast,
  },
};

// Sidebar / Drawer slide
export const slideRight = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: transitions.fast,
  },
};

// Staggered list container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// Stagger item
export const staggerItem = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.fast,
  },
};

// Tab active pill layout animation id helper
export const activeTabTransition = {
  type: "spring",
  stiffness: 500,
  damping: 38,
};
