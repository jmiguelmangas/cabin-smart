import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { LoadingProvider } from '../context/LoadingContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WebSocketProvider } from '../context/WebSocketContext';

const TestWrapper = ({ children }) => (
  <LoadingProvider>
    <NotificationProvider>
      <WebSocketProvider>
        {children}
      </WebSocketProvider>
    </NotificationProvider>
  </LoadingProvider>
);

describe('Dashboard and KPIs Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dashboard Display', () => {
    it('shows the main dashboard title when in crew view', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to crew view to see dashboard
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      fireEvent.click(crewBtn);

      await waitFor(() => {
        expect(screen.getByText(/CabinSmart Dashboard/i)).toBeInTheDocument();
      });
    });

    it('displays KPI cards with metrics in crew view', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to crew view to see dashboard
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      fireEvent.click(crewBtn);

      await waitFor(() => {
        const kpiCards = document.querySelectorAll('.kpi-card');
        expect(kpiCards.length).toBeGreaterThan(0);
      });
    });

    it('shows occupancy metrics in crew view', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to crew view to see dashboard
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      fireEvent.click(crewBtn);

      await waitFor(() => {
        expect(screen.getByText(/Ocupación/i)).toBeInTheDocument();
      });
    });

    it('displays connection count in crew view', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to crew view to see dashboard
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      fireEvent.click(crewBtn);

      await waitFor(() => {
        expect(screen.getByText(/Conectados/i)).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Elements', () => {
    it('has clickable buttons for different views', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // At least should have the view toggle buttons
      expect(screen.getByRole('button', { name: /pasajero/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /baño/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tripulación/i })).toBeInTheDocument();
    });

    it('switches between different dashboard views', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      const crewBtn = screen.getByRole('button', { name: /tripulación/i });
      
      // Switch to crew view
      fireEvent.click(crewBtn);
      
      // Should now show crew-specific content
      expect(crewBtn).toHaveClass('active');
    });
  });

  describe('Data Visualization', () => {
    it('shows proper layout structure', () => {
      const { container } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Check that main structural elements exist
      expect(container.querySelector('.app')).toBeInTheDocument();
      expect(container.querySelector('.app-header')).toBeInTheDocument();
      expect(container.querySelector('.app-main')).toBeInTheDocument();
    });
  });
});
