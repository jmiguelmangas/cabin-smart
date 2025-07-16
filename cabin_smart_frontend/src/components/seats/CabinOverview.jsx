import { FaUser, FaUserSlash, FaCircleCheck, FaCircleXmark, FaToilet } from 'react-icons/fa6';
import { FaPlaneDeparture } from 'react-icons/fa6';

const CabinOverview = ({ seats, selectedSeat, onSeatSelect, onToggleBelt }) => {
  const totalRows = 33;
  const seatsPerRow = 6;
  
  const handleSeatClick = (seatId) => {
    onSeatSelect(seatId === selectedSeat ? null : seatId);
  };

  const handleBeltClick = (e, seatId) => {
    e.stopPropagation();
    onToggleBelt(seatId);
  };

  const renderSeat = (row, col) => {
    const seatId = `${row}${String.fromCharCode(64 + col)}`;
    const seat = seats[seatId] || {
      seat_id: seatId,
      is_occupied: false,
      is_buckled: false,
      passenger_name: `Pasajero ${seatId}`
    };
    
    const isSelected = selectedSeat === seatId;
    const isBusinessClass = row <= 8;
    
    // Determine seat state: empty (gray), occupied with belt (green), occupied without belt (red)
    let seatState = 'empty';
    if (seat.is_occupied) {
      seatState = seat.is_buckled ? 'buckled' : 'unbuckled';
    }
    
    const seatClass = `seat-simple ${seatState} ${isSelected ? 'selected' : ''} ${isBusinessClass ? 'business' : 'economy'}`;
    
    return (
      <div 
        key={seatId} 
        className={seatClass}
        onClick={() => handleSeatClick(seatId)}
        title={`${seatId} - ${seat.is_occupied ? `Ocupado por ${seat.passenger_name}` : 'Libre'} - ${seat.is_buckled ? 'Cinturón abrochado' : 'Cinturón suelto'}`}
      >
        <div className="seat-number">{seatId}</div>
      </div>
    );
  };

  const renderBathroom = (type, position) => {
    return (
      <div key={`${type}-${position}`} className={`bathroom ${type}`}>
        <FaToilet />
        <span>{type === 'business' ? 'Baño Business' : 'Baño'}</span>
      </div>
    );
  };

  // Render cabin layout horizontally like an airplane from above
  return (
    <div className="cabin-overview">
      <div className="airplane-layout-horizontal">
        {/* Cockpit */}
        <div className="cockpit-section-horizontal">
          <FaPlaneDeparture />
          <span>Cabina</span>
        </div>
        
        {/* Airplane body - All rows horizontally from left to right */}
        <div className="airplane-body-horizontal">
          {/* Column headers */}
          <div className="seat-headers">
            <div className="row-header">Fila</div>
            <div className="seat-header">A</div>
            <div className="seat-header">B</div>
            <div className="seat-header">C</div>
            <div className="aisle-header">Pasillo</div>
            <div className="seat-header">D</div>
            <div className="seat-header">E</div>
            <div className="seat-header">F</div>
          </div>
          
          {/* All rows displayed horizontally */}
          <div className="airplane-rows-container">
            {Array.from({ length: 33 }, (_, rowIndex) => {
              const row = rowIndex + 1;
              const isBusinessClass = row <= 8;
              
              return (
                <div key={`row-${row}`} className="airplane-row-horizontal">
                  {/* Row number */}
                  <div className={`row-number-horizontal ${isBusinessClass ? 'business' : 'economy'}`}>
                    {row}
                  </div>
                  
                  {/* A seat */}
                  <div className="seat-position">
                    {renderSeat(row, 1)}
                  </div>
                  
                  {/* B seat */}
                  <div className="seat-position">
                    {renderSeat(row, 2)}
                  </div>
                  
                  {/* C seat */}
                  <div className="seat-position">
                    {renderSeat(row, 3)}
                  </div>
                  
                  {/* Center aisle */}
                  <div className="center-aisle-horizontal"></div>
                  
                  {/* D seat */}
                  <div className="seat-position">
                    {renderSeat(row, 4)}
                  </div>
                  
                  {/* E seat */}
                  <div className="seat-position">
                    {renderSeat(row, 5)}
                  </div>
                  
                  {/* F seat */}
                  <div className="seat-position">
                    {renderSeat(row, 6)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bathrooms section */}
          <div className="bathrooms-horizontal">
            <div className="bathroom-group business-bathrooms">
              <span>Baños Business (Filas 1-8)</span>
              <div className="bathroom-icons">
                <FaToilet />
                <FaToilet />
              </div>
            </div>
            <div className="bathroom-group economy-bathrooms">
              <span>Baños Economy (Filas 9-33)</span>
              <div className="bathroom-icons">
                <FaToilet />
                <FaToilet />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cabin-legend">
        <div className="legend-item">
          <div className="seat-legend empty">1A</div>
          <span>Libre</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend buckled">1A</div>
          <span>Ocupado - Cinturón Abrochado</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend unbuckled">1A</div>
          <span>Ocupado - Cinturón Suelto</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend business">1A</div>
          <span>Business Class</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend economy">9A</div>
          <span>Economy Class</span>
        </div>
      </div>
    </div>
  );
};

export default CabinOverview;
