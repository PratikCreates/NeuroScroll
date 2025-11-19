/**
 * Chrome storage wrapper utilities with data validation and retention management
 * Implements requirements 2.1, 2.2, 2.5 for local storage and data management
 */
import { StorageSchema, StorageKey, ViewingSession, UserSettings } from '../types';
export declare class StorageManager {
    private static readonly DEFAULT_RETENTION_DAYS;
    private static readonly MAX_SESSIONS;
    /**
     * Get data from Chrome storage with type safety
     */
    static get<K extends StorageKey>(key: K): Promise<StorageSchema[K] | null>;
    /**
     * Set data in Chrome storage with validation
     */
    static set<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<boolean>;
    /**
     * Add a new session to storage with automatic cleanup
     */
    static addSession(session: ViewingSession): Promise<boolean>;
    /**
     * Save a session (add new or update existing)
     */
    saveSession(session: ViewingSession): Promise<boolean>;
    /**
     * Update an existing session
     */
    static updateSession(sessionId: string, updates: Partial<ViewingSession>): Promise<boolean>;
    /**
     * Get user settings with defaults
     */
    static getSettings(): Promise<UserSettings>;
    /**
     * Save user settings
     */
    static saveSettings(settings: UserSettings): Promise<boolean>;
    /**
     * Clear all stored data (for reset functionality)
     */
    static clearAllData(): Promise<boolean>;
    /**
     * Export data as CSV format
     */
    static exportAsCSV(): Promise<string>;
    /**
     * Apply data retention policy based on user settings
     */
    private static applyRetentionPolicy;
    /**
     * Validate data before storing
     */
    private static validateData;
    /**
     * Validate session data structure
     */
    private static validateSession;
    /**
     * Validate settings data structure
     */
    private static validateSettings;
    /**
     * Get default user settings
     */
    private static getDefaultSettings;
}
