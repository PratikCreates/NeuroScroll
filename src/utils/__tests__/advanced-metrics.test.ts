/**
 * Advanced metrics testing for complex behavioral analysis
 */

import { MetricsEngine } from '../metrics-engine';
import { ViewingSession, VideoInteraction, ComputedMetrics } from '../../types';

describe('Advanced Metrics Analysis', () => {
  const createComplexSession = (
    videoCount: number,
    dwellTimes: number[],
    replayCount: number = 0,
    startHour: number = 14
  ): ViewingSession => {
    const startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);
    
    const interactions: VideoInteraction[] = [];
    let currentTime = startTime.getTime();
    
    for (let i = 0; i < videoCount; i++) {
      const videoId = `video${i + 1}`;
      const dwellTime = dwellTimes[i] || 5000;
      
      // Enter interaction
      interactions.push({
        id: `enter-${i}`,
        videoId,
        sessionId: 'test-session',
        timestamp: currentTime,
        action: 'enter',
        metadata: { videoOrder: i }
      });
      
      // Add replays if specified
      if (i === 0) {
        for (let r = 0; r < replayCount; r++) {
          interactions.push({
            id: `replay-${i}-${r}`,
            videoId,
            sessionId: 'test-session',
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
        sessionId: 'test-session',
        timestamp: currentTime,
        action: 'leave',
        metadata: { dwellTime, videoOrder: i }
      });
      
      currentTime += 500; // Brief gap between videos
    }
    
    return {
      id: 'test-session',
      startTime: startTime.getTime(),
      endTime: currentTime,
      isActive: false,
      videoCount,
      totalDwellTime: dwellTimes.reduce((sum, time) => sum + time, 0),
      interactions
    };
  };

  describe('Dopamine Spike Index Analysis', () => {
    it('should identify high dopamine spike patterns', () => {
      // Rapid consumption pattern: many videos, short dwell times
      const session = createComplexSession(20, Array(20).fill(2000)); // 20 videos, 2s each
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.dopamineSpikeIndex).toBeGreaterThan(5); // High spike index
    });

    it('should identify low dopamine spike patterns', () => {
      // Slow consumption: few videos, long dwell times
      const session = createComplexSession(3, [30000, 25000, 20000]); // 3 videos, 20-30s each
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.dopamineSpikeIndex).toBeLessThan(1); // Low spike index
    });

    it('should handle edge case of single video session', () => {
      const session = createComplexSession(1, [10000]);
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.dopamineSpikeIndex).toBe(0.1); // 1 video / 10s = 0.1
    });
  });

  describe('Attention Span Patterns', () => {
    it('should calculate EWMA for varying attention spans', () => {
      // Decreasing attention pattern
      const dwellTimes = [15000, 12000, 8000, 5000, 3000]; // 15s to 3s
      const session = createComplexSession(5, dwellTimes);
      const metrics = MetricsEngine.computeMetrics(session);
      
      // EWMA should be weighted toward recent shorter times
      expect(metrics.attentionSpan).toBeLessThan(10); // Should be less than simple average
      expect(metrics.attentionSpan).toBeGreaterThan(3); // But more than final value
    });

    it('should handle improving attention pattern', () => {
      // Increasing attention pattern
      const dwellTimes = [3000, 5000, 8000, 12000, 15000]; // 3s to 15s
      const session = createComplexSession(5, dwellTimes);
      const metrics = MetricsEngine.computeMetrics(session);
      
      // EWMA should be weighted toward recent longer times
      // With alpha=0.3, the EWMA will be around 9.4 seconds
      expect(metrics.attentionSpan).toBeGreaterThan(8);
      expect(metrics.attentionSpan).toBeLessThan(12);
    });
  });

  describe('Fatigue Curve Analysis', () => {
    it('should detect clear fatigue pattern', () => {
      // Strong declining pattern
      const dwellTimes = [20000, 16000, 12000, 8000, 4000, 2000];
      const session = createComplexSession(6, dwellTimes);
      const metrics = MetricsEngine.computeMetrics(session);
      
      const slope = MetricsEngine.calculateFatigueSlope(metrics.fatiguePoints);
      expect(slope).toBeLessThan(-2); // Strong negative slope
      expect(metrics.fatiguePoints).toHaveLength(6);
      expect(metrics.fatiguePoints[0].dwellTime).toBe(20); // First video longest
      expect(metrics.fatiguePoints[5].dwellTime).toBe(2); // Last video shortest
    });

    it('should detect engagement recovery pattern', () => {
      // U-shaped pattern: fatigue then recovery
      const dwellTimes = [15000, 10000, 5000, 8000, 12000, 16000];
      const session = createComplexSession(6, dwellTimes);
      const metrics = MetricsEngine.computeMetrics(session);
      
      const slope = MetricsEngine.calculateFatigueSlope(metrics.fatiguePoints);
      // Overall slope might be slightly positive due to recovery
      expect(slope).toBeGreaterThan(-1);
    });
  });

  describe('Replay Sensitivity Analysis', () => {
    it('should track high replay sensitivity', () => {
      const session = createComplexSession(5, [10000, 8000, 6000, 4000, 2000], 8); // 8 replays on first video
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.replaySensitivity).toBe(8);
    });

    it('should handle zero replays', () => {
      const session = createComplexSession(5, [10000, 8000, 6000, 4000, 2000], 0);
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.replaySensitivity).toBe(0);
    });
  });

  describe('Circadian Drift Detection', () => {
    it('should detect late night sessions (11 PM - 6 AM)', () => {
      const lateNightHours = [23, 0, 1, 2, 3, 4, 5];
      
      lateNightHours.forEach(hour => {
        const session = createComplexSession(3, [5000, 5000, 5000], 0, hour);
        const metrics = MetricsEngine.computeMetrics(session);
        expect(metrics.circadianDrift).toBe(true);
      });
    });

    it('should not detect circadian drift for normal hours', () => {
      const normalHours = [7, 8, 12, 15, 18, 21, 22];
      
      normalHours.forEach(hour => {
        const session = createComplexSession(3, [5000, 5000, 5000], 0, hour);
        const metrics = MetricsEngine.computeMetrics(session);
        expect(metrics.circadianDrift).toBe(false);
      });
    });
  });

  describe('Session Health Classification', () => {
    it('should classify healthy viewing patterns', () => {
      const healthyPatterns = [
        { videos: 3, dwellTimes: [20000, 18000, 15000], replays: 1, hour: 14 }, // Moderate consumption
        { videos: 5, dwellTimes: [15000, 12000, 10000, 8000, 6000], replays: 2, hour: 16 }, // Gradual decline
      ];

      healthyPatterns.forEach(pattern => {
        const session = createComplexSession(pattern.videos, pattern.dwellTimes, pattern.replays, pattern.hour);
        const metrics = MetricsEngine.computeMetrics(session);
        const health = MetricsEngine.analyzeSessionHealth(metrics);
        
        expect(health).toBe('healthy');
      });
    });

    it('should classify doomscroll patterns', () => {
      const doomscrollPatterns = [
        { videos: 25, dwellTimes: Array(25).fill(2000), replays: 15, hour: 1 }, // Rapid consumption at night
        { videos: 15, dwellTimes: Array(15).fill(1500), replays: 20, hour: 23 }, // Very short attention, many replays
      ];

      doomscrollPatterns.forEach(pattern => {
        const session = createComplexSession(pattern.videos, pattern.dwellTimes, pattern.replays, pattern.hour);
        const metrics = MetricsEngine.computeMetrics(session);
        const health = MetricsEngine.analyzeSessionHealth(metrics);
        
        expect(health).toBe('doomscroll');
      });
    });

    it('should handle ambiguous patterns', () => {
      // Moderate patterns that don't clearly fit either category
      const ambiguousPatterns = [
        { videos: 8, dwellTimes: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000], replays: 5, hour: 15 },
      ];

      ambiguousPatterns.forEach(pattern => {
        const session = createComplexSession(pattern.videos, pattern.dwellTimes, pattern.replays, pattern.hour);
        const metrics = MetricsEngine.computeMetrics(session);
        const health = MetricsEngine.analyzeSessionHealth(metrics);
        
        expect(['healthy', 'unknown']).toContain(health);
      });
    });
  });

  describe('Real-time Metrics Updates', () => {
    it('should adjust confidence for active sessions', () => {
      const session = createComplexSession(3, [10000, 8000, 6000]);
      session.isActive = true;
      delete session.endTime;
      
      const metrics = MetricsEngine.updateRealTimeMetrics(session);
      
      expect(metrics.confidence).toBeLessThan(0.8); // Reduced confidence for active session
      expect(metrics.sessionLength).toBeGreaterThan(0);
    });

    it('should maintain confidence for completed sessions', () => {
      const session = createComplexSession(3, [10000, 8000, 6000]);
      session.isActive = false;
      
      const metrics = MetricsEngine.updateRealTimeMetrics(session);
      
      expect(metrics.confidence).toBe(0.8); // Full confidence for completed session
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large sessions efficiently', () => {
      const startTime = performance.now();
      
      // Create a large session with 100 videos
      const largeDwellTimes = Array(100).fill(0).map((_, i) => 5000 + Math.random() * 10000);
      const largeSession = createComplexSession(100, largeDwellTimes, 25);
      
      const metrics = MetricsEngine.computeMetrics(largeSession);
      
      const endTime = performance.now();
      const computationTime = endTime - startTime;
      
      expect(computationTime).toBeLessThan(100); // Should complete in under 100ms
      expect(metrics.fatiguePoints).toHaveLength(100);
      expect(metrics.dopamineSpikeIndex).toBeGreaterThan(0);
    });

    it('should handle malformed interaction data', () => {
      const session: ViewingSession = {
        id: 'malformed-session',
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        isActive: false,
        videoCount: 2,
        totalDwellTime: 0,
        interactions: [
          // Missing required fields
          { id: 'bad1', videoId: '', sessionId: 'test', timestamp: 0, action: 'enter', metadata: {} },
          // Invalid action
          { id: 'bad2', videoId: 'video1', sessionId: 'test', timestamp: 1000, action: 'invalid' as any, metadata: {} },
          // Missing metadata
          { id: 'bad3', videoId: 'video1', sessionId: 'test', timestamp: 2000, action: 'leave', metadata: {} }
        ]
      };
      
      const metrics = MetricsEngine.computeMetrics(session);
      
      // Should not crash and return sensible defaults
      expect(metrics.dopamineSpikeIndex).toBe(0);
      expect(metrics.attentionSpan).toBe(0);
      expect(metrics.replaySensitivity).toBe(0);
      expect(metrics.fatiguePoints).toHaveLength(0);
    });

    it('should handle sessions with only scroll interactions', () => {
      const session: ViewingSession = {
        id: 'scroll-only-session',
        startTime: Date.now(),
        endTime: Date.now() + 30000,
        isActive: false,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: [
          { id: 'scroll1', videoId: 'video1', sessionId: 'test', timestamp: 1000, action: 'scroll', metadata: { scrollSpeed: 100 } },
          { id: 'scroll2', videoId: 'video1', sessionId: 'test', timestamp: 2000, action: 'scroll', metadata: { scrollSpeed: 150 } },
          { id: 'scroll3', videoId: 'video1', sessionId: 'test', timestamp: 3000, action: 'scroll', metadata: { scrollSpeed: 200 } }
        ]
      };
      
      const metrics = MetricsEngine.computeMetrics(session);
      
      expect(metrics.dopamineSpikeIndex).toBe(0);
      expect(metrics.attentionSpan).toBe(0);
      expect(metrics.replaySensitivity).toBe(0);
      expect(metrics.fatiguePoints).toHaveLength(0);
    });
  });
});