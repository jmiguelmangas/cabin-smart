import { FaToilet, FaUser, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';

const BathroomQueue = ({
  queue,
  selectedSeat,
  onJoinQueue,
  onLeaveQueue,
  passengerName,
  onNameChange
}) => {
  const isInQueue = queue.some(item => item.seat_id === selectedSeat);
  
  const handleJoinQueue = async () => {
    if (!selectedSeat) return;
    await onJoinQueue();
  };

  const handleLeaveQueue = async () => {
    if (!selectedSeat) return;
    await onLeaveQueue();
  };

  return (
    <div className="bathroom-queue-container">
      <div className="bathroom-status">
        <div className="bathroom-icon">
          <FaToilet size={48} />
          <span>Disponible</span>
        </div>
        
        {selectedSeat && (
          <div className="queue-actions">
            {!isInQueue ? (
              <button 
                className="btn btn-primary"
                onClick={handleJoinQueue}
                disabled={!passengerName.trim()}
              >
                <FaArrowRight /> Unirse a la cola
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
      
      <div className="queue-list">
        <h3>En espera: {queue.length}</h3>
        
        {queue.length === 0 ? (
          <div className="empty-queue">
            <p>Nadie en la cola del baño</p>
          </div>
        ) : (
          <ul>
            {queue.map((item, index) => (
              <li 
                key={`${item.seat_id}-${item.timestamp}`}
                className={`queue-item ${item.seat_id === selectedSeat ? 'current-user' : ''}`}
              >
                <div className="queue-position">{index + 1}</div>
                <div className="passenger-info">
                  <FaUser className="passenger-icon" />
                  <div>
                    <div className="passenger-name">
                      {item.passenger_name}
                    </div>
                    <div className="seat-number">Asiento {item.seat_id}</div>
                  </div>
                </div>
                {index === 0 && (
                  <div className="next-up">
                    <FaCheck /> Siguiente
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {selectedSeat && !isInQueue && (
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
            <FaArrowRight /> Unirse a la cola
          </button>
        </div>
      )}
    </div>
  );
};

export default BathroomQueue;
