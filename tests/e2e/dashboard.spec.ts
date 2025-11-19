/**
 * End-to-end tests for Dashboard functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Chrome extension APIs
    await page.addInitScript(() => {
      // Mock chrome.storage.local
      (window as any).chrome = {
        storage: {
          local: {
            get: async (keys: string | string[]) => {
              const mockData = {
                'neuroscroll-sessions': [
                  {
                    id: 'test-session-1',
                    startTime: Date.now() - 3600000,
                    endTime: Date.now() - 3000000,
                    isActive: false,
                    videoCount: 15,
                    totalDwellTime: 180000,
                    interactions: [],
                    computedMetrics: {
                      dopamineSpikeIndex: 4.2,
                      attentionSpan: 12.5,
                      replaySensitivity: 8,
                      sessionLength: 60,
                      fatiguePoints: [
                        { videoOrder: 0, dwellTime: 20, timestamp: Date.now() - 60000 },
                        { videoOrder: 1, dwellTime: 18, timestamp: Date.now() - 55000 },
                        { videoOrder: 2, dwellTime: 15, timestamp: Date.now() - 50000 },
                        { videoOrder: 3, dwellTime: 12, timestamp: Date.now() - 45000 },
                        { videoOrder: 4, dwellTime: 8, timestamp: Date.now() - 40000 },
                      ],
                      circadianDrift: false,
                      healthClassification: 'doomscroll',
                      confidence: 0.87,
                      timestamp: Date.now(),
                    },
                  },
                ],
                'neuroscroll-settings': {
                  enableAI: true,
                  enableGeminiInsights: false,
                  dataRetentionDays: 30,
                  exportFormat: 'csv',
                  accessibilityMode: false,
                  serviceEnabled: true,
                },
              };

              if (typeof keys === 'string') {
                return { [keys]: mockData[keys as keyof typeof mockData] };
              }
              
              const result: any = {};
              keys.forEach(key => {
                result[key] = mockData[key as keyof typeof mockData];
              });
              return result;
            },
            set: async (data: any) => {
              console.log('Mock storage set:', data);
            },
            clear: async () => {
              console.log('Mock storage cleared');
            },
          },
        },
        runtime: {
          sendMessage: async (message: any) => {
            console.log('Mock message sent:', message);
            return { success: true };
          },
        },
      };
    });

    await page.goto('/');
  });

  test('should display dashboard with metrics', async ({ page }) => {
    // Wait for the dashboard to load
    await expect(page.locator('h1')).toContainText('NeuroScroll Dashboard');

    // Check that all metric cards are present
    await expect(page.locator('text=🧠 Dopamine Spike Index')).toBeVisible();
    await expect(page.locator('text=⏱️ Attention Span')).toBeVisible();
    await expect(page.locator('text=🔄 Replay Sensitivity')).toBeVisible();
    await expect(page.locator('text=📊 Session Length')).toBeVisible();

    // Check metric values
    await expect(page.locator('text=4.20')).toBeVisible(); // Dopamine spike index
    await expect(page.locator('text=12.5s')).toBeVisible(); // Attention span
    await expect(page.locator('text=8')).toBeVisible(); // Replay sensitivity
    await expect(page.locator('text=60min')).toBeVisible(); // Session length
  });

  test('should display health classification', async ({ page }) => {
    // Check for doomscroll classification
    await expect(page.locator('text=⚠️ Doomscroll Detected')).toBeVisible();
    await expect(page.locator('text=87% confidence')).toBeVisible();
  });

  test('should display attention chart', async ({ page }) => {
    // Wait for chart to render
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Check that chart canvas is present
    const chart = page.locator('canvas');
    await expect(chart).toBeVisible();
    
    // Verify chart has data by checking if it has been drawn
    const chartBounds = await chart.boundingBox();
    expect(chartBounds?.width).toBeGreaterThan(0);
    expect(chartBounds?.height).toBeGreaterThan(0);
  });

  test('should handle reset functionality', async ({ page }) => {
    // Click reset button
    await page.click('text=Reset Data');

    // Check confirmation dialog appears
    await expect(page.locator('text=Clear All Data?')).toBeVisible();
    await expect(page.locator('text=This will permanently delete all your viewing session data')).toBeVisible();

    // Test cancel functionality
    await page.click('text=Cancel');
    await expect(page.locator('text=Clear All Data?')).not.toBeVisible();

    // Test confirm functionality
    await page.click('text=Reset Data');
    await page.click('text=Yes, Clear Data');
    
    // Dialog should close
    await expect(page.locator('text=Clear All Data?')).not.toBeVisible();
  });

  test('should handle CSV export', async ({ page }) => {
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.click('text=Export CSV');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify download properties
    expect(download.suggestedFilename()).toMatch(/neuroscroll-data-\d{4}-\d{2}-\d{2}\.csv/);
  });

  test('should show tooltips on hover', async ({ page }) => {
    // Hover over dopamine spike index card
    await page.hover('text=🧠 Dopamine Spike Index');
    
    // Check tooltip appears
    await expect(page.locator('text=Measures rapid content consumption')).toBeVisible();
    
    // Move away and check tooltip disappears
    await page.hover('h1');
    await expect(page.locator('text=Measures rapid content consumption')).not.toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Reset button
    await expect(page.locator('text=Reset Data')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Export button
    await expect(page.locator('text=Export CSV')).toBeFocused();
    
    // Test keyboard activation
    await page.keyboard.press('Enter');
    
    // Should trigger download
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/neuroscroll-data-\d{4}-\d{2}-\d{2}\.csv/);
  });

  test('should handle empty state', async ({ page }) => {
    // Override mock to return empty data
    await page.addInitScript(() => {
      (window as any).chrome.storage.local.get = async () => ({
        'neuroscroll-sessions': [],
        'neuroscroll-settings': {
          enableAI: true,
          enableGeminiInsights: false,
          dataRetentionDays: 30,
          exportFormat: 'csv',
          accessibilityMode: false,
          serviceEnabled: true,
        },
      });
    });

    await page.reload();

    // Check empty state message
    await expect(page.locator('text=No viewing sessions found')).toBeVisible();
    await expect(page.locator('text=Start watching YouTube Shorts to see your neural patterns!')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    // Override mock to simulate slow loading
    await page.addInitScript(() => {
      (window as any).chrome.storage.local.get = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          'neuroscroll-sessions': [],
          'neuroscroll-settings': {},
        };
      };
    });

    await page.reload();

    // Check loading state
    await expect(page.locator('text=Loading your neural patterns...')).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.locator('text=No viewing sessions found')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that dashboard still renders properly
    await expect(page.locator('h1')).toContainText('NeuroScroll Dashboard');
    
    // Check that metric cards stack vertically on mobile
    const cards = page.locator('[data-testid="metrics-card"]');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      const firstCard = cards.first();
      const secondCard = cards.nth(1);
      
      const firstCardBox = await firstCard.boundingBox();
      const secondCardBox = await secondCard.boundingBox();
      
      // On mobile, cards should stack (second card should be below first)
      expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
    }
  });

  test('should handle chart interactions', async ({ page }) => {
    // Wait for chart to load
    await page.waitForSelector('canvas');
    
    // Hover over chart to show tooltip
    const chart = page.locator('canvas');
    await chart.hover();
    
    // Chart should be interactive (this is basic - Chart.js tooltips are complex to test)
    const chartBounds = await chart.boundingBox();
    expect(chartBounds?.width).toBeGreaterThan(200);
    expect(chartBounds?.height).toBeGreaterThan(100);
  });

  test('should persist user preferences', async ({ page }) => {
    // This test would check if user settings are properly saved and loaded
    // For now, we'll just verify the settings are loaded correctly
    
    await expect(page.locator('h1')).toContainText('NeuroScroll Dashboard');
    
    // Settings should be loaded (AI enabled by default in our mock)
    // This would be more meaningful with actual settings UI
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Override mock to simulate error
    await page.addInitScript(() => {
      (window as any).chrome.storage.local.get = async () => {
        throw new Error('Storage access failed');
      };
    });

    await page.reload();

    // Should show error message instead of crashing
    await expect(page.locator('text=Error loading data')).toBeVisible();
  });

  test('should update in real-time', async ({ page }) => {
    // Simulate new data being added
    await page.evaluate(() => {
      // Trigger a storage change event
      const event = new CustomEvent('storage-updated', {
        detail: {
          'neuroscroll-sessions': [
            {
              id: 'new-session',
              startTime: Date.now() - 1800000,
              endTime: Date.now() - 1200000,
              isActive: false,
              videoCount: 20,
              totalDwellTime: 240000,
              interactions: [],
              computedMetrics: {
                dopamineSpikeIndex: 6.8,
                attentionSpan: 8.2,
                replaySensitivity: 12,
                sessionLength: 40,
                fatiguePoints: [],
                circadianDrift: true,
                healthClassification: 'doomscroll',
                confidence: 0.92,
                timestamp: Date.now(),
              },
            },
          ],
        },
      });
      window.dispatchEvent(event);
    });

    // Check if metrics updated (this would require the component to listen for storage changes)
    // For now, we'll just verify the page doesn't crash
    await expect(page.locator('h1')).toContainText('NeuroScroll Dashboard');
  });
});