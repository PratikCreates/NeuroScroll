/**
 * Performance monitoring utilities for NeuroScroll extension
 */
export interface MemoryStats {
    heapUsed: number;
    heapTotal: number;
    external: number;
    peakHeapUsed: number;
}
export interface PerformanceMetrics {
    memoryStats: MemoryStats;
    operationTimes: Map<string, number[]>;
    scrollEventCount: number;
    aiInferenceCount: number;
    storageOperationCount: number;
}
export declare class PerformanceMonitor {
    private memoryTracking;
    private peakHeapUsed;
    private operationTimes;
    private scrollEventCount;
    private aiInferenceCount;
    private storageOperationCount;
    private memoryCheckInterval;
    constructor();
    /**
     * Start tracking memory usage
     */
    startMemoryTracking(): void;
    /**
     * Stop tracking memory usage
     */
    stopMemoryTracking(): void;
    /**
     * Get current memory statistics
     */
    getMemoryStats(): MemoryStats;
    /**
     * Track operation timing
     */
    startOperation(operationName: string): () => void;
    /**
     * Get operation timing statistics
     */
    getOperationStats(operationName: string): {
        count: number;
        average: number;
        min: number;
        max: number;
        total: number;
    } | null;
    /**
     * Track scroll events
     */
    trackScrollEvent(): void;
    /**
     * Track AI inference operations
     */
    trackAIInference(): void;
    /**
     * Track storage operations
     */
    trackStorageOperation(): void;
    /**
     * Get comprehensive performance metrics
     */
    getPerformanceMetrics(): PerformanceMetrics;
    /**
     * Reset all performance counters
     */
    reset(): void;
    /**
     * Generate performance report
     */
    generateReport(): string;
    /**
     * Generate performance warnings
     */
    private generateWarnings;
    /**
     * Cleanup resources
     */
    cleanup(): void;
    /**
     * Get current memory usage (browser-compatible)
     */
    private getCurrentMemoryUsage;
    /**
     * Get total memory usage (browser-compatible)
     */
    private getTotalMemoryUsage;
    /**
     * Get external memory usage (browser-compatible)
     */
    private getExternalMemoryUsage;
}
export declare const performanceMonitor: PerformanceMonitor;
