/**
 * CSV export utilities for NeuroScroll data
 * Provides formatted data export functionality
 * Requirements: 2.3, 2.4 for data export
 */

import { ViewingSession } from '../types';

export class CSVExporter {
  /**
   * Export sessions to CSV format
   */
  static exportSessions(sessions: ViewingSession[]): string {
    const headers = [
      'Session ID',
      'Start Time',
      'End Time', 
      'Duration (min)',
      'Video Count',
      'Total Dwell Time (s)',
      'Dopamine Spike Index',
      'Attention Span (s)',
      'Replay Sensitivity',
      'Circadian Drift',
      'Health Classification',
      'Confidence'
    ];

    const rows = sessions.map(session => [
      session.id,
      new Date(session.startTime).toISOString(),
      session.endTime ? new Date(session.endTime).toISOString() : 'Active',
      session.endTime ? 
        ((session.endTime - session.startTime) / 60000).toFixed(2) : 
        ((Date.now() - session.startTime) / 60000).toFixed(2),
      session.videoCount.toString(),
      (session.totalDwellTime / 1000).toFixed(2),
      session.computedMetrics?.dopamineSpikeIndex?.toFixed(2) || 'N/A',
      session.computedMetrics?.attentionSpan?.toFixed(2) || 'N/A',
      session.computedMetrics?.replaySensitivity?.toString() || 'N/A',
      session.computedMetrics?.circadianDrift ? 'Yes' : 'No',
      session.computedMetrics?.healthClassification || 'Unknown',
      session.computedMetrics?.confidence?.toFixed(2) || 'N/A'
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Export detailed interactions to CSV format
   */
  static exportInteractions(sessions: ViewingSession[]): string {
    const headers = [
      'Session ID',
      'Interaction ID',
      'Video ID',
      'Timestamp',
      'Action',
      'Dwell Time (s)',
      'Scroll Speed',
      'Video Order'
    ];

    const rows: string[][] = [];
    
    sessions.forEach(session => {
      session.interactions.forEach(interaction => {
        rows.push([
          session.id,
          interaction.id,
          interaction.videoId,
          new Date(interaction.timestamp).toISOString(),
          interaction.action,
          interaction.metadata.dwellTime ? 
            (interaction.metadata.dwellTime / 1000).toFixed(2) : 'N/A',
          interaction.metadata.scrollSpeed?.toFixed(2) || 'N/A',
          interaction.metadata.videoOrder?.toString() || 'N/A'
        ]);
      });
    });

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Export fatigue curve data to CSV format
   */
  static exportFatigueCurves(sessions: ViewingSession[]): string {
    const headers = [
      'Session ID',
      'Video Order',
      'Dwell Time (s)',
      'Timestamp'
    ];

    const rows: string[][] = [];
    
    sessions.forEach(session => {
      if (session.computedMetrics?.fatiguePoints) {
        session.computedMetrics.fatiguePoints.forEach(point => {
          rows.push([
            session.id,
            point.videoOrder.toString(),
            point.dwellTime.toFixed(2),
            new Date(point.timestamp).toISOString()
          ]);
        });
      }
    });

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Create downloadable CSV blob (for popup use only)
   * Note: This method should only be called from popup context, not background
   */
  static createDownloadableCSV(csvContent: string, filename: string): void {
    // This method is only for popup use - background script should not call this
    if (typeof document === 'undefined') {
      throw new Error('createDownloadableCSV can only be called from popup context');
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Generate comprehensive data export
   */
  static exportAllData(sessions: ViewingSession[]): {
    sessions: string;
    interactions: string;
    fatigueCurves: string;
  } {
    return {
      sessions: this.exportSessions(sessions),
      interactions: this.exportInteractions(sessions),
      fatigueCurves: this.exportFatigueCurves(sessions)
    };
  }
}