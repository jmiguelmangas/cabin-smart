import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notification from '../components/common/Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = uuidv4();
    const newNotification = { id, type, message, duration };
    
    setNotifications(prev => {
      // Evitar duplicados del mismo mensaje
      const existingNotification = prev.find(n => n.message === message && n.type === type);
      if (existingNotification) {
        return prev; // No agregar duplicado
      }
      
      // Limitar a máximo 3 notificaciones
      const updated = [...prev, newNotification];
      if (updated.length > 3) {
        return updated.slice(-3); // Mantener solo las 3 más recientes
      }
      
      return updated;
    });
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    const duration = options.autoClose || 5000;
    return addNotification({ type: 'success', message, duration });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    const duration = options.autoClose || 5000;
    return addNotification({ type: 'error', message, duration });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    const duration = options.autoClose || 5000;
    return addNotification({ type: 'warning', message, duration });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    const duration = options.autoClose || 5000;
    return addNotification({ type: 'info', message, duration });
  }, [addNotification]);

  const contextValue = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
      <style jsx global>{`
        .notification-container {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 100%;
        }
        
        @media (max-width: 480px) {
          .notification-container {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            align-items: center;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
