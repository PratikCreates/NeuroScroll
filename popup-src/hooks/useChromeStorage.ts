import { useState, useEffect, useCallback } from 'react'
import { MetricsData } from '../types'

export function useChromeStorage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if chrome extension APIs are available
      if (!chrome?.runtime?.id) {
        console.error('Chrome extension context not available')
        throw new Error('Extension context not available')
      }

      console.log('Sending GET_CURRENT_METRICS message to background script')

      // Get current metrics from background script
      const response = await chrome.runtime.sendMessage({ 
        type: 'GET_CURRENT_METRICS' 
      })

      console.log('Received response from background script:', response)

      if (response?.error) {
        throw new Error(response.error)
      }

      const metricsData: MetricsData = {
        sessionActive: response?.sessionActive || false,
        serviceEnabled: response?.serviceEnabled !== false, // Default to true
        videoCount: response?.videoCount || 0,
        interactionCount: response?.interactionCount || 0,
        attentionSpan: response?.attentionSpan || 0,
        dopamineIndex: response?.dopamineIndex || 0,
        replaySensitivity: response?.replaySensitivity || 0,
        sessionLength: response?.sessionLength || 0,
        circadianDrift: response?.circadianDrift || 0,
        activeSessions: response?.activeSessions || 0,
        storedSessions: response?.storedSessions || 0,
        lastUpdate: response?.lastUpdate || new Date().toLocaleTimeString(),
        // Advanced behavioral metrics
        scrollMomentum: response?.scrollMomentum || 0,
        rewardVariability: response?.rewardVariability || 0,
        bingeBursts: response?.bingeBursts || 0,
        engagementHalfLife: response?.engagementHalfLife || 0,
        cognitiveLoad: response?.cognitiveLoad || 0,
        habitStrength: response?.habitStrength || 0,
        noveltyBias: response?.noveltyBias || 0,
        sessionArchetype: response?.sessionArchetype || 'unknown',
        aiClassification: response?.aiClassification || 'unknown',
        aiConfidence: response?.aiConfidence || 0
      }

      setMetrics(metricsData)
    } catch (err) {
      console.error('Failed to load metrics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Set default metrics for development/testing
      const defaultMetrics: MetricsData = {
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
        lastUpdate: 'Never',
        scrollMomentum: 0,
        rewardVariability: 0,
        bingeBursts: 0,
        engagementHalfLife: 0,
        cognitiveLoad: 0,
        habitStrength: 0,
        noveltyBias: 0,
        sessionArchetype: 'unknown',
        aiClassification: 'unknown',
        aiConfidence: 0
      }
      setMetrics(defaultMetrics)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await loadMetrics()
  }, [loadMetrics])

  const exportData = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'EXPORT_DATA' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // The background script handles the actual CSV download
      console.log('Export initiated successfully')
    } catch (err) {
      console.error('Export failed:', err)
      setError(err instanceof Error ? err.message : 'Export failed')
    }
  }, [])

  const clearData = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'CLEAR_DATA' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // Refresh metrics after clearing
      await loadMetrics()
    } catch (err) {
      console.error('Clear failed:', err)
      setError(err instanceof Error ? err.message : 'Clear failed')
    }
  }, [loadMetrics])

  const startSession = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'START_SESSION' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // Refresh metrics after starting session
      await loadMetrics()
    } catch (err) {
      console.error('Start session failed:', err)
      setError(err instanceof Error ? err.message : 'Start session failed')
    }
  }, [loadMetrics])

  const stopSession = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'STOP_SESSION' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // Refresh metrics after stopping session
      await loadMetrics()
    } catch (err) {
      console.error('Stop session failed:', err)
      setError(err instanceof Error ? err.message : 'Stop session failed')
    }
  }, [loadMetrics])

  const enableService = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'ENABLE_SERVICE' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // Refresh metrics after enabling service
      await loadMetrics()
    } catch (err) {
      console.error('Enable service failed:', err)
      setError(err instanceof Error ? err.message : 'Enable service failed')
    }
  }, [loadMetrics])

  const disableService = useCallback(async () => {
    try {
      setError(null)
      
      if (!chrome?.runtime?.id) {
        throw new Error('Extension context not available')
      }

      const response = await chrome.runtime.sendMessage({ 
        type: 'DISABLE_SERVICE' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      // Refresh metrics after disabling service
      await loadMetrics()
    } catch (err) {
      console.error('Disable service failed:', err)
      setError(err instanceof Error ? err.message : 'Disable service failed')
    }
  }, [loadMetrics])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  return {
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
  }
}