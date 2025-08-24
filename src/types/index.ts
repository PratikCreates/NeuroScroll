/**
 * Core data models for NeuroScroll YouTube Shorts analyzer
 * Based on requirements 2.1, 2.2, 2.5 for data structure and storage
 */

export interface VideoInteraction {
  id: string;
  videoId: string;
  sessionId: string;
  timestamp: number;
  action: 'enter' | 'leave' | 'replay' | 'scroll';
  metadata: {
    scrollSpeed?: number;
    dwellTime?: number;
    videoOrder?: number;
    scrollDirection?: 'up' | 'down';
    scrollDistance?: number;
  };
}

export interface ViewingSession {
  id: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
  videoCount: number;
  totalDwellTime: number;
  interactions: VideoInteraction[];
  computedMetrics?: ComputedMetrics;
}

export interface ComputedMetrics {
  dopamineSpikeIndex: number;
  attentionSpan: number;
  replaySensitivity: number;
  sessionLength: number;
  fatiguePoints: FatiguePoint[];
  circadianDrift: boolean;
  healthClassification: 'healthy' | 'doomscroll' | 'unknown';
  confidence: number;
  timestamp: number;
  // Advanced behavioral metrics
  scrollMomentum: number; // Impulse Index
  rewardVariability: number; // Standard deviation of dwell times
  bingeBursts: BingeBurst[];
  engagementHalfLife: number; // Video index where attention drops to half
  cognitiveLoad: number; // Mental processing demand
  habitStrength: number; // Pattern consistency
  noveltyBias: number; // New content preference
  sessionArchetype: 'explorer' | 'sampler' | 'doomscroller' | 'unknown';
}

export interface BingeBurst {
  startIndex: number;
  endIndex: number;
  length: number;
  averageDwellTime: number;
  timestamp: number;
}

export interface FatiguePoint {
  videoOrder: number;
  dwellTime: number;
  timestamp: number;
}

export interface UserSettings {
  enableAI: boolean;
  enableGeminiInsights: boolean;
  dataRetentionDays: number;
  exportFormat: 'csv' | 'json';
  accessibilityMode: boolean;
  serviceEnabled: boolean;
}

export interface StorageSchema {
  'neuroscroll-sessions': ViewingSession[];
  'neuroscroll-settings': UserSettings;
  'neuroscroll-ai-model': ArrayBuffer;
}

export type StorageKey = keyof StorageSchema;