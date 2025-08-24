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

export class PerformanceMonitor {
  private memoryTracking: boolean = false;
  private peakHeapUsed: number = 0;
  private operationTimes: Map<string, number[]> = new Map();
  private scrollEventCount: number = 0;
  private aiInferenceCount: number = 0;
  private storageOperationCount: number = 0;
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMemoryTracking();
  }

  /**
   * Start tracking memory usage
   */
  startMemoryTracking(): void {
    this.memoryTracking = true;
    
    // Check memory every 5 seconds
    this.memoryCheckInterval = setInterval(() => {
      if (this.memoryTracking) {
        const currentMemory = this.getCurrentMemoryUsage();
        if (currentMemory > this.peakHeapUsed) {
          this.peakHeapUsed = currentMemory;
        }
      }
    }, 5000);
  }

  /**
   * Stop tracking memory usage
   */
  stopMemoryTracking(): void {
    this.memoryTracking = false;
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): MemoryStats {
    const currentHeapUsed = this.getCurrentMemoryUsage();
    
    return {
      heapUsed: currentHeapUsed,
      heapTotal: this.getTotalMemoryUsage(),
      external: this.getExternalMemoryUsage(),
      peakHeapUsed: Math.max(this.peakHeapUsed, currentHeapUsed)
    };
  }

  /**
   * Track operation timing
   */
  startOperation(operationName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.operationTimes.has(operationName)) {
        this.operationTimes.set(operationName, []);
      }
      
      this.operationTimes.get(operationName)!.push(duration);
    };
  }

  /**
   * Get operation timing statistics
   */
  getOperationStats(operationName: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const times = this.operationTimes.get(operationName);
    if (!times || times.length === 0) {
      return null;
    }

    const total = times.reduce((sum, time) => sum + time, 0);
    const average = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return {
      count: times.length,
      average,
      min,
      max,
      total
    };
  }

  /**
   * Track scroll events
   */
  trackScrollEvent(): void {
    this.scrollEventCount++;
  }

  /**
   * Track AI inference operations
   */
  trackAIInference(): void {
    this.aiInferenceCount++;
  }

  /**
   * Track storage operations
   */
  trackStorageOperation(): void {
    this.storageOperationCount++;
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      memoryStats: this.getMemoryStats(),
      operationTimes: new Map(this.operationTimes),
      scrollEventCount: this.scrollEventCount,
      aiInferenceCount: this.aiInferenceCount,
      storageOperationCount: this.storageOperationCount
    };
  }

  /**
   * Reset all performance counters
   */
  reset(): void {
    this.operationTimes.clear();
    this.scrollEventCount = 0;
    this.aiInferenceCount = 0;
    this.storageOperationCount = 0;
    this.peakHeapUsed = this.getCurrentMemoryUsage();
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getPerformanceMetrics();
    const report = [];

    report.push('=== NeuroScroll Performance Report ===');
    report.push('');
    
    // Memory statistics
    report.push('Memory Usage:');
    report.push(`  Current Heap: ${(metrics.memoryStats.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    report.push(`  Total Heap: ${(metrics.memoryStats.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    report.push(`  Peak Heap: ${(metrics.memoryStats.peakHeapUsed / 1024 / 1024).toFixed(2)} MB`);
    report.push(`  External: ${(metrics.memoryStats.external / 1024 / 1024).toFixed(2)} MB`);
    report.push('');

    // Operation timings
    report.push('Operation Timings:');
    for (const [operation] of metrics.operationTimes) {
      const stats = this.getOperationStats(operation);
      if (stats) {
        report.push(`  ${operation}:`);
        report.push(`    Count: ${stats.count}`);
        report.push(`    Average: ${stats.average.toFixed(2)}ms`);
        report.push(`    Min: ${stats.min.toFixed(2)}ms`);
        report.push(`    Max: ${stats.max.toFixed(2)}ms`);
        report.push(`    Total: ${stats.total.toFixed(2)}ms`);
      }
    }
    report.push('');

    // Event counters
    report.push('Event Counters:');
    report.push(`  Scroll Events: ${metrics.scrollEventCount}`);
    report.push(`  AI Inferences: ${metrics.aiInferenceCount}`);
    report.push(`  Storage Operations: ${metrics.storageOperationCount}`);
    report.push('');

    // Performance warnings
    const warnings = this.generateWarnings(metrics);
    if (warnings.length > 0) {
      report.push('Performance Warnings:');
      warnings.forEach(warning => report.push(`  ⚠️  ${warning}`));
      report.push('');
    }

    report.push('=== End Report ===');
    
    return report.join('\n');
  }

  /**
   * Generate performance warnings
   */
  private generateWarnings(metrics: PerformanceMetrics): string[] {
    const warnings: string[] = [];

    // Memory warnings
    if (metrics.memoryStats.heapUsed > 100 * 1024 * 1024) { // 100MB
      warnings.push('High memory usage detected (>100MB)');
    }

    if (metrics.memoryStats.peakHeapUsed > 200 * 1024 * 1024) { // 200MB
      warnings.push('Very high peak memory usage detected (>200MB)');
    }

    // Operation timing warnings
    for (const [operation] of metrics.operationTimes) {
      const stats = this.getOperationStats(operation);
      if (stats) {
        if (stats.average > 100) { // 100ms average
          warnings.push(`Slow operation detected: ${operation} (avg: ${stats.average.toFixed(2)}ms)`);
        }
        
        if (stats.max > 1000) { // 1 second max
          warnings.push(`Very slow operation detected: ${operation} (max: ${stats.max.toFixed(2)}ms)`);
        }
      }
    }

    // Event frequency warnings
    if (metrics.scrollEventCount > 10000) {
      warnings.push('High scroll event frequency - consider throttling');
    }

    return warnings;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopMemoryTracking();
    this.reset();
  }

  /**
   * Get current memory usage (browser-compatible)
   */
  private getCurrentMemoryUsage(): number {
    // In browser environment, use performance.memory if available
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    
    // Fallback for testing environment
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    
    return 0;
  }

  /**
   * Get total memory usage (browser-compatible)
   */
  private getTotalMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.totalJSHeapSize || 0;
    }
    
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapTotal;
    }
    
    return 0;
  }

  /**
   * Get external memory usage (browser-compatible)
   */
  private getExternalMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().external;
    }
    
    return 0;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();