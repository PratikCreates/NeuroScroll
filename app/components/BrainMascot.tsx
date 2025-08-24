'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BrainMascotProps {
  fatigueLevel: number // 0-1 scale
  attentionSpan: number
  dopamineIndex: number
  animated?: boolean
}

export default function BrainMascot({ 
  fatigueLevel, 
  attentionSpan, 
  dopamineIndex,
  animated = true 
}: BrainMascotProps) {
  const [currentEmoji, setCurrentEmoji] = useState('🧠')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBreathingTip, setShowBreathingTip] = useState(false)

  const getBrainState = () => {
    // Determine brain state based on metrics
    if (fatigueLevel > 0.8) {
      return {
        emoji: '😵‍💫',
        color: '#ef4444',
        message: 'Severely fatigued',
        description: 'Time for a break!',
        severity: 'high',
        recommendation: 'Take a 15-20 minute break away from screens'
      }
    } else if (fatigueLevel > 0.6) {
      return {
        emoji: '😴',
        color: '#f59e0b',
        message: 'Getting tired',
        description: 'Consider taking a break soon',
        severity: 'medium',
        recommendation: 'Take a 5-10 minute break or do some eye exercises'
      }
    } else if (dopamineIndex > 8) {
      return {
        emoji: '🤯',
        color: '#8b5cf6',
        message: 'Dopamine overload',
        description: 'High stimulation detected',
        severity: 'medium',
        recommendation: 'Try slowing down your viewing pace'
      }
    } else if (attentionSpan > 30) {
      return {
        emoji: '🧠',
        color: '#10b981',
        message: 'Focused',
        description: 'Good attention span',
        severity: 'low',
        recommendation: 'Great focus! Keep up the mindful viewing'
      }
    } else if (attentionSpan > 15) {
      return {
        emoji: '🤔',
        color: '#3b82f6',
        message: 'Moderate focus',
        description: 'Average attention levels',
        severity: 'low',
        recommendation: 'Try to be more mindful of your viewing habits'
      }
    } else {
      return {
        emoji: '😵',
        color: '#f97316',
        message: 'Scattered',
        description: 'Low attention span',
        severity: 'medium',
        recommendation: 'Consider taking breaks between videos'
      }
    }
  }

  const brainState = getBrainState()

  useEffect(() => {
    if (animated && currentEmoji !== brainState.emoji) {
      setIsAnimating(true)
      
      const timer = setTimeout(() => {
        setCurrentEmoji(brainState.emoji)
        setIsAnimating(false)
      }, 150)

      return () => clearTimeout(timer)
    } else if (!animated) {
      setCurrentEmoji(brainState.emoji)
    }
    
    return undefined
  }, [brainState.emoji, animated, currentEmoji])

  useEffect(() => {
    // Show breathing tip for high fatigue
    if (fatigueLevel > 0.6) {
      setShowBreathingTip(true)
    } else {
      setShowBreathingTip(false)
    }
  }, [fatigueLevel])

  const getMotionProps = () => {
    if (!animated) return {}
    
    return {
      animate: {
        scale: fatigueLevel > 0.7 ? [1, 1.05, 1] : 1,
        rotate: isAnimating ? [0, 5, -5, 0] : 0
      },
      transition: {
        scale: {
          duration: 2,
          repeat: fatigueLevel > 0.7 ? Infinity : 0,
          ease: 'easeInOut' as const
        },
        rotate: {
          duration: 0.5,
          ease: 'easeInOut' as const
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="brain-mascot flex flex-col items-center"
      role="region"
      aria-label="Brain mascot showing current mental state"
    >
      <motion.div 
        className="text-6xl mb-3 cursor-pointer"
        style={{ 
          filter: `drop-shadow(0 0 12px ${brainState.color}60)`,
          color: brainState.color
        }}
        role="img" 
        aria-label={`${brainState.message}: ${brainState.description}`}
        tabIndex={0}
        {...getMotionProps()}
        whileHover={animated ? { scale: 1.1 } : {}}
        whileTap={animated ? { scale: 0.95 } : {}}
      >
        {currentEmoji}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div 
          className="text-sm font-medium mb-1 text-high-contrast"
          style={{ color: brainState.color }}
          role="status"
          aria-live="polite"
        >
          {brainState.message}
        </div>
        <div className="text-xs text-white/80 mb-2">
          {brainState.description}
        </div>
        <div className="text-xs text-white/60 italic">
          {brainState.recommendation}
        </div>
      </motion.div>

      {/* Metrics summary with better accessibility */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-xs text-white/70 text-center space-y-1 bg-white/5 rounded-lg p-3 border border-white/10"
        role="region"
        aria-label="Current metrics summary"
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-medium text-white/90">Fatigue</div>
            <div className={`${fatigueLevel > 0.6 ? 'text-red-400' : 'text-green-400'}`}>
              {(fatigueLevel * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="font-medium text-white/90">Focus</div>
            <div className={`${attentionSpan > 20 ? 'text-green-400' : attentionSpan > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
              {attentionSpan.toFixed(1)}s
            </div>
          </div>
          <div>
            <div className="font-medium text-white/90">Stimulation</div>
            <div className={`${dopamineIndex > 6 ? 'text-red-400' : 'text-green-400'}`}>
              {dopamineIndex.toFixed(1)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breathing animation for high fatigue */}
      <AnimatePresence>
        {showBreathingTip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-xs text-white/70 text-center bg-blue-500/20 rounded-lg p-2 border border-blue-500/30"
            role="alert"
            aria-live="polite"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">🌬️</span>
              <span>Take a deep breath...</span>
            </motion.div>
            <div className="text-xs text-white/50 mt-1">
              Inhale for 4, hold for 4, exhale for 4
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen reader description */}
      <div className="sr-only">
        Brain mascot currently showing {brainState.message} state. 
        Fatigue level is {(fatigueLevel * 100).toFixed(0)} percent. 
        Attention span is {attentionSpan.toFixed(1)} seconds. 
        Dopamine index is {dopamineIndex.toFixed(1)}. 
        Recommendation: {brainState.recommendation}
      </div>
    </motion.div>
  )
}