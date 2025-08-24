'use client'

import { useChromeStorage } from '../hooks/useChromeStorage'
import MetricsCard from './components/MetricsCard'
import AttentionChart from './components/AttentionChart'
import FatigueVisualization from './components/FatigueVisualization'
import BrainMascot from './components/BrainMascot'

export default function Dashboard() {
  const { metrics, loading, error, refresh, exportData, clearData, startSession } = useChromeStorage()

  // Generate sample data for visualizations (in real implementation, this would come from metrics)
  const attentionData = metrics ? [
    { timestamp: Date.now() - 300000, attentionSpan: metrics.attentionSpan * 0.8 },
    { timestamp: Date.now() - 240000, attentionSpan: metrics.attentionSpan * 1.2 },
    { timestamp: Date.now() - 180000, attentionSpan: metrics.attentionSpan * 0.9 },
    { timestamp: Date.now() - 120000, attentionSpan: metrics.attentionSpan * 1.1 },
    { timestamp: Date.now() - 60000, attentionSpan: metrics.attentionSpan * 0.95 },
    { timestamp: Date.now(), attentionSpan: metrics.attentionSpan }
  ] : []

  const fatigueData = metrics ? [
    { timestamp: Date.now() - 300000, fatigueLevel: 0.2 },
    { timestamp: Date.now() - 240000, fatigueLevel: 0.3, sessionBoundary: true },
    { timestamp: Date.now() - 180000, fatigueLevel: 0.5 },
    { timestamp: Date.now() - 120000, fatigueLevel: 0.7 },
    { timestamp: Date.now() - 60000, fatigueLevel: 0.8 },
    { timestamp: Date.now(), fatigueLevel: Math.min(metrics.sessionLength / 3600, 1) }
  ] : []

  return (
    <div className="popup-container">
      {/* Header with Brain Mascot */}
      <div className="text-center mb-6">
        <BrainMascot 
          fatigueLevel={metrics ? Math.min(metrics.sessionLength / 3600, 1) : 0}
          attentionSpan={metrics?.attentionSpan || 0}
          dopamineIndex={metrics?.dopamineIndex || 0}
        />
        <h1 className="text-xl font-bold mb-1 mt-3">NeuroScroll</h1>
        <p className="text-xs opacity-90">
          YouTube Shorts behavior analyzer
        </p>
      </div>
      
      {/* Core Metrics */}
      <div className="metrics-card">
        <MetricsCard
          title="Session Status"
          emoji="🔄"
          value={loading ? 'Loading...' : metrics?.sessionActive ? 'Active' : 'Inactive'}
          tooltip="Current tracking session state"
          status={metrics?.sessionActive ? 'active' : 'inactive'}
        />
        
        <MetricsCard
          title="Videos Watched"
          emoji="📺"
          value={loading ? '-' : metrics?.videoCount || 0}
          tooltip="Total number of YouTube Shorts viewed in this session"
        />
        
        <MetricsCard
          title="Interactions"
          emoji="👆"
          value={loading ? '-' : metrics?.interactionCount || 0}
          tooltip="Total user interactions (scrolls, enters, leaves, replays)"
        />
        
        <MetricsCard
          title="Attention Span"
          emoji="🧠"
          value={loading ? '-' : `${metrics?.attentionSpan || 0}s`}
          tooltip="Average time spent watching each video - indicates focus level"
        >
          {metrics && attentionData.length > 0 && (
            <div className="mt-2">
              <AttentionChart data={attentionData} width={300} height={60} />
            </div>
          )}
        </MetricsCard>
        
        <MetricsCard
          title="Dopamine Spike Index"
          emoji="⚡"
          value={loading ? '-' : (metrics?.dopamineIndex || 0).toFixed(2)}
          tooltip="Rapid content consumption rate - higher values may indicate dopamine-seeking behavior"
          status={metrics && metrics.dopamineIndex > 8 ? 'warning' : 'normal'}
        />
        
        <MetricsCard
          title="Replay Sensitivity"
          emoji="🔁"
          value={loading ? '-' : (metrics?.replaySensitivity || 0).toFixed(2)}
          tooltip="Number of video replays - indicates content engagement or compulsive behavior"
        />
        
        <MetricsCard
          title="Session Length"
          emoji="⏱️"
          value={loading ? '-' : `${Math.floor((metrics?.sessionLength || 0) / 60)}m`}
          tooltip="Total session duration - longer sessions may indicate binge behavior"
          status={metrics && metrics.sessionLength > 1800 ? 'warning' : 'normal'}
        />
        
        <MetricsCard
          title="Circadian Drift"
          emoji="🌙"
          value={loading ? '-' : `${(metrics?.circadianDrift || 0).toFixed(1)}%`}
          tooltip="Late-night usage (11 PM - 6 AM) can disrupt circadian rhythms"
          status={metrics && metrics.circadianDrift > 50 ? 'warning' : 'normal'}
        />
      </div>

      {/* Fatigue Visualization */}
      {metrics && fatigueData.length > 0 && (
        <div className="metrics-card">
          <FatigueVisualization data={fatigueData} width={350} height={60} />
        </div>
      )}
      
      {/* Debug Section */}
      <div className="debug-section">
        <div className="text-xs font-semibold mb-3 opacity-80 uppercase">
          Debug Information
        </div>
        <div className="text-xs opacity-70 mb-1">
          Active Sessions: {metrics?.activeSessions || 0}
        </div>
        <div className="text-xs opacity-70 mb-1">
          Stored Sessions: {metrics?.storedSessions || 0}
        </div>
        <div className="text-xs opacity-70 mb-4">
          Last Update: {metrics?.lastUpdate || 'Never'}
        </div>
        
        <div className="flex gap-2 mb-2">
          <button 
            className="btn-primary flex-1" 
            onClick={refresh}
            disabled={loading}
          >
            Refresh
          </button>
          <button 
            className="btn-primary flex-1" 
            onClick={exportData}
            disabled={loading}
          >
            Export
          </button>
          <button 
            className="btn-primary flex-1" 
            onClick={clearData}
            disabled={loading}
          >
            Clear
          </button>
        </div>
        
        <div className="flex">
          <button 
            className="btn-primary btn-success w-full" 
            onClick={startSession}
            disabled={loading}
          >
            Start Session
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-2 bg-red-500/20 rounded text-xs text-red-200">
          Error: {error}
        </div>
      )}
    </div>
  )
}