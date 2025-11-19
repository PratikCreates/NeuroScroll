/**
 * AI Analysis Scheduler for NeuroScroll
 * Manages efficient scheduling and error handling for AI inference
 * Requirements: 5.4 - Real-time AI analysis with efficient scheduling
 */
import { AIClassificationResult } from './ai-classifier';
import { ViewingSession, ComputedMetrics } from '../types';
export interface ScheduledAnalysis {
    sessionId: string;
    session: ViewingSession;
    metrics: ComputedMetrics;
    priority: 'high' | 'normal' | 'low';
    timestamp: number;
    retryCount: number;
}
export interface AnalysisResult {
    sessionId: string;
    result: AIClassificationResult;
    processingTime: number;
    success: boolean;
    error?: string;
}
export declare class AIScheduler {
    private static instance;
    private analysisQueue;
    private isProcessing;
    private processingInterval;
    private readonly maxRetries;
    private readonly batchSize;
    private readonly processingDelay;
    private callbacks;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): AIScheduler;
    /**
     * Schedule a session for AI analysis
     */
    scheduleAnalysis(session: ViewingSession, metrics: ComputedMetrics, priority?: 'high' | 'normal' | 'low', callback?: (result: AnalysisResult) => void): void;
    /**
     * Schedule real-time analysis for active session
     */
    scheduleRealTimeAnalysis(session: ViewingSession, metrics: ComputedMetrics, callback?: (result: AnalysisResult) => void): void;
    /**
     * Sort queue by priority and timestamp
     */
    private sortQueue;
    /**
     * Start the processing loop
     */
    private startProcessing;
    /**
     * Stop the processing loop
     */
    stopProcessing(): void;
    /**
     * Process the analysis queue
     */
    private processQueue;
    /**
     * Process a batch of analyses
     */
    private processBatch;
    /**
     * Handle analysis failure with retry logic
     */
    private handleFailure;
    /**
     * Get queue status
     */
    getQueueStatus(): {
        queueLength: number;
        isProcessing: boolean;
        highPriorityCount: number;
        normalPriorityCount: number;
        lowPriorityCount: number;
    };
    /**
     * Clear all pending analyses
     */
    clearQueue(): void;
    /**
     * Clear analyses for a specific session
     */
    clearSessionAnalysis(sessionId: string): void;
    /**
     * Dispose of the scheduler
     */
    dispose(): void;
}
