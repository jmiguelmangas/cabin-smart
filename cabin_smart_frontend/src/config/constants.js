// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000';

// WebSocket Configuration
export const WS_CONFIG = {
url: import.meta.env.VITE_WS_URL || (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host,
  path: '/ws',
  transports: ['websocket'],
  reconnectAttempts: 5,
  reconnectDelay: 1000,
};

// Seat Configuration
export const SEAT_CONFIG = {
  ROWS: 4,
  COLS: 6,
  AISLE_AFTER_COL: 3, // Aisle after this column index (0-based)
};

// Status Constants
export const STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  BUCKLED: 'buckled',
  UNBUCKLED: 'unbuckled',
  IN_SEAT: 'in_seat',
  AWAY: 'away',
};

// Event Names
export const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  SEAT_UPDATED: 'seat_updated',
  BATHROOM_QUEUE_UPDATED: 'bathroom_queue_updated',
  INITIAL_STATE: 'initial_state',
  ERROR: 'error',
  TOGGLE_SEAT_BELT: 'toggle_seat_belt',
  JOIN_BATHROOM_QUEUE: 'join_bathroom_queue',
  LEAVE_BATHROOM_QUEUE: 'leave_bathroom_queue',
  UPDATE_SEAT_STATUS: 'update_seat_status',
  USER_COUNT_UPDATED: 'user_count_updated',
};

// UI Constants
export const UI = {
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
  },
  VIEW: {
    PASSENGER: 'passenger',
    CREW: 'crew',
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'cabin_smart_theme',
  SELECTED_SEAT: 'cabin_smart_selected_seat',
  PASSENGER_NAME: 'cabin_smart_passenger_name',
  VIEW: 'cabin_smart_view',
};

// Default Values
export const DEFAULTS = {
  PASSENGER_NAME: 'Pasajero',
  VIEW: UI.VIEW.PASSENGER,
  THEME: UI.THEME.LIGHT,
};

// Animation Durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
};

// Export all constants as default
export default {
  API_BASE_URL,
  WS_CONFIG,
  SEAT_CONFIG,
  STATUS,
  EVENTS,
  UI,
  STORAGE_KEYS,
  DEFAULTS,
  ANIMATION,
};
