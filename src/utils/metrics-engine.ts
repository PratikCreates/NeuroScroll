/**
 * Metrics computation engine for NeuroScroll
 * Implements neuroscience-based behavioral analysis
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import { ViewingSession, VideoInteraction, ComputedMetrics, FatiguePoint, BingeBurst } from '../types';

export class MetricsEngine {
  /**
   * Compute all metrics for a viewing session
   */
  static computeMetrics(session: ViewingSession): ComputedMetrics {
    try {
      if (!session || !Array.isArray(session.interactions)) {
        throw new Error('Invalid session data');
      }

      const interactions = session.interactions;
      const sessionLength = this.calculateSessionLength(session);
      
      const fatiguePoints = this.generateFatiguePoints(interactions);
      const dwellTimes = this.extractDwellTimes(interactions);
      
      const metrics: ComputedMetrics = {
        dopamineSpikeIndex: this.calculateDopamineSpikeIndex(interactions),
        attentionSpan: this.calculateAttentionSpan(interactions),
        replaySensitivity: this.calculateReplaySensitivity(interactions),
        sessionLength,
        fatiguePoints,
        circadianDrift: this.detectCircadianDrift(session.startTime, sessionLength),
        healthClassification: 'unknown', // Will be set by AI classifier
        confidence: 0.8, // Default confidence
        timestamp: Date.now(),
        // Advanced behavioral metrics
        scrollMomentum: this.calculateScrollMomentum(interactions),
        rewardVariability: this.calculateRewardVariability(dwellTimes),
        bingeBursts: this.detectBingeBursts(interactions),
        engagementHalfLife: this.calculateEngagementHalfLife(fatiguePoints),
        cognitiveLoad: this.calculateCognitiveLoad(interactions),
        habitStrength: this.calculateHabitStrength(interactions),
        noveltyBias: this.calculateNoveltyBias(interactions),
        sessionArchetype: 'unknown' // Will be determined after all metrics
      };

      // Apply health classification and session archetype
      metrics.healthClassification = this.analyzeSessionHealth(metrics);
      metrics.sessionArchetype = this.classifySessionArchetype(metrics);

      return metrics;
    } catch (error) {
      console.error('Error computing metrics:', error);
      // Return safe default metrics
      return {
        dopamineSpikeIndex: 0,
        attentionSpan: 0,
        replaySensitivity: 0,
        sessionLength: 0,
        fatiguePoints: [],
        circadianDrift: false,
        healthClassification: 'unknown',
        confidence: 0,
        timestamp: Date.now(),
        scrollMomentum: 0,
        rewardVariability: 0,
        bingeBursts: [],
        engagementHalfLife: 0,
        cognitiveLoad: 0,
        habitStrength: 0,
        noveltyBias: 0,
        sessionArchetype: 'unknown'
      };
    }
  }

  /**
   * Calculate Dopamine Spike Index
   * Formula: number of shorts viewed ÷ average dwell time
   * Higher values indicate rapid content consumption
   */
  private static calculateDopamineSpikeIndex(interactions: VideoInteraction[]): number {
    try {
      if (!Array.isArray(interactions) || interactions.length === 0) {
        return 0;
      }

      const enterEvents = interactions.filter(i => i && i.action === 'enter');
      const leaveEvents = interactions.filter(i => i && i.action === 'leave' && i.metadata?.dwellTime);
      
      if (enterEvents.length === 0 || leaveEvents.length === 0) {
        return 0;
      }

      const totalDwellTime = leaveEvents.reduce((sum, interaction) => {
        const dwellTime = interaction.metadata?.dwellTime || 0;
        return sum + (typeof dwellTime === 'number' && dwellTime > 0 ? dwellTime : 0);
      }, 0);

      const averageDwellTime = totalDwellTime / leaveEvents.length;
      
      if (averageDwellTime === 0 || !isFinite(averageDwellTime)) {
        return 0;
      }

      const result = enterEvents.length / (averageDwellTime / 1000); // Convert to seconds
      return isFinite(result) ? Math.max(0, result) : 0;
    } catch (error) {
      console.error('Error calculating dopamine spike index:', error);
      return 0;
    }
  }

  /**
   * Calculate Attention Span
   * Moving average of dwell times with exponential decay
   */
  private static calculateAttentionSpan(interactions: VideoInteraction[]): number {
    try {
      if (!Array.isArray(interactions) || interactions.length === 0) {
        return 0;
      }

      const dwellTimes = interactions
        .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
        .map(i => i.metadata.dwellTime!)
        .filter(time => typeof time === 'number' && time > 0 && isFinite(time));

      if (dwellTimes.length === 0) {
        return 0;
      }

      // Calculate exponentially weighted moving average
      const alpha = 0.3; // Smoothing factor
      let ewma = dwellTimes[0];

      for (let i = 1; i < dwellTimes.length; i++) {
        ewma = alpha * dwellTimes[i] + (1 - alpha) * ewma;
        if (!isFinite(ewma)) {
          console.error('Non-finite EWMA value detected');
          return 0;
        }
      }

      const result = ewma / 1000; // Convert to seconds
      return isFinite(result) ? Math.max(0, result) : 0;
    } catch (error) {
      console.error('Error calculating attention span:', error);
      return 0;
    }
  }

  /**
   * Calculate Replay Sensitivity
   * Total number of replay events
   */
  private static calculateReplaySensitivity(interactions: VideoInteraction[]): number {
    return interactions.filter(i => i.action === 'replay').length;
  }

  /**
   * Calculate session length in minutes
   */
  private static calculateSessionLength(session: ViewingSession): number {
    if (!session.endTime) {
      return (Date.now() - session.startTime) / 60000;
    }
    return (session.endTime - session.startTime) / 60000;
  }

  /**
   * Generate fatigue curve points
   * Shows dwell time progression over video order
   */
  private static generateFatiguePoints(interactions: VideoInteraction[]): FatiguePoint[] {
    const videoSequence = new Map<string, number>();
    let videoOrder = 0;

    // Track video order
    interactions
      .filter(i => i.action === 'enter')
      .forEach(interaction => {
        if (!videoSequence.has(interaction.videoId)) {
          videoSequence.set(interaction.videoId, videoOrder++);
        }
      });

    // Generate fatigue points from leave events
    const fatiguePoints: FatiguePoint[] = [];
    
    interactions
      .filter(i => i.action === 'leave' && i.metadata.dwellTime)
      .forEach(interaction => {
        const order = videoSequence.get(interaction.videoId);
        if (order !== undefined) {
          fatiguePoints.push({
            videoOrder: order,
            dwellTime: interaction.metadata.dwellTime! / 1000, // Convert to seconds
            timestamp: interaction.timestamp
          });
        }
      });

    return fatiguePoints.sort((a, b) => a.videoOrder - b.videoOrder);
  }

  /**
   * Detect circadian drift (late-night bingeing)
   * Flags sessions between 11 PM and 6 AM
   */
  private static detectCircadianDrift(startTime: number, sessionLengthMinutes: number): boolean {
    const startDate = new Date(startTime);
    const endDate = new Date(startTime + sessionLengthMinutes * 60000);
    
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();

    // Check if session starts or ends in circadian drift window (11 PM - 6 AM)
    const isStartInDriftWindow = startHour >= 23 || startHour < 6;
    const isEndInDriftWindow = endHour >= 23 || endHour < 6;
    
    // Also check if session spans midnight
    const spansCircadianWindow = startHour >= 23 && endHour < 6;

    return isStartInDriftWindow || isEndInDriftWindow || spansCircadianWindow;
  }

  /**
   * Calculate fatigue slope for trend analysis
   * Negative slope indicates increasing fatigue (decreasing dwell time)
   */
  static calculateFatigueSlope(fatiguePoints: FatiguePoint[]): number {
    if (fatiguePoints.length < 2) {
      return 0;
    }

    // Linear regression to find slope
    const n = fatiguePoints.length;
    const sumX = fatiguePoints.reduce((sum, point) => sum + point.videoOrder, 0);
    const sumY = fatiguePoints.reduce((sum, point) => sum + point.dwellTime, 0);
    const sumXY = fatiguePoints.reduce((sum, point) => sum + point.videoOrder * point.dwellTime, 0);
    const sumXX = fatiguePoints.reduce((sum, point) => sum + point.videoOrder * point.videoOrder, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return isNaN(slope) ? 0 : slope;
  }

  /**
   * Analyze session health based on metrics
   * Provides preliminary classification before AI analysis
   */
  static analyzeSessionHealth(metrics: ComputedMetrics): 'healthy' | 'doomscroll' | 'unknown' {
    // Healthy session indicators
    const hasModerateAttentionSpan = metrics.attentionSpan > 10 && metrics.attentionSpan < 120; // 10s - 2min
    const hasLowDopamineSpike = metrics.dopamineSpikeIndex < 2;
    const hasLowReplayRate = metrics.replaySensitivity < 5;
    const hasReasonableLength = metrics.sessionLength < 60; // Less than 1 hour
    const noCircadianDrift = !metrics.circadianDrift;

    const healthyIndicators = [
      hasModerateAttentionSpan,
      hasLowDopamineSpike,
      hasLowReplayRate,
      hasReasonableLength,
      noCircadianDrift
    ].filter(Boolean).length;

    // Doomscroll indicators
    const hasShortAttentionSpan = metrics.attentionSpan < 5; // Less than 5 seconds
    const hasHighDopamineSpike = metrics.dopamineSpikeIndex > 5;
    const hasHighReplayRate = metrics.replaySensitivity > 10;
    const hasLongSession = metrics.sessionLength > 120; // More than 2 hours
    const hasCircadianDrift = metrics.circadianDrift;

    const doomscrollIndicators = [
      hasShortAttentionSpan,
      hasHighDopamineSpike,
      hasHighReplayRate,
      hasLongSession,
      hasCircadianDrift
    ].filter(Boolean).length;

    if (healthyIndicators >= 3) {
      return 'healthy';
    } else if (doomscrollIndicators >= 3) {
      return 'doomscroll';
    }

    return 'unknown';
  }

  /**
   * Extract dwell times from interactions for analysis
   */
  private static extractDwellTimes(interactions: VideoInteraction[]): number[] {
    return interactions
      .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
      .map(i => i.metadata.dwellTime! / 1000) // Convert to seconds
      .filter(time => typeof time === 'number' && time > 0 && isFinite(time));
  }

  /**
   * Calculate Scroll Momentum (Impulse Index) ⚡🌀
   * Formula: # of Shorts skipped in < 3s / total Shorts viewed
   * High momentum = dopamine-seeking impulse scrolling
   */
  private static calculateScrollMomentum(interactions: VideoInteraction[]): number {
    try {
      const dwellTimes = this.extractDwellTimes(interactions);
      
      if (dwellTimes.length === 0) {
        return 0;
      }

      const quickSkips = dwellTimes.filter(time => time < 3).length;
      const momentum = quickSkips / dwellTimes.length;
      
      return isFinite(momentum) ? Math.max(0, Math.min(1, momentum)) : 0;
    } catch (error) {
      console.error('Error calculating scroll momentum:', error);
      return 0;
    }
  }

  /**
   * Calculate Reward Variability Score 🎢
   * Formula: Standard deviation of dwell times
   * High variability = inconsistent dopamine rewards → addictive reinforcement
   */
  private static calculateRewardVariability(dwellTimes: number[]): number {
    try {
      if (dwellTimes.length < 2) {
        return 0;
      }

      const mean = dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length;
      const variance = dwellTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / dwellTimes.length;
      const standardDeviation = Math.sqrt(variance);
      
      return isFinite(standardDeviation) ? standardDeviation : 0;
    } catch (error) {
      console.error('Error calculating reward variability:', error);
      return 0;
    }
  }

  /**
   * Detect Binge Burst patterns 🔥
   * Count consecutive videos watched with dwell < 5s
   * Each streak ≥ 5 videos = Binge Burst
   */
  private static detectBingeBursts(interactions: VideoInteraction[]): BingeBurst[] {
    try {
      const dwellTimes = interactions
        .filter(i => i && i.action === 'leave' && i.metadata?.dwellTime)
        .map((i, index) => ({
          index,
          dwellTime: i.metadata.dwellTime! / 1000,
          timestamp: i.timestamp
        }));

      const bursts: BingeBurst[] = [];
      let burstStart = -1;
      let burstDwellTimes: number[] = [];
      let burstTimestamps: number[] = [];

      for (let i = 0; i < dwellTimes.length; i++) {
        const item = dwellTimes[i];
        
        if (item.dwellTime < 5) {
          // Start or continue a burst
          if (burstStart === -1) {
            burstStart = i;
            burstDwellTimes = [item.dwellTime];
            burstTimestamps = [item.timestamp];
          } else {
            burstDwellTimes.push(item.dwellTime);
            burstTimestamps.push(item.timestamp);
          }
        } else {
          // End current burst if it exists and meets minimum length
          if (burstStart !== -1 && burstDwellTimes.length >= 5) {
            const averageDwellTime = burstDwellTimes.reduce((sum, time) => sum + time, 0) / burstDwellTimes.length;
            
            bursts.push({
              startIndex: burstStart,
              endIndex: burstStart + burstDwellTimes.length - 1,
              length: burstDwellTimes.length,
              averageDwellTime,
              timestamp: burstTimestamps[0]
            });
          }
          
          // Reset burst tracking
          burstStart = -1;
          burstDwellTimes = [];
          burstTimestamps = [];
        }
      }

      // Handle burst that continues to the end
      if (burstStart !== -1 && burstDwellTimes.length >= 5) {
        const averageDwellTime = burstDwellTimes.reduce((sum, time) => sum + time, 0) / burstDwellTimes.length;
        
        bursts.push({
          startIndex: burstStart,
          endIndex: burstStart + burstDwellTimes.length - 1,
          length: burstDwellTimes.length,
          averageDwellTime,
          timestamp: burstTimestamps[0]
        });
      }

      return bursts;
    } catch (error) {
      console.error('Error detecting binge bursts:', error);
      return [];
    }
  }

  /**
   * Calculate Engagement Decay Half-Life ⏳
   * Find the video index where attention span drops to half its initial value
   */
  private static calculateEngagementHalfLife(fatiguePoints: FatiguePoint[]): number {
    try {
      if (fatiguePoints.length < 3) {
        return 0;
      }

      // Sort by video order to ensure proper sequence
      const sortedPoints = [...fatiguePoints].sort((a, b) => a.videoOrder - b.videoOrder);
      
      // Calculate initial attention (average of first 3 videos)
      const initialAttention = sortedPoints.slice(0, 3).reduce((sum, point) => sum + point.dwellTime, 0) / 3;
      const halfAttention = initialAttention / 2;

      // Find where attention drops to half
      for (let i = 3; i < sortedPoints.length; i++) {
        // Use moving average to smooth out noise
        const windowSize = Math.min(3, i + 1);
        const windowStart = Math.max(0, i - windowSize + 1);
        const currentAttention = sortedPoints.slice(windowStart, i + 1)
          .reduce((sum, point) => sum + point.dwellTime, 0) / windowSize;

        if (currentAttention <= halfAttention) {
          return sortedPoints[i].videoOrder;
        }
      }

      // If attention never drops to half, return the total video count
      return sortedPoints[sortedPoints.length - 1].videoOrder;
    } catch (error) {
      console.error('Error calculating engagement half-life:', error);
      return 0;
    }
  }

  /**
   * Classify Session Archetype 🤖
   * Explorer: high dwell, low skip momentum
   * Sampler: moderate dwell, moderate skips
   * Doomscroller: low dwell, high skips, many bursts
   */
  private static classifySessionArchetype(metrics: ComputedMetrics): 'explorer' | 'sampler' | 'doomscroller' | 'unknown' {
    try {
      const { attentionSpan, scrollMomentum, bingeBursts, sessionLength } = metrics;

      // Insufficient data
      if (sessionLength < 0.5 || attentionSpan === 0) { // Reduced minimum session length to 30 seconds
        return 'unknown';
      }

      const highAttention = attentionSpan > 15; // > 15 seconds average
      const moderateAttention = attentionSpan > 8 && attentionSpan <= 15; // 8-15 seconds
      const lowAttention = attentionSpan <= 8; // <= 8 seconds

      const lowMomentum = scrollMomentum < 0.3; // < 30% quick skips
      const moderateMomentum = scrollMomentum >= 0.3 && scrollMomentum < 0.6; // 30-60%
      const highMomentum = scrollMomentum >= 0.6; // >= 60%

      const manyBursts = bingeBursts.length >= 2;

      // Classification logic
      if (highAttention && lowMomentum) {
        return 'explorer';
      } else if (lowAttention && (highMomentum || manyBursts)) {
        return 'doomscroller';
      } else if (moderateAttention && moderateMomentum) {
        return 'sampler';
      } else {
        // Edge cases - use dominant characteristic
        if (highMomentum || manyBursts) {
          return 'doomscroller';
        } else if (highAttention) {
          return 'explorer';
        } else {
          return 'sampler';
        }
      }
    } catch (error) {
      console.error('Error classifying session archetype:', error);
      return 'unknown';
    }
  }

  /**
   * Calculate Cognitive Load 🧠
   * Measures mental processing demand from content switching patterns
   * Formula: (scroll events + rapid transitions) / total interactions
   */
  private static calculateCognitiveLoad(interactions: VideoInteraction[]): number {
    try {
      if (interactions.length === 0) {
        return 0;
      }

      const scrollEvents = interactions.filter(i => i.action === 'scroll').length;
      const rapidTransitions = interactions.filter(i => 
        i.action === 'leave' && i.metadata?.dwellTime && i.metadata.dwellTime < 2000
      ).length;

      const cognitiveStressors = scrollEvents + rapidTransitions;
      const cognitiveLoad = cognitiveStressors / interactions.length;

      return isFinite(cognitiveLoad) ? Math.max(0, Math.min(1, cognitiveLoad)) : 0;
    } catch (error) {
      console.error('Error calculating cognitive load:', error);
      return 0;
    }
  }

  /**
   * Calculate Habit Strength 🔄
   * Measures consistency of viewing patterns over time
   * Formula: 1 - (variance in dwell times / mean dwell time)
   */
  private static calculateHabitStrength(interactions: VideoInteraction[]): number {
    try {
      const dwellTimes = this.extractDwellTimes(interactions);
      
      if (dwellTimes.length < 3) {
        return 0;
      }

      const mean = dwellTimes.reduce((sum, time) => sum + time, 0) / dwellTimes.length;
      const variance = dwellTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / dwellTimes.length;
      
      if (mean === 0) {
        return 0;
      }

      const coefficientOfVariation = Math.sqrt(variance) / mean;
      const habitStrength = Math.max(0, 1 - coefficientOfVariation);

      return isFinite(habitStrength) ? Math.min(1, habitStrength) : 0;
    } catch (error) {
      console.error('Error calculating habit strength:', error);
      return 0;
    }
  }

  /**
   * Calculate Novelty Bias ✨
   * Measures preference for new content over familiar patterns
   * Formula: unique videos / total video interactions
   */
  private static calculateNoveltyBias(interactions: VideoInteraction[]): number {
    try {
      const videoInteractions = interactions.filter(i => i.action === 'enter');
      
      if (videoInteractions.length === 0) {
        return 0;
      }

      const uniqueVideos = new Set(videoInteractions.map(i => i.videoId)).size;
      const noveltyBias = uniqueVideos / videoInteractions.length;

      return isFinite(noveltyBias) ? Math.max(0, Math.min(1, noveltyBias)) : 0;
    } catch (error) {
      console.error('Error calculating novelty bias:', error);
      return 0;
    }
  }

  /**
   * Update metrics in real-time during active session
   */
  static updateRealTimeMetrics(session: ViewingSession): ComputedMetrics {
    const metrics = this.computeMetrics(session);
    
    // Add real-time specific adjustments
    if (session.isActive) {
      // Adjust session length for active session
      metrics.sessionLength = (Date.now() - session.startTime) / 60000;
      
      // Lower confidence for incomplete sessions
      metrics.confidence = Math.max(0.3, metrics.confidence - 0.2);
    }

    // Apply preliminary health classification and archetype
    metrics.healthClassification = this.analyzeSessionHealth(metrics);
    metrics.sessionArchetype = this.classifySessionArchetype(metrics);

    return metrics;
  }
}