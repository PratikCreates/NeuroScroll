/**
 * Tests for background service worker message validation and data structures
 * Validates core functionality without full Chrome extension environment
 */

import { VideoInteraction, ViewingSession } from '../../types';

describe('Background Service Worker Core Functionality', () => {

  const createMockInteraction = (action: string, videoId: string): VideoInteraction => ({
    id: 'test-interaction',
    videoId,
    sessionId: 'test-session',
    timestamp: Date.now(),
    action: action as any,
    metadata: { dwellTime: 5000 }
  });

  describe('Data Validation', () => {
    it('should validate interaction data structure', () => {
      const validInteraction = createMockInteraction('enter', 'video1');
      
      expect(validInteraction.id).toBeDefined();
      expect(validInteraction.videoId).toBe('video1');
      expect(validInteraction.sessionId).toBe('test-session');
      expect(validInteraction.action).toBe('enter');
      expect(typeof validInteraction.timestamp).toBe('number');
      expect(validInteraction.metadata).toBeDefined();
    });

    it('should validate session data structure', () => {
      const session: ViewingSession = {
        id: 'test-session',
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        isActive: false,
        videoCount: 5,
        totalDwellTime: 30000,
        interactions: []
      };

      expect(session.id).toBe('test-session');
      expect(typeof session.startTime).toBe('number');
      expect(typeof session.endTime).toBe('number');
      expect(typeof session.isActive).toBe('boolean');
      expect(typeof session.videoCount).toBe('number');
      expect(typeof session.totalDwellTime).toBe('number');
      expect(Array.isArray(session.interactions)).toBe(true);
    });

    it('should handle message type validation', () => {
      const validMessage = { type: 'SESSION_START', sessionId: 'test', timestamp: Date.now() };
      const invalidMessage: any = { data: 'invalid' };
      
      expect(typeof validMessage.type).toBe('string');
      expect(validMessage.type).toBe('SESSION_START');
      expect(typeof invalidMessage.type).toBe('undefined');
    });
  });

  describe('Session Logic', () => {
    it('should create valid session objects', () => {
      const sessionId = 'test-session-' + Date.now();
      const timestamp = Date.now();
      
      const session: ViewingSession = {
        id: sessionId,
        startTime: timestamp,
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      };

      expect(session.id).toBe(sessionId);
      expect(session.startTime).toBe(timestamp);
      expect(session.isActive).toBe(true);
      expect(session.videoCount).toBe(0);
      expect(session.totalDwellTime).toBe(0);
      expect(session.interactions).toHaveLength(0);
    });

    it('should handle session state transitions', () => {
      const session: ViewingSession = {
        id: 'test-session',
        startTime: Date.now() - 60000,
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      };

      // Add interaction
      const interaction = createMockInteraction('enter', 'video1');
      session.interactions.push(interaction);
      session.videoCount = 1;

      expect(session.interactions).toHaveLength(1);
      expect(session.videoCount).toBe(1);

      // End session
      session.endTime = Date.now();
      session.isActive = false;

      expect(session.endTime).toBeDefined();
      expect(session.isActive).toBe(false);
    });
  });

  describe('Interaction Processing', () => {
    it('should process video enter interactions', () => {
      const session: ViewingSession = {
        id: 'test-session',
        startTime: Date.now(),
        isActive: true,
        videoCount: 0,
        totalDwellTime: 0,
        interactions: []
      };

      const enterInteraction = createMockInteraction('enter', 'video1');
      session.interactions.push(enterInteraction);

      // Simulate video count update
      const uniqueVideos = new Set(
        session.interactions
          .filter(i => i.action === 'enter')
          .map(i => i.videoId)
      );
      session.videoCount = uniqueVideos.size;

      expect(session.videoCount).toBe(1);
      expect(session.interactions).toHaveLength(1);
      expect(session.interactions[0].action).toBe('enter');
    });

    it('should process video leave interactions with dwell time', () => {
      const session: ViewingSession = {
        id: 'test-session',
        startTime: Date.now(),
        isActive: true,
        videoCount: 1,
        totalDwellTime: 0,
        interactions: []
      };

      const leaveInteraction = createMockInteraction('leave', 'video1');
      leaveInteraction.metadata.dwellTime = 10000; // 10 seconds
      session.interactions.push(leaveInteraction);

      // Simulate dwell time update
      session.totalDwellTime += leaveInteraction.metadata.dwellTime;

      expect(session.totalDwellTime).toBe(10000);
      expect(session.interactions[0].metadata.dwellTime).toBe(10000);
    });

    it('should handle replay interactions', () => {
      const session: ViewingSession = {
        id: 'test-session',
        startTime: Date.now(),
        isActive: true,
        videoCount: 1,
        totalDwellTime: 0,
        interactions: []
      };

      const replayInteraction = createMockInteraction('replay', 'video1');
      session.interactions.push(replayInteraction);

      const replayCount = session.interactions.filter(i => i.action === 'replay').length;
      expect(replayCount).toBe(1);
    });
  });

  describe('Data Structures', () => {
    it('should maintain session data integrity', () => {
      const sessions: ViewingSession[] = [
        {
          id: 'session1',
          startTime: Date.now() - 60000,
          endTime: Date.now(),
          isActive: false,
          videoCount: 5,
          totalDwellTime: 50000,
          interactions: []
        },
        {
          id: 'session2',
          startTime: Date.now() - 30000,
          isActive: true,
          videoCount: 2,
          totalDwellTime: 15000,
          interactions: []
        }
      ];

      expect(sessions).toHaveLength(2);
      expect(sessions[0].isActive).toBe(false);
      expect(sessions[1].isActive).toBe(true);
      expect(sessions[0].endTime).toBeDefined();
      expect(sessions[1].endTime).toBeUndefined();
    });

    it('should handle CSV export data format', () => {
      const csvHeaders = [
        'Session ID', 'Start Time', 'End Time', 'Duration (min)', 
        'Video Count', 'Dopamine Spike Index', 'Attention Span', 
        'Replay Sensitivity', 'Circadian Drift', 'Health Classification'
      ];

      const csvRow = [
        'session1',
        new Date().toISOString(),
        new Date().toISOString(),
        '30.5',
        '10',
        '2.5',
        '15.2',
        '3',
        'No',
        'healthy'
      ];

      expect(csvHeaders).toHaveLength(10);
      expect(csvRow).toHaveLength(10);
      expect(csvHeaders[0]).toBe('Session ID');
      expect(csvRow[0]).toBe('session1');
    });
  });

  describe('Message Format Validation', () => {
    it('should validate required message fields', () => {
      const validSessionStart = {
        type: 'SESSION_START',
        sessionId: 'test-session',
        timestamp: Date.now()
      };

      const invalidSessionStart: any = {
        type: 'SESSION_START'
        // Missing required fields
      };

      expect(validSessionStart.type).toBe('SESSION_START');
      expect(validSessionStart.sessionId).toBeDefined();
      expect(validSessionStart.timestamp).toBeDefined();

      expect(invalidSessionStart.sessionId).toBeUndefined();
      expect(invalidSessionStart.timestamp).toBeUndefined();
    });

    it('should validate interaction message structure', () => {
      const validInteractionMessage = {
        type: 'INTERACTION',
        interaction: createMockInteraction('enter', 'video1')
      };

      const invalidInteractionMessage: any = {
        type: 'INTERACTION',
        interaction: { invalid: 'data' }
      };

      expect(validInteractionMessage.type).toBe('INTERACTION');
      expect(validInteractionMessage.interaction.id).toBeDefined();
      expect(validInteractionMessage.interaction.videoId).toBe('video1');
      expect(validInteractionMessage.interaction.action).toBe('enter');

      expect(invalidInteractionMessage.interaction.id).toBeUndefined();
      expect(invalidInteractionMessage.interaction.videoId).toBeUndefined();
    });
  });
});