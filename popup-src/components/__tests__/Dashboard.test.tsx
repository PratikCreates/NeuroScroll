/**
 * Tests for Dashboard component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from '../Dashboard';
import { useChromeStorage } from '../../hooks/useChromeStorage';

// Mock the custom hook
jest.mock('../../hooks/useChromeStorage');
const mockUseChromeStorage = useChromeStorage as jest.MockedFunction<typeof useChromeStorage>;

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
      Mock Line Chart
    </div>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Dashboard Component', () => {
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
  };

  const mockSessions = [
    {
      id: 'session-1',
      startTime: Date.now() - 3600000,
      endTime: Date.now() - 3000000,
      isActive: false,
      videoCount: 10,
      totalDwellTime: 150000,
      interactions: [],
      computedMetrics: mockMetrics,
    },
  ];

  beforeEach(() => {
    mockUseChromeStorage.mockReturnValue({
      data: mockSessions,
      loading: false,
      error: null,
      updateData: jest.fn(),
      clearData: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render dashboard with metrics', () => {
      render(<Dashboard />);

      expect(screen.getByText('NeuroScroll Dashboard')).toBeInTheDocument();
      expect(screen.getByText('🧠 Dopamine Spike Index')).toBeInTheDocument();
      expect(screen.getByText('⏱️ Attention Span')).toBeInTheDocument();
      expect(screen.getByText('🔄 Replay Sensitivity')).toBeInTheDocument();
      expect(screen.getByText('📊 Session Length')).toBeInTheDocument();
    });

    it('should display metric values correctly', () => {
      render(<Dashboard />);

      expect(screen.getByText('3.20')).toBeInTheDocument(); // Dopamine spike index
      expect(screen.getByText('15.5s')).toBeInTheDocument(); // Attention span
      expect(screen.getByText('5')).toBeInTheDocument(); // Replay sensitivity
      expect(screen.getByText('45min')).toBeInTheDocument(); // Session length
    });

    it('should show loading state', () => {
      mockUseChromeStorage.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('Loading your neural patterns...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockUseChromeStorage.mockReturnValue({
        data: null,
        loading: false,
        error: 'Failed to load data',
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('Error loading data: Failed to load data')).toBeInTheDocument();
    });

    it('should show empty state when no sessions exist', () => {
      mockUseChromeStorage.mockReturnValue({
        data: [],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('No viewing sessions found')).toBeInTheDocument();
      expect(screen.getByText('Start watching YouTube Shorts to see your neural patterns!')).toBeInTheDocument();
    });
  });

  describe('Health Classification', () => {
    it('should display healthy session classification', () => {
      render(<Dashboard />);

      expect(screen.getByText('✅ Healthy Session')).toBeInTheDocument();
      expect(screen.getByText('85% confidence')).toBeInTheDocument();
    });

    it('should display doomscroll session classification', () => {
      const doomscrollMetrics = {
        ...mockMetrics,
        healthClassification: 'doomscroll' as const,
        confidence: 0.92,
      };

      mockUseChromeStorage.mockReturnValue({
        data: [{
          ...mockSessions[0],
          computedMetrics: doomscrollMetrics,
        }],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('⚠️ Doomscroll Detected')).toBeInTheDocument();
      expect(screen.getByText('92% confidence')).toBeInTheDocument();
    });

    it('should display unknown classification', () => {
      const unknownMetrics = {
        ...mockMetrics,
        healthClassification: 'unknown' as const,
        confidence: 0.45,
      };

      mockUseChromeStorage.mockReturnValue({
        data: [{
          ...mockSessions[0],
          computedMetrics: unknownMetrics,
        }],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('❓ Analyzing...')).toBeInTheDocument();
      expect(screen.getByText('45% confidence')).toBeInTheDocument();
    });
  });

  describe('Circadian Drift', () => {
    it('should display circadian drift warning', () => {
      const circadianMetrics = {
        ...mockMetrics,
        circadianDrift: true,
      };

      mockUseChromeStorage.mockReturnValue({
        data: [{
          ...mockSessions[0],
          computedMetrics: circadianMetrics,
        }],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('🌙 Late Night Session Detected')).toBeInTheDocument();
    });

    it('should not display circadian drift warning for normal hours', () => {
      render(<Dashboard />);

      expect(screen.queryByText('🌙 Late Night Session Detected')).not.toBeInTheDocument();
    });
  });

  describe('Charts', () => {
    it('should render attention chart with correct data', () => {
      render(<Dashboard />);

      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();

      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');
      expect(chartData.labels).toEqual(['Video 1', 'Video 2', 'Video 3']);
      expect(chartData.datasets[0].data).toEqual([20, 15, 10]);
    });

    it('should handle empty fatigue points', () => {
      const emptyMetrics = {
        ...mockMetrics,
        fatiguePoints: [],
      };

      mockUseChromeStorage.mockReturnValue({
        data: [{
          ...mockSessions[0],
          computedMetrics: emptyMetrics,
        }],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      render(<Dashboard />);

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');
      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
    });
  });

  describe('Reset Functionality', () => {
    it('should show reset button', () => {
      render(<Dashboard />);

      const resetButton = screen.getByText('Reset Data');
      expect(resetButton).toBeInTheDocument();
    });

    it('should show confirmation dialog when reset is clicked', () => {
      render(<Dashboard />);

      const resetButton = screen.getByText('Reset Data');
      fireEvent.click(resetButton);

      expect(screen.getByText('Clear All Data?')).toBeInTheDocument();
      expect(screen.getByText('This will permanently delete all your viewing session data. This action cannot be undone.')).toBeInTheDocument();
    });

    it('should call clearData when confirmed', async () => {
      const mockClearData = jest.fn();
      mockUseChromeStorage.mockReturnValue({
        data: mockSessions,
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: mockClearData,
      });

      render(<Dashboard />);

      const resetButton = screen.getByText('Reset Data');
      fireEvent.click(resetButton);

      const confirmButton = screen.getByText('Yes, Clear Data');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockClearData).toHaveBeenCalled();
      });
    });

    it('should close dialog when cancelled', () => {
      render(<Dashboard />);

      const resetButton = screen.getByText('Reset Data');
      fireEvent.click(resetButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Clear All Data?')).not.toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should show export button', () => {
      render(<Dashboard />);

      const exportButton = screen.getByText('Export CSV');
      expect(exportButton).toBeInTheDocument();
    });

    it('should handle export click', () => {
      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockClick = jest.fn();
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
      });

      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick,
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

      render(<Dashboard />);

      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Dashboard />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset Data' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Dashboard />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('NeuroScroll Dashboard');

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', () => {
      render(<Dashboard />);

      const resetButton = screen.getByText('Reset Data');
      const exportButton = screen.getByText('Export CSV');

      // Both buttons should be focusable
      resetButton.focus();
      expect(document.activeElement).toBe(resetButton);

      exportButton.focus();
      expect(document.activeElement).toBe(exportButton);
    });
  });

  describe('Responsive Design', () => {
    it('should handle different screen sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile width
      });

      render(<Dashboard />);

      // Component should render without errors on mobile
      expect(screen.getByText('NeuroScroll Dashboard')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<Dashboard />);

      // Re-render with same data
      rerender(<Dashboard />);

      // Should not cause additional API calls
      expect(mockUseChromeStorage).toHaveBeenCalledTimes(2); // Once per render
    });

    it('should handle large datasets efficiently', () => {
      const largeFatiguePoints = Array(1000).fill(null).map((_, i) => ({
        videoOrder: i,
        dwellTime: Math.random() * 30,
        timestamp: Date.now() - (i * 1000),
      }));

      const largeMetrics = {
        ...mockMetrics,
        fatiguePoints: largeFatiguePoints,
      };

      mockUseChromeStorage.mockReturnValue({
        data: [{
          ...mockSessions[0],
          computedMetrics: largeMetrics,
        }],
        loading: false,
        error: null,
        updateData: jest.fn(),
        clearData: jest.fn(),
      });

      const startTime = performance.now();
      render(<Dashboard />);
      const endTime = performance.now();

      // Should render large dataset quickly
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});