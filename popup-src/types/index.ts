export interface MetricsData {
  sessionActive: boolean;
  serviceEnabled: boolean;
  videoCount: number;
  interactionCount: number;
  attentionSpan: number;
  dopamineIndex: number;
  replaySensitivity: number;
  sessionLength: number;
  circadianDrift: number;
  activeSessions: number;
  storedSessions: number;
  lastUpdate: string;
  // Advanced behavioral metrics
  scrollMomentum: number;
  rewardVariability: number;
  bingeBursts: number;
  engagementHalfLife: number;
  cognitiveLoad: number;
  habitStrength: number;
  noveltyBias: number;
  sessionArchetype: 'explorer' | 'sampler' | 'doomscroller' | 'unknown';
  aiClassification: 'healthy' | 'doomscroll' | 'unknown';
  aiConfidence: number;
}