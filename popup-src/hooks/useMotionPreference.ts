'use client'

import { useState, useEffect } from 'react'

export function useMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Return motion configuration based on user preference
  const getMotionConfig = () => {
    if (prefersReducedMotion) {
      return {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
        whileHover: {},
        whileTap: {}
      }
    }

    return {
      // Default motion configurations
      transition: { duration: 0.2 },
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    }
  }

  return {
    prefersReducedMotion,
    getMotionConfig
  }
}