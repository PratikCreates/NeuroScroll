'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AttentionDataPoint {
  timestamp: number
  attentionSpan: number
  videoId?: string
}

interface AttentionChartProps {
  data: AttentionDataPoint[]
  width?: number
  height?: number
}

export default function AttentionChart({ 
  data, 
  width = 350, 
  height = 120 
}: AttentionChartProps) {
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
    const maxAttention = Math.max(...data.map(d => d.attentionSpan), 10)
    const minTime = Math.min(...data.map(d => d.timestamp))
    const maxTime = Math.max(...data.map(d => d.timestamp))
    const timeRange = maxTime - minTime || 1

    // Draw grid lines with better contrast
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = (width / 6) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Create gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, '#10b981')
    gradient.addColorStop(1, '#34d399')

    // Draw attention span line with gradient
    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = ((point.timestamp - minTime) / timeRange) * width
      const y = height - (point.attentionSpan / maxAttention) * height

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
      const y = height - (point.attentionSpan / maxAttention) * height

      // Glow effect
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 8
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Inner dot
      ctx.shadowBlur = 0
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels with better contrast
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Max: ${maxAttention.toFixed(1)}s`, 8, 18)
    ctx.textAlign = 'right'
    ctx.fillText('0s', width - 8, height - 8)

  }, [data, width, height])

  const currentAttention = data.length > 0 ? data[data.length - 1].attentionSpan : 0
  const averageAttention = data.length > 0 ? data.reduce((sum, d) => sum + d.attentionSpan, 0) / data.length : 0

  if (!data.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="attention-chart"
        role="img"
        aria-label="No attention data available"
      >
        <div className="text-xs text-white/70 mb-2 font-medium">
          Attention Span Over Time
        </div>
        <div 
          className="flex items-center justify-center bg-white/10 rounded-lg border border-white/20"
          style={{ width, height }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2" aria-hidden="true">📊</div>
            <span className="text-xs text-white/60">No attention data available</span>
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
      className="attention-chart"
      role="img"
      aria-label={`Attention span chart showing ${data.length} data points with current attention of ${currentAttention.toFixed(1)} seconds`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/70 font-medium">
          Attention Span Over Time
        </div>
        <div className="text-xs text-green-400 font-medium">
          Avg: {averageAttention.toFixed(1)}s
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
        aria-describedby="attention-chart-description"
      />
      
      <div 
        id="attention-chart-description" 
        className="text-xs text-white/60 mt-2 flex justify-between"
      >
        <span>{data.length} data points</span>
        <span>Current: {currentAttention.toFixed(1)}s</span>
      </div>

      {/* Screen reader description */}
      <div className="sr-only">
        Attention span chart displaying {data.length} data points over time. 
        Current attention span is {currentAttention.toFixed(1)} seconds. 
        Average attention span is {averageAttention.toFixed(1)} seconds.
        {currentAttention > 30 && " This indicates good focus levels."}
        {currentAttention < 15 && " This indicates low attention levels."}
      </div>
    </motion.div>
  )
}