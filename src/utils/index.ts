/**
 * Shared utilities for NeuroScroll extension
 */

export * from './storage';

/**
 * Generate unique ID for sessions and interactions
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
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
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Debounce function to delay execution until after delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Check if current time is during circadian drift hours (11 PM - 6 AM)
 */
export function isCircadianDriftTime(timestamp: number = Date.now()): boolean {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour >= 23 || hour < 6;
}

/**
 * Calculate time difference in minutes
 */
export function getTimeDifferenceMinutes(start: number, end: number): number {
  return Math.round((end - start) / 60000);
}