'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface FatigueDataPoint {
  timestamp: number
  fatigueLevel: number
  sessionBoundary?: boolean
}

interface FatigueVisualizationProps {
  data: FatigueDataPoint[]
  width?: number
  height?: number
}

export default function FatigueVisualization({ 
  data, 
  width = 350, 
  height = 80 
}: FatigueVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data.length) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate scales
    const minTime = Math.min(...data.map(d => d.timestamp))
    const maxTime = Math.max(...data.map(d => d.timestamp))
    const timeRange = maxTime - minTime || 1

    // Draw session boundaries with better visibility
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])

    data.forEach(point => {
      if (point.sessionBoundary) {
        const x = ((point.timestamp - minTime) / timeRange) * width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
    })

    ctx.setLineDash([])

    // Create enhanced fatigue gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.9)') // High fatigue - red
    gradient.addColorStop(0.3, 'rgba(251, 191, 36, 0.7)') // Medium-high fatigue - orange
    gradient.addColorStop(0.6, 'rgba(251, 191, 36, 0.6)') // Medium fatigue - yellow
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.5)') // Low fatigue - green

    // Draw fatigue area with smooth curves
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, height)

    // Use quadratic curves for smoother visualization
    data.forEach((point, index) => {
      const x = ((point.timestamp - minTime) / timeRange) * width
      const y = height - (point.fatigueLevel * height)

      if (index === 0) {
        ctx.lineTo(x, y)
      } else if (index === data.length - 1) {
        ctx.lineTo(x, y)
      } else {
        const nextPoint = data[index + 1]
        const nextX = ((nextPoint.timestamp - minTime) / timeRange) * width
        const nextY = height - (nextPoint.fatigueLevel * height)
        const cpX = x + (nextX - x) / 2
        const cpY = y
        ctx.quadraticCurveTo(cpX, cpY, nextX, nextY)
      }
    })

    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    // Draw fatigue line with gradient stroke
    const lineGradient = ctx.createLinearGradient(0, 0, width, 0)
    lineGradient.addColorStop(0, '#ef4444')
    lineGradient.addColorStop(0.5, '#f59e0b')
    lineGradient.addColorStop(1, '#10b981')

    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = ((point.timestamp - minTime) / timeRange) * width
      const y = height - (point.fatigueLevel * height)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points with glow effect
    data.forEach(point => {
      const x = ((point.timestamp - minTime) / timeRange) * width
      const y = height - (point.fatigueLevel * height)
      
      // Determine color based on fatigue level
      let pointColor = '#10b981' // green
      if (point.fatigueLevel > 0.6) pointColor = '#ef4444' // red
      else if (point.fatigueLevel > 0.3) pointColor = '#f59e0b' // yellow

      // Glow effect
      ctx.shadowColor = pointColor
      ctx.shadowBlur = 6
      ctx.fillStyle = pointColor
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()

      // Inner dot
      ctx.shadowBlur = 0
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw timeline markers with better contrast
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'

    const timeMarkers = Math.min(5, data.length)
    for (let i = 0; i <= timeMarkers; i++) {
      const x = (width / timeMarkers) * i
      const time = minTime + (timeRange / timeMarkers) * i
      const timeStr = new Date(time).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      ctx.fillText(timeStr, x, height - 4)
    }

  }, [data, width, height])

  const getCurrentFatigueLevel = () => {
    if (!data.length) return 0
    return data[data.length - 1].fatigueLevel
  }

  const getFatigueStatus = (level: number) => {
    if (level < 0.3) return { 
      text: 'Fresh', 
      color: 'text-green-400',
      description: 'Low fatigue levels, good mental state'
    }
    if (level < 0.6) return { 
      text: 'Moderate', 
      color: 'text-yellow-400',
      description: 'Moderate fatigue, consider taking breaks'
    }
    return { 
      text: 'Fatigued', 
      color: 'text-red-400',
      description: 'High fatigue levels, break recommended'
    }
  }

  const getAverageFatigue = () => {
    if (!data.length) return 0
    return data.reduce((sum, d) => sum + d.fatigueLevel, 0) / data.length
  }

  const currentLevel = getCurrentFatigueLevel()
  const averageLevel = getAverageFatigue()
  const status = getFatigueStatus(currentLevel)
  const sessionCount = data.filter(d => d.sessionBoundary).length

  if (!data.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fatigue-visualization"
        role="img"
        aria-label="No fatigue data available"
      >
        <div className="text-xs text-white/70 mb-2 font-medium">
          Fatigue Timeline
        </div>
        <div 
          className="flex items-center justify-center bg-white/10 rounded-lg border border-white/20"
          style={{ width, height }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2" aria-hidden="true">📈</div>
            <span className="text-xs text-white/60">No fatigue data available</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fatigue-visualization"
      role="img"
      aria-label={`Fatigue timeline showing ${data.length} data points with current fatigue level of ${(currentLevel * 100).toFixed(0)} percent`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/70 font-medium">
          Fatigue Timeline
        </div>
        <div className={`text-xs font-medium ${status.color}`}>
          {status.text} ({(currentLevel * 100).toFixed(0)}%)
        </div>
      </div>
      
      <motion.canvas 
        ref={canvasRef}
        className="bg-white/10 rounded-lg border border-white/20"
        style={{ width, height }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        tabIndex={0}
        role="img"
        aria-describedby="fatigue-chart-description"
      />
      
      <div className="flex justify-between text-xs text-white/60 mt-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full" aria-hidden="true"></span>
          Fresh
        </span>
        <span className="text-center">
          Avg: {(averageLevel * 100).toFixed(0)}%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true"></span>
          Fatigued
        </span>
      </div>

      {sessionCount > 0 && (
        <div className="text-xs text-white/50 mt-1 text-center">
          {sessionCount} session{sessionCount !== 1 ? 's' : ''} • {data.length} data points
        </div>
      )}

      {/* Screen reader description */}
      <div 
        id="fatigue-chart-description" 
        className="sr-only"
      >
        Fatigue timeline chart displaying {data.length} data points over time. 
        Current fatigue level is {(currentLevel * 100).toFixed(0)} percent, which is {status.text.toLowerCase()}. 
        Average fatigue level is {(averageLevel * 100).toFixed(0)} percent.
        {sessionCount > 0 && ` Chart shows ${sessionCount} session${sessionCount !== 1 ? 's' : ''}.`}
        {status.description}
      </div>
    </motion.div>
  )
}