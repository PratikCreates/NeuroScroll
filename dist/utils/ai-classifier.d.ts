/**
 * TensorFlow.js AI Classification System for NeuroScroll
 * Implements neural network for healthy vs doomscroll session classification
 * Requirements: 5.1, 5.2, 5.4, 7.4
 */
import { ComputedMetrics, ViewingSession } from '../types';
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
    circadianDrift: number;
    videoCount: number;
    timeOfDay: number;
    scrollMomentum: number;
    rewardVariability: number;
    bingeBursts: number;
    engagementHalfLife: number;
}
export declare class AIClassifier {
    private static model;
    private static isLoading;
    private static modelVersion;
    private static readonly MODEL_URL;
    /**
     * Initialize the AI classifier
     */
    static initialize(): Promise<void>;
    /**
     * Load existing model from storage
     */
    private static loadModel;
    /**
     * Create and train a new neural network model
     */
    private static createAndTrainModel;
    /**
     * Create a simple fallback model for error cases
     */
    private static createFallbackModel;
    /**
     * Generate synthetic training data based on behavioral research patterns
     */
    private static generateTrainingData;
    /**
     * Extract features from session data for AI analysis
     */
    static extractFeatures(session: ViewingSession, metrics: ComputedMetrics): SessionFeatures;
    /**
     * Normalize features for model input
     */
    private static normalizeFeatures;
    /**
     * Classify a session using the trained model
     */
    static classifySession(session: ViewingSession, metrics: ComputedMetrics): Promise<AIClassificationResult>;
    /**
     * Batch classify multiple sessions for efficiency
     */
    static classifySessions(sessions: Array<{
        session: ViewingSession;
        metrics: ComputedMetrics;
    }>): Promise<AIClassificationResult[]>;
    /**
     * Get model information and status
     */
    static getModelInfo(): {
        isLoaded: boolean;
        version: string;
        isLoading: boolean;
    };
    /**
     * Dispose of the model to free memory
     */
    static dispose(): void;
    /**
     * Retrain model with new data (for future enhancement)
     */
    static retrainModel(): Promise<void>;
}
