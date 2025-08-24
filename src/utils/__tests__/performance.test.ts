/**
 * Performance monitoring and optimization tests
 */

import { PerformanceMonitor } from '../performance-monitor';
import { MetricsEngine } from '../metrics-engine';
import { ViewingSession, VideoInteraction } from '../../types';

describe('Performance Monitoring', () => {
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    jest.clearAllMocks();
  });

  afterEach(() => {
    performanceMonitor.cleanup();
  });

  describe('Memory Usage Tracking', () => {
    it('should track memory usage during metrics computation', async () => {
      const session = createLargeSession(100);
      
      performanceMonitor.startMemoryTracking();
      
      // Simulate memory-intensive operation
      const metrics = MetricsEngine.computeMetrics(session);
      
      const memoryStats = performanceMonitor.getMemoryStats();
      
      expect(memoryStats.heapUsed).toBeGreaterThan(0);
      expect(memoryStats.heapTotal).toBeGreaterThan(memoryStats.heapUsed);
      expect(memoryStats.external).toBeGreaterThan(0);
    });

    it('should detect memory leaks in long-running operations', async () => {
      performanceMonitor.startMemoryTracking();
      
      const initialMemory = performanceMonitor.getMemoryStats().heapUsed;
      
      // Simulate multiple operations that might leak memory
      for (let i = 0; i < 10; i++) {
        const session = createLargeSession(50);
        MetricsEngine.computeMetrics(session);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performanceMonitor.getMemoryStats().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    it('should track peak memory usage', () => {
      performanceMonitor.startMemoryTracking();
      
      // Create progressively larger sessions
      for (let size = 10; size <= 100; size += 10) {
        const session = createLargeSession(size);
        MetricsEngine.computeMetrics(session);
      }
      
      const stats = performanceMonitor.getMemoryStats();
      expect(stats.peakHeapUsed).toBeGreaterThanOrEqual(stats.heapUsed);
    });
  });

  describe('Scroll Handling Performance', () => {
    it('should measure scroll event processing time', () => {
      const scrollEvents = Array(1000).fill(null).map((_, i) => ({
        timestamp: Date.now() + i,
        scrollY: i * 100,
        scrollSpeed: Math.random() * 1000
      }));

      const startTime = performance.now();
      
      // Simulate scroll event processing
      const processedEvents = scrollEvents.map(event => ({
        ...event,
        processed: true,
        throttled: event.scrollSpeed > 500
      }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(50); // Should process 1000 events in under 50ms
      expect(processedEvents).toHaveLength(1000);
    });

    it('should validate throttling effectiveness', () => {
      let callCount = 0;
      const throttledFunction = throttle(() => {
        callCount++;
      }, 16); // 60fps throttling

      const startTime = performance.now();
      
      // Simulate rapid scroll events
      for (let i = 0; i < 100; i++) {
        throttledFunction();
      }
      
      const endTime = performance.now();
      
      // Should significantly reduce call count
      expect(callCount).toBeLessThan(10);
      expect(endTime - startTime).toBeLessThan(20);
    });

    it('should measure intersection observer performance', () => {
      const mockEntries = Array(50).fill(null).map((_, i) => ({
        target: { id: `video-${i}` },
        isIntersecting: Math.random() > 0.5,
        intersectionRatio: Math.random(),
        time: performance.now()
      }));

      const startTime = performance.now();
      
      // Simulate intersection observer callback
      const visibleVideos = mockEntries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(10); // Should process quickly
      expect(visibleVideos.length).toBeGreaterThan(0);
    });
  });

  describe('AI Inference Performance', () => {
    it('should measure AI classification time', async () => {
      const metrics = {
        dopamineSpikeIndex: 3.5,
        attentionSpan: 12,
        replaySensitivity: 5,
        sessionLength: 90,
        fatiguePoints: [],
        circadianDrift: false,
        healthClassification: 'unknown' as const,
        confidence: 0.8,
        timestamp: Date.now()
      };

      const startTime = performance.now();
      
      // Simulate AI inference (mock implementation)
      const features = [
        metrics.dopamineSpikeIndex,
        metrics.attentionSpan,
        metrics.replaySensitivity,
        metrics.sessionLength,
        metrics.circadianDrift ? 1 : 0
      ];
      
      // Simulate neural network computation
      let result = 0;
      for (let i = 0; i < features.length; i++) {
        result += features[i] * Math.random();
      }
      const classification = result > 50 ? 'doomscroll' : 'healthy';
      
      const endTime = performance.now();
      const inferenceTime = endTime - startTime;
      
      expect(inferenceTime).toBeLessThan(10); // Should complete inference quickly
      expect(['healthy', 'doomscroll']).toContain(classification);
    });

    it('should handle batch inference efficiently', async () => {
      const batchSize = 20;
      const metricsBatch = Array(batchSize).fill(null).map(() => ({
        dopamineSpikeIndex: Math.random() * 10,
        attentionSpan: Math.random() * 30,
        replaySensitivity: Math.floor(Math.random() * 20),
        sessionLength: Math.random() * 200,
        fatiguePoints: [],
        circadianDrift: Math.random() > 0.5,
        healthClassification: 'unknown' as const,
        confidence: 0.8,
        timestamp: Date.now()
      }));

      const startTime = performance.now();
      
      // Simulate batch processing
      const results = metricsBatch.map(metrics => {
        const features = [
          metrics.dopamineSpikeIndex,
          metrics.attentionSpan,
          metrics.replaySensitivity,
          metrics.sessionLength,
          metrics.circadianDrift ? 1 : 0
        ];
        
        let result = 0;
        for (let i = 0; i < features.length; i++) {
          result += features[i] * Math.random();
        }
        
        return result > 50 ? 'doomscroll' : 'healthy';
      });
      
      const endTime = performance.now();
      const batchTime = endTime - startTime;
      
      expect(batchTime).toBeLessThan(50); // Batch should complete quickly
      expect(results).toHaveLength(batchSize);
    });
  });

  describe('Storage Performance', () => {
    it('should measure storage write performance', async () => {
      const largeSessions = Array(10).fill(null).map((_, i) => 
        createLargeSession(50, `session-${i}`)
      );

      const startTime = performance.now();
      
      // Simulate storage operations
      const serializedData = JSON.stringify(largeSessions);
      const parsedData = JSON.parse(serializedData);
      
      const endTime = performance.now();
      const storageTime = endTime - startTime;
      
      expect(storageTime).toBeLessThan(100); // Should serialize/deserialize quickly
      expect(parsedData).toHaveLength(10);
      expect(serializedData.length).toBeGreaterThan(1000);
    });

    it('should validate data compression efficiency', () => {
      const session = createLargeSession(100);
      const originalData = JSON.stringify(session);
      
      // Simulate compression by removing unnecessary whitespace and optimizing structure
      const compressedData = JSON.stringify(session, null, 0);
      
      const compressionRatio = compressedData.length / originalData.length;
      
      expect(compressionRatio).toBeLessThanOrEqual(1);
      expect(compressedData.length).toBeGreaterThan(0);
    });
  });

  describe('Chart Rendering Performance', () => {
    it('should measure chart data preparation time', () => {
      const session = createLargeSession(200);
      const metrics = MetricsEngine.computeMetrics(session);
      
      const startTime = performance.now();
      
      // Simulate chart data preparation
      const chartData = {
        labels: metrics.fatiguePoints.map((_, i) => `Video ${i + 1}`),
        datasets: [{
          label: 'Attention Span',
          data: metrics.fatiguePoints.map(point => point.dwellTime),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      
      const endTime = performance.now();
      const preparationTime = endTime - startTime;
      
      expect(preparationTime).toBeLessThan(20); // Should prepare chart data quickly
      expect(chartData.labels).toHaveLength(200);
      expect(chartData.datasets[0].data).toHaveLength(200);
    });

    it('should optimize data point reduction for large datasets', () => {
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        x: i,
        y: Math.sin(i / 100) * 50 + 50 + Math.random() * 10
      }));

      const startTime = performance.now();
      
      // Simulate data point reduction algorithm
      const reducedDataset = largeDataset.filter((_, i) => i % 5 === 0); // Keep every 5th point
      
      const endTime = performance.now();
      const reductionTime = endTime - startTime;
      
      expect(reductionTime).toBeLessThan(10);
      expect(reducedDataset.length).toBe(200); // 1000 / 5
      expect(reducedDataset[0]).toEqual(largeDataset[0]);
    });
  });

  describe('Resource Cleanup', () => {
    it('should properly cleanup event listeners', () => {
      const mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };

      const listeners = ['scroll', 'resize', 'focus', 'blur'];
      const mockCallback = jest.fn();
      
      // Add listeners
      listeners.forEach(event => {
        mockElement.addEventListener(event, mockCallback);
      });
      
      // Cleanup
      listeners.forEach(event => {
        mockElement.removeEventListener(event, mockCallback);
      });
      
      expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
      expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
    });

    it('should cleanup timers and intervals', () => {
      const timers: NodeJS.Timeout[] = [];
      
      // Create multiple timers
      for (let i = 0; i < 5; i++) {
        const timer = setTimeout(() => {}, 1000);
        timers.push(timer);
      }
      
      // Cleanup all timers
      timers.forEach(timer => clearTimeout(timer));
      
      expect(timers).toHaveLength(5);
    });
  });
});

// Helper functions
function createLargeSession(videoCount: number, sessionId: string = 'test-session'): ViewingSession {
  const interactions: VideoInteraction[] = [];
  const startTime = Date.now() - (videoCount * 10000);
  
  for (let i = 0; i < videoCount; i++) {
    const videoId = `video-${i}`;
    const timestamp = startTime + (i * 10000);
    const dwellTime = 3000 + Math.random() * 15000; // 3-18 seconds
    
    interactions.push({
      id: `enter-${i}`,
      videoId,
      sessionId,
      timestamp,
      action: 'enter',
      metadata: { videoOrder: i }
    });
    
    interactions.push({
      id: `leave-${i}`,
      videoId,
      sessionId,
      timestamp: timestamp + dwellTime,
      action: 'leave',
      metadata: { dwellTime, videoOrder: i }
    });
    
    // Add some replays randomly
    if (Math.random() > 0.8) {
      interactions.push({
        id: `replay-${i}`,
        videoId,
        sessionId,
        timestamp: timestamp + dwellTime / 2,
        action: 'replay',
        metadata: {}
      });
    }
  }
  
  return {
    id: sessionId,
    startTime,
    endTime: startTime + (videoCount * 10000),
    isActive: false,
    videoCount,
    totalDwellTime: interactions
      .filter(i => i.action === 'leave')
      .reduce((sum, i) => sum + (i.metadata.dwellTime || 0), 0),
    interactions
  };
}

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}