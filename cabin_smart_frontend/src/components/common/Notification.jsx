import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { ANIMATION } from '../../config/constants';

const Notification = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer;
    
    if (isVisible && duration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, ANIMATION.NORMAL);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon" />;
      case 'error':
        return <FaExclamationCircle className="notification-icon" />;
      case 'warning':
        return <FaExclamationCircle className="notification-icon" />;
      default:
        return <FaInfoCircle className="notification-icon" />;
    }
  };

  const getClassName = () => {
    const baseClass = 'notification';
    const typeClass = `notification-${type}`;
    const exitClass = isExiting ? 'notification-exit' : '';
    return `${baseClass} ${typeClass} ${exitClass}`.trim();
  };

  return (
    <div className={getClassName()}>
      <div className="notification-content">
        <div className="notification-icon-container">
          {getIcon()}
        </div>
        <div className="notification-message">
          {message}
        </div>
        <button 
          className="notification-close"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Notification;
