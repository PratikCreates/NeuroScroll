/**
 * Tests for AI Classification Module
 */

import { AIClassifier } from '../ai-classifier';
import { ComputedMetrics, ViewingSession } from '../../types';

// Mock TensorFlow.js
const mockModel = {
  add: jest.fn(),
  compile: jest.fn(),
  fit: jest.fn(() => Promise.resolve()),
  predict: jest.fn(() => ({
    data: jest.fn(() => Promise.resolve([0.8])),
    dispose: jest.fn()
  })),
  save: jest.fn(() => Promise.resolve()),
  dispose: jest.fn()
};

jest.mock('@tensorflow/tfjs', () => ({
  sequential: jest.fn(() => mockModel),
  layers: {
    dense: jest.fn(() => ({})),
    dropout: jest.fn(() => ({}))
  },
  tensor2d: jest.fn(() => ({
    dispose: jest.fn()
  })),
  train: {
    adam: jest.fn(() => ({}))
  },
  loadLayersModel: jest.fn(() => Promise.reject(new Error('No model found')))
}));

describe('AIClassifier', () => {
  const createMockMetrics = (overrides: Partial<ComputedMetrics> = {}): ComputedMetrics => ({
    dopamineSpikeIndex: 2.5,
    attentionSpan: 15,
    replaySensitivity: 3,
    sessionLength: 45,
    fatiguePoints: [
      { videoOrder: 0, dwellTime: 20, timestamp: Date.now() - 60000 },
      { videoOrder: 1, dwellTime: 15, timestamp: Date.now() - 45000 }
    ],
    circadianDrift: false,
    healthClassification: 'unknown',
    confidence: 0.8,
    timestamp: Date.now(),
    ...overrides
  });

  const createMockSession = (): ViewingSession => ({
    id: 'test-session',
    startTime: Date.now() - 60000,
    endTime: Date.now(),
    isActive: false,
    videoCount: 10,
    totalDwellTime: 150000,
    interactions: []
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the static model state
    AIClassifier.dispose();
  });

  describe('Feature Extraction', () => {
    it('should extract features correctly from session and metrics', () => {
      const session = createMockSession();
      const metrics = createMockMetrics({
        dopamineSpikeIndex: 3.2,
        attentionSpan: 12.5,
        replaySensitivity: 5,
        sessionLength: 90,
        circadianDrift: true
      });

      const features = AIClassifier.extractFeatures(session, metrics);
      
      expect(features.dopamineSpikeIndex).toBe(3.2);
      expect(features.attentionSpan).toBe(12.5);
      expect(features.replaySensitivity).toBe(5);
      expect(features.sessionLength).toBe(90);
      expect(features.circadianDrift).toBe(1); // boolean to number
      expect(features.videoCount).toBe(10);
      expect(typeof features.timeOfDay).toBe('number');
      expect(features.timeOfDay).toBeGreaterThanOrEqual(0);
      expect(features.timeOfDay).toBeLessThan(24);
    });

    it('should handle edge case values', () => {
      const session = createMockSession();
      const metrics = createMockMetrics({
        dopamineSpikeIndex: 0,
        attentionSpan: 0,
        replaySensitivity: 0,
        sessionLength: 0,
        circadianDrift: false,
        fatiguePoints: []
      });

      const features = AIClassifier.extractFeatures(session, metrics);
      
      expect(features.dopamineSpikeIndex).toBe(0);
      expect(features.attentionSpan).toBe(0);
      expect(features.replaySensitivity).toBe(0);
      expect(features.sessionLength).toBe(0);
      expect(features.circadianDrift).toBe(0);
    });

    it('should normalize extreme values', () => {
      const session = createMockSession();
      const metrics = createMockMetrics({
        dopamineSpikeIndex: 100, // Very high
        attentionSpan: 300, // Very high
        replaySensitivity: 50, // Very high
        sessionLength: 1000, // Very long
        circadianDrift: true
      });

      const features = AIClassifier.extractFeatures(session, metrics);
      
      // Should extract raw values (normalization happens internally)
      expect(features.dopamineSpikeIndex).toBe(100);
      expect(features.attentionSpan).toBe(300);
      expect(features.replaySensitivity).toBe(50);
      expect(features.sessionLength).toBe(1000);
      expect(features.circadianDrift).toBe(1);
    });
  });

  describe('Model Initialization', () => {
    it('should initialize model successfully', async () => {
      await AIClassifier.initialize();
      const modelInfo = AIClassifier.getModelInfo();
      expect(modelInfo.isLoaded).toBe(true);
    });

    it('should handle model initialization failure gracefully', async () => {
      // Mock TensorFlow.js to throw error during model creation
      const tf = require('@tensorflow/tfjs');
      const originalSequential = tf.sequential;
      tf.sequential.mockImplementationOnce(() => {
        throw new Error('TensorFlow.js failed to load');
      });

      await AIClassifier.initialize();
      const modelInfo = AIClassifier.getModelInfo();
      
      // Should still have a fallback model
      expect(modelInfo.isLoaded).toBe(true);
      
      // Restore original implementation
      tf.sequential.mockImplementation(originalSequential);
    });
  });

  describe('Classification', () => {
    beforeEach(async () => {
      await AIClassifier.initialize();
    });

    it('should classify healthy session correctly', async () => {
      const session = createMockSession();
      const healthyMetrics = createMockMetrics({
        dopamineSpikeIndex: 1.2,
        attentionSpan: 25,
        replaySensitivity: 2,
        sessionLength: 30,
        circadianDrift: false
      });

      // Mock prediction to return low probability (healthy)
      const tf = require('@tensorflow/tfjs');
      tf.sequential().predict.mockReturnValueOnce({
        data: () => Promise.resolve([0.2]), // Low probability = healthy
        dispose: jest.fn()
      });

      const result = await AIClassifier.classifySession(session, healthyMetrics);
      
      expect(result.classification).toBe('healthy');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.features).toBeDefined();
      expect(result.modelVersion).toBeDefined();
    });

    it('should classify doomscroll session correctly', async () => {
      const session = createMockSession();
      const doomscrollMetrics = createMockMetrics({
        dopamineSpikeIndex: 8.5,
        attentionSpan: 3,
        replaySensitivity: 15,
        sessionLength: 180,
        circadianDrift: true
      });

      // Mock prediction to return high probability (doomscroll)
      const tf = require('@tensorflow/tfjs');
      tf.sequential().predict.mockReturnValueOnce({
        data: () => Promise.resolve([0.9]), // High probability = doomscroll
        dispose: jest.fn()
      });

      const result = await AIClassifier.classifySession(session, doomscrollMetrics);
      
      expect(result.classification).toBe('doomscroll');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle uncertain classifications', async () => {
      const session = createMockSession();
      const ambiguousMetrics = createMockMetrics({
        dopamineSpikeIndex: 4,
        attentionSpan: 12,
        replaySensitivity: 6,
        sessionLength: 75,
        circadianDrift: false
      });

      // Mock prediction to return middle probability
      const tf = require('@tensorflow/tfjs');
      tf.sequential().predict.mockReturnValueOnce({
        data: () => Promise.resolve([0.5]), // Middle probability = uncertain
        dispose: jest.fn()
      });

      const result = await AIClassifier.classifySession(session, ambiguousMetrics);
      
      expect(result.classification).toBe('unknown');
      expect(result.confidence).toBe(0.5);
    });

    it('should handle model prediction errors', async () => {
      const session = createMockSession();
      const metrics = createMockMetrics();

      // Mock prediction to throw error
      const tf = require('@tensorflow/tfjs');
      tf.sequential().predict.mockImplementationOnce(() => {
        throw new Error('Prediction failed');
      });

      const result = await AIClassifier.classifySession(session, metrics);
      
      expect(result.classification).toBe('unknown');
      expect(result.confidence).toBe(0.3); // Fallback confidence
      expect(result.modelVersion).toBe('fallback');
    });
  });

  describe('Batch Classification', () => {
    beforeEach(async () => {
      await AIClassifier.initialize();
    });

    it('should classify multiple sessions efficiently', async () => {
      const sessions = [
        { session: createMockSession(), metrics: createMockMetrics({ dopamineSpikeIndex: 1, attentionSpan: 30 }) },
        { session: createMockSession(), metrics: createMockMetrics({ dopamineSpikeIndex: 8, attentionSpan: 3 }) },
        { session: createMockSession(), metrics: createMockMetrics({ dopamineSpikeIndex: 4, attentionSpan: 15 }) }
      ];

      // Mock predictions for batch
      const tf = require('@tensorflow/tfjs');
      tf.sequential().predict.mockReturnValueOnce({
        data: () => Promise.resolve([0.1, 0.9, 0.5]), // Different predictions for each session
        dispose: jest.fn()
      });

      const results = await AIClassifier.classifySessions(sessions);
      
      expect(results).toHaveLength(3);
      expect(results[0].classification).toBe('healthy');
      expect(results[1].classification).toBe('doomscroll');
      expect(results[2].classification).toBe('unknown');
    });

    it('should handle empty batch', async () => {
      const results = await AIClassifier.classifySessions([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('Model Performance', () => {
    beforeEach(async () => {
      await AIClassifier.initialize();
    });

    it('should complete classification within reasonable time', async () => {
      const session = createMockSession();
      const metrics = createMockMetrics();
      
      const startTime = performance.now();
      await AIClassifier.classifySession(session, metrics);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should handle large batch efficiently', async () => {
      const largeBatch = Array(50).fill(null).map(() => ({
        session: createMockSession(),
        metrics: createMockMetrics()
      }));
      
      const startTime = performance.now();
      await AIClassifier.classifySessions(largeBatch);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(500); // Should complete batch in under 500ms
    });
  });

  describe('Memory Management', () => {
    it('should dispose of tensors properly', async () => {
      await AIClassifier.initialize();
      
      const session = createMockSession();
      const metrics = createMockMetrics();
      const tf = require('@tensorflow/tfjs');
      
      // Mock tensor with dispose method
      const mockTensor = { 
        data: () => Promise.resolve([0.5]),
        dispose: jest.fn() 
      };
      tf.sequential().predict.mockReturnValueOnce(mockTensor);
      
      await AIClassifier.classifySession(session, metrics);
      
      expect(mockTensor.dispose).toHaveBeenCalled();
    });

    it('should handle model cleanup', () => {
      AIClassifier.dispose();
      // Should not throw errors
      const modelInfo = AIClassifier.getModelInfo();
      expect(modelInfo.isLoaded).toBe(false);
    });
  });

  describe('Model Info', () => {
    it('should provide correct model information', () => {
      const modelInfo = AIClassifier.getModelInfo();
      
      expect(typeof modelInfo.isLoaded).toBe('boolean');
      expect(typeof modelInfo.version).toBe('string');
      expect(typeof modelInfo.isLoading).toBe('boolean');
    });

    it('should update model info after initialization', async () => {
      const beforeInfo = AIClassifier.getModelInfo();
      expect(beforeInfo.isLoaded).toBe(false);
      
      await AIClassifier.initialize();
      
      const afterInfo = AIClassifier.getModelInfo();
      expect(afterInfo.isLoaded).toBe(true);
      expect(afterInfo.version).toBe('1.0.0');
    });
  });
});