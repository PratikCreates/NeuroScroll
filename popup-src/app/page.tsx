'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChromeStorage } from '../hooks/useChromeStorage'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { BasicMetrics } from '../components/BasicMetrics'
import { AdvancedMetrics } from '../components/AdvancedMetrics'
import AccessibleButton from '../components/AccessibleButton'
import ConfirmationDialog from '../components/ConfirmationDialog'

export default function Dashboard() {
  const {
    metrics,
    loading,
    error,
    refresh,
    exportData,
    clearData,
    startSession,
    stopSession,
    enableService,
    disableService
  } = useChromeStorage()
  const { prefersReducedMotion, getMotionConfig } = useMotionPreference()
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Auto-expand to fullscreen when switching to advanced
  useEffect(() => {
    if (showAdvanced && !isFullscreen) {
      setIsFullscreen(true)
    }
  }, [showAdvanced])

  const motionConfig = getMotionConfig()

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      await clearData()
    } finally {
      setIsClearing(false)
      setShowClearDialog(false)
    }
  }

  function getArchetypeEmoji(archetype: string) {
    switch (archetype) {
      case 'explorer': return '🧭'
      case 'sampler': return '🎯'
      case 'doomscroller': return '🌀'
      default: return '❓'
    }
  }

  function getArchetypeStatus(archetype: string) {
    switch (archetype) {
      case 'explorer': return 'good'
      case 'sampler': return 'warning'
      case 'doomscroller': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <div
      className={`popup-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
      role="main"
      aria-label="NeuroScroll Dashboard"
    >
      {/* Header - Fixed layout without centering */}
      <div className="flex items-start justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-2xl"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            role="img"
            aria-label="Brain emoji representing NeuroScroll"
          >
            🧠
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-white">NeuroScroll</h1>
            <p className="text-xs text-white/70">YouTube Shorts analyzer</p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          <AccessibleButton
            onClick={() => {
              // Open documentation page
              if (typeof chrome !== 'undefined' && chrome.tabs) {
                chrome.tabs.create({ url: chrome.runtime.getURL('docs.html') });
              } else {
                window.open('docs.html', '_blank');
              }
            }}
            variant="secondary"
            icon="📖"
            ariaLabel="Open documentation"
            className="text-xs px-2 py-1"
          >
            Docs
          </AccessibleButton>

          <AccessibleButton
            onClick={() => {
              if (!isFullscreen) {
                setShowAdvanced(true); // Auto-switch to advanced when going fullscreen
              }
              setIsFullscreen(!isFullscreen);
            }}
            variant="secondary"
            icon={isFullscreen ? '🔽' : '🔼'}
            ariaLabel={isFullscreen ? 'Minimize view' : 'Expand view'}
            className="text-xs px-2 py-1"
          >
            {isFullscreen ? 'Min' : 'Max'}
          </AccessibleButton>
        </div>
      </div>

      {/* Status Indicator - Compact */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.3 }}
        className="bg-white/10 rounded-lg p-3 mb-4 border border-white/20"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${metrics?.sessionActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
            <span className="text-white/90">
              {metrics?.sessionActive ? 'Recording Session' : 'Standby Mode'}
            </span>
          </div>
          <div className="text-white/70 text-xs">
            {metrics?.sessionActive ? `${metrics?.videoCount || 0} videos` : 'Ready to track'}
          </div>
        </div>

        {/* Quick Health Status */}
        {metrics?.sessionArchetype && metrics?.sessionArchetype !== 'unknown' && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>{getArchetypeEmoji(metrics.sessionArchetype)}</span>
                <span className="text-white/80 capitalize">{metrics.sessionArchetype}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${getArchetypeStatus(metrics.sessionArchetype) === 'good' ? 'bg-green-500/20 text-green-300' :
                  getArchetypeStatus(metrics.sessionArchetype) === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                    getArchetypeStatus(metrics.sessionArchetype) === 'danger' ? 'bg-red-500/20 text-red-300' :
                      'bg-gray-500/20 text-gray-300'
                }`}>
                {getArchetypeStatus(metrics.sessionArchetype) === 'good' ? 'Healthy' :
                  getArchetypeStatus(metrics.sessionArchetype) === 'warning' ? 'Moderate' :
                    getArchetypeStatus(metrics.sessionArchetype) === 'danger' ? 'Concerning' : 'Unknown'}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Metrics Toggle */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.2 }}
        className="flex justify-center mb-4"
      >
        <div className="bg-gray-800/50 rounded-lg p-1 flex border border-gray-700/50">
          <button
            onClick={() => setShowAdvanced(false)}
            className={`px-4 py-2 text-sm rounded transition-all ${!showAdvanced
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            📊 Basic Stats
          </button>
          <button
            onClick={() => setShowAdvanced(true)}
            className={`px-4 py-2 text-sm rounded transition-all ${showAdvanced
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            🧠 Advanced Stats
          </button>
        </div>
      </motion.div>

      {/* Metrics Content */}
      <AnimatePresence mode="wait">
        {showAdvanced ? (
          <motion.div
            key="advanced"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
          >
            <AdvancedMetrics metrics={metrics || {
              sessionActive: false,
              serviceEnabled: true,
              videoCount: 0,
              interactionCount: 0,
              attentionSpan: 0,
              dopamineIndex: 0,
              replaySensitivity: 0,
              sessionLength: 0,
              circadianDrift: 0,
              activeSessions: 0,
              storedSessions: 0,
              lastUpdate: '',
              scrollMomentum: 0,
              rewardVariability: 0,
              bingeBursts: 0,
              engagementHalfLife: 0,
              sessionArchetype: 'unknown',
              aiClassification: 'unknown',
              aiConfidence: 0
            }} loading={loading} />
          </motion.div>
        ) : (
          <motion.div
            key="basic"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
          >
            <BasicMetrics metrics={metrics || {
              sessionActive: false,
              serviceEnabled: true,
              videoCount: 0,
              interactionCount: 0,
              attentionSpan: 0,
              dopamineIndex: 0,
              replaySensitivity: 0,
              sessionLength: 0,
              circadianDrift: 0,
              activeSessions: 0,
              storedSessions: 0,
              lastUpdate: '',
              scrollMomentum: 0,
              rewardVariability: 0,
              bingeBursts: 0,
              engagementHalfLife: 0,
              sessionArchetype: 'unknown',
              aiClassification: 'unknown',
              aiConfidence: 0
            }} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel - Only show in basic mode or when not fullscreen */}
      {(!showAdvanced || !isFullscreen) && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.3 }}
          className="mt-4 space-y-3"
        >
          {/* System Status */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <h3 className="text-xs font-semibold mb-2 text-white/90 uppercase flex items-center gap-2">
              <span>🔧</span>
              System Status
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/70">Active Sessions:</span>
                  <span className="text-white">{metrics?.activeSessions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Stored Sessions:</span>
                  <span className="text-white">{metrics?.storedSessions || 0}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/70">Service:</span>
                  <span className={`${metrics?.serviceEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics?.serviceEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Updated:</span>
                  <span className="text-white/80 text-xs">{metrics?.lastUpdate || 'Never'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Primary Controls */}
              <div className="flex gap-2">
                <AccessibleButton
                  onClick={metrics?.serviceEnabled ? disableService : enableService}
                  disabled={loading}
                  variant={metrics?.serviceEnabled ? 'danger' : 'success'}
                  icon={metrics?.serviceEnabled ? '⏹️' : '▶️'}
                  ariaLabel={metrics?.serviceEnabled ? 'Disable tracking service' : 'Enable tracking service'}
                  className="flex-1 text-xs"
                >
                  {metrics?.serviceEnabled ? 'Disable Service' : 'Enable Service'}
                </AccessibleButton>
              </div>

              {/* Session Control */}
              <div className="flex gap-2">
                <AccessibleButton
                  onClick={startSession}
                  disabled={loading || !metrics?.serviceEnabled || metrics?.sessionActive}
                  loading={loading}
                  variant="success"
                  icon="▶️"
                  ariaLabel="Start a new tracking session"
                  className="flex-1 text-xs"
                >
                  Start Session
                </AccessibleButton>

                <AccessibleButton
                  onClick={stopSession}
                  disabled={loading || !metrics?.serviceEnabled || !metrics?.sessionActive}
                  variant="danger"
                  icon="⏹️"
                  ariaLabel="Stop current tracking session"
                  className="flex-1 text-xs"
                >
                  Stop Session
                </AccessibleButton>
              </div>

              {/* Data Management */}
              <div className="flex gap-2">
                <AccessibleButton
                  onClick={refresh}
                  disabled={loading}
                  loading={loading}
                  variant="primary"
                  icon="🔄"
                  ariaLabel="Refresh metrics data"
                  className="flex-1 text-xs"
                >
                  Refresh
                </AccessibleButton>

                <AccessibleButton
                  onClick={exportData}
                  disabled={loading}
                  variant="primary"
                  icon="📊"
                  ariaLabel="Export session data as CSV"
                  className="flex-1 text-xs"
                >
                  Export CSV
                </AccessibleButton>

                <AccessibleButton
                  onClick={() => setShowClearDialog(true)}
                  disabled={loading}
                  variant="danger"
                  icon="🗑️"
                  ariaLabel="Clear all session data"
                  className="flex-1 text-xs"
                >
                  Clear Data
                </AccessibleButton>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
            className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-400" aria-hidden="true">⚠️</span>
              <div>
                <div className="text-xs font-medium text-red-200">Error</div>
                <div className="text-xs text-red-300">{error}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClearDialog}
        title="Clear All Data"
        message="Are you sure you want to clear all session data? This action cannot be undone and will permanently delete all your viewing history and metrics."
        confirmText="Clear Data"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleClearData}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  )
}