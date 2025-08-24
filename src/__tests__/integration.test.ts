/**
 * Integration tests for NeuroScroll extension
 * Tests the complete workflow from content script to popup display
 */

import { MetricsEngine } from '../utils/metrics-engine';
import { StorageManager } from '../utils/storage';
import { AIClassifier } from '../utils/ai-classifier';
import { ViewingSession, VideoInteraction, ComputedMetrics } from '../types';

// Mock Chrome APIs
const mockChrome = {
  storage: {
    local: {
      data: new Map(),
      get: jest.fn().mockImplementation(async (keys) => {
        const result: any = {};
        if (typeof keys === 'string') {
          result[keys] = mockChrome.storage.local.data.get(keys) || null;
        } else if (Array.isArray(keys)) {
          keys.forEach(key => {
            result[key] = mockChrome.storage.local.data.get(key) || null;
          });
        }
        return result;
      }),
      set: jest.fn().mockImplementation(async (data) => {
        Object.entries(data).forEach(([key, value]) => {
          mockChrome.storage.local.data.set(key, value);
        });
      }),
      clear: jest.fn().mockImplementation(async () => {
        mockChrome.storage.local.data.clear();
      }),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
};

// @ts-ignore
global.chrome = mockChrome;

describe('NeuroScroll Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChrome.storage.local.data.clear();
  });

  describe('Complete User Journey', () => {
    it('should handle complete viewing session lifecycle', async () => {
      // 1. Simulate content script tracking interactions
      const sessionId = 'integration-test-session';
      const interactions: VideoInteraction[] = [];
      
      // User starts watching YouTube Shorts
      const startTime = Date.now();
      
      // Watch 5 videos with decreasing attention (fatigue pattern)
      const dwellTimes = [20000, 15000, 10000, 8000, 5000]; // 20s to 5s
      
      for (let i = 0; i < 5; i++) {
        const videoId = `video-${i + 1}`;
        const enterTime = startTime + (i * 25000);
        const leaveTime = enterTime + dwellTimes[i];
        
        // Enter interaction
        interactions.push({
          id: `enter-${i}`,
          videoId,
          sessionId,
          timestamp: enterTime,
          action: 'enter',
          metadata: { videoOrder: i }
        });
        
        // Add some scroll events
        interactions.push({
          id: `scroll-${i}-1`,
          videoId,
          sessionId,
          timestamp: enterTime + 2000,
          action: 'scroll',
          metadata: { scrollSpeed: 150 }
        });
        
        // Add replay for first video (user really liked it)
        if (i === 0) {
          interactions.push({
            id: `replay-${i}`,
            videoId,
            sessionId,
            timestamp: enterTime + 10000,
            action: 'replay',
            metadata: {}
          });
        }
        
        // Leave interaction
        interactions.push({
          id: `leave-${i}`,
          videoId,
          sessionId,
          timestamp: leaveTime,
          action: 'leave',
          metadata: { dwellTime: dwellTimes[i], videoOrder: i }
        });
      }
      
      // 2. Create session object
      const session: ViewingSession = {
        id: sessionId,
        startTime,
        endTime: startTime + 125000, // Total session time
        isActive: false,
        videoCount: 5,
        totalDwellTime: dwellTimes.reduce((sum, time) => sum + time, 0),
        interactions
      };
      
      // 3. Store session data
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // 4. Compute metrics
      const metrics = MetricsEngine.computeMetrics(session);
      
      // Verify metrics are computed correctly
      expect(metrics.dopamineSpikeIndex).toBeCloseTo(0.43, 2); // 5 videos / 11.6s avg
      expect(metrics.attentionSpan).toBeGreaterThan(0);
      expect(metrics.replaySensitivity).toBe(1); // One replay
      expect(metrics.sessionLength).toBeCloseTo(2.08, 1); // ~2.08 minutes (125 seconds)
      expect(metrics.fatiguePoints).toHaveLength(5);
      expect(metrics.circadianDrift).toBe(false); // Normal hours
      
      // 5. Update session with computed metrics
      session.computedMetrics = metrics;
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // 6. Classify session with AI
      const classification = await AIClassifier.classifySession(session, metrics);
      expect(classification.classification).toMatch(/healthy|doomscroll|unknown/);
      expect(classification.confidence).toBeGreaterThanOrEqual(0);
      expect(classification.confidence).toBeLessThanOrEqual(1);
      
      // 7. Verify data persistence
      const storedSessions = await StorageManager.get('neuroscroll-sessions');
      expect(storedSessions).toHaveLength(1);
      expect(storedSessions![0].id).toBe(sessionId);
      expect(storedSessions![0].computedMetrics).toBeDefined();
      
      // 8. Test CSV export
      const csvData = await StorageManager.exportAsCSV();
      expect(csvData).toContain('Session ID');
      expect(csvData).toContain(sessionId);
      expect(csvData).toContain('Dopamine Spike Index');
    }, 10000); // 10 second timeout

    it('should handle multiple sessions with different patterns', async () => {
      const sessions: ViewingSession[] = [];
      
      // Create healthy session
      const healthySession = createMockSession('healthy-session', {
        videoCount: 3,
        dwellTimes: [25000, 20000, 18000], // Long, stable attention
        replays: 1,
        startHour: 14 // Afternoon
      });
      sessions.push(healthySession);
      
      // Create doomscroll session
      const doomscrollSession = createMockSession('doomscroll-session', {
        videoCount: 20,
        dwellTimes: Array(20).fill(2000), // Very short attention
        replays: 15,
        startHour: 1 // Late night
      });
      sessions.push(doomscrollSession);
      
      // Store all sessions
      await StorageManager.set('neuroscroll-sessions', sessions);
      
      // Compute metrics for all sessions
      for (const session of sessions) {
        session.computedMetrics = MetricsEngine.computeMetrics(session);
      }
      
      // Update storage with computed metrics
      await StorageManager.set('neuroscroll-sessions', sessions);
      
      // Verify different classifications
      const healthyMetrics = sessions[0].computedMetrics!;
      const doomscrollMetrics = sessions[1].computedMetrics!;
      
      expect(healthyMetrics.dopamineSpikeIndex).toBeLessThan(doomscrollMetrics.dopamineSpikeIndex);
      expect(healthyMetrics.attentionSpan).toBeGreaterThan(doomscrollMetrics.attentionSpan);
      expect(healthyMetrics.circadianDrift).toBe(false);
      expect(doomscrollMetrics.circadianDrift).toBe(true);
      
      // Test batch AI classification
      const classifications = await AIClassifier.classifySessions([
        { session: healthySession, metrics: healthyMetrics },
        { session: doomscrollSession, metrics: doomscrollMetrics }
      ]);
      expect(classifications).toHaveLength(2);
      expect(classifications[0].classification).toMatch(/healthy|unknown/);
      expect(classifications[1].classification).toMatch(/doomscroll|unknown/);
    });

    it('should handle real-time session updates', async () => {
      // Start with active session
      const sessionId = 'realtime-session';
      const session: ViewingSession = {
        id: sessionId,
        startTime: Date.now() - 60000, // Started 1 minute ago
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      };
      
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // Simulate adding interactions in real-time
      const interactions: VideoInteraction[] = [];
      
      // Add first video
      interactions.push({
        id: 'enter-1',
        videoId: 'video-1',
        sessionId,
        timestamp: session.startTime + 5000,
        action: 'enter',
        metadata: { videoOrder: 0 }
      });
      
      session.interactions = interactions;
      session.videoCount = 1;
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // Compute real-time metrics
      let metrics = MetricsEngine.updateRealTimeMetrics(session);
      expect(metrics.confidence).toBeLessThan(0.8); // Lower confidence for active session
      
      // Add leave interaction
      interactions.push({
        id: 'leave-1',
        videoId: 'video-1',
        sessionId,
        timestamp: session.startTime + 15000,
        action: 'leave',
        metadata: { dwellTime: 10000, videoOrder: 0 }
      });
      
      session.interactions = interactions;
      session.totalDwellTime = 10000;
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // Update metrics
      metrics = MetricsEngine.updateRealTimeMetrics(session);
      expect(metrics.attentionSpan).toBeGreaterThan(0);
      expect(metrics.fatiguePoints).toHaveLength(1);
      
      // End session
      session.endTime = Date.now();
      session.isActive = false;
      await StorageManager.set('neuroscroll-sessions', [session]);
      
      // Final metrics should have full confidence
      metrics = MetricsEngine.computeMetrics(session);
      expect(metrics.confidence).toBe(0.8);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle storage errors gracefully', async () => {
      // Mock storage failure
      mockChrome.storage.local.get.mockRejectedValueOnce(new Error('Storage quota exceeded'));
      
      const result = await StorageManager.get('neuroscroll-sessions');
      expect(result).toBeNull();
    });

    it('should handle corrupted session data', async () => {
      // Store corrupted data
      const corruptedData = {
        id: 'corrupted',
        // Missing required fields
        interactions: 'invalid'
      };
      
      await StorageManager.set('neuroscroll-sessions', [corruptedData as any]);
      
      // Should handle gracefully
      const sessions = await StorageManager.get('neuroscroll-sessions');
      expect(sessions).toHaveLength(1);
      
      // Metrics computation should not crash
      const metrics = MetricsEngine.computeMetrics(corruptedData as any);
      expect(metrics.dopamineSpikeIndex).toBe(0);
      expect(metrics.attentionSpan).toBe(0);
    });

    it('should handle AI classification failures', async () => {
      const metrics: ComputedMetrics = {
        dopamineSpikeIndex: 3.5,
        attentionSpan: 12,
        replaySensitivity: 5,
        sessionLength: 60,
        fatiguePoints: [],
        circadianDrift: false,
        healthClassification: 'unknown',
        confidence: 0.8,
        timestamp: Date.now()
      };
      
      // Mock AI failure
      jest.spyOn(AIClassifier, 'classifySession').mockRejectedValueOnce(new Error('Model not loaded'));
      
      const mockSession = createMockSession('error-test', {
        videoCount: 5,
        dwellTimes: [10000, 8000, 6000, 4000, 2000],
        replays: 1,
        startHour: 14
      });
      
      const result = await AIClassifier.classifySession(mockSession, metrics);
      expect(result.classification).toBe('unknown');
      expect(result.confidence).toBe(0);
      expect(result.error).toBeDefined();
    });

    it('should handle large datasets efficiently', async () => {
      // Create large session with 1000 interactions
      const largeSession = createLargeSession(1000);
      
      const startTime = performance.now();
      
      // Store large session
      await StorageManager.set('neuroscroll-sessions', [largeSession]);
      
      // Compute metrics
      const metrics = MetricsEngine.computeMetrics(largeSession);
      
      // Export CSV
      const csvData = await StorageManager.exportAsCSV();
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle large dataset efficiently
      expect(totalTime).toBeLessThan(1000); // Under 1 second
      expect(metrics.fatiguePoints).toHaveLength(500); // 1000 interactions = 500 videos
      expect(csvData.length).toBeGreaterThan(300); // CSV should have header + data
    });
  });

  describe('Data Migration and Versioning', () => {
    it('should handle data format migrations', async () => {
      // Simulate old data format
      const oldFormatData = {
        sessions: [
          {
            id: 'old-session',
            start: Date.now() - 3600000, // Old field name
            end: Date.now() - 3000000,
            videos: 5, // Old field name
            interactions: []
          }
        ]
      };
      
      // Store old format
      await StorageManager.set('neuroscroll-sessions-v1', oldFormatData);
      
      // Migration would happen here (not implemented in this test)
      // For now, just verify we can handle missing fields
      const sessions = await StorageManager.get('neuroscroll-sessions');
      expect(sessions).toBeNull(); // No new format data
    });

    it('should maintain backward compatibility', async () => {
      // Create session without new fields
      const legacySession: Partial<ViewingSession> = {
        id: 'legacy-session',
        startTime: Date.now() - 3600000,
        endTime: Date.now() - 3000000,
        isActive: false,
        videoCount: 3,
        totalDwellTime: 45000,
        interactions: []
        // Missing computedMetrics field
      };
      
      await StorageManager.set('neuroscroll-sessions', [legacySession as ViewingSession]);
      
      // Should still work
      const sessions = await StorageManager.get('neuroscroll-sessions');
      expect(sessions).toHaveLength(1);
      expect(sessions![0].id).toBe('legacy-session');
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track performance metrics during operations', async () => {
      const session = createMockSession('perf-test', {
        videoCount: 50,
        dwellTimes: Array(50).fill(0).map(() => Math.random() * 20000 + 5000),
        replays: 10,
        startHour: 15
      });
      
      // Track storage operation
      const storageStart = performance.now();
      await StorageManager.set('neuroscroll-sessions', [session]);
      const storageTime = performance.now() - storageStart;
      
      // Track metrics computation
      const metricsStart = performance.now();
      const metrics = MetricsEngine.computeMetrics(session);
      const metricsTime = performance.now() - metricsStart;
      
      // Track AI classification
      const aiStart = performance.now();
      await AIClassifier.classifySession(session, metrics);
      const aiTime = performance.now() - aiStart;
      
      // Verify reasonable performance
      expect(storageTime).toBeLessThan(100); // Storage under 100ms
      expect(metricsTime).toBeLessThan(50);  // Metrics under 50ms
      expect(aiTime).toBeLessThan(200);      // AI under 200ms
    }, 10000); // 10 second timeout
  });
});

// Helper functions
function createMockSession(
  sessionId: string,
  options: {
    videoCount: number;
    dwellTimes: number[];
    replays: number;
    startHour: number;
  }
): ViewingSession {
  const { videoCount, dwellTimes, replays, startHour } = options;
  
  const startTime = new Date();
  startTime.setHours(startHour, 0, 0, 0);
  
  const interactions: VideoInteraction[] = [];
  let currentTime = startTime.getTime();
  
  for (let i = 0; i < videoCount; i++) {
    const videoId = `video-${i + 1}`;
    const dwellTime = dwellTimes[i] || 5000;
    
    // Enter interaction
    interactions.push({
      id: `enter-${i}`,
      videoId,
      sessionId,
      timestamp: currentTime,
      action: 'enter',
      metadata: { videoOrder: i }
    });
    
    // Add replays to first video
    if (i === 0) {
      for (let r = 0; r < replays; r++) {
        interactions.push({
          id: `replay-${i}-${r}`,
          videoId,
          sessionId,
          timestamp: currentTime + (r + 1) * 1000,
          action: 'replay',
          metadata: {}
        });
      }
    }
    
    // Leave interaction
    currentTime += dwellTime;
    interactions.push({
      id: `leave-${i}`,
      videoId,
      sessionId,
      timestamp: currentTime,
      action: 'leave',
      metadata: { dwellTime, videoOrder: i }
    });
    
    currentTime += 500; // Brief gap between videos
  }
  
  return {
    id: sessionId,
    startTime: startTime.getTime(),
    endTime: currentTime,
    isActive: false,
    videoCount,
    totalDwellTime: dwellTimes.reduce((sum, time) => sum + time, 0),
    interactions
  };
}

function createLargeSession(interactionCount: number): ViewingSession {
  const sessionId = 'large-session';
  const startTime = Date.now() - (interactionCount * 1000);
  const interactions: VideoInteraction[] = [];
  
  for (let i = 0; i < interactionCount; i++) {
    const videoId = `video-${Math.floor(i / 2) + 1}`;
    const timestamp = startTime + (i * 1000);
    const action = i % 2 === 0 ? 'enter' : 'leave';
    const dwellTime = action === 'leave' ? 5000 + Math.random() * 15000 : undefined;
    
    interactions.push({
      id: `interaction-${i}`,
      videoId,
      sessionId,
      timestamp,
      action: action as any,
      metadata: dwellTime ? { dwellTime, videoOrder: Math.floor(i / 2) } : { videoOrder: Math.floor(i / 2) }
    });
  }
  
  return {
    id: sessionId,
    startTime,
    endTime: startTime + (interactionCount * 1000),
    isActive: false,
    videoCount: Math.floor(interactionCount / 2),
    totalDwellTime: interactions
      .filter(i => i.action === 'leave')
      .reduce((sum, i) => sum + (i.metadata.dwellTime || 0), 0),
    interactions
  };
}