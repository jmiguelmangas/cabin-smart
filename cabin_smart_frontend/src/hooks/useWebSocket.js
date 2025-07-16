import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { EVENTS, WS_CONFIG } from '../config/constants';

const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const ws = useRef(null);
  const { showError } = useNotification();
  const eventHandlers = useRef({});
  const reconnectTimer = useRef(null);
  const connectRef = useRef(null);
  const { 
    autoReconnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    debug = process.env.NODE_ENV === 'development',
    ...socketOptions 
  } = options;

  const log = useCallback((...args) => {
    if (debug) {
      console.log('[WebSocket]', ...args);
    }
  }, [debug]);

  // Define connect function that doesn't change
  connectRef.current = () => {
    if (ws.current) {
      ws.current.close();
    }

    try {
      // Create WebSocket connection
      let wsUrl;
      
      if (url.startsWith('ws')) {
        wsUrl = url;
      } else if (WS_CONFIG.url) {
        // Ensure the URL has the correct protocol and no double slashes
        const baseUrl = WS_CONFIG.url.replace(/^http/, 'ws').replace(/\/$/, '');
        wsUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      } else {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${window.location.host}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      
      log('Connecting to WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);
      
      // Set binary type to improve compatibility
      ws.current.binaryType = 'arraybuffer';
      
      // Set up event handlers
      ws.current.onopen = (event) => {
        log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        
        // Call onOpen callback if provided
        if (typeof options.onOpen === 'function') {
          options.onOpen(event);
        }
      };

      ws.current.onclose = (event) => {
        log('WebSocket disconnected');
        setIsConnected(false);
        
        // Call onClose callback if provided
        if (typeof options.onClose === 'function') {
          options.onClose(event);
        }

        // Attempt to reconnect if enabled
        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          log(`Attempting to reconnect (${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
          
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            if (connectRef.current) {
              connectRef.current();
            }
          }, reconnectInterval);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          showError('No se pudo conectar al servidor. Por favor, recarga la página.', { autoClose: 2000 });
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        
        // Call onError callback if provided
        if (typeof options.onError === 'function') {
          options.onError(error);
        } else {
          showError('Error de conexión con el servidor', { autoClose: 2000 });
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          log('Received message:', message);
          
          // Call the appropriate event handler
          if (message.event && eventHandlers.current[message.event]) {
            eventHandlers.current[message.event].forEach(handler => {
              handler(message.data);
            });
          }
          
          // Call the general message handler if provided
          if (typeof options.onMessage === 'function') {
            options.onMessage(message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      showError('Error al conectar con el servidor', { autoClose: 2000 });
    }
  };

  const connect = useCallback(() => {
    if (connectRef.current) {
      connectRef.current();
    }
  }, []);

  // Set up event listeners
  const on = useCallback((event, callback) => {
    if (!eventHandlers.current[event]) {
      eventHandlers.current[event] = [];
    }
    
    eventHandlers.current[event].push(callback);
    
    // Return cleanup function
    return () => {
      eventHandlers.current[event] = eventHandlers.current[event].filter(
        handler => handler !== callback
      );
    };
  }, []);

  // Send a message through the WebSocket
  const send = useCallback((event, data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data });
      ws.current.send(message);
      log('Sent message:', { event, data });
      return true;
    } else {
      console.warn('WebSocket is not connected');
      return false;
    }
  }, [log]);

  // Effect to handle connection and cleanup
  useEffect(() => {
    // Connect when the component mounts
    connect();
    
    // Cleanup function
    return () => {
      if (ws.current) {
        log('Closing WebSocket connection');
        ws.current.close();
      }
      
      // Clear any pending reconnect attempts
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [connect, log]);

  // Note: URL changes handled in the main useEffect

  return {
    isConnected,
    send,
    on,
    reconnect: connect,
    disconnect: () => {
      if (ws.current) {
        ws.current.close();
      }
    },
  };
};

export default useWebSocket;
