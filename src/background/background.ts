/**
 * Background service worker for NeuroScroll extension
 * Handles message passing, data processing, and metrics computation
 * Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import { VideoInteraction, ViewingSession, ComputedMetrics } from '../types';
import { StorageManager } from '../utils/storage';
import { MetricsEngine } from '../utils/metrics-engine';
import { AIClassifier } from '../utils/ai-classifier';
import { AIScheduler } from '../utils/ai-scheduler';

console.log('NeuroScroll background service worker loaded');

// Service Worker health monitoring
let serviceWorkerHealthy = true;

// Test storage access immediately to detect SW context issues
(async () => {
  try {
    await chrome.storage.local.set({ 'neuroscroll-sw-health': Date.now() });
    console.log('✅ Service Worker storage access confirmed');
    serviceWorkerHealthy = true;
  } catch (error) {
    console.error('❌ Service Worker storage access failed:', error);
    serviceWorkerHealthy = false;
  }
})();

// Periodic health check
setInterval(async () => {
  try {
    await chrome.storage.local.set({ 'neuroscroll-sw-health': Date.now() });
    if (!serviceWorkerHealthy) {
      console.log('✅ Service Worker recovered');
      serviceWorkerHealthy = true;
    }
  } catch (error) {
    if (serviceWorkerHealthy) {
      console.warn('⚠️ Service Worker health check failed:', error);
      serviceWorkerHealthy = false;
    }
  }
}, 30000); // Check every 30 seconds

const storageManager = new StorageManager();
const activeSessions = new Map<string, ViewingSession>();
const aiScheduler = AIScheduler.getInstance();

// Real-time metrics update interval (30 seconds)
const METRICS_UPDATE_INTERVAL = 30000;

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Validate message structure
  if (!message || typeof message.type !== 'string') {
    console.warn('Invalid message format:', message);
    sendResponse({ status: 'error', error: 'Invalid message format' });
    return true;
  }
  
  // Handle different message types
  switch (message.type) {
    case 'PING':
      sendResponse({ status: 'pong' });
      break;
      
    case 'SESSION_START':
      handleSessionStart(message, sendResponse);
      break;
      
    case 'SESSION_END':
      handleSessionEnd(message, sendResponse);
      break;
      
    case 'INTERACTION':
      handleInteraction(message, sendResponse);
      break;
      
    case 'GET_METRICS':
      handleGetMetrics(message, sendResponse);
      break;
      
    case 'GET_CURRENT_METRICS':
      handleGetCurrentMetrics(message, sendResponse);
      break;
      
    case 'GET_SESSIONS':
      handleGetSessions(message, sendResponse);
      break;
      
    case 'EXPORT_DATA':
      handleExportData(message, sendResponse);
      break;
      
    case 'CLEAR_DATA':
      handleClearData(message, sendResponse);
      break;
      
    case 'GET_ACTIVE_SESSION':
      handleGetActiveSession(message, sendResponse);
      break;
      
    case 'DEBUG_STATUS':
      handleDebugStatus(message, sendResponse);
      break;
      
    case 'RESTART_CONTENT_SCRIPT':
      handleRestartContentScript(message, sendResponse);
      break;
      
    case 'FORCE_START_SESSION':
      handleForceStartSession(message, sendResponse);
      break;
      
    case 'START_SESSION':
      handleSessionStart(message, sendResponse);
      break;
      
    case 'STOP_SESSION':
      handleStopSession(message, sendResponse);
      break;
      
    case 'ENABLE_SERVICE':
      handleEnableService(message, sendResponse);
      break;
      
    case 'DISABLE_SERVICE':
      handleDisableService(message, sendResponse);
      break;
      
    case 'GET_AI_STATUS':
      handleGetAIStatus(message, sendResponse);
      break;
      
    case 'CLASSIFY_SESSION':
      handleClassifySession(message, sendResponse);
      break;
      
    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ status: 'error', error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});

async function handleSessionStart(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    // Handle both content script format (with sessionId, timestamp) and popup format (without)
    let sessionId = message.sessionId;
    let timestamp = message.timestamp;
    
    if (!sessionId) {
      // Create new session for popup request
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      timestamp = Date.now();
    }
    
    const session: ViewingSession = {
      id: sessionId,
      startTime: timestamp,
      isActive: true,
      videoCount: 0,
      totalDwellTime: 0,
      interactions: []
    };
    
    activeSessions.set(sessionId, session);
    
    // Start real-time metrics updates for this session
    startRealTimeMetricsUpdates(sessionId);
    
    console.log('Session started:', sessionId);
    sendResponse({ status: 'success', sessionId });
  } catch (error) {
    console.error('Error starting session:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleSessionEnd(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { sessionId, timestamp } = message;
    
    if (!sessionId || !timestamp) {
      throw new Error('Missing required fields: sessionId, timestamp');
    }
    
    const session = activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found: ' + sessionId);
    }
    
    // Finalize session
    session.endTime = timestamp;
    session.isActive = false;
    
    // Compute final metrics
    session.computedMetrics = MetricsEngine.computeMetrics(session);
    
    // Schedule AI classification for completed session
    scheduleAIAnalysis(session, session.computedMetrics, 'normal');
    
    // Save session to storage
    await storageManager.saveSession(session);
    
    // Stop real-time updates
    stopRealTimeMetricsUpdates(sessionId);
    
    // Remove from active sessions
    activeSessions.delete(sessionId);
    
    console.log('Session ended and saved:', sessionId, 'Metrics:', session.computedMetrics);
    sendResponse({ 
      status: 'success', 
      metrics: session.computedMetrics 
    });
  } catch (error) {
    console.error('Error ending session:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleInteraction(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { interaction } = message;
    
    if (!interaction || !isValidInteraction(interaction)) {
      throw new Error('Invalid interaction data');
    }
    
    let session = activeSessions.get(interaction.sessionId);
    
    // Auto-create session if it doesn't exist (recovery mechanism)
    if (!session) {
      console.warn('Session not found, creating new session:', interaction.sessionId);
      session = {
        id: interaction.sessionId,
        startTime: interaction.timestamp - 1000, // Start slightly before first interaction
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      };
      activeSessions.set(interaction.sessionId, session);
      startRealTimeMetricsUpdates(interaction.sessionId);
    }
    
    // Add interaction to session
    session.interactions.push(interaction);
    
    // Update session statistics
    updateSessionStats(session, interaction);
    
    // Update real-time metrics if significant interaction
    if (interaction.action === 'leave' || interaction.action === 'replay') {
      session.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
      
      // Schedule real-time AI analysis for active sessions with sufficient data
      if (session.interactions.length >= 5 && session.interactions.length % 10 === 0) {
        scheduleAIAnalysis(session, session.computedMetrics, 'high');
      }
    }
    
    // Auto-save session periodically to prevent data loss
    await autoSaveSession(session);
    
    console.log('Interaction recorded:', interaction.action, interaction.videoId, 'Session:', interaction.sessionId);
    sendResponse({ 
      status: 'success',
      metrics: session.computedMetrics 
    });
  } catch (error) {
    console.error('Error handling interaction:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

function isValidInteraction(interaction: any): interaction is VideoInteraction {
  try {
    // Check if interaction exists
    if (!interaction) {
      console.error('Interaction is null or undefined');
      return false;
    }

    // Validate required string fields
    if (typeof interaction.id !== 'string' || interaction.id.length === 0) {
      console.error('Invalid interaction.id:', interaction.id);
      return false;
    }

    if (typeof interaction.videoId !== 'string' || interaction.videoId.length === 0) {
      console.error('Invalid interaction.videoId:', interaction.videoId);
      return false;
    }

    if (typeof interaction.sessionId !== 'string' || interaction.sessionId.length === 0) {
      console.error('Invalid interaction.sessionId:', interaction.sessionId);
      return false;
    }

    // Validate timestamp
    if (typeof interaction.timestamp !== 'number' || interaction.timestamp <= 0) {
      console.error('Invalid interaction.timestamp:', interaction.timestamp);
      return false;
    }

    // Validate action
    if (!['enter', 'leave', 'replay', 'scroll'].includes(interaction.action)) {
      console.error('Invalid interaction.action:', interaction.action);
      return false;
    }

    // Validate metadata (can be empty object but must exist)
    if (typeof interaction.metadata !== 'object' || interaction.metadata === null) {
      console.error('Invalid interaction.metadata:', interaction.metadata);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating interaction:', error, 'Interaction data:', interaction);
    return false;
  }
}

async function handleGetMetrics(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { sessionId } = message;
    
    if (sessionId) {
      // Get metrics for specific session
      const session = activeSessions.get(sessionId);
      if (session) {
        const metrics = MetricsEngine.updateRealTimeMetrics(session);
        sendResponse({ status: 'success', metrics });
      } else {
        // Check stored sessions
        const sessions = await StorageManager.get('neuroscroll-sessions') || [];
        const storedSession = sessions.find(s => s.id === sessionId);
        if (storedSession?.computedMetrics) {
          sendResponse({ status: 'success', metrics: storedSession.computedMetrics });
        } else {
          throw new Error('Session not found: ' + sessionId);
        }
      }
    } else {
      // Get metrics for all active sessions
      const allMetrics: Record<string, ComputedMetrics> = {};
      for (const [id, session] of activeSessions) {
        allMetrics[id] = MetricsEngine.updateRealTimeMetrics(session);
      }
      sendResponse({ status: 'success', metrics: allMetrics });
    }
  } catch (error) {
    console.error('Error getting metrics:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleGetCurrentMetrics(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
    const activeSessionsArray = Array.from(activeSessions.values());
    const settings = await StorageManager.getSettings();
    const serviceEnabled = settings.serviceEnabled !== false; // Default to true
    
    // Get the most recent active session or create default metrics
    let currentMetrics = {
      sessionActive: activeSessionsArray.length > 0,
      serviceEnabled: serviceEnabled,
      videoCount: 0,
      interactionCount: 0,
      attentionSpan: 0,
      dopamineIndex: 0,
      replaySensitivity: 0,
      sessionLength: 0,
      circadianDrift: 0,
      activeSessions: activeSessionsArray.length,
      storedSessions: storedSessions.length,
      lastUpdate: new Date().toLocaleTimeString(),
      scrollMomentum: 0,
      rewardVariability: 0,
      bingeBursts: 0,
      engagementHalfLife: 0,
      cognitiveLoad: 0,
      habitStrength: 0,
      noveltyBias: 0,
      sessionArchetype: 'unknown' as 'explorer' | 'sampler' | 'doomscroller' | 'unknown',
      aiClassification: 'unknown' as 'healthy' | 'doomscroll' | 'unknown',
      aiConfidence: 0
    };
    
    if (activeSessionsArray.length > 0) {
      // Get metrics from the most recent active session
      const mostRecentSession = activeSessionsArray.sort((a, b) => b.startTime - a.startTime)[0];
      const metrics = MetricsEngine.updateRealTimeMetrics(mostRecentSession);
      
      if (metrics) {
        currentMetrics = {
          sessionActive: true,
          serviceEnabled: serviceEnabled,
          videoCount: mostRecentSession.videoCount || 0,
          interactionCount: mostRecentSession.interactions.length || 0,
          attentionSpan: metrics.attentionSpan || 0,
          dopamineIndex: metrics.dopamineSpikeIndex || 0,
          replaySensitivity: metrics.replaySensitivity || 0,
          sessionLength: Math.floor((Date.now() - mostRecentSession.startTime) / 1000) || 0,
          circadianDrift: metrics.circadianDrift ? 100 : 0,
          activeSessions: activeSessionsArray.length,
          storedSessions: storedSessions.length,
          lastUpdate: new Date().toLocaleTimeString(),
          scrollMomentum: metrics.scrollMomentum || 0,
          rewardVariability: metrics.rewardVariability || 0,
          bingeBursts: metrics.bingeBursts?.length || 0,
          engagementHalfLife: metrics.engagementHalfLife || 0,
          cognitiveLoad: metrics.cognitiveLoad || 0,
          habitStrength: metrics.habitStrength || 0,
          noveltyBias: metrics.noveltyBias || 0,
          sessionArchetype: (metrics.sessionArchetype || 'unknown') as 'explorer' | 'sampler' | 'doomscroller' | 'unknown',
          aiClassification: (metrics.healthClassification || 'unknown') as 'healthy' | 'doomscroll' | 'unknown',
          aiConfidence: metrics.confidence || 0
        };
      }
    }
    
    sendResponse(currentMetrics);
  } catch (error) {
    console.error('Error getting current metrics:', error);
    sendResponse({ 
      error: error instanceof Error ? error.message : 'Unknown error',
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
      lastUpdate: new Date().toLocaleTimeString(),
      scrollMomentum: 0,
      rewardVariability: 0,
      bingeBursts: 0,
      engagementHalfLife: 0,
      sessionArchetype: 'unknown' as 'explorer' | 'sampler' | 'doomscroller' | 'unknown',
      aiClassification: 'unknown' as 'healthy' | 'doomscroll' | 'unknown',
      aiConfidence: 0
    });
  }
}

async function handleGetSessions(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { includeActive = true, limit } = message;
    
    // Get stored sessions
    const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
    
    let allSessions = [...storedSessions];
    
    // Add active sessions if requested
    if (includeActive) {
      const activeSessArray = Array.from(activeSessions.values()).map(session => ({
        ...session,
        computedMetrics: MetricsEngine.updateRealTimeMetrics(session)
      }));
      allSessions = [...allSessions, ...activeSessArray];
    }
    
    // Sort by start time (newest first)
    allSessions.sort((a, b) => b.startTime - a.startTime);
    
    // Apply limit if specified
    if (limit && limit > 0) {
      allSessions = allSessions.slice(0, limit);
    }
    
    sendResponse({ status: 'success', sessions: allSessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleExportData(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { format = 'csv' } = message;
    
    if (format === 'csv') {
      const csvData = await StorageManager.exportAsCSV();
      sendResponse({ status: 'success', data: csvData, format: 'csv' });
    } else if (format === 'json') {
      const sessions = await StorageManager.get('neuroscroll-sessions') || [];
      const jsonData = JSON.stringify(sessions, null, 2);
      sendResponse({ status: 'success', data: jsonData, format: 'json' });
    } else {
      throw new Error('Unsupported export format: ' + format);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleClearData(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    // For popup requests, auto-confirm (user already clicked the button)
    const confirmed = message.confirmed !== undefined ? message.confirmed : true;
    
    if (!confirmed) {
      sendResponse({ status: 'error', error: 'Data clearing requires confirmation' });
      return;
    }
    
    // Clear stored data
    const success = await StorageManager.clearAllData();
    
    // Clear active sessions
    activeSessions.clear();
    
    // Stop all real-time updates
    clearAllRealTimeUpdates();
    
    if (success) {
      console.log('All data cleared successfully');
      sendResponse({ status: 'success' });
    } else {
      throw new Error('Failed to clear storage');
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleGetActiveSession(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const activeSessArray = Array.from(activeSessions.values()).map(session => ({
      ...session,
      computedMetrics: MetricsEngine.updateRealTimeMetrics(session)
    }));
    
    // Return the most recent active session
    const mostRecentSession = activeSessArray.sort((a, b) => b.startTime - a.startTime)[0] || null;
    
    sendResponse({ status: 'success', session: mostRecentSession });
  } catch (error) {
    console.error('Error getting active session:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleDebugStatus(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
    const activeSessionsArray = Array.from(activeSessions.values());
    
    // Get service status from settings
    const settings = await StorageManager.getSettings();
    
    const debugInfo = {
      activeSessionsCount: activeSessions.size,
      storedSessionsCount: storedSessions.length,
      serviceEnabled: settings.serviceEnabled !== false, // Default to enabled
      activeSessions: activeSessionsArray.map(s => ({
        id: s.id,
        startTime: new Date(s.startTime).toISOString(),
        interactionCount: s.interactions.length,
        videoCount: s.videoCount,
        isActive: s.isActive
      })),
      recentStoredSessions: storedSessions.slice(-5).map(s => ({
        id: s.id,
        startTime: new Date(s.startTime).toISOString(),
        endTime: s.endTime ? new Date(s.endTime).toISOString() : 'Active',
        interactionCount: s.interactions.length,
        videoCount: s.videoCount,
        isActive: s.isActive
      })),
      lastSaveTimes: Object.fromEntries(lastSaveTime.entries())
    };
    
    console.log('Debug status:', debugInfo);
    sendResponse({ status: 'success', debug: debugInfo });
  } catch (error) {
    console.error('Error getting debug status:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleRestartContentScript(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    // Get current active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs.length === 0) {
      throw new Error('No active tab found');
    }
    
    const tab = tabs[0];
    
    if (!tab.id) {
      throw new Error('Tab ID not available');
    }
    
    if (!tab.url || !tab.url.includes('youtube.com')) {
      throw new Error('Current tab is not YouTube');
    }
    
    // Reload the content script
    await chrome.tabs.reload(tab.id);
    
    sendResponse({ status: 'success', message: 'Content script restarted' });
  } catch (error) {
    console.error('Error restarting content script:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleForceStartSession(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { tabId, url } = message;
    
    // Validate that we're on YouTube Shorts
    if (!url || !url.includes('youtube.com')) {
      throw new Error('Not on YouTube - please navigate to YouTube Shorts first');
    }
    
    // Create a new session directly in the background
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    
    const session = {
      id: sessionId,
      startTime: timestamp,
      isActive: true,
      videoCount: 0,
      totalDwellTime: 0,
      interactions: []
    };
    
    // Add to active sessions
    activeSessions.set(sessionId, session);
    
    // Start real-time metrics updates
    startRealTimeMetricsUpdates(sessionId);
    
    // Try to notify content script (if it exists)
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'SESSION_CREATED',
        sessionId: sessionId,
        timestamp: timestamp
      });
    } catch (contentScriptError) {
      // Content script might not be loaded, that's okay
      console.log('Content script not available, session created in background only');
    }
    
    console.log('Force started session:', sessionId);
    sendResponse({ 
      status: 'success', 
      sessionId: sessionId,
      message: 'Session started successfully' 
    });
    
  } catch (error) {
    console.error('Error force starting session:', error);
    sendResponse({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

async function handleStopSession(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const activeSessionsArray = Array.from(activeSessions.values());
    
    if (activeSessionsArray.length === 0) {
      throw new Error('No active sessions to stop');
    }
    
    // Stop all active sessions
    const stoppedSessions = [];
    for (const session of activeSessionsArray) {
      try {
        // Finalize session
        session.endTime = Date.now();
        session.isActive = false;
        
        // Compute final metrics
        session.computedMetrics = MetricsEngine.computeMetrics(session);
        
        // Save session to storage
        await storageManager.saveSession(session);
        
        // Stop real-time updates
        stopRealTimeMetricsUpdates(session.id);
        
        // Remove from active sessions
        activeSessions.delete(session.id);
        
        stoppedSessions.push(session.id);
        console.log('Session stopped:', session.id);
      } catch (error) {
        console.error('Error stopping session:', session.id, error);
      }
    }
    
    sendResponse({ 
      status: 'success', 
      message: `Stopped ${stoppedSessions.length} session(s)`,
      stoppedSessions 
    });
  } catch (error) {
    console.error('Error stopping sessions:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleEnableService(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const settings = await StorageManager.getSettings();
    settings.serviceEnabled = true;
    await StorageManager.saveSettings(settings);
    
    console.log('NeuroScroll service enabled');
    sendResponse({ status: 'success', message: 'Service enabled successfully' });
  } catch (error) {
    console.error('Error enabling service:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

async function handleDisableService(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const settings = await StorageManager.getSettings();
    settings.serviceEnabled = false;
    await StorageManager.saveSettings(settings);
    
    // Stop all active sessions when disabling service
    const activeSessionsArray = Array.from(activeSessions.values());
    for (const session of activeSessionsArray) {
      try {
        session.endTime = Date.now();
        session.isActive = false;
        session.computedMetrics = MetricsEngine.computeMetrics(session);
        await storageManager.saveSession(session);
        stopRealTimeMetricsUpdates(session.id);
        activeSessions.delete(session.id);
      } catch (error) {
        console.error('Error stopping session during service disable:', session.id, error);
      }
    }
    
    console.log('NeuroScroll service disabled');
    sendResponse({ status: 'success', message: 'Service disabled successfully' });
  } catch (error) {
    console.error('Error disabling service:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

function updateSessionStats(session: ViewingSession, interaction: VideoInteraction): void {
  switch (interaction.action) {
    case 'enter':
      // Track unique videos
      const uniqueVideos = new Set(
        session.interactions
          .filter(i => i.action === 'enter')
          .map(i => i.videoId)
      );
      session.videoCount = uniqueVideos.size;
      break;
      
    case 'leave':
      // Add dwell time to total
      if (interaction.metadata.dwellTime) {
        session.totalDwellTime += interaction.metadata.dwellTime;
      }
      break;
  }
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('NeuroScroll extension installed');
  await recoverActiveSessions();
});

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('NeuroScroll extension started');
  await recoverActiveSessions();
});

// Recover sessions when service worker starts
recoverActiveSessions();

// Real-time metrics update system
const metricsUpdateIntervals = new Map<string, NodeJS.Timeout>();

// Auto-save tracking
const lastSaveTime = new Map<string, number>();
const AUTO_SAVE_INTERVAL = 10000; // Save every 10 seconds

/**
 * Auto-save session to prevent data loss
 */
async function autoSaveSession(session: ViewingSession): Promise<void> {
  if (!session || !session.id) {
    console.error('Invalid session for auto-save:', session);
    return;
  }

  const now = Date.now();
  const lastSave = lastSaveTime.get(session.id) || 0;
  
  // Only save if enough time has passed or if this is the first save
  if (now - lastSave > AUTO_SAVE_INTERVAL || lastSave === 0) {
    try {
      // Validate session data before saving
      if (!Array.isArray(session.interactions)) {
        console.error('Invalid interactions array in session:', session.id);
        return;
      }

      // Create a copy for saving (don't mark as ended)
      const sessionCopy: ViewingSession = {
        ...session,
        interactions: [...session.interactions] // Deep copy interactions array
      };
      
      // Only compute metrics if we have interactions
      if (session.interactions.length > 0) {
        sessionCopy.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
      }
      
      await storageManager.saveSession(sessionCopy);
      lastSaveTime.set(session.id, now);
      console.log('Auto-saved session:', session.id, 'Interactions:', session.interactions.length);
    } catch (error) {
      console.error('Error auto-saving session:', session.id, error);
      // Don't update lastSaveTime on error so we'll retry next time
    }
  }
}

/**
 * Recover active sessions from storage on startup
 */
async function recoverActiveSessions(): Promise<void> {
  try {
    console.log('Attempting to recover active sessions...');
    const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
    
    if (!Array.isArray(storedSessions)) {
      console.error('Invalid stored sessions data:', storedSessions);
      return;
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentSessions = storedSessions.filter(session => {
      try {
        // Validate session structure
        return (
          session &&
          typeof session.id === 'string' &&
          typeof session.startTime === 'number' &&
          typeof session.isActive === 'boolean' &&
          Array.isArray(session.interactions) &&
          session.isActive && 
          session.startTime > fiveMinutesAgo
        );
      } catch (error) {
        console.error('Error validating session for recovery:', session, error);
        return false;
      }
    });
    
    let recoveredCount = 0;
    for (const session of recentSessions) {
      try {
        activeSessions.set(session.id, session);
        startRealTimeMetricsUpdates(session.id);
        recoveredCount++;
        console.log('Recovered active session:', session.id, 'Interactions:', session.interactions.length);
      } catch (error) {
        console.error('Error recovering individual session:', session.id, error);
      }
    }
    
    if (recoveredCount > 0) {
      console.log(`Successfully recovered ${recoveredCount} active sessions`);
    } else {
      console.log('No active sessions to recover');
    }
  } catch (error) {
    console.error('Error recovering active sessions:', error);
  }
}

function startRealTimeMetricsUpdates(sessionId: string): void {
  // Clear existing interval if any
  stopRealTimeMetricsUpdates(sessionId);
  
  const interval = setInterval(() => {
    const session = activeSessions.get(sessionId);
    if (session && session.isActive) {
      // Update metrics
      session.computedMetrics = MetricsEngine.updateRealTimeMetrics(session);
      
      // Broadcast updated metrics to popup if open
      chrome.runtime.sendMessage({
        type: 'METRICS_UPDATE',
        sessionId,
        metrics: session.computedMetrics
      }).catch(() => {
        // Popup might not be open, ignore error
      });
    } else {
      // Session no longer active, stop updates
      stopRealTimeMetricsUpdates(sessionId);
    }
  }, METRICS_UPDATE_INTERVAL);
  
  metricsUpdateIntervals.set(sessionId, interval);
}

function stopRealTimeMetricsUpdates(sessionId: string): void {
  const interval = metricsUpdateIntervals.get(sessionId);
  if (interval) {
    clearInterval(interval);
    metricsUpdateIntervals.delete(sessionId);
  }
}

function clearAllRealTimeUpdates(): void {
  for (const [sessionId] of metricsUpdateIntervals) {
    stopRealTimeMetricsUpdates(sessionId);
  }
}

// Periodic auto-save of all active sessions (every 30 seconds)
setInterval(async () => {
  for (const [sessionId, session] of activeSessions) {
    try {
      await autoSaveSession(session);
    } catch (error) {
      console.error('Error in periodic auto-save for session:', sessionId, error);
    }
  }
}, 30000); // 30 seconds

// Initialize AI system on startup
initializeAISystem();

/**
 * Initialize the AI classification system
 */
async function initializeAISystem(): Promise<void> {
  try {
    console.log('Initializing AI classification system...');
    await AIClassifier.initialize();
    console.log('AI classification system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AI system:', error);
  }
}

/**
 * Schedule AI analysis for a session
 */
function scheduleAIAnalysis(
  session: ViewingSession, 
  metrics: ComputedMetrics, 
  priority: 'high' | 'normal' | 'low' = 'normal'
): void {
  try {
    aiScheduler.scheduleAnalysis(session, metrics, priority, (result) => {
      if (result.success) {
        // Update session with AI classification
        const updatedMetrics = {
          ...metrics,
          healthClassification: result.result.classification,
          confidence: result.result.confidence
        };
        
        // Update active session if it exists
        const activeSession = activeSessions.get(session.id);
        if (activeSession) {
          activeSession.computedMetrics = updatedMetrics;
        }
        
        // Save updated session to storage
        storageManager.saveSession({
          ...session,
          computedMetrics: updatedMetrics
        }).catch(error => {
          console.error('Error saving AI-updated session:', error);
        });
        
        console.log(`AI analysis completed for session ${session.id}: ${result.result.classification} (${(result.result.confidence * 100).toFixed(1)}%)`);
      } else {
        console.error(`AI analysis failed for session ${session.id}:`, result.error);
      }
    });
  } catch (error) {
    console.error('Error scheduling AI analysis:', error);
  }
}

/**
 * Handle AI status request
 */
async function handleGetAIStatus(_message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const modelInfo = AIClassifier.getModelInfo();
    const queueStatus = aiScheduler.getQueueStatus();
    const settings = await StorageManager.getSettings();
    
    const aiStatus = {
      enabled: settings.enableAI !== false, // Default to enabled
      modelLoaded: modelInfo.isLoaded,
      modelVersion: modelInfo.version,
      isLoading: modelInfo.isLoading,
      queueLength: queueStatus.queueLength,
      isProcessing: queueStatus.isProcessing,
      highPriorityCount: queueStatus.highPriorityCount,
      normalPriorityCount: queueStatus.normalPriorityCount,
      lowPriorityCount: queueStatus.lowPriorityCount
    };
    
    sendResponse({ status: 'success', aiStatus });
  } catch (error) {
    console.error('Error getting AI status:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

/**
 * Handle manual session classification request
 */
async function handleClassifySession(message: any, sendResponse: (response: any) => void): Promise<void> {
  try {
    const { sessionId } = message;
    
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    // Find session (active or stored)
    let session = activeSessions.get(sessionId);
    let metrics: ComputedMetrics;
    
    if (session) {
      metrics = MetricsEngine.updateRealTimeMetrics(session);
    } else {
      // Check stored sessions
      const storedSessions = await StorageManager.get('neuroscroll-sessions') || [];
      const storedSession = storedSessions.find(s => s.id === sessionId);
      
      if (!storedSession) {
        throw new Error('Session not found: ' + sessionId);
      }
      
      session = storedSession;
      metrics = storedSession.computedMetrics || MetricsEngine.computeMetrics(storedSession);
    }
    
    // Perform immediate AI classification
    const result = await AIClassifier.classifySession(session, metrics);
    
    // Update session with AI results
    const updatedMetrics = {
      ...metrics,
      healthClassification: result.classification,
      confidence: result.confidence
    };
    
    // Update active session if it exists
    if (activeSessions.has(sessionId)) {
      activeSessions.get(sessionId)!.computedMetrics = updatedMetrics;
    }
    
    // Save updated session
    await storageManager.saveSession({
      ...session,
      computedMetrics: updatedMetrics
    });
    
    sendResponse({ 
      status: 'success', 
      classification: result,
      metrics: updatedMetrics
    });
    
  } catch (error) {
    console.error('Error classifying session:', error);
    sendResponse({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Periodic cleanup of old data (runs every hour)
setInterval(async () => {
  try {
    const sessions = await StorageManager.get('neuroscroll-sessions') || [];
    const settings = await StorageManager.getSettings();
    const retentionMs = settings.dataRetentionDays * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - retentionMs;
    
    const filteredSessions = sessions.filter(session => session.startTime > cutoffTime);
    
    if (filteredSessions.length !== sessions.length) {
      await StorageManager.set('neuroscroll-sessions', filteredSessions);
      console.log(`Cleaned up ${sessions.length - filteredSessions.length} old sessions`);
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
}, 60 * 60 * 1000); // 1 hour

// Cleanup on extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Extension suspending, cleaning up AI resources...');
  aiScheduler.dispose();
  AIClassifier.dispose();
});
chrome.runtime.onSuspend.addListener(async () => {
  console.log('Extension suspending, saving active sessions...');
  
  // Stop all real-time updates
  clearAllRealTimeUpdates();
  
  for (const [sessionId, session] of activeSessions) {
    try {
      session.endTime = Date.now();
      session.isActive = false;
      
      // Compute final metrics
      session.computedMetrics = MetricsEngine.computeMetrics(session);
      
      await storageManager.saveSession(session);
      console.log('Saved session on suspend:', sessionId);
    } catch (error) {
      console.error('Error saving session on suspend:', error);
    }
  }
  
  activeSessions.clear();
});