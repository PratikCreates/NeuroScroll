/**
 * Metrics computation engine for NeuroScroll
 * Implements neuroscience-based behavioral analysis
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
import { ViewingSession, ComputedMetrics, FatiguePoint } from '../types';
export declare class MetricsEngine {
    /**
     * Compute all metrics for a viewing session
     */
    static computeMetrics(session: ViewingSession): ComputedMetrics;
    /**
     * Calculate Dopamine Spike Index
     * Formula: number of shorts viewed ÷ average dwell time
     * Higher values indicate rapid content consumption
     */
    private static calculateDopamineSpikeIndex;
    /**
     * Calculate Attention Span
     * Moving average of dwell times with exponential decay
     */
    private static calculateAttentionSpan;
    /**
     * Calculate Replay Sensitivity
     * Total number of replay events
     */
    private static calculateReplaySensitivity;
    /**
     * Calculate session length in minutes
     */
    private static calculateSessionLength;
    /**
     * Generate fatigue curve points
     * Shows dwell time progression over video order
     */
    private static generateFatiguePoints;
    /**
     * Detect circadian drift (late-night bingeing)
     * Flags sessions between 11 PM and 6 AM
     */
    private static detectCircadianDrift;
    /**
     * Calculate fatigue slope for trend analysis
     * Negative slope indicates increasing fatigue (decreasing dwell time)
     */
    static calculateFatigueSlope(fatiguePoints: FatiguePoint[]): number;
    /**
     * Analyze session health based on metrics
     * Provides preliminary classification before AI analysis
     */
    static analyzeSessionHealth(metrics: ComputedMetrics): 'healthy' | 'doomscroll' | 'unknown';
    /**
     * Extract dwell times from interactions for analysis
     */
    private static extractDwellTimes;
    /**
     * Calculate Scroll Momentum (Impulse Index) ⚡🌀
     * Formula: # of Shorts skipped in < 3s / total Shorts viewed
     * High momentum = dopamine-seeking impulse scrolling
     */
    private static calculateScrollMomentum;
    /**
     * Calculate Reward Variability Score 🎢
     * Formula: Standard deviation of dwell times
     * High variability = inconsistent dopamine rewards → addictive reinforcement
     */
    private static calculateRewardVariability;
    /**
     * Detect Binge Burst patterns 🔥
     * Count consecutive videos watched with dwell < 5s
     * Each streak ≥ 5 videos = Binge Burst
     */
    private static detectBingeBursts;
    /**
     * Calculate Engagement Decay Half-Life ⏳
     * Find the video index where attention span drops to half its initial value
     */
    private static calculateEngagementHalfLife;
    /**
     * Classify Session Archetype 🤖
     * Explorer: high dwell, low skip momentum
     * Sampler: moderate dwell, moderate skips
     * Doomscroller: low dwell, high skips, many bursts
     */
    private static classifySessionArchetype;
    /**
     * Update metrics in real-time during active session
     */
    static updateRealTimeMetrics(session: ViewingSession): ComputedMetrics;
}
