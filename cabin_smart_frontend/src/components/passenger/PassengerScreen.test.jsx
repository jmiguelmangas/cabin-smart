import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PassengerScreen from './PassengerScreen';
import { LoadingProvider } from '../../context/LoadingContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { WebSocketProvider } from '../../context/WebSocketContext';

const TestWrapper = ({ children }) => (
  <LoadingProvider>
    <NotificationProvider>
      <WebSocketProvider>
        {children}
      </WebSocketProvider>
    </NotificationProvider>
  </LoadingProvider>
);

describe('PassengerScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders seat selection when no seat is selected', () => {
    render(
      <TestWrapper>
        <PassengerScreen 
          seats={{}}
          selectedSeat={null}
          onSeatSelect={() => {}}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/Selección de Asiento/i)).toBeInTheDocument();
    expect(screen.getByText(/CabinSmart Airlines/i)).toBeInTheDocument();
    expect(screen.getByText(/Seleccione su asiento/i)).toBeInTheDocument();
  });

  it('renders passenger interface when seat is selected', () => {
    render(
      <TestWrapper>
        <PassengerScreen 
          seats={{}}
          selectedSeat="4A"
          passengerName="Juan"
          seatBeltStatus={false}
          isInBathroomQueue={false}
          onSeatSelect={() => {}}
          onToggleSeatBelt={() => {}}
          onJoinBathroomQueue={() => {}}
          onLeaveBathroomQueue={() => {}}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/Asiento 4A/i)).toBeInTheDocument();
    expect(screen.getByText(/¡Bienvenido a bordo!/i)).toBeInTheDocument();
    expect(screen.getByText(/Hola Juan/i)).toBeInTheDocument();
  });

  it('shows welcome message functionality', () => {
    render(
      <TestWrapper>
        <PassengerScreen 
          seats={{}}
          selectedSeat="4A"
          passengerName="Juan"
          seatBeltStatus={true}
          isInBathroomQueue={false}
          onSeatSelect={() => {}}
          onToggleSeatBelt={() => {}}
          onJoinBathroomQueue={() => {}}
          onLeaveBathroomQueue={() => {}}
        />
      </TestWrapper>
    );

    expect(screen.getByText(/CabinSmart Airlines/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continuar/i })).toBeInTheDocument();
  });
});
