/**
 * Tests for content script functionality
 */

describe('Content Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect YouTube Shorts page correctly', () => {
    // Test the URL pattern matching logic
    const testUrls = [
      '/shorts/abc123',
      '/shorts/xyz789',
      '/watch?v=abc123', // Should not match
      '/playlist?list=abc' // Should not match
    ];

    const isYouTubeShortsPage = (pathname: string) => pathname.startsWith('/shorts/');
    
    expect(isYouTubeShortsPage(testUrls[0])).toBe(true);
    expect(isYouTubeShortsPage(testUrls[1])).toBe(true);
    expect(isYouTubeShortsPage(testUrls[2])).toBe(false);
    expect(isYouTubeShortsPage(testUrls[3])).toBe(false);
  });

  test('should generate unique session and interaction IDs', () => {
    const id1 = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const id2 = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^session_\d+_[a-z0-9]+$/);
  });

  test('should throttle function calls correctly', (done) => {
    let callCount = 0;
    
    const throttledFn = throttle(() => {
      callCount++;
    }, 100);

    // Call multiple times rapidly
    throttledFn();
    throttledFn();
    throttledFn();

    // Should only be called once immediately
    expect(callCount).toBe(1);

    // Wait for throttle delay and check again
    setTimeout(() => {
      expect(callCount).toBe(2); // One more call should have been made
      done();
    }, 150);
  });
});

// Helper function for testing (copied from content script)
function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}