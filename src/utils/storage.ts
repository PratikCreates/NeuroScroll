/**
 * Chrome storage wrapper utilities with data validation and retention management
 * Implements requirements 2.1, 2.2, 2.5 for local storage and data management
 */

import { StorageSchema, StorageKey, ViewingSession, UserSettings } from '../types';

export class StorageManager {
  private static readonly DEFAULT_RETENTION_DAYS = 30;
  private static readonly MAX_SESSIONS = 1000;

  /**
   * Get data from Chrome storage with type safety
   */
  static async get<K extends StorageKey>(key: K): Promise<StorageSchema[K] | null> {
    try {
      // Check if chrome storage is available
      if (!chrome?.storage?.local) {
        console.warn('Chrome storage not available');
        return null;
      }

      const result = await chrome.storage.local.get(key);
      return result[key] || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific Service Worker context errors
      if (errorMessage.includes('No SW Context') || 
          errorMessage.includes('Extension context invalidated') ||
          errorMessage.includes('message port closed')) {
        console.warn(`Service Worker context unavailable for storage key ${key}. This is normal during extension reload.`);
        return null;
      }
      
      console.error(`Failed to get storage key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in Chrome storage with validation
   */
  static async set<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<boolean> {
    try {
      // Check if chrome storage is available
      if (!chrome?.storage?.local) {
        console.warn('Chrome storage not available');
        return false;
      }

      // Validate data before storing
      if (!this.validateData(key, value)) {
        console.error(`Invalid data for storage key ${key}`);
        return false;
      }

      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific Service Worker context errors
      if (errorMessage.includes('No SW Context') || 
          errorMessage.includes('Extension context invalidated') ||
          errorMessage.includes('message port closed')) {
        console.warn(`Service Worker context unavailable for storage key ${key}. Data will be lost. This is normal during extension reload.`);
        return false;
      }
      
      console.error(`Failed to set storage key ${key}:`, error);
      return false;
    }
  }

  /**
   * Add a new session to storage with automatic cleanup
   */
  static async addSession(session: ViewingSession): Promise<boolean> {
    try {
      const sessions = await this.get('neuroscroll-sessions') || [];
      
      // Add new session
      sessions.push(session);
      
      // Apply retention policy
      const cleanedSessions = this.applyRetentionPolicy(sessions);
      
      return await this.set('neuroscroll-sessions', cleanedSessions);
    } catch (error) {
      console.error('Failed to add session:', error);
      return false;
    }
  }

  /**
   * Save a session (add new or update existing)
   */
  async saveSession(session: ViewingSession): Promise<boolean> {
    try {
      // Validate session data
      if (!session || !session.id || typeof session.id !== 'string') {
        console.error('Invalid session data for saving:', session);
        return false;
      }

      if (!Array.isArray(session.interactions)) {
        console.error('Invalid interactions array in session:', session.id);
        return false;
      }

      const sessions = await StorageManager.get('neuroscroll-sessions') || [];
      
      if (!Array.isArray(sessions)) {
        console.error('Stored sessions data is corrupted, reinitializing');
        await StorageManager.set('neuroscroll-sessions', []);
        return await this.saveSession(session); // Retry with clean storage
      }

      const existingIndex = sessions.findIndex(s => s && s.id === session.id);
      
      if (existingIndex >= 0) {
        // Update existing session
        sessions[existingIndex] = { ...session };
      } else {
        // Add new session
        sessions.push({ ...session });
      }
      
      // Apply retention policy
      const cleanedSessions = StorageManager.applyRetentionPolicy(sessions);
      
      return await StorageManager.set('neuroscroll-sessions', cleanedSessions);
    } catch (error) {
      console.error('Failed to save session:', session?.id, error);
      return false;
    }
  }

  /**
   * Update an existing session
   */
  static async updateSession(sessionId: string, updates: Partial<ViewingSession>): Promise<boolean> {
    try {
      const sessions = await this.get('neuroscroll-sessions') || [];
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        console.error(`Session ${sessionId} not found`);
        return false;
      }

      sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
      return await this.set('neuroscroll-sessions', sessions);
    } catch (error) {
      console.error('Failed to update session:', error);
      return false;
    }
  }

  /**
   * Get user settings with defaults
   */
  static async getSettings(): Promise<UserSettings> {
    const settings = await this.get('neuroscroll-settings');
    return settings || this.getDefaultSettings();
  }

  /**
   * Save user settings
   */
  static async saveSettings(settings: UserSettings): Promise<boolean> {
    return await this.set('neuroscroll-settings', settings);
  }

  /**
   * Clear all stored data (for reset functionality)
   */
  static async clearAllData(): Promise<boolean> {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  /**
   * Export data as CSV format
   */
  static async exportAsCSV(): Promise<string> {
    const sessions = await this.get('neuroscroll-sessions') || [];
    
    // Manual CSV export to avoid dynamic import issues in background script
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
   * Apply data retention policy based on user settings
   */
  private static applyRetentionPolicy(sessions: ViewingSession[]): ViewingSession[] {
    const settings = this.getDefaultSettings(); // Will be replaced with actual settings
    const retentionMs = settings.dataRetentionDays * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - retentionMs;

    // Remove old sessions
    let filteredSessions = sessions.filter(session => session.startTime > cutoffTime);

    // Limit total number of sessions
    if (filteredSessions.length > this.MAX_SESSIONS) {
      filteredSessions = filteredSessions
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, this.MAX_SESSIONS);
    }

    return filteredSessions;
  }

  /**
   * Validate data before storing
   */
  private static validateData<K extends StorageKey>(key: K, value: StorageSchema[K]): boolean {
    switch (key) {
      case 'neuroscroll-sessions':
        return Array.isArray(value) && value.every(this.validateSession);
      case 'neuroscroll-settings':
        return this.validateSettings(value as UserSettings);
      case 'neuroscroll-ai-model':
        return value instanceof ArrayBuffer;
      default:
        return false;
    }
  }

  /**
   * Validate session data structure
   */
  private static validateSession(session: ViewingSession): boolean {
    return (
      typeof session.id === 'string' &&
      typeof session.startTime === 'number' &&
      typeof session.isActive === 'boolean' &&
      typeof session.videoCount === 'number' &&
      typeof session.totalDwellTime === 'number' &&
      Array.isArray(session.interactions)
    );
  }

  /**
   * Validate settings data structure
   */
  private static validateSettings(settings: UserSettings): boolean {
    return (
      typeof settings.enableAI === 'boolean' &&
      typeof settings.enableGeminiInsights === 'boolean' &&
      typeof settings.dataRetentionDays === 'number' &&
      ['csv', 'json'].includes(settings.exportFormat) &&
      typeof settings.accessibilityMode === 'boolean' &&
      typeof settings.serviceEnabled === 'boolean'
    );
  }

  /**
   * Get default user settings
   */
  private static getDefaultSettings(): UserSettings {
    return {
      enableAI: true,
      enableGeminiInsights: false,
      dataRetentionDays: this.DEFAULT_RETENTION_DAYS,
      exportFormat: 'csv',
      accessibilityMode: false,
      serviceEnabled: true
    };
  }
}