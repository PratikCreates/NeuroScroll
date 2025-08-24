/**
 * Tests for storage utilities
 */

import { StorageManager } from '../storage';
import { ViewingSession } from '../../types';

describe('StorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should retrieve data from chrome storage', async () => {
      const mockData = [{ id: 'test-session' }];
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        'neuroscroll-sessions': mockData
      });

      const result = await StorageManager.get('neuroscroll-sessions');
      expect(result).toEqual(mockData);
      expect(chrome.storage.local.get).toHaveBeenCalledWith('neuroscroll-sessions');
    });

    it('should return null if key does not exist', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({});

      const result = await StorageManager.get('neuroscroll-sessions');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store valid data', async () => {
      const mockSessions: ViewingSession[] = [{
        id: 'test-session',
        startTime: Date.now(),
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      }];

      (chrome.storage.local.set as jest.Mock).mockResolvedValue(undefined);

      const result = await StorageManager.set('neuroscroll-sessions', mockSessions);
      expect(result).toBe(true);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        'neuroscroll-sessions': mockSessions
      });
    });
  });

  describe('getSettings', () => {
    it('should return default settings if none exist', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({});

      const settings = await StorageManager.getSettings();
      expect(settings).toEqual({
        enableAI: true,
        enableGeminiInsights: false,
        dataRetentionDays: 30,
        exportFormat: 'csv',
        accessibilityMode: false,
        serviceEnabled: true
      });
    });
  });

  describe('exportAsCSV', () => {
    it('should generate CSV format', async () => {
      const mockSessions: ViewingSession[] = [{
        id: 'test-session',
        startTime: 1640995200000, // 2022-01-01 00:00:00
        endTime: 1640995800000,   // 2022-01-01 00:10:00
        isActive: false,
        videoCount: 5,
        totalDwellTime: 600000,
        interactions: [],
        computedMetrics: {
          dopamineSpikeIndex: 2.5,
          attentionSpan: 120,
          replaySensitivity: 3,
          sessionLength: 600,
          fatiguePoints: [],
          circadianDrift: false,
          healthClassification: 'healthy',
          confidence: 0.85,
          timestamp: Date.now()
        }
      }];

      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        'neuroscroll-sessions': mockSessions
      });

      const csv = await StorageManager.exportAsCSV();
      expect(csv).toContain('"Session ID","Start Time","End Time"');
      expect(csv).toContain('test-session');
      expect(csv).toContain('2.50'); // dopamine spike index
      expect(csv).toContain('healthy');
    });
  });
});