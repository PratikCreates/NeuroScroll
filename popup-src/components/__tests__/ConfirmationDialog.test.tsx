/**
 * Tests for ConfirmationDialog component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmationDialog } from '../ConfirmationDialog';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ConfirmationDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Yes, Continue',
    cancelText: 'Cancel',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when open', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
      expect(screen.getByText('Yes, Continue')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<ConfirmationDialog {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with custom content', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          title="Delete Item"
          message="This action cannot be undone."
          confirmText="Delete"
          cancelText="Keep"
        />
      );

      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Keep')).toBeInTheDocument();
    });

    it('should render with danger variant', () => {
      render(<ConfirmationDialog {...defaultProps} variant="danger" />);

      const confirmButton = screen.getByText('Yes, Continue');
      expect(confirmButton).toHaveClass('bg-red-600');
    });

    it('should render with warning variant', () => {
      render(<ConfirmationDialog {...defaultProps} variant="warning" />);

      const confirmButton = screen.getByText('Yes, Continue');
      expect(confirmButton).toHaveClass('bg-yellow-600');
    });
  });

  describe('Interaction', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      const handleConfirm = jest.fn();
      render(<ConfirmationDialog {...defaultProps} onConfirm={handleConfirm} />);

      const confirmButton = screen.getByText('Yes, Continue');
      fireEvent.click(confirmButton);

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
      const handleCancel = jest.fn();
      render(<ConfirmationDialog {...defaultProps} onCancel={handleCancel} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when backdrop is clicked', () => {
      const handleCancel = jest.fn();
      render(<ConfirmationDialog {...defaultProps} onCancel={handleCancel} />);

      const backdrop = screen.getByRole('dialog').parentElement;
      fireEvent.click(backdrop!);

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when dialog content is clicked', () => {
      const handleCancel = jest.fn();
      render(<ConfirmationDialog {...defaultProps} onCancel={handleCancel} />);

      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      expect(handleCancel).not.toHaveBeenCalled();
    });

    it('should handle keyboard events', () => {
      const handleCancel = jest.fn();
      const handleConfirm = jest.fn();
      render(
        <ConfirmationDialog 
          {...defaultProps} 
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      );

      // Escape key should cancel
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(handleCancel).toHaveBeenCalledTimes(1);

      // Enter key should confirm
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('should have proper heading structure', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Confirm Action');
    });

    it('should trap focus within dialog', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      const confirmButton = screen.getByText('Yes, Continue');

      // Focus should start on cancel button (safer default)
      expect(document.activeElement).toBe(cancelButton);

      // Tab should move to confirm button
      fireEvent.keyDown(cancelButton, { key: 'Tab' });
      expect(document.activeElement).toBe(confirmButton);

      // Shift+Tab should move back to cancel button
      fireEvent.keyDown(confirmButton, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(cancelButton);
    });

    it('should restore focus when closed', () => {
      const triggerButton = document.createElement('button');
      document.body.appendChild(triggerButton);
      triggerButton.focus();

      const { rerender } = render(<ConfirmationDialog {...defaultProps} />);

      // Dialog should be focused
      expect(document.activeElement).not.toBe(triggerButton);

      // Close dialog
      rerender(<ConfirmationDialog {...defaultProps} isOpen={false} />);

      // Focus should return to trigger button
      expect(document.activeElement).toBe(triggerButton);

      document.body.removeChild(triggerButton);
    });

    it('should have proper button roles and labels', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      const confirmButton = screen.getByRole('button', { name: 'Yes, Continue' });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      expect(confirmButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state on confirm button', () => {
      render(<ConfirmationDialog {...defaultProps} loading />);

      const confirmButton = screen.getByText('Yes, Continue');
      expect(confirmButton).toBeDisabled();
      expect(confirmButton).toHaveAttribute('aria-busy', 'true');
    });

    it('should disable cancel button when loading', () => {
      render(<ConfirmationDialog {...defaultProps} loading />);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeDisabled();
    });

    it('should not call handlers when loading', () => {
      const handleConfirm = jest.fn();
      const handleCancel = jest.fn();
      render(
        <ConfirmationDialog 
          {...defaultProps} 
          loading
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      );

      const confirmButton = screen.getByText('Yes, Continue');
      const cancelButton = screen.getByText('Cancel');

      fireEvent.click(confirmButton);
      fireEvent.click(cancelButton);

      expect(handleConfirm).not.toHaveBeenCalled();
      expect(handleCancel).not.toHaveBeenCalled();
    });
  });

  describe('Custom Content', () => {
    it('should render custom message content', () => {
      const customMessage = (
        <div>
          <p>This is a custom message</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      render(<ConfirmationDialog {...defaultProps} message={customMessage} />);

      expect(screen.getByText('This is a custom message')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render with custom button content', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          confirmText={<span>✓ Confirm</span>}
          cancelText={<span>✗ Cancel</span>}
        />
      );

      expect(screen.getByText('✓ Confirm')).toBeInTheDocument();
      expect(screen.getByText('✗ Cancel')).toBeInTheDocument();
    });
  });

  describe('Portal Rendering', () => {
    it('should render in document body', () => {
      render(<ConfirmationDialog {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog.closest('body')).toBe(document.body);
    });

    it('should clean up when unmounted', () => {
      const { unmount } = render(<ConfirmationDialog {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      unmount();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should handle animation states', () => {
      const { rerender } = render(<ConfirmationDialog {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<ConfirmationDialog {...defaultProps} isOpen={true} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing handlers gracefully', () => {
      render(
        <ConfirmationDialog
          isOpen={true}
          title="Test"
          message="Test message"
          confirmText="OK"
          cancelText="Cancel"
        />
      );

      const confirmButton = screen.getByText('OK');
      const cancelButton = screen.getByText('Cancel');

      expect(() => {
        fireEvent.click(confirmButton);
        fireEvent.click(cancelButton);
      }).not.toThrow();
    });

    it('should handle empty strings', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          title=""
          message=""
          confirmText=""
          cancelText=""
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longMessage = 'A'.repeat(1000);
      render(<ConfirmationDialog {...defaultProps} message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});