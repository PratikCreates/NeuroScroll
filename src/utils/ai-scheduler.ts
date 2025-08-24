/**
 * AI Analysis Scheduler for NeuroScroll
 * Manages efficient scheduling and error handling for AI inference
 * Requirements: 5.4 - Real-time AI analysis with efficient scheduling
 */

import { AIClassifier, AIClassificationResult } from './ai-classifier';
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

export class AIScheduler {
  private static instance: AIScheduler | null = null;
  private analysisQueue: ScheduledAnalysis[] = [];
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private readonly maxRetries = 3;
  private readonly batchSize = 5;
  private readonly processingDelay = 1000; // 1 second between batches
  private callbacks: Map<string, (result: AnalysisResult) => void> = new Map();

  private constructor() {
    this.startProcessing();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AIScheduler {
    if (!this.instance) {
      this.instance = new AIScheduler();
    }
    return this.instance;
  }

  /**
   * Schedule a session for AI analysis
   */
  scheduleAnalysis(
    session: ViewingSession,
    metrics: ComputedMetrics,
    priority: 'high' | 'normal' | 'low' = 'normal',
    callback?: (result: AnalysisResult) => void
  ): void {
    const analysis: ScheduledAnalysis = {
      sessionId: session.id,
      session,
      metrics,
      priority,
      timestamp: Date.now(),
      retryCount: 0
    };

    // Remove any existing analysis for this session
    this.analysisQueue = this.analysisQueue.filter(a => a.sessionId !== session.id);

    // Add new analysis to queue
    this.analysisQueue.push(analysis);

    // Sort queue by priority and timestamp
    this.sortQueue();

    // Register callback if provided
    if (callback) {
      this.callbacks.set(session.id, callback);
    }

    console.log(`Scheduled AI analysis for session ${session.id} with priority ${priority}`);
  }

  /**
   * Schedule real-time analysis for active session
   */
  scheduleRealTimeAnalysis(
    session: ViewingSession,
    metrics: ComputedMetrics,
    callback?: (result: AnalysisResult) => void
  ): void {
    // Real-time analysis gets high priority
    this.scheduleAnalysis(session, metrics, 'high', callback);
  }

  /**
   * Sort queue by priority and timestamp
   */
  private sortQueue(): void {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    
    this.analysisQueue.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // Then by timestamp (older first)
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Start the processing loop
   */
  private startProcessing(): void {
    if (this.processingInterval) {
      return;
    }

    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, this.processingDelay);
  }

  /**
   * Stop the processing loop
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  /**
   * Process the analysis queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.analysisQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Get next batch of analyses
      const batch = this.analysisQueue.splice(0, this.batchSize);
      
      if (batch.length === 0) {
        return;
      }

      console.log(`Processing AI analysis batch of ${batch.length} sessions`);

      // Process batch
      const startTime = performance.now();
      const results = await this.processBatch(batch);
      const processingTime = performance.now() - startTime;

      // Handle results
      results.forEach((result, index) => {
        const analysis = batch[index];
        
        if (result.success) {
          // Success - notify callback
          const callback = this.callbacks.get(analysis.sessionId);
          if (callback) {
            callback({
              sessionId: analysis.sessionId,
              result: result.result!,
              processingTime: result.processingTime,
              success: true
            });
            this.callbacks.delete(analysis.sessionId);
          }
        } else {
          // Failure - retry if possible
          this.handleFailure(analysis, result.error);
        }
      });

      console.log(`Batch processing completed in ${processingTime.toFixed(2)}ms`);

    } catch (error) {
      console.error('Error processing AI analysis queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a batch of analyses
   */
  private async processBatch(batch: ScheduledAnalysis[]): Promise<Array<{
    success: boolean;
    result?: AIClassificationResult;
    processingTime: number;
    error?: string;
  }>> {
    const results: Array<{
      success: boolean;
      result?: AIClassificationResult;
      processingTime: number;
      error?: string;
    }> = [];

    try {
      // Prepare data for batch processing
      const sessionData = batch.map(analysis => ({
        session: analysis.session,
        metrics: analysis.metrics
      }));

      // Perform batch classification
      const startTime = performance.now();
      const classifications = await AIClassifier.classifySessions(sessionData);
      const totalProcessingTime = performance.now() - startTime;
      const avgProcessingTime = totalProcessingTime / batch.length;

      // Map results
      classifications.forEach((classification) => {
        results.push({
          success: true,
          result: classification,
          processingTime: avgProcessingTime
        });
      });

    } catch (error) {
      console.error('Batch AI classification failed:', error);
      
      // Fall back to individual processing
      for (const analysis of batch) {
        try {
          const startTime = performance.now();
          const result = await AIClassifier.classifySession(analysis.session, analysis.metrics);
          const processingTime = performance.now() - startTime;
          
          results.push({
            success: true,
            result,
            processingTime
          });
        } catch (individualError) {
          results.push({
            success: false,
            processingTime: 0,
            error: individualError instanceof Error ? individualError.message : 'Unknown error'
          });
        }
      }
    }

    return results;
  }

  /**
   * Handle analysis failure with retry logic
   */
  private handleFailure(analysis: ScheduledAnalysis, error?: string): void {
    analysis.retryCount++;

    if (analysis.retryCount <= this.maxRetries) {
      // Retry with lower priority and exponential backoff
      analysis.priority = 'low';
      analysis.timestamp = Date.now() + (analysis.retryCount * 2000); // 2s, 4s, 6s delays
      
      this.analysisQueue.push(analysis);
      this.sortQueue();
      
      console.log(`Retrying AI analysis for session ${analysis.sessionId} (attempt ${analysis.retryCount}/${this.maxRetries})`);
    } else {
      // Max retries reached - notify callback with failure
      const callback = this.callbacks.get(analysis.sessionId);
      if (callback) {
        callback({
          sessionId: analysis.sessionId,
          result: {
            classification: 'unknown',
            confidence: 0,
            features: AIClassifier.extractFeatures(analysis.session, analysis.metrics),
            modelVersion: 'failed'
          },
          processingTime: 0,
          success: false,
          error: error || 'Max retries exceeded'
        });
        this.callbacks.delete(analysis.sessionId);
      }
      
      console.error(`AI analysis failed for session ${analysis.sessionId} after ${this.maxRetries} retries:`, error);
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    highPriorityCount: number;
    normalPriorityCount: number;
    lowPriorityCount: number;
  } {
    const counts = this.analysisQueue.reduce((acc, analysis) => {
      acc[analysis.priority]++;
      return acc;
    }, { high: 0, normal: 0, low: 0 });

    return {
      queueLength: this.analysisQueue.length,
      isProcessing: this.isProcessing,
      highPriorityCount: counts.high,
      normalPriorityCount: counts.normal,
      lowPriorityCount: counts.low
    };
  }

  /**
   * Clear all pending analyses
   */
  clearQueue(): void {
    this.analysisQueue = [];
    this.callbacks.clear();
    console.log('AI analysis queue cleared');
  }

  /**
   * Clear analyses for a specific session
   */
  clearSessionAnalysis(sessionId: string): void {
    this.analysisQueue = this.analysisQueue.filter(a => a.sessionId !== sessionId);
    this.callbacks.delete(sessionId);
  }

  /**
   * Dispose of the scheduler
   */
  dispose(): void {
    this.stopProcessing();
    this.clearQueue();
    AIScheduler.instance = null;
  }
}