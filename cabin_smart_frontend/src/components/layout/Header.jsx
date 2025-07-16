import { FaPlaneDeparture, FaUser, FaUserTie, FaMagnifyingGlass } from 'react-icons/fa6';
import { useState } from 'react';

const Header = ({ 
  view, 
  onViewChange, 
  selectedSeat, 
  onSeatSelect, 
  passengerName, 
  onNameChange,
  seats = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const handleSeatChange = (e) => {
    onSeatSelect(e.target.value || null);
  };
  
  // Generate all seats for search (passenger can select any seat to simulate being there)
  const getAllSeats = () => {
    const allSeats = [];
    const rows = 33;
    const seatsPerRow = 6;
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < seatsPerRow; col++) {
        const seatId = `${row}${String.fromCharCode(65 + col)}`;
        const seat = seats[seatId];
        
        allSeats.push({
          id: seatId,
          row: row,
          class: row <= 8 ? 'Business' : 'Economy',
          isOccupied: seat ? seat.is_occupied : false,
          passengerName: seat ? seat.passenger_name : null
        });
      }
    }
    
    return allSeats;
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
    
  };
  
  const handleSeatSelect = (seatId) => {
    onSeatSelect(seatId);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <FaPlaneDeparture className="logo-icon" />
          <h1>CabinSmart</h1>
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${view === 'passenger' ? 'active' : ''}`}
            onClick={() => onViewChange('passenger')}
          >
            <FaUser /> Pasajero
          </button>
          <button 
            className={`toggle-btn ${view === 'crew' ? 'active' : ''}`}
            onClick={() => onViewChange('crew')}
          >
            <FaUserTie /> Tripulación
          </button>
        </div>
        
        {view === 'passenger' && (
          <div className="passenger-info">
            <div className="form-group search-group">
              <label htmlFor="seatSearch">Buscar asiento:</label>
              <div className="search-container">
                <FaMagnifyingGlass className="search-icon" />
                <input
                  id="seatSearch"
                  type="text"
                  placeholder="Buscar tu asiento (ej: 4D, Business)..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {showSearchResults && (() => {
                  const allSeats = getAllSeats();
                  const filteredSeats = allSeats.filter(seat => 
                    seat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    seat.class.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  return (
                    <div className="search-results">
                      {filteredSeats.slice(0, 6).map(seat => (
                        <div
                          key={seat.id}
                          className={`search-result-item ${seat.class.toLowerCase()}`}
                          onClick={() => handleSeatSelect(seat.id)}
                        >
                          <span className="seat-id">{seat.id}</span>
                          <span className="seat-class">{seat.class}</span>
                          {seat.isOccupied && seat.passengerName && (
                            <span className="passenger-name">{seat.passengerName}</span>
                          )}
                        </div>
                      ))}
                      {filteredSeats.length === 0 && (
                        <div className="no-results">
                          No se encontraron asientos
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="seatSelect">O selecciona manualmente:</label>
              <select 
                id="seatSelect" 
                value={selectedSeat || ''} 
                onChange={handleSeatChange}
              >
                <option value="">Selecciona tu asiento</option>
                {Array.from({ length: 33 }, (_, row) => 
                  Array.from({ length: 6 }, (_, col) => {
                    const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
                    return (
                      <option key={seatId} value={seatId}>
                        Asiento {seatId}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
            
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
