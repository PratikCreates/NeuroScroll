'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MetricsData } from '../types'

interface AdvancedMetricsProps {
  metrics: MetricsData
  loading?: boolean
}

export function AdvancedMetrics({ metrics, loading = false }: AdvancedMetricsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const getArchetypeEmoji = (archetype: string) => {
    switch (archetype) {
      case 'explorer': return '🧭'
      case 'sampler': return '🎯'
      case 'doomscroller': return '🌀'
      default: return '❓'
    }
  }

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case 'explorer': return 'text-green-400'
      case 'sampler': return 'text-yellow-400'
      case 'doomscroller': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getArchetypeDescription = (archetype: string) => {
    switch (archetype) {
      case 'explorer': return 'Thoughtful, engaged viewing with selective content consumption. High attention span, low skip momentum.'
      case 'sampler': return 'Balanced approach with selective sampling. Moderate attention and skip patterns.'
      case 'doomscroller': return 'Compulsive, rapid consumption with poor engagement. Low attention, high skips, multiple binge bursts.'
      default: return 'Insufficient data for classification. Continue watching to build behavioral profile.'
    }
  }

  const MetricCard: React.FC<{
    title: string
    value: string
    tooltip: string
    icon: string
    status?: 'good' | 'warning' | 'danger'
    subtitle?: string
  }> = ({ title, value, tooltip, icon, status = 'good', subtitle }) => {
    const statusColors = {
      good: 'border-green-500/30 bg-green-500/10',
      warning: 'border-yellow-500/30 bg-yellow-500/10',
      danger: 'border-red-500/30 bg-red-500/10'
    }

    return (
      <div
        className={`relative p-4 rounded-lg border ${statusColors[status]} backdrop-blur-sm cursor-help transition-all duration-200 hover:shadow-lg`}
        title={tooltip}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium text-gray-300">{title}</span>
          </div>
          <span className="text-lg font-bold text-white">{loading ? '...' : value}</span>
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    )
  }

  const SectionHeader: React.FC<{
    title: string
    icon: string
    expandable?: boolean
    expanded?: boolean
    onToggle?: () => void
  }> = ({ title, icon, expandable = false, expanded = false, onToggle }) => (
    <div
      className={`flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 ${expandable ? 'cursor-pointer' : ''}`}
      onClick={expandable ? onToggle : undefined}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      {expandable && (
        <span className="text-gray-400">
          {expanded ? '🔼' : '🔽'}
        </span>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.h3 
        className="text-xl font-bold text-white mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        🧠 Advanced Neural Patterns
      </motion.h3>

      {/* Session Archetype - Featured */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{getArchetypeEmoji(metrics.sessionArchetype || 'unknown')}</div>
          <h4 className="text-2xl font-bold text-white mb-1">Session Archetype</h4>
          <div className={`text-xl font-bold capitalize ${getArchetypeColor(metrics.sessionArchetype || 'unknown')}`}>
            {metrics.sessionArchetype || 'Unknown'}
          </div>
        </div>
        <p className="text-sm text-gray-300 text-center leading-relaxed">
          {getArchetypeDescription(metrics.sessionArchetype || 'unknown')}
        </p>
      </motion.div>

      {/* Core Behavioral Metrics */}
      <div className="space-y-4">
        <SectionHeader title="Core Behavioral Metrics" icon="⚡" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Scroll Momentum"
            value={`${((metrics.scrollMomentum || 0) * 100).toFixed(0)}%`}
            tooltip="Impulse Index: Percentage of videos skipped in <3s. >50% indicates dopamine-seeking impulse scrolling behavior."
            icon="🌊"
            subtitle="Impulse scrolling indicator"
            status={
              (metrics.scrollMomentum || 0) > 0.6 ? 'danger' :
              (metrics.scrollMomentum || 0) > 0.3 ? 'warning' : 'good'
            }
          />
          <MetricCard
            title="Reward Variability"
            value={`${(metrics.rewardVariability || 0).toFixed(1)}s`}
            tooltip="Standard deviation of dwell times. High variability (>20s) indicates inconsistent dopamine rewards and addictive reinforcement patterns."
            icon="🎢"
            subtitle="Dopamine consistency"
            status={
              (metrics.rewardVariability || 0) > 20 ? 'danger' :
              (metrics.rewardVariability || 0) > 10 ? 'warning' : 'good'
            }
          />
          <MetricCard
            title="Binge Bursts"
            value={String(metrics.bingeBursts || 0)}
            tooltip="Rapid consumption loops: 5+ consecutive videos watched <5s each. More bursts indicate stronger doomscrolling patterns."
            icon="🔥"
            subtitle="Rapid consumption episodes"
            status={
              (metrics.bingeBursts || 0) >= 3 ? 'danger' :
              (metrics.bingeBursts || 0) >= 1 ? 'warning' : 'good'
            }
          />
          <MetricCard
            title="Engagement Half-Life"
            value={`${metrics.engagementHalfLife || 0} videos`}
            tooltip="Videos until attention drops to 50%. <5 videos = rapid decay, >10 videos = resilient engagement."
            icon="⏳"
            subtitle="Attention decay rate"
            status={
              (metrics.engagementHalfLife || 0) < 5 ? 'danger' :
              (metrics.engagementHalfLife || 0) < 10 ? 'warning' : 'good'
            }
          />
        </div>
      </div>

      {/* Cognitive & Behavioral Patterns */}
      <div className="space-y-4">
        <SectionHeader title="Cognitive & Behavioral Patterns" icon="🧠" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Cognitive Load"
            value={`${((metrics.cognitiveLoad || 0) * 100).toFixed(0)}%`}
            tooltip="Mental processing demand from content switching. >70% indicates high cognitive strain and mental fatigue."
            icon="🧠"
            subtitle="Mental processing demand"
            status={
              (metrics.cognitiveLoad || 0) > 0.7 ? 'danger' :
              (metrics.cognitiveLoad || 0) > 0.4 ? 'warning' : 'good'
            }
          />
          <MetricCard
            title="Habit Strength"
            value={`${((metrics.habitStrength || 0) * 100).toFixed(0)}%`}
            tooltip="Consistency of viewing patterns. >80% indicates deeply ingrained behavioral habits that may be hard to change."
            icon="🔄"
            subtitle="Pattern consistency"
            status={
              (metrics.habitStrength || 0) > 0.8 ? 'danger' :
              (metrics.habitStrength || 0) > 0.5 ? 'warning' : 'good'
            }
          />
          <MetricCard
            title="Novelty Bias"
            value={`${((metrics.noveltyBias || 0) * 100).toFixed(0)}%`}
            tooltip="Preference for new content over familiar patterns. >80% indicates strong novelty-seeking behavior."
            icon="✨"
            subtitle="New content preference"
            status={
              (metrics.noveltyBias || 0) > 0.8 ? 'danger' :
              (metrics.noveltyBias || 0) > 0.5 ? 'warning' : 'good'
            }
          />
        </div>
      </div>

      {/* Session Statistics */}
      <div className="space-y-4">
        <SectionHeader 
          title="Session Statistics" 
          icon="📊" 
          expandable={true}
          expanded={expandedSection === 'stats'}
          onToggle={() => setExpandedSection(expandedSection === 'stats' ? null : 'stats')}
        />
        <AnimatePresence>
          {expandedSection === 'stats' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">Dopamine Index</div>
                <div className="text-lg font-bold text-white">{(metrics.dopamineIndex || 0).toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">Attention Span</div>
                <div className="text-lg font-bold text-white">{(metrics.attentionSpan || 0).toFixed(1)}s</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">Replay Rate</div>
                <div className="text-lg font-bold text-white">{metrics.replaySensitivity || 0}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="text-xs text-gray-400">Session Length</div>
                <div className="text-lg font-bold text-white">{Math.floor((metrics.sessionLength || 0) / 60)}m</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Health Insights */}
      <div className="space-y-4">
        <SectionHeader title="Health Insights" icon="💡" />
        <div
          className={`p-4 rounded-lg border ${
            metrics.aiClassification === 'healthy' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
            metrics.aiClassification === 'doomscroll' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
            'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Health Classification</span>
            <span className="font-bold capitalize">{metrics.aiClassification || 'unknown'}</span>
          </div>
          <div className="text-sm opacity-80">
            Confidence: {((metrics.aiConfidence || 0) * 100).toFixed(0)}%
            {(metrics.circadianDrift || 0) > 30 && (
              <span className="ml-2 text-yellow-400">⚠️ Late night session detected</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}