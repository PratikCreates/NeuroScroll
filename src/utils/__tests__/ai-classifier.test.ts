/**
 * Tests for AI Classification Module
 */

import { AIClassifier } from '../ai-classifier';
import { ComputedMetrics, ViewingSession } from '../../types';

// Create mocks outside the factory to avoid hoisting issues, but they must be accessed via require/import in tests
// However, for jest.mock factory, we can only use variables starting with "mock"
// So we'll define the factory inline.

const mockDispose = jest.fn();
const mockPredict = jest.fn();
const mockFit = jest.fn().mockResolvedValue(undefined);
const mockSave = jest.fn().mockResolvedValue(undefined);
const mockCompile = jest.fn();
const mockAdd = jest.fn();

const mockModelObj = {
  predict: mockPredict,
  fit: mockFit,
  save: mockSave,
  dispose: mockDispose,
  compile: mockCompile,
  add: mockAdd,
};

// Define the mock factory
jest.mock('@tensorflow/tfjs', () => {
  return {
    __esModule: true,
    sequential: jest.fn(() => mockModelObj),
    loadLayersModel: jest.fn(() => Promise.resolve(mockModelObj)),
    layers: {
      dense: jest.fn(() => ({})),
      dropout: jest.fn(() => ({}))
    },
    tensor2d: jest.fn(() => ({
      dispose: jest.fn(),
      data: jest.fn(() => Promise.resolve([0.8])) // Default data
    })),
    train: {
      adam: jest.fn(() => ({}))
    },
    // Add default export for compatibility with dynamic import
    default: {
      sequential: jest.fn(() => mockModelObj),
      loadLayersModel: jest.fn(() => Promise.resolve(mockModelObj)),
      layers: {
        dense: jest.fn(() => ({})),
        dropout: jest.fn(() => ({}))
      },
      tensor2d: jest.fn(() => ({
        dispose: jest.fn(),
        data: jest.fn(() => Promise.resolve([0.8]))
      })),
      train: {
        adam: jest.fn(() => ({}))
      }
    }
  };
});

// We need to access the mocked module to configure it in tests
import * as tfMock from '@tensorflow/tfjs';

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
    scrollMomentum: 0.5,
    rewardVariability: 10,
    bingeBursts: [],
    engagementHalfLife: 50,
    cognitiveLoad: 0.7,
    habitStrength: 0.4,
    noveltyBias: 0.6,
    sessionArchetype: 'unknown',
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

    // Reset mock default behavior
    (mockPredict as jest.Mock).mockReset();
    (mockPredict as jest.Mock).mockReturnValue({
      data: jest.fn(() => Promise.resolve([0.5])),
      dispose: jest.fn()
    });

    // Ensure sequential returns the model
    (tfMock.sequential as jest.Mock).mockReturnValue(mockModelObj);
    (tfMock.loadLayersModel as jest.Mock).mockResolvedValue(mockModelObj);
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

      // Should extract raw values (normalization happens internally during classification)
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
      // Force loadModel to fail so we try to create new model
      (tfMock.loadLayersModel as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('No model found')));

      // Force createAndTrainModel to fail too? 
      // In the original test it was checking if fallback is created.
      // Let's make sequential fail for the first call (createAndTrainModel uses sequential)
      (tfMock.sequential as jest.Mock).mockImplementationOnce(() => {
        throw new Error('TensorFlow.js failed to load');
      });
      // But ensure the second call (for fallback model) succeeds
      (tfMock.sequential as jest.Mock).mockImplementationOnce(() => mockModelObj);

      await AIClassifier.initialize();
      const modelInfo = AIClassifier.getModelInfo();

      // Should still have a fallback model (from the second sequential call)
      expect(modelInfo.isLoaded).toBe(true);
    });
  });

  describe('Classification', () => {
    beforeEach(async () => {
      // Reset mocks again to ensure clean state
      (tfMock.loadLayersModel as jest.Mock).mockResolvedValue(mockModelObj);
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
      (mockPredict as jest.Mock).mockReturnValueOnce({
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
      (mockPredict as jest.Mock).mockReturnValueOnce({
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
      (mockPredict as jest.Mock).mockReturnValueOnce({
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
      (mockPredict as jest.Mock).mockImplementationOnce(() => {
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
      (mockPredict as jest.Mock).mockReturnValueOnce({
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

      (mockPredict as jest.Mock).mockReturnValueOnce({
        data: () => Promise.resolve([0.5]),
        dispose: jest.fn()
      });

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

      (mockPredict as jest.Mock).mockReturnValueOnce({
        data: () => Promise.resolve(new Array(50).fill(0.5)),
        dispose: jest.fn()
      });

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

      // Mock tensor with dispose method
      const mockTensor = {
        data: () => Promise.resolve([0.5]),
        dispose: jest.fn()
      };
      (mockPredict as jest.Mock).mockReturnValueOnce(mockTensor);

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