/**
 * TensorFlow.js AI Classification System for NeuroScroll
 * Implements neural network for healthy vs doomscroll session classification
 * Requirements: 5.1, 5.2, 5.4, 7.4
 */

import * as tf from '@tensorflow/tfjs';
import { ComputedMetrics, ViewingSession } from '../types';
import { MetricsEngine } from './metrics-engine';

export interface AIClassificationResult {
  classification: 'healthy' | 'doomscroll' | 'unknown';
  confidence: number;
  features: SessionFeatures;
  modelVersion: string;
}

export interface SessionFeatures {
  sessionLength: number;
  attentionSpan: number;
  dopamineSpikeIndex: number;
  replaySensitivity: number;
  fatigueSlope: number;
  circadianDrift: number; // 0 or 1
  videoCount: number;
  timeOfDay: number; // 0-23
  scrollMomentum: number;
  rewardVariability: number;
  bingeBursts: number;
  engagementHalfLife: number;
}

export class AIClassifier {
  private static model: tf.LayersModel | null = null;
  private static isLoading = false;
  private static modelVersion = '1.0.0';
  private static readonly MODEL_URL = 'indexeddb://neuroscroll-ai-model';

  /**
   * Initialize the AI classifier
   */
  static async initialize(): Promise<void> {
    if (this.model || this.isLoading) {
      return;
    }

    this.isLoading = true;
    
    try {
      // Try to load existing model from IndexedDB
      await this.loadModel();
      
      if (!this.model) {
        // Create and train a new model if none exists
        await this.createAndTrainModel();
      }
    } catch (error) {
      console.error('Failed to initialize AI classifier:', error);
      // Create a simple fallback model
      await this.createFallbackModel();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load existing model from storage
   */
  private static async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(this.MODEL_URL);
      console.log('AI model loaded successfully');
    } catch (error) {
      console.log('No existing model found, will create new one');
    }
  }

  /**
   * Create and train a new neural network model
   */
  private static async createAndTrainModel(): Promise<void> {
    console.log('Creating new AI classification model...');

    // Create model architecture
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [12], // 12 input features (expanded)
          units: 24,
          activation: 'relu',
          name: 'hidden1'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 12,
          activation: 'relu',
          name: 'hidden2'
        }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({
          units: 1,
          activation: 'sigmoid',
          name: 'output'
        })
      ]
    });

    // Compile model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Generate synthetic training data based on behavioral research
    const { features, labels } = this.generateTrainingData();

    // Train the model
    await this.model.fit(features, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true,
      verbose: 0
    });

    // Save model to IndexedDB
    await this.model.save(this.MODEL_URL);
    console.log('AI model trained and saved successfully');

    // Clean up training data
    features.dispose();
    labels.dispose();
  }

  /**
   * Create a simple fallback model for error cases
   */
  private static async createFallbackModel(): Promise<void> {
    console.log('Creating fallback AI model...');
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [12],
          units: 1,
          activation: 'sigmoid'
        })
      ]
    });

    this.model.compile({
      optimizer: 'sgd',
      loss: 'binaryCrossentropy'
    });
  }

  /**
   * Generate synthetic training data based on behavioral research patterns
   */
  private static generateTrainingData(): { features: tf.Tensor2D, labels: tf.Tensor2D } {
    const numSamples = 1000;
    const featuresData: number[][] = [];
    const labelsData: number[][] = [];

    for (let i = 0; i < numSamples; i++) {
      const isHealthy = Math.random() > 0.4; // 60% doomscroll, 40% healthy (realistic distribution)
      
      let sessionLength, attentionSpan, dopamineSpikeIndex, replaySensitivity;
      let fatigueSlope, circadianDrift, videoCount, timeOfDay;
      let scrollMomentum, rewardVariability, bingeBursts, engagementHalfLife;

      if (isHealthy) {
        // Healthy session patterns
        sessionLength = Math.random() * 45 + 5; // 5-50 minutes
        attentionSpan = Math.random() * 60 + 15; // 15-75 seconds
        dopamineSpikeIndex = Math.random() * 2 + 0.5; // 0.5-2.5
        replaySensitivity = Math.floor(Math.random() * 3); // 0-2 replays
        fatigueSlope = (Math.random() - 0.5) * 0.5; // Slight positive or negative
        circadianDrift = Math.random() > 0.8 ? 1 : 0; // 20% chance
        videoCount = Math.floor(sessionLength * (1 + Math.random())); // Reasonable video count
        timeOfDay = Math.random() > 0.3 ? Math.floor(Math.random() * 17) + 7 : Math.floor(Math.random() * 24); // Mostly daytime
        scrollMomentum = Math.random() * 0.3; // Low momentum (0-30%)
        rewardVariability = Math.random() * 8 + 2; // Low variability (2-10s)
        bingeBursts = Math.floor(Math.random() * 2); // 0-1 bursts
        engagementHalfLife = Math.floor(Math.random() * 20) + 10; // 10-30 videos
      } else {
        // Doomscroll session patterns
        sessionLength = Math.random() * 180 + 30; // 30-210 minutes
        attentionSpan = Math.random() * 10 + 2; // 2-12 seconds
        dopamineSpikeIndex = Math.random() * 8 + 3; // 3-11
        replaySensitivity = Math.floor(Math.random() * 15 + 5); // 5-19 replays
        fatigueSlope = -Math.random() * 2; // Negative slope (increasing fatigue)
        circadianDrift = Math.random() > 0.4 ? 1 : 0; // 60% chance
        videoCount = Math.floor(sessionLength * (2 + Math.random() * 2)); // High video count
        timeOfDay = Math.random() > 0.6 ? Math.floor(Math.random() * 6) + 22 : Math.floor(Math.random() * 24); // Often late night
        if (timeOfDay > 24) timeOfDay -= 24;
        scrollMomentum = Math.random() * 0.5 + 0.4; // High momentum (40-90%)
        rewardVariability = Math.random() * 25 + 10; // High variability (10-35s)
        bingeBursts = Math.floor(Math.random() * 5) + 2; // 2-6 bursts
        engagementHalfLife = Math.floor(Math.random() * 8) + 2; // 2-10 videos
      }

      featuresData.push([
        sessionLength / 200, // Normalize to 0-1
        attentionSpan / 100,
        dopamineSpikeIndex / 10,
        replaySensitivity / 20,
        (fatigueSlope + 2) / 4, // Normalize -2 to 2 -> 0 to 1
        circadianDrift,
        videoCount / 400,
        timeOfDay / 24,
        scrollMomentum, // Already 0-1
        rewardVariability / 40, // Normalize to 0-1
        bingeBursts / 10, // Normalize to 0-1
        engagementHalfLife / 50 // Normalize to 0-1
      ]);

      labelsData.push([isHealthy ? 0 : 1]); // 0 = healthy, 1 = doomscroll
    }

    return {
      features: tf.tensor2d(featuresData),
      labels: tf.tensor2d(labelsData)
    };
  }

  /**
   * Extract features from session data for AI analysis
   */
  static extractFeatures(session: ViewingSession, metrics: ComputedMetrics): SessionFeatures {
    const startDate = new Date(session.startTime);
    const fatigueSlope = MetricsEngine.calculateFatigueSlope(metrics.fatiguePoints);

    return {
      sessionLength: metrics.sessionLength,
      attentionSpan: metrics.attentionSpan,
      dopamineSpikeIndex: metrics.dopamineSpikeIndex,
      replaySensitivity: metrics.replaySensitivity,
      fatigueSlope,
      circadianDrift: metrics.circadianDrift ? 1 : 0,
      videoCount: session.videoCount,
      timeOfDay: startDate.getHours(),
      scrollMomentum: metrics.scrollMomentum || 0,
      rewardVariability: metrics.rewardVariability || 0,
      bingeBursts: metrics.bingeBursts?.length || 0,
      engagementHalfLife: metrics.engagementHalfLife || 0
    };
  }

  /**
   * Normalize features for model input
   */
  private static normalizeFeatures(features: SessionFeatures): number[] {
    return [
      Math.min(features.sessionLength / 200, 1), // Cap at 200 minutes
      Math.min(features.attentionSpan / 100, 1), // Cap at 100 seconds
      Math.min(features.dopamineSpikeIndex / 10, 1), // Cap at 10
      Math.min(features.replaySensitivity / 20, 1), // Cap at 20
      Math.max(0, Math.min((features.fatigueSlope + 2) / 4, 1)), // Normalize -2 to 2 -> 0 to 1
      features.circadianDrift,
      Math.min(features.videoCount / 400, 1), // Cap at 400 videos
      features.timeOfDay / 24,
      Math.min(features.scrollMomentum, 1), // Already 0-1 but ensure cap
      Math.min(features.rewardVariability / 40, 1), // Cap at 40 seconds
      Math.min(features.bingeBursts / 10, 1), // Cap at 10 bursts
      Math.min(features.engagementHalfLife / 50, 1) // Cap at 50 videos
    ];
  }

  /**
   * Classify a session using the trained model
   */
  static async classifySession(session: ViewingSession, metrics: ComputedMetrics): Promise<AIClassificationResult> {
    try {
      // Ensure model is initialized
      if (!this.model) {
        await this.initialize();
      }

      if (!this.model) {
        throw new Error('Model not available');
      }

      // Extract and normalize features
      const features = this.extractFeatures(session, metrics);
      const normalizedFeatures = this.normalizeFeatures(features);

      // Make prediction
      const prediction = this.model.predict(tf.tensor2d([normalizedFeatures])) as tf.Tensor;
      const predictionData = await prediction.data();
      const confidence = predictionData[0];

      // Clean up tensors
      prediction.dispose();

      // Determine classification
      let classification: 'healthy' | 'doomscroll' | 'unknown';
      if (confidence > 0.7) {
        classification = 'doomscroll';
      } else if (confidence < 0.3) {
        classification = 'healthy';
      } else {
        classification = 'unknown';
      }

      return {
        classification,
        confidence: classification === 'unknown' ? 0.5 : Math.abs(confidence - 0.5) * 2,
        features,
        modelVersion: this.modelVersion
      };

    } catch (error) {
      console.error('Error in AI classification:', error);
      
      // Fallback to rule-based classification
      return {
        classification: metrics.healthClassification,
        confidence: 0.3, // Low confidence for fallback
        features: this.extractFeatures(session, metrics),
        modelVersion: 'fallback'
      };
    }
  }

  /**
   * Batch classify multiple sessions for efficiency
   */
  static async classifySessions(sessions: Array<{ session: ViewingSession, metrics: ComputedMetrics }>): Promise<AIClassificationResult[]> {
    if (!this.model) {
      await this.initialize();
    }

    if (!this.model || sessions.length === 0) {
      return sessions.map(({ session, metrics }) => ({
        classification: metrics.healthClassification,
        confidence: 0.3,
        features: this.extractFeatures(session, metrics),
        modelVersion: 'fallback'
      }));
    }

    try {
      // Extract and normalize all features
      const allFeatures = sessions.map(({ session, metrics }) => {
        const features = this.extractFeatures(session, metrics);
        return this.normalizeFeatures(features);
      });

      // Make batch prediction
      const predictions = this.model.predict(tf.tensor2d(allFeatures)) as tf.Tensor;
      const predictionData = await predictions.data();

      // Clean up tensors
      predictions.dispose();

      // Process results
      return sessions.map(({ session, metrics }, index) => {
        const confidence = predictionData[index];
        let classification: 'healthy' | 'doomscroll' | 'unknown';
        
        if (confidence > 0.7) {
          classification = 'doomscroll';
        } else if (confidence < 0.3) {
          classification = 'healthy';
        } else {
          classification = 'unknown';
        }

        return {
          classification,
          confidence: classification === 'unknown' ? 0.5 : Math.abs(confidence - 0.5) * 2,
          features: this.extractFeatures(session, metrics),
          modelVersion: this.modelVersion
        };
      });

    } catch (error) {
      console.error('Error in batch AI classification:', error);
      
      // Fallback to rule-based classification
      return sessions.map(({ session, metrics }) => ({
        classification: metrics.healthClassification,
        confidence: 0.3,
        features: this.extractFeatures(session, metrics),
        modelVersion: 'fallback'
      }));
    }
  }

  /**
   * Get model information and status
   */
  static getModelInfo(): { isLoaded: boolean, version: string, isLoading: boolean } {
    return {
      isLoaded: !!this.model,
      version: this.modelVersion,
      isLoading: this.isLoading
    };
  }

  /**
   * Dispose of the model to free memory
   */
  static dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }

  /**
   * Retrain model with new data (for future enhancement)
   */
  static async retrainModel(): Promise<void> {
    this.dispose();
    await this.createAndTrainModel();
  }
}