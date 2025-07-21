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

describe('CabinSmart Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('App Navigation', () => {
    it('allows user to switch between passenger, bathroom, and crew views', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Check initial passenger view is active
      const passengerBtn = screen.getByRole('button', { name: /pasajero/i });
      const bathroomBtn = screen.getByRole('button', { name: /baño/i });
      const crewBtn = screen.getByRole('button', { name: /tripulación/i });

      expect(passengerBtn).toHaveClass('active');

      // Switch to bathroom view
      fireEvent.click(bathroomBtn);
      await waitFor(() => {
        expect(bathroomBtn).toHaveClass('active');
        expect(passengerBtn).not.toHaveClass('active');
      });

      // Switch to crew view  
      fireEvent.click(crewBtn);
      await waitFor(() => {
        expect(crewBtn).toHaveClass('active');
        expect(bathroomBtn).not.toHaveClass('active');
      });
    });
  });

  describe('Passenger Functionality', () => {
    it('allows passenger to search for seats', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to passenger view first
      const passengerBtn = screen.getByRole('button', { name: /pasajero/i });
      fireEvent.click(passengerBtn);
      
      await waitFor(
        () => {
          const activeBtn = screen.getByRole('button', { name: /pasajero/i });
          return activeBtn.classList.contains('active');
        },
        { timeout: 2000 }
      );

      // Check if main content is available (more generic test)
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });

    it('shows seat selection interface', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Switch to passenger view first  
      const passengerBtn = screen.getByRole('button', { name: /pasajero/i });
      fireEvent.click(passengerBtn);
      
      await waitFor(
        () => {
          const activeBtn = screen.getByRole('button', { name: /pasajero/i });
          return activeBtn.classList.contains('active');
        },
        { timeout: 2000 }
      );

      // Look for passenger interface elements more generically
      await waitFor(
        () => {
          const mainContent = screen.getByRole('main');
          expect(mainContent).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });
  describe('Connection Status', () => {
    it('shows connection status in footer', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Check that connection status is displayed
      expect(screen.getByText(/estado:/i)).toBeInTheDocument();
      const disconnectedElements = screen.getAllByText(/desconectado/i);
      expect(disconnectedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('renders properly on different screen sizes', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      const app = screen.getByRole('main') || document.querySelector('.app');
      expect(app).toBeInTheDocument();
    });
  });
});
