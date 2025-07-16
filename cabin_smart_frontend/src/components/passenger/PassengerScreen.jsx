import { useState, useEffect } from 'react';
import { FaUser, FaCircleCheck, FaCircleXmark, FaToilet, FaBell, FaLock, FaUnlock } from 'react-icons/fa6';
import { FaPlane } from 'react-icons/fa';
import SeatSelection from './SeatSelection';

const PassengerScreen = ({ 
  seats,
  selectedSeat, 
  passengerName, 
  onNameChange,
  seatBeltStatus, 
  onToggleSeatBelt,
  isInBathroomQueue,
  queuePosition,
  onJoinBathroomQueue,
  onLeaveBathroomQueue,
  onSeatSelect
}) => {
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if user has seen welcome message before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('cabin_smart_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // Handle welcome message close
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('cabin_smart_welcome_seen', 'true');
  };


  if (!selectedSeat) {
    return (
      <div className="passenger-screen">
        <div className="screen-header">
          <div className="airline-logo">
            <FaPlane />
            <span>CabinSmart Airlines</span>
          </div>
          <div className="seat-info">
            <span>Selección de Asiento</span>
          </div>
        </div>
        <SeatSelection
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
        />
      </div>
    );
  }

  return (
    <div className="passenger-screen">
      {/* Header de la pantalla */}
      <div className="screen-header">
        <div className="airline-logo">
          <FaPlane />
          <span>CabinSmart Airlines</span>
        </div>
        <div className="seat-info">
          <span>Asiento {selectedSeat}</span>
          {passengerName && (
            <span className="passenger-name">- {passengerName}</span>
          )}
        </div>
      </div>

      {/* Mensaje de bienvenida */}
      {showWelcome && (
        <div className="welcome-message">
          <h3>¡Bienvenido a bordo!</h3>
          <p>Hola {passengerName || 'Pasajero'}</p>
          <button 
            className="btn-close-welcome"
            onClick={handleCloseWelcome}
          >
            Continuar
          </button>
        </div>
      )}

      {/* Pantalla principal */}
      {!showWelcome && (
        <div className="main-screen">
          {/* Sección de seguridad - Cinturón */}
          <div className="safety-section">
            <div className="section-header">
              <h3>Seguridad</h3>
            </div>
            
            <div className="seatbelt-panel">
              <div className="seatbelt-status">
                <div className={`status-indicator ${seatBeltStatus ? 'buckled' : 'unbuckled'}`}>
                  {seatBeltStatus ? (
                    <FaCircleCheck className="status-icon success" />
                  ) : (
                    <FaCircleXmark className="status-icon danger" />
                  )}
                </div>
                <div className="status-text">
                  <h4>Cinturón de Seguridad</h4>
                  <p>{seatBeltStatus ? 'Abrochado correctamente' : 'Por favor, abrócheese el cinturón'}</p>
                </div>
              </div>
              
              {!seatBeltStatus && (
                <div className="safety-alert">
                  <FaBell className="alert-icon" />
                  <span>Para su seguridad, mantenga el cinturón abrochado durante el vuelo</span>
                </div>
              )}
              
              <div className="seatbelt-controls">
                <button 
                  className={`seatbelt-btn ${seatBeltStatus ? 'unbuckle' : 'buckle'}`}
                  onClick={onToggleSeatBelt}
                >
                  {seatBeltStatus ? (
                    <>
                      <FaUnlock /> Desabrochar
                    </>
                  ) : (
                    <>
                      <FaLock /> Abrochar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sección de servicios */}
          <div className="services-section">
            <div className="section-header">
              <h3>Servicios</h3>
            </div>
            
            <div className="bathroom-service">
              <div className="service-header">
                <FaToilet className="service-icon" />
                <h4>Servicio de Baño</h4>
              </div>
              
              {isInBathroomQueue ? (
                <div className="queue-status">
                  <div className="queue-info">
                    <p>Está en la cola del baño</p>
                    <div className="queue-position">
                      Posición: <span className="position-number">{queuePosition}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={onLeaveBathroomQueue}
                  >
                    Salir de la cola
                  </button>
                </div>
              ) : (
                <div className="join-queue">
                  <p>El baño está disponible</p>
                  <button 
                    className="btn btn-primary"
                    onClick={onJoinBathroomQueue}
                  >
                    Unirse a la cola
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PassengerScreen;
