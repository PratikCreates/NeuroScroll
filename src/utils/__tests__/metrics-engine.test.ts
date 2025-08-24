/**
 * Tests for MetricsEngine
 * Validates neuroscience-based behavioral analysis computations
 */

import { MetricsEngine } from '../metrics-engine';
import { ViewingSession, VideoInteraction, FatiguePoint } from '../../types';

describe('MetricsEngine', () => {
  const createMockSession = (interactions: VideoInteraction[]): ViewingSession => ({
    id: 'test-session',
    startTime: Date.now() - 60000, // 1 minute ago
    endTime: Date.now(),
    isActive: false,
    videoCount: 0,
    totalDwellTime: 0,
    interactions
  });

  const createMockInteraction = (
    action: 'enter' | 'leave' | 'replay' | 'scroll',
    videoId: string,
    timestamp: number,
    metadata: any = {}
  ): VideoInteraction => ({
    id: `interaction-${timestamp}`,
    videoId,
    sessionId: 'test-session',
    timestamp,
    action,
    metadata
  });

  describe('computeMetrics', () => {
    it('should compute basic metrics for a simple session', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 11000, { dwellTime: 10000 }),
        createMockInteraction('enter', 'video2', 12000),
        createMockInteraction('leave', 'video2', 17000, { dwellTime: 5000 })
      ];

      const session = createMockSession(interactions);
      const metrics = MetricsEngine.computeMetrics(session);

      expect(metrics.dopamineSpikeIndex).toBeCloseTo(0.267, 2); // 2 videos / 7.5s avg
      expect(metrics.attentionSpan).toBeCloseTo(8.5, 1); // EWMA of 10s and 5s with alpha=0.3
      expect(metrics.replaySensitivity).toBe(0);
      expect(metrics.sessionLength).toBeGreaterThan(0);
      expect(metrics.fatiguePoints).toHaveLength(2);
      expect(metrics.circadianDrift).toBe(false);
    });

    it('should calculate dopamine spike index correctly', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 3000, { dwellTime: 2000 }),
        createMockInteraction('enter', 'video2', 3100),
        createMockInteraction('leave', 'video2', 4100, { dwellTime: 1000 }),
        createMockInteraction('enter', 'video3', 4200),
        createMockInteraction('leave', 'video3', 5200, { dwellTime: 1000 })
      ];

      const session = createMockSession(interactions);
      const metrics = MetricsEngine.computeMetrics(session);

      // 3 videos / (4000ms / 3 / 1000) = 3 / 1.33 = 2.25
      expect(metrics.dopamineSpikeIndex).toBeCloseTo(2.25, 2);
    });

    it('should handle replay sensitivity calculation', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('replay', 'video1', 2000),
        createMockInteraction('replay', 'video1', 3000),
        createMockInteraction('leave', 'video1', 4000, { dwellTime: 3000 })
      ];

      const session = createMockSession(interactions);
      const metrics = MetricsEngine.computeMetrics(session);

      expect(metrics.replaySensitivity).toBe(2);
    });

    it('should generate fatigue points in correct order', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 11000, { dwellTime: 10000 }),
        createMockInteraction('enter', 'video2', 12000),
        createMockInteraction('leave', 'video2', 19000, { dwellTime: 7000 }),
        createMockInteraction('enter', 'video3', 20000),
        createMockInteraction('leave', 'video3', 25000, { dwellTime: 5000 })
      ];

      const session = createMockSession(interactions);
      const metrics = MetricsEngine.computeMetrics(session);

      expect(metrics.fatiguePoints).toHaveLength(3);
      expect(metrics.fatiguePoints[0].videoOrder).toBe(0);
      expect(metrics.fatiguePoints[0].dwellTime).toBe(10);
      expect(metrics.fatiguePoints[1].videoOrder).toBe(1);
      expect(metrics.fatiguePoints[1].dwellTime).toBe(7);
      expect(metrics.fatiguePoints[2].videoOrder).toBe(2);
      expect(metrics.fatiguePoints[2].dwellTime).toBe(5);
    });

    it('should detect circadian drift for late night sessions', () => {
      // Create a session starting at 11:30 PM
      const lateNightStart = new Date();
      lateNightStart.setHours(23, 30, 0, 0);
      
      const session: ViewingSession = {
        id: 'late-session',
        startTime: lateNightStart.getTime(),
        endTime: lateNightStart.getTime() + 30 * 60000, // 30 minutes later
        isActive: false,
        videoCount: 1,
        totalDwellTime: 0,
        interactions: [
          createMockInteraction('enter', 'video1', lateNightStart.getTime()),
          createMockInteraction('leave', 'video1', lateNightStart.getTime() + 10000, { dwellTime: 10000 })
        ]
      };

      const metrics = MetricsEngine.computeMetrics(session);
      expect(metrics.circadianDrift).toBe(true);
    });

    it('should not detect circadian drift for normal hours', () => {
      // Create a session starting at 2:00 PM
      const normalStart = new Date();
      normalStart.setHours(14, 0, 0, 0);
      
      const session: ViewingSession = {
        id: 'normal-session',
        startTime: normalStart.getTime(),
        endTime: normalStart.getTime() + 30 * 60000,
        isActive: false,
        videoCount: 1,
        totalDwellTime: 0,
        interactions: [
          createMockInteraction('enter', 'video1', normalStart.getTime()),
          createMockInteraction('leave', 'video1', normalStart.getTime() + 10000, { dwellTime: 10000 })
        ]
      };

      const metrics = MetricsEngine.computeMetrics(session);
      expect(metrics.circadianDrift).toBe(false);
    });
  });

  describe('calculateFatigueSlope', () => {
    it('should calculate negative slope for decreasing dwell times', () => {
      const fatiguePoints: FatiguePoint[] = [
        { videoOrder: 0, dwellTime: 10, timestamp: 1000 },
        { videoOrder: 1, dwellTime: 8, timestamp: 2000 },
        { videoOrder: 2, dwellTime: 6, timestamp: 3000 },
        { videoOrder: 3, dwellTime: 4, timestamp: 4000 }
      ];

      const slope = MetricsEngine.calculateFatigueSlope(fatiguePoints);
      expect(slope).toBeLessThan(0); // Negative slope indicates fatigue
    });

    it('should calculate positive slope for increasing dwell times', () => {
      const fatiguePoints: FatiguePoint[] = [
        { videoOrder: 0, dwellTime: 4, timestamp: 1000 },
        { videoOrder: 1, dwellTime: 6, timestamp: 2000 },
        { videoOrder: 2, dwellTime: 8, timestamp: 3000 },
        { videoOrder: 3, dwellTime: 10, timestamp: 4000 }
      ];

      const slope = MetricsEngine.calculateFatigueSlope(fatiguePoints);
      expect(slope).toBeGreaterThan(0); // Positive slope indicates increasing attention
    });

    it('should return 0 for insufficient data points', () => {
      const fatiguePoints: FatiguePoint[] = [
        { videoOrder: 0, dwellTime: 10, timestamp: 1000 }
      ];

      const slope = MetricsEngine.calculateFatigueSlope(fatiguePoints);
      expect(slope).toBe(0);
    });
  });

  describe('analyzeSessionHealth', () => {
    it('should classify healthy session', () => {
      const healthyMetrics = {
        dopamineSpikeIndex: 1.5, // Low
        attentionSpan: 30, // Moderate
        replaySensitivity: 2, // Low
        sessionLength: 45, // Reasonable
        fatiguePoints: [],
        circadianDrift: false,
        healthClassification: 'unknown' as const,
        confidence: 0.8,
        timestamp: Date.now()
      };

      const classification = MetricsEngine.analyzeSessionHealth(healthyMetrics);
      expect(classification).toBe('healthy');
    });

    it('should classify doomscroll session', () => {
      const doomscrollMetrics = {
        dopamineSpikeIndex: 8, // High
        attentionSpan: 3, // Very short
        replaySensitivity: 15, // High
        sessionLength: 150, // Very long
        fatiguePoints: [],
        circadianDrift: true,
        healthClassification: 'unknown' as const,
        confidence: 0.8,
        timestamp: Date.now()
      };

      const classification = MetricsEngine.analyzeSessionHealth(doomscrollMetrics);
      expect(classification).toBe('doomscroll');
    });

    it('should return unknown for ambiguous sessions', () => {
      const ambiguousMetrics = {
        dopamineSpikeIndex: 3, // Medium
        attentionSpan: 15, // Medium
        replaySensitivity: 5, // Medium
        sessionLength: 60, // Medium
        fatiguePoints: [],
        circadianDrift: false,
        healthClassification: 'unknown' as const,
        confidence: 0.8,
        timestamp: Date.now()
      };

      const classification = MetricsEngine.analyzeSessionHealth(ambiguousMetrics);
      expect(classification).toBe('unknown');
    });
  });

  describe('updateRealTimeMetrics', () => {
    it('should adjust confidence for active sessions', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 11000, { dwellTime: 10000 })
      ];

      const activeSession = createMockSession(interactions);
      activeSession.isActive = true;
      delete activeSession.endTime;

      const metrics = MetricsEngine.updateRealTimeMetrics(activeSession);
      
      expect(metrics.confidence).toBeLessThan(0.8); // Lower confidence for active session
      expect(metrics.sessionLength).toBeGreaterThan(0); // Should calculate current length
    });

    it('should maintain full confidence for completed sessions', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 11000, { dwellTime: 10000 })
      ];

      const completedSession = createMockSession(interactions);
      completedSession.isActive = false;

      const metrics = MetricsEngine.updateRealTimeMetrics(completedSession);
      
      expect(metrics.confidence).toBe(0.8); // Full confidence for completed session
    });
  });

  describe('edge cases', () => {
    it('should handle empty interactions gracefully', () => {
      const session = createMockSession([]);
      const metrics = MetricsEngine.computeMetrics(session);

      expect(metrics.dopamineSpikeIndex).toBe(0);
      expect(metrics.attentionSpan).toBe(0);
      expect(metrics.replaySensitivity).toBe(0);
      expect(metrics.fatiguePoints).toHaveLength(0);
    });

    it('should handle interactions without dwell time', () => {
      const interactions = [
        createMockInteraction('enter', 'video1', 1000),
        createMockInteraction('leave', 'video1', 2000), // No dwellTime in metadata
        createMockInteraction('scroll', 'video1', 1500, { scrollSpeed: 100 })
      ];

      const session = createMockSession(interactions);
      const metrics = MetricsEngine.computeMetrics(session);

      expect(metrics.dopamineSpikeIndex).toBe(0); // Should handle division by zero
      expect(metrics.attentionSpan).toBe(0);
      expect(metrics.fatiguePoints).toHaveLength(0);
    });
  });
});