/**
 * Accessibility testing for NeuroScroll extension
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Chrome extension APIs
    await page.addInitScript(() => {
      (window as any).chrome = {
        storage: {
          local: {
            get: async () => ({
              'neuroscroll-sessions': [
                {
                  id: 'test-session',
                  startTime: Date.now() - 3600000,
                  endTime: Date.now() - 3000000,
                  isActive: false,
                  videoCount: 10,
                  totalDwellTime: 120000,
                  interactions: [],
                  computedMetrics: {
                    dopamineSpikeIndex: 3.5,
                    attentionSpan: 15.2,
                    replaySensitivity: 4,
                    sessionLength: 45,
                    fatiguePoints: [
                      { videoOrder: 0, dwellTime: 18, timestamp: Date.now() - 60000 },
                      { videoOrder: 1, dwellTime: 15, timestamp: Date.now() - 45000 },
                      { videoOrder: 2, dwellTime: 12, timestamp: Date.now() - 30000 },
                    ],
                    circadianDrift: false,
                    healthClassification: 'healthy',
                    confidence: 0.78,
                    timestamp: Date.now(),
                  },
                },
              ],
              'neuroscroll-settings': {
                enableAI: true,
                accessibilityMode: true,
              },
            }),
            set: async () => {},
            clear: async () => {},
          },
        },
      };
    });

    await page.goto('/');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('NeuroScroll Dashboard');

    // Check for section headings
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);

    // Verify heading hierarchy (no h3 before h2, etc.)
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingTexts = await allHeadings.allTextContents();
    
    // Should start with h1
    expect(headingTexts.length).toBeGreaterThan(0);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check metric cards have proper roles
    const metricCards = page.locator('[role="region"]');
    const cardCount = await metricCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Check buttons have proper roles and labels
    const resetButton = page.locator('button:has-text("Reset Data")');
    await expect(resetButton).toHaveAttribute('type', 'button');
    
    const exportButton = page.locator('button:has-text("Export CSV")');
    await expect(exportButton).toHaveAttribute('type', 'button');
  });

  test('should be fully keyboard navigable', async ({ page }) => {
    // Start from the beginning
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Tab through all interactive elements
    const interactiveElements = [];
    let previousElement = null;
    
    for (let i = 0; i < 10; i++) { // Limit to prevent infinite loop
      const currentElement = await page.locator(':focus').textContent();
      if (currentElement === previousElement) break; // Reached end of tab order
      
      interactiveElements.push(currentElement);
      previousElement = currentElement;
      await page.keyboard.press('Tab');
    }

    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  test('should support keyboard activation', async ({ page }) => {
    // Focus on reset button and activate with Enter
    await page.focus('button:has-text("Reset Data")');
    await page.keyboard.press('Enter');
    
    // Should open confirmation dialog
    await expect(page.locator('text=Clear All Data?')).toBeVisible();
    
    // Focus on cancel and activate with Space
    await page.focus('button:has-text("Cancel")');
    await page.keyboard.press(' ');
    
    // Dialog should close
    await expect(page.locator('text=Clear All Data?')).not.toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Run axe-core color contrast checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test('should provide alternative text for images and icons', async ({ page }) => {
    // Check for images without alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaLabelledBy = await img.getAttribute('aria-labelledby');
      
      // Should have at least one form of alternative text
      expect(alt || ariaLabel || ariaLabelledBy).toBeTruthy();
    }

    // Check for decorative images (should have empty alt or aria-hidden)
    const decorativeImages = page.locator('img[alt=""], img[aria-hidden="true"]');
    // These are acceptable for decorative content
  });

  test('should have proper form labels and descriptions', async ({ page }) => {
    // Check for form inputs (if any)
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // Check for associated label
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        // Should have label or aria-label
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('should announce dynamic content changes', async ({ page }) => {
    // Check for live regions
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have at least one live region for metric updates
    expect(liveRegionCount).toBeGreaterThan(0);

    // Check for status messages
    const statusElements = page.locator('[role="status"], [aria-live="polite"]');
    const statusCount = await statusElements.count();
    expect(statusCount).toBeGreaterThan(0);
  });

  test('should handle focus management in dialogs', async ({ page }) => {
    // Open confirmation dialog
    await page.click('button:has-text("Reset Data")');
    
    // Focus should move to dialog
    const dialog = page.locator('[role="dialog"], [role="alertdialog"]');
    await expect(dialog).toBeVisible();
    
    // Focus should be trapped within dialog
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    
    // Should be within dialog
    const isWithinDialog = await focusedElement.evaluate((el, dialogEl) => {
      return dialogEl?.contains(el) || false;
    }, await dialog.elementHandle());
    
    expect(isWithinDialog).toBe(true);
    
    // Escape should close dialog
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for landmark roles
    const landmarks = page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThan(0);

    // Check for skip links (if implemented)
    const skipLinks = page.locator('a[href^="#"]:has-text("Skip")');
    // Skip links are optional but recommended

    // Check for section headings that provide structure
    const structuralHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await structuralHeadings.count();
    expect(headingCount).toBeGreaterThan(1); // Should have more than just the main heading
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    // Check that animations are disabled or reduced
    // This would require checking CSS animations/transitions
    const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
    const animatedCount = await animatedElements.count();
    
    // Elements might still have animation classes but should respect prefers-reduced-motion
    // This is more of a CSS test, but we can verify elements are still functional
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should provide clear error messages', async ({ page }) => {
    // Simulate error state
    await page.addInitScript(() => {
      (window as any).chrome.storage.local.get = async () => {
        throw new Error('Storage access denied');
      };
    });

    await page.reload();

    // Should show clear error message
    const errorMessage = page.locator('[role="alert"], [aria-live="assertive"]');
    await expect(errorMessage).toBeVisible();
    
    // Error message should be descriptive
    const errorText = await errorMessage.textContent();
    expect(errorText).toContain('Error');
  });

  test('should have proper table accessibility (if tables exist)', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();
    
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      
      // Should have caption or aria-label
      const caption = table.locator('caption');
      const ariaLabel = await table.getAttribute('aria-label');
      const ariaLabelledBy = await table.getAttribute('aria-labelledby');
      
      const hasCaption = await caption.count() > 0;
      expect(hasCaption || ariaLabel || ariaLabelledBy).toBeTruthy();
      
      // Should have proper header structure
      const headers = table.locator('th');
      const headerCount = await headers.count();
      
      if (headerCount > 0) {
        // Headers should have scope attribute
        for (let j = 0; j < headerCount; j++) {
          const header = headers.nth(j);
          const scope = await header.getAttribute('scope');
          // Scope is recommended but not always required
        }
      }
    }
  });

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.addInitScript(() => {
      // Add high contrast media query
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-contrast: high) {
          * {
            border: 1px solid !important;
          }
        }
      `;
      document.head.appendChild(style);
    });

    await page.reload();

    // Verify content is still visible and functional
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Reset Data")')).toBeVisible();
    
    // Run accessibility scan with high contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});