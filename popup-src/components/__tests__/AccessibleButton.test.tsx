/**
 * Tests for AccessibleButton component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccessibleButton } from '../AccessibleButton';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('AccessibleButton Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with basic props', () => {
      render(<AccessibleButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render with custom className', () => {
      render(<AccessibleButton {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should render as disabled when disabled prop is true', () => {
      render(<AccessibleButton {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should render with different variants', () => {
      const { rerender } = render(<AccessibleButton {...defaultProps} variant="primary" />);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');

      rerender(<AccessibleButton {...defaultProps} variant="secondary" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600');

      rerender(<AccessibleButton {...defaultProps} variant="danger" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<AccessibleButton {...defaultProps} size="sm" />);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(<AccessibleButton {...defaultProps} size="md" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');

      rerender(<AccessibleButton {...defaultProps} size="lg" />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} disabled />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard activation with Enter', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard activation with Space', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not handle other keyboard keys', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Tab', code: 'Tab' });

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AccessibleButton {...defaultProps} ariaLabel="Custom label" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should have proper ARIA attributes when disabled', () => {
      render(<AccessibleButton {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be focusable by default', () => {
      render(<AccessibleButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when disabled', () => {
      render(<AccessibleButton {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('should support custom ARIA describedby', () => {
      render(
        <>
          <AccessibleButton {...defaultProps} ariaDescribedBy="help-text" />
          <div id="help-text">This button does something</div>
        </>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('should support loading state with proper ARIA', () => {
      render(<AccessibleButton {...defaultProps} loading />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading', () => {
      render(<AccessibleButton {...defaultProps} loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<AccessibleButton {...defaultProps} loading />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<AccessibleButton {...defaultProps} onClick={handleClick} loading />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Support', () => {
    it('should render with icon', () => {
      const icon = <span data-testid="icon">🔥</span>;
      render(<AccessibleButton {...defaultProps} icon={icon} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render icon-only button', () => {
      const icon = <span data-testid="icon">🔥</span>;
      render(<AccessibleButton onClick={jest.fn()} icon={icon} ariaLabel="Fire button" />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Fire button');
    });
  });

  describe('Focus Management', () => {
    it('should be focusable', () => {
      render(<AccessibleButton {...defaultProps} />);

      const button = screen.getByRole('button');
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it('should show focus indicator', () => {
      render(<AccessibleButton {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.focus(button);

      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should handle blur event', () => {
      const handleBlur = jest.fn();
      render(<AccessibleButton {...defaultProps} onBlur={handleBlur} />);

      const button = screen.getByRole('button');
      fireEvent.focus(button);
      fireEvent.blur(button);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Props', () => {
    it('should pass through custom HTML attributes', () => {
      render(
        <AccessibleButton 
          {...defaultProps} 
          data-testid="custom-button"
          title="Custom title"
        />
      );

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('title', 'Custom title');
    });

    it('should handle custom type attribute', () => {
      render(<AccessibleButton {...defaultProps} type="submit" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should default to button type', () => {
      render(<AccessibleButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onClick gracefully', () => {
      render(<AccessibleButton>No onClick</AccessibleButton>);

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should handle empty children', () => {
      render(<AccessibleButton onClick={jest.fn()}></AccessibleButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('should handle complex children', () => {
      render(
        <AccessibleButton onClick={jest.fn()}>
          <span>Complex</span>
          <strong>Children</strong>
        </AccessibleButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('ComplexChildren');
    });
  });
});