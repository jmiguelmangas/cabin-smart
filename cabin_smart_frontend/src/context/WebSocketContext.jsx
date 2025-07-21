import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import useWebSocket from '../hooks/useWebSocket';
import { EVENTS, WS_CONFIG } from '../config/constants';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { showError, showSuccess } = useNotification();
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [seats, setSeats] = useState({});
  const [bathroomQueue, setBathroomQueue] = useState([]);
  const [bathroomStatus, setBathroomStatus] = useState({ is_occupied: false, current_user: null });
  const [connectedUsers, setConnectedUsers] = useState(0);

  // Handle WebSocket connection and events
  const { isConnected, send, on } = useWebSocket(WS_CONFIG.path, {
    ...WS_CONFIG,
    onOpen: () => setSocketStatus('connected'),
    onClose: () => setSocketStatus('disconnected'),
    onError: () => setSocketStatus('error'),
    debug: process.env.NODE_ENV === 'development',
  });

  // Handle initial data and updates
  useEffect(() => {
    // Handle initial state
    const handleInitialState = (data) => {
      setSeats(data.seats || {});
      setBathroomQueue(data.bathroomQueue || []);
      setBathroomStatus(data.bathroomStatus || { is_occupied: false, current_user: null });
      setConnectedUsers(data.connectedUsers || 0);
    };

    // Handle seat updates
    const handleSeatUpdate = (data) => {
      setSeats(prevSeats => ({
        ...prevSeats,
        [data.seatId]: {
          ...prevSeats[data.seatId],
          ...data.updates,
        },
      }));
    };

    // Handle bathroom queue updates
    const handleBathroomQueueUpdate = (data) => {
      setBathroomQueue(data.queue || []);
    };

    // Handle user count updates
    const handleUserCountUpdate = (data) => {
      setConnectedUsers(data.count || 0);
    };

    // Handle bathroom status updates
    const handleBathroomStatusUpdate = (data) => {
      setBathroomStatus({
        is_occupied: data.isOccupied,
        current_user: data.currentUser,
        action: data.action
      });
    };

    // Handle bathroom direct access
    const handleBathroomDirectAccess = (data) => {
      showSuccess(data.message || 'Puedes ir al baño directamente');
    };

    // Handle bathroom available notification
    const handleBathroomAvailable = (data) => {
      showSuccess(data.message || 'El baño está disponible');
    };

    // Subscribe to WebSocket events
    const cleanupInitialState = on(EVENTS.INITIAL_STATE, handleInitialState);
    const cleanupSeatUpdate = on(EVENTS.SEAT_UPDATED, handleSeatUpdate);
    const cleanupBathroomQueue = on(EVENTS.BATHROOM_QUEUE_UPDATED, handleBathroomQueueUpdate);
    const cleanupBathroomStatus = on('bathroom_status_updated', handleBathroomStatusUpdate);
    const cleanupBathroomDirectAccess = on('bathroom_direct_access', handleBathroomDirectAccess);
    const cleanupBathroomAvailable = on('bathroom_available', handleBathroomAvailable);
    const cleanupUserCount = on(EVENTS.USER_COUNT_UPDATED, handleUserCountUpdate);

    // Clean up event listeners
    return () => {
      cleanupInitialState();
      cleanupSeatUpdate();
      cleanupBathroomQueue();
      cleanupBathroomStatus();
      cleanupBathroomDirectAccess();
      cleanupBathroomAvailable();
      cleanupUserCount();
    };
  }, [on]);

  // Toggle seat belt status
  const toggleSeatBelt = useCallback((seatId) => {
    try {
      const success = send(EVENTS.TOGGLE_SEAT_BELT, { seatId });
      if (!success) {
        showError('Error al actualizar el cinturón - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error toggling seat belt:', error);
      showError('Error al actualizar el cinturón');
      throw error;
    }
  }, [send, showError]);

  // Join bathroom queue
  const joinBathroomQueue = useCallback((seatId, passengerName) => {
    try {
      const success = send(EVENTS.JOIN_BATHROOM_QUEUE, { seatId, passengerName });
      if (!success) {
        showError('Error al unirse a la cola del baño - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error joining bathroom queue:', error);
      showError('Error al unirse a la cola del baño');
      throw error;
    }
  }, [send, showError]);

  // Leave bathroom queue
  const leaveBathroomQueue = useCallback((seatId) => {
    try {
      const success = send(EVENTS.LEAVE_BATHROOM_QUEUE, { seatId });
      if (!success) {
        showError('Error al salir de la cola del baño - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error leaving bathroom queue:', error);
      showError('Error al salir de la cola del baño');
      throw error;
    }
  }, [send, showError]);

  // Mark passenger as in seat
  const markInSeat = useCallback((seatId, inSeat) => {
    try {
      const success = send(EVENTS.UPDATE_SEAT_STATUS, { 
        seatId, 
        updates: { isInSeat: inSeat } 
      });
      if (!success) {
        showError('Error al actualizar el estado del asiento - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error updating seat status:', error);
      showError('Error al actualizar el estado del asiento');
      throw error;
    }
  }, [send, showError]);

  // Get seat by ID
  const getSeat = useCallback((seatId) => {
    return seats[seatId] || null;
  }, [seats]);

  // Check if seat is occupied
  const isSeatOccupied = useCallback((seatId) => {
    return !!seats[seatId]?.is_occupied;
  }, [seats]);

  // Check if seat belt is buckled
  const isSeatBeltBuckled = useCallback((seatId) => {
    return !!seats[seatId]?.is_buckled;
  }, [seats]);

  // Get current position in bathroom queue
  const getQueuePosition = useCallback((seatId) => {
    return bathroomQueue.findIndex(entry => entry.seat_id === seatId);
  }, [bathroomQueue]);

  // Check if passenger is in bathroom queue
  const isInBathroomQueue = useCallback((seatId) => {
    return bathroomQueue.some(entry => entry.seat_id === seatId);
  }, [bathroomQueue]);

  // Simulate bathroom door sensor
  const bathroomDoorSensor = useCallback((action, seatId) => {
    try {
      const success = send('bathroom_door_sensor', { action, seatId });
      if (!success) {
        showError('Error al actualizar sensor de puerta - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error with bathroom door sensor:', error);
      showError('Error al actualizar sensor de puerta');
      throw error;
    }
  }, [send, showError]);

  // Send safety announcement
  const sendSafetyAnnouncement = useCallback((message, targetSeats = []) => {
    try {
      const success = send('safety_announcement', { message, targetSeats });
      if (!success) {
        showError('Error al enviar aviso de seguridad - no conectado');
      }
      return success;
    } catch (error) {
      console.error('Error sending safety announcement:', error);
      showError('Error al enviar aviso de seguridad');
      throw error;
    }
  }, [send, showError]);

  // Context value
  const contextValue = {
    // State
    isConnected,
    socketStatus,
    seats,
    bathroomQueue,
    bathroomStatus,
    connectedUsers,
    
    // Methods
    toggleSeatBelt,
    joinBathroomQueue,
    leaveBathroomQueue,
    markInSeat,
    getSeat,
    isSeatOccupied,
    isSeatBeltBuckled,
    getQueuePosition,
    isInBathroomQueue,
    bathroomDoorSensor,
    sendSafetyAnnouncement,
    
    // Raw WebSocket methods (use with caution)
    send,
    on,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
