import { useState, useEffect, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { useNotification } from '../context/NotificationContext';
import { useLoading } from '../context/LoadingContext';
import { saveSeatSelection, getSavedSeat, saveViewMode, getViewMode } from '../utils/storage';


export const useAppState = () => {
  // Hooks
  const { 
    isConnected,
    seats,
    bathroomQueue,
    bathroomStatus,
    connectedUsers,
    toggleSeatBelt,
    joinBathroomQueue,
    leaveBathroomQueue,
    markInSeat,
    isSeatOccupied,
    isSeatBeltBuckled,
    isInBathroomQueue,
    getQueuePosition,
    bathroomDoorSensor,
  } = useWebSocketContext();
  
  const { showSuccess, showError } = useNotification();
  const { withLoading } = useLoading();

  // State
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [view, setView] = useState('passenger');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedSeat = getSavedSeat();
    const savedView = getViewMode();
    
    if (savedSeat) {
      setSelectedSeat(savedSeat);
    }
    
    if (savedView) {
      setView(savedView);
    }
    
    setIsInitialized(true);
  }, []);

  // Save view mode when it changes
  useEffect(() => {
    if (isInitialized) {
      saveViewMode(view);
    }
  }, [view, isInitialized]);

  // Save seat selection when it changes
  useEffect(() => {
    if (isInitialized && selectedSeat) {
      saveSeatSelection(selectedSeat);
    }
  }, [selectedSeat, isInitialized]);

  // Handle seat selection
  const handleSeatSelect = useCallback((seatId) => {
    setSelectedSeat(seatId);
    // Get passenger name from seat data
    if (seatId && seats[seatId]) {
      setPassengerName(seats[seatId].passenger_name || '');
    }
  }, [seats]);
  
  // Auto-assign name when component initializes if seat is already selected
  useEffect(() => {
    if (isInitialized && selectedSeat && seats[selectedSeat]) {
      setPassengerName(seats[selectedSeat].passenger_name || '');
    }
  }, [isInitialized, selectedSeat, seats]);

  // Toggle seat belt with loading state
  const handleToggleSeatBelt = useCallback(async () => {
    if (!selectedSeat) return;
    
    try {
      await withLoading(
        toggleSeatBelt(selectedSeat),
        { text: 'Actualizando cinturón...' }
      );
      
      showSuccess(
        isSeatBeltBuckled(selectedSeat) 
          ? 'Cinturón abrochado' 
          : 'Cinturón desabrochado'
      );
    } catch (error) {
      showError('Error al actualizar el cinturón');
    }
  }, [selectedSeat, toggleSeatBelt, isSeatBeltBuckled, withLoading, showSuccess, showError]);

  // Handle joining bathroom queue
  const handleJoinBathroomQueue = useCallback(async () => {
    if (!selectedSeat || !passengerName.trim()) {
      showError('Por favor, selecciona un asiento e ingresa tu nombre');
      return;
    }
    
    try {
      await withLoading(
        joinBathroomQueue(selectedSeat, passengerName.trim()),
        { text: 'Uniéndose a la cola...' }
      );
      
      showSuccess('¡Te has unido a la cola del baño!');
    } catch (error) {
      showError('Error al unirse a la cola');
    }
  }, [selectedSeat, passengerName, joinBathroomQueue, withLoading, showSuccess, showError]);

  // Handle leaving bathroom queue
  const handleLeaveBathroomQueue = useCallback(async () => {
    if (!selectedSeat) return;
    
    try {
      await withLoading(
        leaveBathroomQueue(selectedSeat),
        { text: 'Saliendo de la cola...' }
      );
      
      showSuccess('Has salido de la cola del baño');
    } catch (error) {
      showError('Error al salir de la cola');
    }
  }, [selectedSeat, leaveBathroomQueue, withLoading, showSuccess, showError]);

  // Toggle view between passenger and crew
  const toggleView = useCallback(() => {
    setView(prevView => prevView === 'passenger' ? 'crew' : 'passenger');
  }, []);

  // Check if current seat is in bathroom queue
  const isCurrentSeatInQueue = useCallback(() => {
    return selectedSeat ? isInBathroomQueue(selectedSeat) : false;
  }, [selectedSeat, isInBathroomQueue]);

  // Get current seat's queue position
  const getCurrentSeatQueuePosition = useCallback(() => {
    return selectedSeat ? getQueuePosition(selectedSeat) : -1;
  }, [selectedSeat, getQueuePosition]);

  // Get current seat's belt status
  const getCurrentSeatBeltStatus = useCallback(() => {
    if (!selectedSeat) return false;
    return isSeatBeltBuckled(selectedSeat);
  }, [selectedSeat, isSeatBeltBuckled]);

  // Get current seat's occupancy status
  const getCurrentSeatOccupancy = useCallback(() => {
    if (!selectedSeat) return false;
    return isSeatOccupied(selectedSeat);
  }, [selectedSeat, isSeatOccupied]);

  // Get all seats
  const getAllSeats = useCallback(() => {
    return seats;
  }, [seats]);

  // Get all passengers not in their seats
  const getPassengersNotInSeats = useCallback(() => {
    return Object.entries(seats).filter(([_, seat]) => 
      seat.isOccupied && !seat.isInSeat
    ).map(([seatId, seat]) => ({
      seatId,
      ...seat
    }));
  }, [seats]);

  // Get all unbuckled seats
  const getUnbuckledSeats = useCallback(() => {
    return Object.entries(seats).filter(([_, seat]) => 
      seat.isOccupied && !seat.isBuckled
    ).map(([seatId, seat]) => ({
      seatId,
      ...seat
    }));
  }, [seats]);

  // Handle bathroom door sensor
  const handleBathroomDoorSensor = useCallback((action, seatId) => {
    bathroomDoorSensor(action, seatId || selectedSeat);
  }, [bathroomDoorSensor, selectedSeat]);

  return {
    // State
    isConnected,
    selectedSeat,
    passengerName,
    setPassengerName,
    view,
    setView,
    isInitialized,
    
    // Seat data
    seats: getAllSeats(),
    bathroomQueue,
    bathroomStatus,
    connectedUsers,
    
    // Current seat status
    isCurrentSeatInQueue: isCurrentSeatInQueue(),
    currentSeatQueuePosition: getCurrentSeatQueuePosition(),
    isCurrentSeatBeltBuckled: getCurrentSeatBeltStatus(),
    isCurrentSeatOccupied: getCurrentSeatOccupancy(),
    
    // Crew data
    passengersNotInSeats: getPassengersNotInSeats(),
    unbuckledSeats: getUnbuckledSeats(),
    
    // Actions
    handleSeatSelect,
    handleToggleSeatBelt,
    handleJoinBathroomQueue,
    handleLeaveBathroomQueue,
    handleBathroomDoorSensor,
    toggleView,
    markInSeat,
  };
};

export default useAppState;
