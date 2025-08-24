/**
 * Jest test setup for Chrome extension testing
 */

// Mock Chrome APIs for testing
const mockChrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    onInstalled: {
      addListener: jest.fn(),
    },
    onStartup: {
      addListener: jest.fn(),
    },
    lastError: null,
  },
};

// @ts-ignore
global.chrome = mockChrome;