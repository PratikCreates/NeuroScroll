/**
 * CSV export utilities for NeuroScroll data
 * Provides formatted data export functionality
 * Requirements: 2.3, 2.4 for data export
 */
import { ViewingSession } from '../types';
export declare class CSVExporter {
    /**
     * Export sessions to CSV format
     */
    static exportSessions(sessions: ViewingSession[]): string;
    /**
     * Export detailed interactions to CSV format
     */
    static exportInteractions(sessions: ViewingSession[]): string;
    /**
     * Export fatigue curve data to CSV format
     */
    static exportFatigueCurves(sessions: ViewingSession[]): string;
    /**
     * Create downloadable CSV blob (for popup use only)
     * Note: This method should only be called from popup context, not background
     */
    static createDownloadableCSV(csvContent: string, filename: string): void;
    /**
     * Generate comprehensive data export
     */
    static exportAllData(sessions: ViewingSession[]): {
        sessions: string;
        interactions: string;
        fatigueCurves: string;
    };
}
