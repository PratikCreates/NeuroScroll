/**
 * Tests for AdvancedMetrics component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdvancedMetrics } from '../AdvancedMetrics';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AdvancedMetrics Component', () => {
  const mockMetrics = {
    dopamineSpikeIndex: 3.2,
    attentionSpan: 15.5,
    replaySensitivity: 5,
    sessionLength: 45,
    fatiguePoints: [
      { videoOrder: 0, dwellTime: 20, timestamp: Date.now() - 60000 },
      { videoOrder: 1, dwellTime: 15, timestamp: Date.now() - 45000 },
      { videoOrder: 2, dwellTime: 10, timestamp: Date.now() - 30000 },
    ],
    circadianDrift: false,
    healthClassification: 'healthy' as const,
    confidence: 0.85,
    timestamp: Date.now(),
    scrollMomentum: 0.3,
    rewardVariability: 12.5,
    bingeBursts: [
      { startTime: Date.now() - 120000, endTime: Date.now() - 60000, intensity: 0.8 }
    ],
    engagementHalfLife: 25,
    sessionArchetype: 'explorer' as const,
    cognitiveLoad: 0.6,
    habitStrength: 0.4,
    noveltyBias: 0.7
  };

  describe('Rendering', () => {
    it('should render advanced metrics section', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('Advanced Neural Patterns')).toBeInTheDocument();
    });

    it('should display scroll momentum metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('🌊 Scroll Momentum')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
    });

    it('should display reward variability metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('🎲 Reward Variability')).toBeInTheDocument();
      expect(screen.getByText('12.5s')).toBeInTheDocument();
    });

    it('should display binge bursts metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('💥 Binge Bursts')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should display engagement half-life metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('⚡ Engagement Half-Life')).toBeInTheDocument();
      expect(screen.getByText('25 videos')).toBeInTheDocument();
    });

    it('should display session archetype', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('🎭 Session Archetype')).toBeInTheDocument();
      expect(screen.getByText('Explorer')).toBeInTheDocument();
    });

    it('should display cognitive load metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('🧠 Cognitive Load')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('should display habit strength metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('🔄 Habit Strength')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('should display novelty bias metric', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      expect(screen.getByText('✨ Novelty Bias')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
    });
  });

  describe('Different Archetypes', () => {
    it('should display sampler archetype', () => {
      const samplerMetrics = { ...mockMetrics, sessionArchetype: 'sampler' as const };
      render(<AdvancedMetrics metrics={samplerMetrics} />);

      expect(screen.getByText('Sampler')).toBeInTheDocument();
    });

    it('should display doomscroller archetype', () => {
      const doomscrollerMetrics = { ...mockMetrics, sessionArchetype: 'doomscroller' as const };
      render(<AdvancedMetrics metrics={doomscrollerMetrics} />);

      expect(screen.getByText('Doomscroller')).toBeInTheDocument();
    });

    it('should display unknown archetype', () => {
      const unknownMetrics = { ...mockMetrics, sessionArchetype: 'unknown' as const };
      render(<AdvancedMetrics metrics={unknownMetrics} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Tooltips', () => {
    it('should show tooltip for scroll momentum', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const scrollMomentumCard = screen.getByText('🌊 Scroll Momentum').closest('div');
      fireEvent.mouseEnter(scrollMomentumCard!);

      expect(screen.getByText(/Percentage of videos skipped quickly/)).toBeInTheDocument();
    });

    it('should show tooltip for reward variability', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const rewardVariabilityCard = screen.getByText('🎲 Reward Variability').closest('div');
      fireEvent.mouseEnter(rewardVariabilityCard!);

      expect(screen.getByText(/Standard deviation of attention spans/)).toBeInTheDocument();
    });

    it('should show tooltip for binge bursts', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const bingeBurstsCard = screen.getByText('💥 Binge Bursts').closest('div');
      fireEvent.mouseEnter(bingeBurstsCard!);

      expect(screen.getByText(/Periods of intense rapid consumption/)).toBeInTheDocument();
    });

    it('should show tooltip for engagement half-life', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const engagementCard = screen.getByText('⚡ Engagement Half-Life').closest('div');
      fireEvent.mouseEnter(engagementCard!);

      expect(screen.getByText(/Videos until attention drops by 50%/)).toBeInTheDocument();
    });

    it('should show tooltip for session archetype', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const archetypeCard = screen.getByText('🎭 Session Archetype').closest('div');
      fireEvent.mouseEnter(archetypeCard!);

      expect(screen.getByText(/Behavioral pattern classification/)).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const scrollMomentumCard = screen.getByText('🌊 Scroll Momentum').closest('div');
      fireEvent.mouseEnter(scrollMomentumCard!);
      fireEvent.mouseLeave(scrollMomentumCard!);

      expect(screen.queryByText(/Percentage of videos skipped quickly/)).not.toBeInTheDocument();
    });
  });

  describe('Missing Data Handling', () => {
    it('should handle missing scroll momentum', () => {
      const metricsWithoutScrollMomentum = { ...mockMetrics };
      delete metricsWithoutScrollMomentum.scrollMomentum;
      
      render(<AdvancedMetrics metrics={metricsWithoutScrollMomentum} />);

      expect(screen.getByText('🌊 Scroll Momentum')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle missing reward variability', () => {
      const metricsWithoutRewardVariability = { ...mockMetrics };
      delete metricsWithoutRewardVariability.rewardVariability;
      
      render(<AdvancedMetrics metrics={metricsWithoutRewardVariability} />);

      expect(screen.getByText('🎲 Reward Variability')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle missing binge bursts', () => {
      const metricsWithoutBingeBursts = { ...mockMetrics };
      delete metricsWithoutBingeBursts.bingeBursts;
      
      render(<AdvancedMetrics metrics={metricsWithoutBingeBursts} />);

      expect(screen.getByText('💥 Binge Bursts')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle missing engagement half-life', () => {
      const metricsWithoutEngagement = { ...mockMetrics };
      delete metricsWithoutEngagement.engagementHalfLife;
      
      render(<AdvancedMetrics metrics={metricsWithoutEngagement} />);

      expect(screen.getByText('⚡ Engagement Half-Life')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle missing session archetype', () => {
      const metricsWithoutArchetype = { ...mockMetrics };
      delete metricsWithoutArchetype.sessionArchetype;
      
      render(<AdvancedMetrics metrics={metricsWithoutArchetype} />);

      expect(screen.getByText('🎭 Session Archetype')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Value Formatting', () => {
    it('should format percentage values correctly', () => {
      const metricsWithDecimals = {
        ...mockMetrics,
        scrollMomentum: 0.456,
        cognitiveLoad: 0.789,
        habitStrength: 0.123,
        noveltyBias: 0.999
      };
      
      render(<AdvancedMetrics metrics={metricsWithDecimals} />);

      expect(screen.getByText('46%')).toBeInTheDocument(); // scrollMomentum
      expect(screen.getByText('79%')).toBeInTheDocument(); // cognitiveLoad
      expect(screen.getByText('12%')).toBeInTheDocument(); // habitStrength
      expect(screen.getByText('100%')).toBeInTheDocument(); // noveltyBias (rounded)
    });

    it('should format time values correctly', () => {
      const metricsWithTimeValues = {
        ...mockMetrics,
        rewardVariability: 45.67
      };
      
      render(<AdvancedMetrics metrics={metricsWithTimeValues} />);

      expect(screen.getByText('45.7s')).toBeInTheDocument();
    });

    it('should format video count correctly', () => {
      const metricsWithVideoCount = {
        ...mockMetrics,
        engagementHalfLife: 123
      };
      
      render(<AdvancedMetrics metrics={metricsWithVideoCount} />);

      expect(screen.getByText('123 videos')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Advanced Neural Patterns');
    });

    it('should have proper ARIA labels for metric cards', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const scrollMomentumCard = screen.getByText('🌊 Scroll Momentum').closest('div');
      expect(scrollMomentumCard).toHaveAttribute('role', 'region');
      expect(scrollMomentumCard).toHaveAttribute('aria-label', 'Scroll Momentum: 30%');
    });

    it('should be keyboard accessible', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const scrollMomentumCard = screen.getByText('🌊 Scroll Momentum').closest('div');
      expect(scrollMomentumCard).toHaveAttribute('tabIndex', '0');
    });

    it('should show tooltips on keyboard focus', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const scrollMomentumCard = screen.getByText('🌊 Scroll Momentum').closest('div');
      fireEvent.focus(scrollMomentumCard!);

      expect(screen.getByText(/Percentage of videos skipped quickly/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should handle different screen sizes', () => {
      render(<AdvancedMetrics metrics={mockMetrics} />);

      const container = screen.getByText('Advanced Neural Patterns').closest('div');
      expect(container).toHaveClass('grid');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const zeroMetrics = {
        ...mockMetrics,
        scrollMomentum: 0,
        rewardVariability: 0,
        bingeBursts: [],
        engagementHalfLife: 0,
        cognitiveLoad: 0,
        habitStrength: 0,
        noveltyBias: 0
      };
      
      render(<AdvancedMetrics metrics={zeroMetrics} />);

      expect(screen.getByText('0%')).toBeInTheDocument(); // scrollMomentum
      expect(screen.getByText('0.0s')).toBeInTheDocument(); // rewardVariability
      expect(screen.getByText('0')).toBeInTheDocument(); // bingeBursts
    });

    it('should handle very large values', () => {
      const largeMetrics = {
        ...mockMetrics,
        rewardVariability: 999.99,
        engagementHalfLife: 9999
      };
      
      render(<AdvancedMetrics metrics={largeMetrics} />);

      expect(screen.getByText('1000.0s')).toBeInTheDocument(); // rewardVariability (rounded)
      expect(screen.getByText('9999 videos')).toBeInTheDocument(); // engagementHalfLife
    });

    it('should handle null/undefined metrics gracefully', () => {
      const nullMetrics = {
        ...mockMetrics,
        scrollMomentum: null as any,
        rewardVariability: undefined as any
      };
      
      render(<AdvancedMetrics metrics={nullMetrics} />);

      expect(screen.getAllByText('N/A')).toHaveLength(2);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<AdvancedMetrics metrics={mockMetrics} />);

      // Re-render with same metrics
      rerender(<AdvancedMetrics metrics={mockMetrics} />);

      // Should maintain same DOM structure
      expect(screen.getByText('Advanced Neural Patterns')).toBeInTheDocument();
    });

    it('should update when metrics change', () => {
      const { rerender } = render(<AdvancedMetrics metrics={mockMetrics} />);
      expect(screen.getByText('30%')).toBeInTheDocument();

      const updatedMetrics = { ...mockMetrics, scrollMomentum: 0.6 };
      rerender(<AdvancedMetrics metrics={updatedMetrics} />);
      
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.queryByText('30%')).not.toBeInTheDocument();
    });
  });
});