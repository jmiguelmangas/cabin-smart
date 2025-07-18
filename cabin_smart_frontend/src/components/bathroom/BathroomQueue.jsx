import { FaToilet, FaUser, FaArrowRight, FaCheck, FaTimes, FaLock, FaUnlock, FaBell } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const BathroomQueue = ({
  queue,
  selectedSeat,
  onJoinQueue,
  onLeaveQueue,
  passengerName,
  onNameChange,
  bathroomStatus,
  onBathroomDoorSensor
}) => {
  const isInQueue = queue.some(item => item.seat_id === selectedSeat);
  const [notification, setNotification] = useState(null);
  
  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const handleJoinQueue = async () => {
    if (!selectedSeat) return;
    await onJoinQueue();
  };

  const handleLeaveQueue = async () => {
    if (!selectedSeat) return;
    await onLeaveQueue();
  };
  
  const handleEnterBathroom = () => {
    if (onBathroomDoorSensor) {
      onBathroomDoorSensor('enter', selectedSeat);
    }
  };
  
  const handleExitBathroom = () => {
    if (onBathroomDoorSensor) {
      onBathroomDoorSensor('exit', selectedSeat);
    }
  };
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };
  
  // Check if current user is using the bathroom
  const isCurrentUserInBathroom = bathroomStatus?.current_user === selectedSeat;
  
  // Check if current user is next in queue
  const isNextInQueue = queue.length > 0 && queue[0].seat_id === selectedSeat;

  return (
    <div className="bathroom-queue-container">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <FaBell />
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Bathroom Status */}
      <div className="bathroom-status">
        <div className={`bathroom-icon ${bathroomStatus?.is_occupied ? 'occupied' : 'available'}`}>
          {bathroomStatus?.is_occupied ? <FaLock size={48} /> : <FaUnlock size={48} />}
          <span>{bathroomStatus?.is_occupied ? 'Ocupado' : 'Disponible'}</span>
          {bathroomStatus?.is_occupied && bathroomStatus?.current_user && (
            <div className="current-user-info">
              <small>En uso por: Asiento {bathroomStatus.current_user}</small>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        {selectedSeat && (
          <div className="queue-actions">
            {isCurrentUserInBathroom ? (
              <button 
                className="btn btn-warning"
                onClick={handleExitBathroom}
              >
                <FaTimes /> Salir del baño
              </button>
            ) : isNextInQueue && !bathroomStatus?.is_occupied ? (
              <button 
                className="btn btn-success"
                onClick={handleEnterBathroom}
              >
                <FaCheck /> Entrar al baño
              </button>
            ) : !isInQueue ? (
              <button 
                className="btn btn-primary"
                onClick={handleJoinQueue}
                disabled={!passengerName.trim()}
              >
                <FaArrowRight /> {queue.length === 0 && !bathroomStatus?.is_occupied ? 'Ir al baño' : 'Unirse a la cola'}
              </button>
            ) : (
              <button 
                className="btn btn-danger"
                onClick={handleLeaveQueue}
              >
                <FaTimes /> Salir de la cola
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Queue List */}
      <div className="queue-list">
        <h3>
          <FaUser /> En espera: {queue.length}
          {queue.length === 0 && !bathroomStatus?.is_occupied && (
            <span className="available-indicator"> - ¡Disponible!</span>
          )}
        </h3>
        
        {queue.length === 0 ? (
          <div className="empty-queue">
            {bathroomStatus?.is_occupied ? (
              <p>Nadie en la cola del baño</p>
            ) : (
              <p className="go-direct">
                <FaUnlock /> ¡Puedes ir al baño directamente!
              </p>
            )}
          </div>
        ) : (
          <ul>
            {queue.map((item, index) => (
              <li 
                key={`${item.seat_id}-${item.timestamp}`}
                className={`queue-item ${
                  item.seat_id === selectedSeat ? 'current-user' : ''
                } ${
                  index === 0 && !bathroomStatus?.is_occupied ? 'next-available' : ''
                }`}
              >
                <div className="queue-position">{index + 1}</div>
                <div className="passenger-info">
                  <FaUser className="passenger-icon" />
                  <div>
                    <div className="passenger-name">
                      Asiento {item.seat_id}
                    </div>
                    <div className="seat-number"></div>
                  </div>
                </div>
                {index === 0 && (
                  <div className={`next-up ${
                    !bathroomStatus?.is_occupied ? 'ready' : ''
                  }`}>
                    {!bathroomStatus?.is_occupied ? (
                      <><FaCheck /> ¡Tu turno!</>
                    ) : (
                      <><FaCheck /> Siguiente</>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Join Queue Form */}
      {selectedSeat && !isInQueue && !isCurrentUserInBathroom && (
        <div className="join-queue-form">
          <div className="form-group">
            <label>Tu nombre:</label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="¿Cómo te llamas?"
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleJoinQueue}
            disabled={!passengerName.trim()}
          >
            <FaArrowRight /> {queue.length === 0 && !bathroomStatus?.is_occupied ? 'Ir al baño' : 'Unirse a la cola'}
          </button>
        </div>
      )}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            Debug: Occupied={bathroomStatus?.is_occupied ? 'Yes' : 'No'}, 
            Current User={bathroomStatus?.current_user || 'None'}, 
            Queue Length={queue.length}
          </small>
        </div>
      )}
    </div>
  );
};

export default BathroomQueue;
