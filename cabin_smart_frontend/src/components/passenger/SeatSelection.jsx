import { FaUser, FaUserSlash, FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { useState } from 'react';

const SeatSelection = ({ seats, selectedSeat, onSeatSelect }) => {
  const [selectedRow, setSelectedRow] = useState('');
  
  const rows = 33;
  const seatsPerRow = 6;
  
  const handleSeatClick = (seatId) => {
    onSeatSelect(seatId === selectedSeat ? null : seatId);
  };

  const renderSeat = (row, col) => {
    const seatId = `${row}${String.fromCharCode(65 + col)}`;
    const seat = seats[seatId] || {
      seat_id: seatId,
      is_occupied: false,
      is_buckled: false,
      passenger_name: `Pasajero ${seatId}`
    };
    
    const isSelected = selectedSeat === seatId;
    const isBusinessClass = row <= 8;
    const seatClass = `seat-selection-seat ${seat.is_occupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''} ${isBusinessClass ? 'business' : 'economy'}`;
    
    return (
      <div 
        key={seatId} 
        className={seatClass}
        onClick={() => handleSeatClick(seatId)}
        title={seat.is_occupied ? `Ocupado por ${seat.passenger_name}` : `Asiento ${seatId} disponible`}
      >
        <div className="seat-label">
          {seat.is_occupied ? <FaUser /> : <FaUserSlash />}
          <span>{seatId}</span>
        </div>
        
        {seat.is_occupied && (
          <div className="seat-status">
            <div className={`belt-indicator ${seat.is_buckled ? 'buckled' : 'unbuckled'}`}>
              {seat.is_buckled ? (
                <FaCircleCheck className="status-icon" />
              ) : (
                <FaCircleXmark className="status-icon" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getRowsToShow = () => {
    if (selectedRow) {
      const rowNum = parseInt(selectedRow);
      return [rowNum];
    }
    return [];
  };

  return (
    <div className="seat-selection-container">
      <div className="seat-selection-header">
        <h2>Seleccione su asiento</h2>
        <p>Explore los asientos disponibles por fila</p>
      </div>
      
      <div className="browse-mode">
        <div className="row-selector">
          <label htmlFor="row-select">Seleccionar Fila:</label>
          <select
            id="row-select"
            value={selectedRow}
            onChange={(e) => setSelectedRow(e.target.value)}
          >
            <option value="">Seleccione una fila...</option>
            {Array.from({ length: rows }, (_, i) => {
              const rowNum = i + 1;
              const isBusinessClass = rowNum <= 8;
              return (
                <option key={rowNum} value={rowNum}>
                  Fila {rowNum} ({isBusinessClass ? 'Business' : 'Economy'})
                </option>
              );
            })}
          </select>
        </div>
        
        {selectedRow && (
          <div className="row-display">
            <h3>Fila {selectedRow} ({parseInt(selectedRow) <= 8 ? 'Business Class' : 'Economy Class'})</h3>
            <div className="row-layout">
              <div className="seat-row-browse">
                {/* Left side seats */}
                <div className="seats-section">
                  {[0, 1, 2].map((col) => renderSeat(parseInt(selectedRow), col))}
                </div>
                
                {/* Aisle */}
                <div className="aisle-indicator">
                  <span>Pasillo</span>
                </div>
                
                {/* Right side seats */}
                <div className="seats-section">
                  {[3, 4, 5].map((col) => renderSeat(parseInt(selectedRow), col))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="seat-selection-legend">
        <div className="legend-item">
          <div className="seat-legend available"><FaUserSlash /></div>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend occupied"><FaUser /></div>
          <span>Ocupado</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend selected"><FaUser /></div>
          <span>Seleccionado</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend business">B</div>
          <span>Business Class</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend economy">E</div>
          <span>Economy Class</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
