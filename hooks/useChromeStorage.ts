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
        throw new Error('Extension context not available')
      }

      // Get current metrics from background script
      const response = await chrome.runtime.sendMessage({ 
        type: 'GET_CURRENT_METRICS' 
      })

      if (response?.error) {
        throw new Error(response.error)
      }

      const metricsData: MetricsData = {
        sessionActive: response?.sessionActive || false,
        videoCount: response?.videoCount || 0,
        interactionCount: response?.interactionCount || 0,
        attentionSpan: response?.attentionSpan || 0,
        dopamineIndex: response?.dopamineIndex || 0,
        replaySensitivity: response?.replaySensitivity || 0,
        sessionLength: response?.sessionLength || 0,
        circadianDrift: response?.circadianDrift || 0,
        activeSessions: response?.activeSessions || 0,
        storedSessions: response?.storedSessions || 0,
        lastUpdate: response?.lastUpdate || new Date().toLocaleTimeString()
      }

      setMetrics(metricsData)
    } catch (err) {
      console.error('Failed to load metrics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
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
    startSession
  }
}