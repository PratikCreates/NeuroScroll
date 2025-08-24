/**
 * Tests for MetricsCard component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricsCard } from '../MetricsCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('MetricsCard Component', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '42',
    emoji: '🧠',
    tooltip: 'This is a test metric',
    color: 'blue',
  };

  describe('Rendering', () => {
    it('should render with basic props', () => {
      render(<MetricsCard {...defaultProps} />);

      expect(screen.getByText('🧠 Test Metric')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render without emoji', () => {
      render(<MetricsCard {...defaultProps} emoji={undefined} />);

      expect(screen.getByText('Test Metric')).toBeInTheDocument();
      expect(screen.queryByText('🧠')).not.toBeInTheDocument();
    });

    it('should handle long titles', () => {
      const longTitle = 'This is a very long metric title that might wrap';
      render(<MetricsCard {...defaultProps} title={longTitle} />);

      expect(screen.getByText(`🧠 ${longTitle}`)).toBeInTheDocument();
    });

    it('should handle different value types', () => {
      const { rerender } = render(<MetricsCard {...defaultProps} value="0" />);
      expect(screen.getByText('0')).toBeInTheDocument();

      rerender(<MetricsCard {...defaultProps} value="999.99" />);
      expect(screen.getByText('999.99')).toBeInTheDocument();

      rerender(<MetricsCard {...defaultProps} value="N/A" />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Color Variants', () => {
    const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'gray'];

    colors.forEach(color => {
      it(`should apply ${color} color variant`, () => {
        render(<MetricsCard {...defaultProps} color={color} />);
        
        const card = screen.getByText('42').closest('div');
        expect(card).toHaveClass(`border-${color}-200`);
      });
    });

    it('should default to blue color', () => {
      render(<MetricsCard {...defaultProps} color={undefined} />);
      
      const card = screen.getByText('42').closest('div');
      expect(card).toHaveClass('border-blue-200');
    });
  });

  describe('Tooltip Functionality', () => {
    it('should show tooltip on hover', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Simulate hover
      fireEvent.mouseEnter(card!);
      
      expect(screen.getByText('This is a test metric')).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Simulate hover and then leave
      fireEvent.mouseEnter(card!);
      fireEvent.mouseLeave(card!);
      
      expect(screen.queryByText('This is a test metric')).not.toBeInTheDocument();
    });

    it('should not show tooltip if not provided', () => {
      render(<MetricsCard {...defaultProps} tooltip={undefined} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      fireEvent.mouseEnter(card!);
      
      // Should not show any tooltip
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show tooltip on focus for keyboard users', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Simulate focus
      fireEvent.focus(card!);
      
      expect(screen.getByText('This is a test metric')).toBeInTheDocument();
    });

    it('should hide tooltip on blur', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Simulate focus and then blur
      fireEvent.focus(card!);
      fireEvent.blur(card!);
      
      expect(screen.queryByText('This is a test metric')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      expect(card).toHaveAttribute('role', 'region');
      expect(card).toHaveAttribute('aria-label', 'Test Metric: 42');
    });

    it('should be keyboard focusable', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper tooltip ARIA attributes', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      fireEvent.mouseEnter(card!);
      
      const tooltip = screen.getByText('This is a test metric');
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      expect(card).toHaveAttribute('aria-describedby');
    });

    it('should support screen readers', () => {
      render(<MetricsCard {...defaultProps} />);

      // Screen reader should announce the metric value
      const valueElement = screen.getByText('42');
      expect(valueElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Visual States', () => {
    it('should show loading state', () => {
      render(<MetricsCard {...defaultProps} loading={true} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<MetricsCard {...defaultProps} error="Failed to load" />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });

    it('should prioritize error over loading', () => {
      render(<MetricsCard {...defaultProps} loading={true} error="Failed to load" />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should show normal state when no loading or error', () => {
      render(<MetricsCard {...defaultProps} loading={false} error={undefined} />);

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  describe('Animation and Interaction', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<MetricsCard {...defaultProps} onClick={handleClick} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      fireEvent.click(card!);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard activation', () => {
      const handleClick = jest.fn();
      render(<MetricsCard {...defaultProps} onClick={handleClick} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Simulate Enter key
      fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Simulate Space key
      fireEvent.keyDown(card!, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should not be clickable without onClick handler', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      expect(card).not.toHaveAttribute('role', 'button');
      expect(card).not.toHaveClass('cursor-pointer');
    });

    it('should be clickable with onClick handler', () => {
      const handleClick = jest.fn();
      render(<MetricsCard {...defaultProps} onClick={handleClick} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Responsive Design', () => {
    it('should handle different screen sizes', () => {
      render(<MetricsCard {...defaultProps} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      
      // Should have responsive classes
      expect(card).toHaveClass('p-4', 'sm:p-6');
    });

    it('should handle long values on small screens', () => {
      const longValue = '999,999,999.99';
      render(<MetricsCard {...defaultProps} value={longValue} />);

      const valueElement = screen.getByText(longValue);
      expect(valueElement).toHaveClass('text-2xl', 'sm:text-3xl');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<MetricsCard {...defaultProps} />);

      // Re-render with same props
      rerender(<MetricsCard {...defaultProps} />);

      // Should maintain same DOM structure
      expect(screen.getByText('🧠 Test Metric')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should update when value changes', () => {
      const { rerender } = render(<MetricsCard {...defaultProps} value="42" />);
      expect(screen.getByText('42')).toBeInTheDocument();

      rerender(<MetricsCard {...defaultProps} value="84" />);
      expect(screen.getByText('84')).toBeInTheDocument();
      expect(screen.queryByText('42')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<MetricsCard {...defaultProps} title="" />);

      expect(screen.getByText('🧠')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should handle empty value', () => {
      render(<MetricsCard {...defaultProps} value="" />);

      expect(screen.getByText('🧠 Test Metric')).toBeInTheDocument();
      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle special characters in tooltip', () => {
      const specialTooltip = 'This tooltip has "quotes" and <tags> & symbols!';
      render(<MetricsCard {...defaultProps} tooltip={specialTooltip} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      fireEvent.mouseEnter(card!);

      expect(screen.getByText(specialTooltip)).toBeInTheDocument();
    });

    it('should handle very long tooltips', () => {
      const longTooltip = 'This is a very long tooltip that contains a lot of information about the metric and might need to wrap to multiple lines or be truncated depending on the design requirements.';
      render(<MetricsCard {...defaultProps} tooltip={longTooltip} />);

      const card = screen.getByText('🧠 Test Metric').closest('div');
      fireEvent.mouseEnter(card!);

      expect(screen.getByText(longTooltip)).toBeInTheDocument();
    });
  });
});