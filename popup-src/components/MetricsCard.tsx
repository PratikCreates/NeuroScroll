'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface MetricItemProps {
  icon: string
  label: string
  value: string | number
  tooltip?: string
  status?: 'good' | 'warning' | 'danger' | 'neutral'
  loading?: boolean
  index: number
}

export function MetricItem({ 
  icon, 
  label, 
  value, 
  tooltip, 
  status = 'neutral', 
  loading = false,
  index 
}: MetricItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'danger': return 'text-red-400'
      default: return 'text-white'
    }
  }

  const formatValue = (val: string | number) => {
    if (loading) return 'Loading...'
    if (typeof val === 'number') {
      return val.toFixed(val < 10 ? 1 : 0)
    }
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      className="metric-item group relative cursor-help"
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => tooltip && setShowTooltip(false)}
      onFocus={() => tooltip && setShowTooltip(true)}
      onBlur={() => tooltip && setShowTooltip(false)}
      tabIndex={tooltip ? 0 : -1}
      role={tooltip ? 'button' : undefined}
      aria-label={tooltip ? `${label}: ${value}. ${tooltip}` : `${label}: ${value}`}
    >
      <div className="flex items-center gap-3">
        <motion.span 
          className="text-xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          {icon}
        </motion.span>
        <div>
          <div className="metric-label">{label}</div>
        </div>
      </div>
      
      <motion.span 
        className={`metric-value ${getStatusColor()}`}
        key={value} // Re-animate when value changes
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.3 }}
      >
        {formatValue(value)}
      </motion.span>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ 
            opacity: showTooltip ? 1 : 0, 
            y: showTooltip ? 0 : 10,
            scale: showTooltip ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-full mt-3 p-4 bg-gray-900/98 backdrop-blur-md text-white text-sm rounded-xl shadow-2xl border border-white/30 max-w-sm z-50 pointer-events-none"
          role="tooltip"
          aria-hidden={!showTooltip}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="font-semibold mb-2 text-white">{label}</div>
          <div className="text-white/90 leading-relaxed">{tooltip}</div>
          {/* Arrow */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-white/30" />
        </motion.div>
      )}
    </motion.div>
  )
}

interface MetricsCardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export default function MetricsCard({ children, title, className = '' }: MetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`metrics-card ${className}`}
      role="region"
      aria-label={title || 'Metrics'}
    >
      {title && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wide"
        >
          {title}
        </motion.h2>
      )}
      {children}
    </motion.div>
  )
}