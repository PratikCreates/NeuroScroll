'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface AccessibleButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  icon?: string
  fullWidth?: boolean
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  ariaDescribedBy,
  icon,
  fullWidth = false
}, ref) => {
  const getVariantClasses = () => {
    const base = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent'
    
    switch (variant) {
      case 'primary':
        return `${base} bg-white/20 hover:bg-white/30 focus:ring-white/50 text-white`
      case 'secondary':
        return `${base} bg-white/10 hover:bg-white/20 focus:ring-white/30 text-white/90`
      case 'success':
        return `${base} bg-green-500/30 hover:bg-green-500/40 focus:ring-green-400 text-white`
      case 'danger':
        return `${base} bg-red-500/30 hover:bg-red-500/40 focus:ring-red-400 text-white`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'md':
        return 'px-3 py-2 text-xs'
      case 'lg':
        return 'px-4 py-3 text-sm'
    }
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        rounded-md font-medium flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={isDisabled}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 border border-current border-t-transparent rounded-full"
          aria-hidden="true"
        />
      )}
      
      {icon && !loading && (
        <span aria-hidden="true">{icon}</span>
      )}
      
      <span>{children}</span>
    </motion.button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton