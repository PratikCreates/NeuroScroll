'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MetricsData } from '../types'

interface BasicMetricsProps {
  metrics: MetricsData
  loading?: boolean
}

export function BasicMetrics({ metrics, loading = false }: BasicMetricsProps) {
  const getArchetypeEmoji = (archetype: string) => {
    switch (archetype) {
      case 'explorer': return '🧭'
      case 'sampler': return '🎯'
      case 'doomscroller': return '🌀'
      default: return '❓'
    }
  }

  const getArchetypeStatus = (archetype: string) => {
    switch (archetype) {
      case 'explorer': return 'good'
      case 'sampler': return 'warning'
      case 'doomscroller': return 'danger'
      default: return 'neutral'
    }
  }

  const getHealthStatus = (metrics: MetricsData) => {
    const attentionGood = (metrics.attentionSpan || 0) > 10
    const dopamineGood = (metrics.dopamineIndex || 0) < 5
    const scrollGood = (metrics.scrollMomentum || 0) < 0.5
    const sessionGood = (metrics.sessionLength || 0) < 3600 // 1 hour

    const goodCount = [attentionGood, dopamineGood, scrollGood, sessionGood].filter(Boolean).length
    
    if (goodCount >= 3) return 'good'
    if (goodCount >= 2) return 'warning'
    return 'danger'
  }

  const getHealthMessage = (metrics: MetricsData) => {
    const status = getHealthStatus(metrics)
    switch (status) {
      case 'good': return 'Healthy viewing patterns detected'
      case 'warning': return 'Some concerning patterns detected'
      case 'danger': return 'Multiple risk factors present'
      default: return 'Insufficient data for analysis'
    }
  }

  const MetricCard: React.FC<{
    icon: string
    label: string
    value: string | number
    status: 'good' | 'warning' | 'danger' | 'neutral'
    tooltip?: string
  }> = ({ icon, label, value, status, tooltip }) => {
    const statusColors = {
      good: 'border-green-500/30 bg-green-500/10',
      warning: 'border-yellow-500/30 bg-yellow-500/10', 
      danger: 'border-red-500/30 bg-red-500/10',
      neutral: 'border-gray-500/30 bg-gray-500/10'
    }

    return (
      <div 
        className={`p-3 rounded-lg border ${statusColors[status]} backdrop-blur-sm`}
        title={tooltip}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium text-white/90">{label}</span>
          </div>
          <span className="text-lg font-bold text-white">
            {loading ? '...' : value}
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Health Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`rounded-xl p-4 border ${
          getHealthStatus(metrics) === 'good' ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30' :
          getHealthStatus(metrics) === 'warning' ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30' :
          'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Session Health</h3>
            <p className="text-sm text-white/70">{getHealthMessage(metrics)}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl mb-1 ${
              getHealthStatus(metrics) === 'good' ? 'text-green-400' :
              getHealthStatus(metrics) === 'warning' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {getHealthStatus(metrics) === 'good' ? '✅' :
               getHealthStatus(metrics) === 'warning' ? '⚠️' : '🚨'}
            </div>
            {metrics.sessionArchetype && metrics.sessionArchetype !== 'unknown' && (
              <div className="flex items-center gap-1">
                <span className="text-lg">{getArchetypeEmoji(metrics.sessionArchetype)}</span>
                <span className="text-xs text-white/60 capitalize">{metrics.sessionArchetype}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Core Metrics */}
      <div className="bg-gray-900/30 rounded-lg p-3 border border-gray-700/30">
        <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
          <span>📊</span>
          Core Metrics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon="📺"
            label="Videos Watched"
            value={metrics.videoCount || 0}
            tooltip="Total number of YouTube Shorts videos viewed in the current session."
            status="neutral"
          />

          <MetricCard
            icon="👆"
            label="Interactions"
            value={metrics.interactionCount || 0}
            tooltip="Total user interactions recorded (scrolls, replays, navigation events)."
            status="neutral"
          />

          <MetricCard
            icon="⏱️"
            label="Attention Span"
            value={`${(metrics.attentionSpan || 0).toFixed(1)}s`}
            tooltip="Average time spent viewing each video. Higher values indicate better focus and engagement."
            status={
              (metrics.attentionSpan || 0) > 15 ? 'good' :
              (metrics.attentionSpan || 0) > 8 ? 'warning' : 'danger'
            }
          />

          <MetricCard
            icon="🧠"
            label="Dopamine Index"
            value={(metrics.dopamineIndex || 0).toFixed(2)}
            tooltip="Measure of dopamine-driven behavior based on rapid content switching. Lower values are healthier."
            status={
              (metrics.dopamineIndex || 0) < 2 ? 'good' :
              (metrics.dopamineIndex || 0) < 5 ? 'warning' : 'danger'
            }
          />

          <MetricCard
            icon="🔄"
            label="Replay Rate"
            value={(metrics.replaySensitivity || 0).toFixed(1)}
            tooltip="Number of videos replayed. High values may indicate compulsive viewing behavior."
            status={
              (metrics.replaySensitivity || 0) < 3 ? 'good' :
              (metrics.replaySensitivity || 0) < 8 ? 'warning' : 'danger'
            }
          />

          <MetricCard
            icon="⏰"
            label="Session Length"
            value={`${Math.floor((metrics.sessionLength || 0) / 60)}m`}
            tooltip="Total duration of the current viewing session."
            status={
              (metrics.sessionLength || 0) < 1800 ? 'good' :
              (metrics.sessionLength || 0) < 3600 ? 'warning' : 'danger'
            }
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-900/20 rounded-lg p-3 border border-gray-700/20">
        <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
          <span>⚡</span>
          Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Skip Rate:</span>
              <span className={`font-medium ${
                (metrics.scrollMomentum || 0) > 0.6 ? 'text-red-400' : 
                (metrics.scrollMomentum || 0) > 0.3 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {((metrics.scrollMomentum || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Binge Episodes:</span>
              <span className={`font-medium ${
                (metrics.bingeBursts || 0) >= 3 ? 'text-red-400' : 
                (metrics.bingeBursts || 0) >= 1 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {metrics.bingeBursts || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Half-Life:</span>
              <span className="text-white font-medium">{metrics.engagementHalfLife || 0}v</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Variability:</span>
              <span className="text-white font-medium">{(metrics.rewardVariability || 0).toFixed(1)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Night Usage:</span>
              <span className={`font-medium ${
                (metrics.circadianDrift || 0) > 50 ? 'text-red-400' : 
                (metrics.circadianDrift || 0) > 25 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {(metrics.circadianDrift || 0).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">AI Confidence:</span>
              <span className="text-white font-medium">{((metrics.aiConfidence || 0) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 border border-blue-500/20">
        <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
          <span>💡</span>
          Quick Tips
        </h4>
        <div className="space-y-1 text-xs text-white/80">
          {(metrics.attentionSpan || 0) < 8 && (
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>Try the 3-second rule: pause before skipping to improve focus</span>
            </div>
          )}
          {(metrics.scrollMomentum || 0) > 0.6 && (
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>High skip rate detected - consider curating your feed</span>
            </div>
          )}
          {(metrics.bingeBursts || 0) >= 2 && (
            <div className="flex items-center gap-2">
              <span>⏰</span>
              <span>Set viewing time limits to prevent binge episodes</span>
            </div>
          )}
          {(metrics.circadianDrift || 0) > 30 && (
            <div className="flex items-center gap-2">
              <span>🌙</span>
              <span>Late night viewing detected - consider earlier cutoff times</span>
            </div>
          )}
          {(metrics.attentionSpan || 0) > 15 && (metrics.scrollMomentum || 0) < 0.3 && (
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Great viewing habits! You're engaging thoughtfully with content</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}