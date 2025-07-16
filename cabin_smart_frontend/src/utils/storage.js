/**
 * Storage utility for handling localStorage operations with type safety and error handling
 */

const STORAGE_KEYS = {
  USER_PREFERENCES: 'cabin_smart_user_prefs',
  SEAT_SELECTION: 'cabin_smart_seat_selection',
  VIEW_MODE: 'cabin_smart_view_mode',
};

/**
 * Safely get an item from localStorage
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if the key doesn't exist or parsing fails
 * @returns {*} The stored value or defaultValue
 */
const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Try to parse as JSON, return as is if it fails
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage
 * @param {string} key - The key to set
 * @param {*} value - The value to store (will be stringified)
 */
const setItem = (key, value) => {
  try {
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
  }
};

/**
 * Clear all items from localStorage
 */
const clear = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Get user preferences
 * @returns {Object} User preferences object
 */
const getUserPreferences = () => {
  return getItem(STORAGE_KEYS.USER_PREFERENCES, {});
};

/**
 * Save user preferences
 * @param {Object} prefs - Preferences to save
 */
const saveUserPreferences = (prefs) => {
  setItem(STORAGE_KEYS.USER_PREFERENCES, prefs);
};

/**
 * Get saved seat selection
 * @returns {string|null} The selected seat ID or null
 */
const getSavedSeat = () => {
  return getItem(STORAGE_KEYS.SEAT_SELECTION, null);
};

/**
 * Save seat selection
 * @param {string} seatId - The seat ID to save
 */
const saveSeatSelection = (seatId) => {
  setItem(STORAGE_KEYS.SEAT_SELECTION, seatId);
};

/**
 * Get saved view mode (passenger or crew)
 * @returns {string} The view mode ('passenger' or 'crew')
 */
const getViewMode = () => {
  return getItem(STORAGE_KEYS.VIEW_MODE, 'passenger');
};

/**
 * Save view mode
 * @param {string} mode - The view mode to save ('passenger' or 'crew')
 */
const saveViewMode = (mode) => {
  if (['passenger', 'crew'].includes(mode)) {
    setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }
};

// Export all the functions
export {
  STORAGE_KEYS,
  getItem,
  setItem,
  removeItem,
  clear,
  getUserPreferences,
  saveUserPreferences,
  getSavedSeat,
  saveSeatSelection,
  getViewMode,
  saveViewMode,
};
