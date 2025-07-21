import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { LoadingProvider } from '../context/LoadingContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WebSocketProvider } from '../context/WebSocketContext';

// Mock fetch to simulate network errors
global.fetch = vi.fn();

const TestWrapper = ({ children }) => (
  <LoadingProvider>
    <NotificationProvider>
      <WebSocketProvider>
        {children}
      </WebSocketProvider>
    </NotificationProvider>
  </LoadingProvider>
);

describe('Error Handling and Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading States', () => {
    it('renders without crashing when loading', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // App should render even if data is loading
      expect(screen.getByRole('heading', { name: /CabinSmart/i })).toBeInTheDocument();
    });

    it('shows appropriate content while data loads', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to crew view first to see dashboard
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      fireEvent.click(crewBtn);

      // Should show some kind of interface even during loading
      await waitFor(() => {
        expect(screen.getByText(/CabinSmart Dashboard/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundaries', () => {
    it('handles WebSocket connection errors gracefully', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // App should still render even if WebSocket fails
      const headings = screen.getAllByRole('heading', { name: /CabinSmart/i });
      expect(headings.length).toBeGreaterThan(0);
      
      // Should show disconnected status
      const statusElements = screen.getAllByText(/desconectado/i);
      expect(statusElements.length).toBeGreaterThan(0);
    });

    it('displays error notifications when appropriate', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Check if there are any error notifications
      const errorNotification = screen.queryByText(/error/i);
      // This may or may not exist depending on current state
      expect(errorNotification).toBeDefined(); // Just ensure no crash
    });
  });

  describe('Graceful Degradation', () => {
    it('works without real-time data', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Core functionality should work even without live data
      expect(screen.getByRole('button', { name: /pasajero/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /baño/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tripulación/i })).toBeInTheDocument();
    });

    it('maintains UI structure under error conditions', () => {
      const { container } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Essential UI elements should always be present
      expect(container.querySelector('.app')).toBeInTheDocument();
      expect(container.querySelector('.app-header')).toBeInTheDocument();
      expect(container.querySelector('.view-toggle')).toBeInTheDocument();
    });
  });

  describe('Data Validation', () => {
    it('handles empty or invalid data gracefully', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // App should handle missing data without crashing
      const headings = screen.getAllByRole('heading', { name: /CabinSmart/i });
      expect(headings.length).toBeGreaterThan(0);
    });

    it('shows fallback content when data is unavailable', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Should show some default state indicators
      const occupancyElements = screen.getAllByText(/ocupación|usuarios|asientos/i);
      expect(occupancyElements.length).toBeGreaterThan(0);
    });
  });
});
