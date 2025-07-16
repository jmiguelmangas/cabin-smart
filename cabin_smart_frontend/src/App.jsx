import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNotification } from './context/NotificationContext';

// Components
import Header from './components/layout/Header';
import CabinOverview from './components/seats/CabinOverview';
import BathroomQueue from './components/bathroom/BathroomQueue';
import CrewDashboard from './components/crew/CrewDashboard';
import PassengerScreen from './components/passenger/PassengerScreen';
import Loading from './components/common/Loading';

// Hooks
import useAppState from './hooks/useAppState';

// Styles
import './App.css';
import './styles/passenger-screen.css';
import './styles/dashboard.css';

function App() {
  const { showInfo } = useNotification();
  
  // Use our custom hook for app state management
  const {
    isConnected,
    selectedSeat,
    passengerName,
    setPassengerName,
    view,
    setView,
    isInitialized,
    seats,
    bathroomQueue,
    connectedUsers,
    isCurrentSeatInQueue,
    currentSeatQueuePosition,
    isCurrentSeatBeltBuckled,
    isCurrentSeatOccupied,
    passengersNotInSeats,
    unbuckledSeats,
    handleSeatSelect,
    handleToggleSeatBelt,
    handleJoinBathroomQueue,
    handleLeaveBathroomQueue,
    toggleView,
    markInSeat,
  } = useAppState();

  // Show connection status notifications
  useEffect(() => {
    if (!isInitialized) return;
    
    if (isConnected) {
      showInfo('Conectado al servidor', { autoClose: 2000 });
    } else {
      showInfo('Desconectado del servidor. Intentando reconectar...', { autoClose: 2000 });
    }
  }, [isConnected, isInitialized, showInfo]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="app-loading">
        <Loading size="xl" text="Cargando aplicación..." />
      </div>
    );
  }
  
  // Render the appropriate view based on the current view mode
  const renderView = () => {
    if (view === 'crew') {
      return (
        <CrewDashboard
          seats={seats}
          bathroomQueue={bathroomQueue}
          passengersNotInSeats={passengersNotInSeats}
          unbuckledSeats={unbuckledSeats}
          connectedUsers={connectedUsers}
          onMarkInSeat={markInSeat}
          onToggleSeatBelt={handleToggleSeatBelt}
        />
      );
    }
    
    // Default to passenger view
    return (
      <PassengerScreen
        seats={seats}
        selectedSeat={selectedSeat}
        passengerName={passengerName}
        onNameChange={setPassengerName}
        seatBeltStatus={isCurrentSeatBeltBuckled}
        onToggleSeatBelt={handleToggleSeatBelt}
        isInBathroomQueue={isCurrentSeatInQueue}
        queuePosition={currentSeatQueuePosition}
        onJoinBathroomQueue={handleJoinBathroomQueue}
        onLeaveBathroomQueue={handleLeaveBathroomQueue}
        onSeatSelect={handleSeatSelect}
      />
    );
  };

  return (
    <Router>
      <div className="app">
        <Header
          view={view}
          onViewChange={setView}
          selectedSeat={selectedSeat}
          onSeatSelect={handleSeatSelect}
          passengerName={passengerName}
          onNameChange={setPassengerName}
          seats={seats}
        />
        
        <main className="app-main">
          <div className="container">
            {renderView()}
          </div>
        </main>
        
        <footer className="app-footer">
          <div className="container">
            <p>CabinSmart &copy; {new Date().getFullYear()} - Estado: {isConnected ? 'Conectado' : 'Desconectado'}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
