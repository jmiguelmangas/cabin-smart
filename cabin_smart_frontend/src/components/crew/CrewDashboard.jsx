import React from 'react';
import { FaUser, FaUserSlash, FaUserCheck, FaUserClock, FaUserCog, FaUserShield, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';
import { useLoading } from '../../context/LoadingContext';
import { useWebSocketContext } from '../../context/WebSocketContext';
import CabinOverview from '../seats/CabinOverview';

const CrewDashboard = ({
  seats = {},
  bathroomQueue = [],
  passengersNotInSeats = [],
  unbuckledSeats = [],
  connectedUsers = 0,
  onMarkInSeat,
  onToggleSeatBelt,
}) => {
  const { withLoading } = useLoading();
  const { showSuccess, showError } = useNotification();
  const { sendSafetyAnnouncement } = useWebSocketContext();

  // Handle marking a passenger as in their seat
  const handleMarkInSeat = async (seatId, inSeat) => {
    try {
      await withLoading(
        onMarkInSeat(seatId, inSeat),
        { text: 'Actualizando estado del pasajero...' }
      );
      
      showSuccess(
        inSeat 
          ? 'Pasajero marcado como en su asiento' 
          : 'Pasajero marcado como fuera de su asiento'
      );
    } catch (error) {
      console.error('Error updating passenger status:', error);
      showError('Error al actualizar el estado del pasajero');
    }
  };

  // Handle toggling seat belt
  const handleToggleBelt = async (seatId) => {
    try {
      await withLoading(
        onToggleSeatBelt(seatId),
        { text: 'Actualizando cinturón...' }
      );
    } catch (error) {
      console.error('Error toggling seat belt:', error);
      showError('Error al actualizar el cinturón');
    }
  };

  // Handle sending safety announcement
  const handleSendSafetyAnnouncement = async () => {
    try {
      const unbuckledSeatIds = unbuckledSeats.map(seat => seat.seatId);
      const message = 'Por favor, abróchense el cinturón de seguridad inmediatamente.';
      
      await withLoading(
        sendSafetyAnnouncement(message, unbuckledSeatIds),
        { text: 'Enviando aviso de seguridad...' }
      );
      
      showSuccess(`Aviso enviado a ${unbuckledSeats.length} pasajeros sin cinturón abrochado`);
    } catch (error) {
      console.error('Error sending safety announcement:', error);
      showError('Error al enviar el aviso de seguridad');
    }
  };

  // Calculate statistics
  const totalSeats = Object.keys(seats).length;
  const occupiedSeats = Object.values(seats).filter(seat => seat.is_occupied).length;
  const availableSeats = totalSeats - occupiedSeats;
  const percentageOccupied = Math.round((occupiedSeats / totalSeats) * 100) || 0;
  const buckledSeats = Object.values(seats).filter(seat => seat.is_buckled).length;
  const unbuckledCount = Object.values(seats).filter(seat => !seat.is_buckled).length;
  const percentageBuckled = Math.round((buckledSeats / totalSeats) * 100) || 0;
  const safetyCompliance = unbuckledCount === 0 ? 100 : Math.round(((totalSeats - unbuckledCount) / totalSeats) * 100);
  
  // Business vs Economy statistics
  const businessSeats = Object.values(seats).filter(seat => seat.seat_class === 'business');
  const economySeats = Object.values(seats).filter(seat => seat.seat_class === 'economy');
  const businessOccupied = businessSeats.filter(seat => seat.is_occupied).length;
  const economyOccupied = economySeats.filter(seat => seat.is_occupied).length;
  const businessBuckled = businessSeats.filter(seat => seat.is_buckled).length;
  const economyBuckled = economySeats.filter(seat => seat.is_buckled).length;

  return (
    <div className="powerbi-dashboard">
      {/* Header with Key Metrics */}
      <div className="dashboard-header">
        <h1>CabinSmart Dashboard</h1>
        <div className="kpi-cards">
          <div className="kpi-card primary">
            <div className="kpi-icon"><FaUser /></div>
            <div className="kpi-content">
              <div className="kpi-value">{connectedUsers}</div>
              <div className="kpi-label">Conectados</div>
            </div>
          </div>
          <div className="kpi-card success">
            <div className="kpi-icon"><FaUserCheck /></div>
            <div className="kpi-content">
              <div className="kpi-value">{occupiedSeats}/{totalSeats}</div>
              <div className="kpi-label">Ocupación ({percentageOccupied}%)</div>
              <div className="kpi-progress">
                <div className="progress-bar" style={{ width: `${percentageOccupied}%` }}></div>
              </div>
            </div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-icon"><FaExclamationTriangle /></div>
            <div className="kpi-content">
              <div className="kpi-value">{unbuckledCount}</div>
              <div className="kpi-label">Cinturones Sueltos</div>
              <div className="kpi-subtext">{percentageBuckled}% abrochados</div>
            </div>
          </div>
          <div className="kpi-card info">
            <div className="kpi-icon"><FaUserClock /></div>
            <div className="kpi-content">
              <div className="kpi-value">{bathroomQueue.length}</div>
              <div className="kpi-label">En Cola Baño</div>
            </div>
          </div>
          <div className="kpi-card business">
            <div className="kpi-icon"><FaUserShield /></div>
            <div className="kpi-content">
              <div className="kpi-value">{businessOccupied}/{businessSeats.length}</div>
              <div className="kpi-label">Business</div>
              <div className="kpi-subtext">{businessBuckled} abrochados</div>
            </div>
          </div>
          <div className="kpi-card economy">
            <div className="kpi-icon"><FaUser /></div>
            <div className="kpi-content">
              <div className="kpi-value">{economyOccupied}/{economySeats.length}</div>
              <div className="kpi-label">Economy</div>
              <div className="kpi-subtext">{economyBuckled} abrochados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Cabin Overview - Full Width */}
        <div className="cabin-overview-section">
          <div className="section-header">
            <h2>Vista de la Cabina</h2>
            <div className="section-actions">
              <button 
                className="btn btn-warning"
                onClick={handleSendSafetyAnnouncement}
                disabled={unbuckledCount === 0}
              >
                <FaBell /> Aviso Seguridad ({unbuckledCount})
              </button>
            </div>
          </div>
          <div className="cabin-container-wide">
            <CabinOverview
              seats={seats}
              selectedSeat={null}
              onSeatSelect={() => {}}
              onToggleSeatBelt={handleToggleBelt}
            />
          </div>
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* Alerts Panel */}
          <div className="panel alert-panel">
            <div className="panel-header">
              <h3><FaExclamationTriangle /> Alertas</h3>
            </div>
            <div className="panel-content">
              {unbuckledCount > 0 && (
                <div className="alert-item danger">
                  <div className="alert-icon"><FaExclamationTriangle /></div>
                  <div className="alert-content">
                    <div className="alert-title">{unbuckledCount} Cinturones Sueltos</div>
                    <div className="alert-desc">Revisar seguridad</div>
                  </div>
                </div>
              )}
              {passengersNotInSeats.length > 0 && (
                <div className="alert-item warning">
                  <div className="alert-icon"><FaUserSlash /></div>
                  <div className="alert-content">
                    <div className="alert-title">{passengersNotInSeats.length} Fuera de Asiento</div>
                    <div className="alert-desc">Verificar ubicación</div>
                  </div>
                </div>
              )}
              {bathroomQueue.length > 3 && (
                <div className="alert-item info">
                  <div className="alert-icon"><FaUserClock /></div>
                  <div className="alert-content">
                    <div className="alert-title">Cola Larga en Baño</div>
                    <div className="alert-desc">{bathroomQueue.length} personas</div>
                  </div>
                </div>
              )}
              {unbuckledCount === 0 && passengersNotInSeats.length === 0 && bathroomQueue.length <= 3 && (
                <div className="alert-item success">
                  <div className="alert-icon"><FaUserCheck /></div>
                  <div className="alert-content">
                    <div className="alert-title">Todo Normal</div>
                    <div className="alert-desc">Sin alertas activas</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bathroom Queue Panel */}
          <div className="panel queue-panel">
            <div className="panel-header">
              <h3><FaUserClock /> Cola del Baño</h3>
            </div>
            <div className="panel-content">
              {bathroomQueue.length > 0 ? (
                <div className="queue-list">
                  {bathroomQueue.slice(0, 5).map(({ seat_id, passenger_name, timestamp }, index) => (
                    <div key={`${seat_id}-${timestamp}`} className="queue-item">
                      <div className="queue-position">#{index + 1}</div>
                      <div className="queue-details">
                        <div className="passenger-name">
                          Asiento {seat_id}
                        </div>
                        <div className="queue-time">
                          {new Date(timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {bathroomQueue.length > 5 && (
                    <div className="queue-more">+{bathroomQueue.length - 5} más...</div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <FaUserCheck className="empty-icon" />
                  <span>Cola vacía</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewDashboard;
