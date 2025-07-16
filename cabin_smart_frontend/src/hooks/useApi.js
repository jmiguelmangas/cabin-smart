import { useState, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useLoading } from '../context/LoadingContext';
import { API_BASE_URL } from '../config/constants';

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useNotification();
  const { withLoading } = useLoading();

  /**
   * Make an API request
   * @param {string} endpoint - The API endpoint (without the base URL)
   * @param {Object} options - Fetch options (method, headers, body, etc.)
   * @param {Object} config - Additional configuration
   * @param {boolean} config.showLoading - Whether to show loading indicator (default: true)
   * @param {boolean} config.showSuccess - Whether to show success notification (default: false)
   * @param {boolean} config.showError - Whether to show error notification (default: true)
   * @param {string} config.successMessage - Custom success message
   * @param {string} config.errorMessage - Custom error message
   * @returns {Promise<{data: any, error: any}>} - The response data and error
   */
  const request = useCallback(async (endpoint, options = {}, config = {}) => {
    const {
      showLoading = true,
      showSuccess = false,
      showError: showErrorNotification = true,
      successMessage = 'Operación exitosa',
      errorMessage = 'Error en la operación',
    } = config;

    // Skip if already loading
    if (isLoading) return { data: null, error: new Error('Request already in progress') };

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Add base URL if not already included
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
        
        // Set default headers
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Create request options
        const requestOptions = {
          ...options,
          headers,
          credentials: 'include', // Include cookies for authentication
        };

        // Make the request
        const response = await fetch(url, requestOptions);
        
        // Handle non-OK responses
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { message: response.statusText };
          }
          
          const error = new Error(errorData.message || 'Error en la solicitud');
          error.status = response.status;
          error.data = errorData;
          throw error;
        }

        // Parse response data
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Update state
        setData(responseData);
        
        // Show success notification if enabled
        if (showSuccess) {
          showSuccess(successMessage);
        }
        
        return { data: responseData, error: null };
      } catch (err) {
        console.error('API Error:', err);
        setError(err);
        
        // Show error notification if enabled
        if (showErrorNotification) {
          const message = err.data?.message || errorMessage;
          showError(message);
        }
        
        return { data: null, error: err };
      } finally {
        setIsLoading(false);
      }
    };

    // Execute with loading state if enabled
    if (showLoading) {
      return withLoading(fetchData(), { text: 'Cargando...' });
    }
    
    return fetchData();
  }, [isLoading, showError, showSuccess, withLoading]);

  // Helper methods for common HTTP methods
  const get = useCallback((endpoint, config = {}) => 
    request(endpoint, { method: 'GET' }, config), 
    [request]
  );

  const post = useCallback((endpoint, body, config = {}) => 
    request(endpoint, { 
      method: 'POST', 
      body: typeof body === 'object' ? JSON.stringify(body) : body,
    }, config), 
    [request]
  );

  const put = useCallback((endpoint, body, config = {}) => 
    request(endpoint, { 
      method: 'PUT', 
      body: typeof body === 'object' ? JSON.stringify(body) : body,
    }, config), 
    [request]
  );

  const del = useCallback((endpoint, config = {}) => 
    request(endpoint, { method: 'DELETE' }, config), 
    [request]
  );

  const patch = useCallback((endpoint, body, config = {}) => 
    request(endpoint, { 
      method: 'PATCH', 
      body: typeof body === 'object' ? JSON.stringify(body) : body,
    }, config), 
    [request]
  );

  return {
    // State
    data,
    error,
    isLoading,
    
    // Methods
    request,
    get,
    post,
    put,
    delete: del,
    patch,
    
    // Reset state
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
};

export default useApi;
