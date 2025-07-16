import { FaUser, FaUserSlash, FaCircleCheck, FaCircleXmark, FaToilet } from 'react-icons/fa6';
import { FaPlaneDeparture } from 'react-icons/fa6';

const CrewControls = ({ seats, bathroomQueue, onToggleBelt }) => {
  // Count seat status
  const totalSeats = Object.keys(seats).length;
  const occupiedSeats = Object.values(seats).filter(seat => seat.is_occupied).length;
  const buckledSeats = Object.values(seats).filter(seat => seat.is_occupied && seat.is_buckled).length;
  const unbuckledSeats = occupiedSeats - buckledSeats;
  
  // Get passengers not in their seats
  const passengersNotInSeats = Object.values(seats)
    .filter(seat => !seat.is_in_seat && seat.is_occupied);
    
  // Get passengers with unbuckled seatbelts
  const passengersUnbuckled = Object.values(seats)
    .filter(seat => seat.is_occupied && !seat.is_buckled);

  return (
    <div className="crew-dashboard">
      <div className="dashboard-header">
        <h2>Panel de Control de la Tripulación</h2>
        <div className="status-summary">
          <div className="status-item">
            <FaUser />
            <span>{occupiedSeats} / {totalSeats} Asientos</span>
          </div>
          <div className="status-item success">
            <FaCircleCheck />
            <span>{buckledSeats} Abrochados</span>
          </div>
          <div className="status-item warning">
            <FaCircleXmark />
            <span>{unbuckledSeats} Sin abrochar</span>
          </div>
          <div className="status-item info">
            <FaToilet />
            <span>{bathroomQueue.length} En cola del baño</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        {/* Unbuckled Passengers */}
        {passengersUnbuckled.length > 0 && (
          <div className="dashboard-section">
            <h3>Pasajeros sin cinturón abrochado</h3>
            <div className="passenger-grid">
              {passengersUnbuckled.map(passenger => (
                <div key={passenger.seat_id} className="passenger-card warning">
                  <div className="passenger-header">
                    <FaUser className="passenger-icon" />
                    <div className="passenger-name">
                      {passenger.passenger_name}
                      <span className="seat-number">Asiento {passenger.seat_id}</span>
                    </div>
                  </div>
                  <div className="passenger-actions">
                    <button 
                      className="btn btn-sm"
                      onClick={() => onToggleBelt(passenger.seat_id)}
                    >
                      <FaCircleCheck /> Marcar como abrochado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Passengers Not in Seats */}
        {passengersNotInSeats.length > 0 && (
          <div className="dashboard-section">
            <h3>Pasajeros fuera de sus asientos</h3>
            <div className="passenger-grid">
              {passengersNotInSeats.map(passenger => (
                <div key={passenger.seat_id} className="passenger-card danger">
                  <div className="passenger-header">
                    <FaUserSlash className="passenger-icon" />
                    <div className="passenger-name">
                      {passenger.passenger_name}
                      <span className="seat-number">Asiento {passenger.seat_id}</span>
                    </div>
                  </div>
                  <div className="passenger-actions">
                    <span className="status-badge">Fuera del asiento</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Bathroom Queue */}
        <div className="dashboard-section">
          <h3>Cola del baño ({bathroomQueue.length})</h3>
          {bathroomQueue.length === 0 ? (
            <p>No hay nadie en la cola del baño</p>
          ) : (
            <div className="queue-list">
              {bathroomQueue.map((item, index) => (
                <div key={`${item.seat_id}-${item.timestamp}`} className="queue-item">
                  <div className="queue-position">{index + 1}</div>
                  <div className="passenger-info">
                    <FaUser className="passenger-icon" />
                    <div>
                      <div className="passenger-name">{item.passenger_name}</div>
                      <div className="seat-number">Asiento {item.seat_id}</div>
                    </div>
                  </div>
                  <div className="queue-time">
                    En cola: {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* All Passengers */}
        <div className="dashboard-section">
          <h3>Todos los pasajeros</h3>
          <div className="passenger-grid">
            {Object.values(seats).map(passenger => (
              <div 
                key={passenger.seat_id} 
                className={`passenger-card ${!passenger.is_buckled ? 'warning' : ''} ${!passenger.is_in_seat ? 'danger' : ''}`}
              >
                <div className="passenger-header">
                  {passenger.is_in_seat ? <FaUser /> : <FaUserSlash />}
                  <div className="passenger-name">
                    {passenger.passenger_name}
                    <span className="seat-number">Asiento {passenger.seat_id}</span>
                  </div>
                </div>
                <div className="passenger-status">
                  <span className={`status-badge ${passenger.is_buckled ? 'success' : 'warning'}`}>
                    {passenger.is_buckled ? 'Abrochado' : 'Sin abrochar'}
                  </span>
                  {!passenger.is_buckled && (
                    <button 
                      className="btn btn-sm"
                      onClick={() => onToggleBelt(passenger.seat_id)}
                    >
                      <FaCircleCheck /> Abrochar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewControls;
