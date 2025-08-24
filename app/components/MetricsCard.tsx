'use client'

import { ReactNode } from 'react'

interface MetricsCardProps {
  title: string
  emoji: string
  value: string | number
  tooltip: string
  status?: 'active' | 'inactive' | 'warning' | 'normal'
  children?: ReactNode
}

export default function MetricsCard({ 
  title, 
  emoji, 
  value, 
  tooltip, 
  status = 'normal',
  children 
}: MetricsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      default: return 'text-white'
    }
  }

  return (
    <div className="metric-item" title={tooltip}>
      <div className="flex items-center gap-3">
        <span className="text-xl" role="img" aria-label={title}>
          {emoji}
        </span>
        <div>
          <div className="metric-label">{title}</div>
          {children}
        </div>
      </div>
      <span className={`metric-value ${getStatusColor()}`}>
        {value}
      </span>
    </div>
  )
}