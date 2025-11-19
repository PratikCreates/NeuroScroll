/**
 * Shared utilities for NeuroScroll extension
 */
export * from './storage';
/**
 * Generate unique ID for sessions and interactions
 */
export declare function generateId(): string;
/**
 * Throttle function to limit execution frequency
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Debounce function to delay execution until after delay
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Check if current time is during circadian drift hours (11 PM - 6 AM)
 */
export declare function isCircadianDriftTime(timestamp?: number): boolean;
/**
 * Calculate time difference in minutes
 */
export declare function getTimeDifferenceMinutes(start: number, end: number): number;
