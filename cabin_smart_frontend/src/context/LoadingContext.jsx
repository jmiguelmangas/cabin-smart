import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../components/common/Loading';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const startLoading = useCallback(({ id, text = 'Cargando...', fullScreen = false, overlay = false } = {}) => {
    const loadingId = id || uuidv4();
    
    setLoadingStates(prev => ({
      ...prev,
      [loadingId]: { text, fullScreen, overlay, isLoading: true }
    }));
    
    return loadingId;
  }, []);

  const stopLoading = useCallback((id) => {
    if (!id) return;
    
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  }, []);

  const withLoading = useCallback(async (promise, options = {}) => {
    const { id, text, fullScreen, overlay } = options;
    const loadingId = startLoading({ id, text, fullScreen, overlay });
    
    try {
      const result = await promise;
      return result;
    } catch (error) {
      console.error('Error in withLoading:', error);
      throw error;
    } finally {
      stopLoading(loadingId);
    }
  }, [startLoading, stopLoading]);

  const isLoading = Object.values(loadingStates).some(state => state.isLoading);
  const fullScreenLoading = Object.values(loadingStates).find(state => state.isLoading && state.fullScreen);
  const overlayLoadings = Object.entries(loadingStates)
    .filter(([_, state]) => state.isLoading && state.overlay && !state.fullScreen);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, withLoading, isLoading }}>
      {children}
      
      {/* Fullscreen loading */}
      {fullScreenLoading && (
        <div className="global-loading-container">
          <Loading 
            size="lg" 
            text={fullScreenLoading.text} 
            fullScreen 
          />
        </div>
      )}
      
      {/* Overlay loadings */}
      {overlayLoadings.map(([id, state]) => (
        <div key={id} className="loading-overlay-wrapper">
          <Loading 
            size="md" 
            text={state.text} 
            overlay 
          />
        </div>
      ))}
      
      <style jsx global>{`
        .global-loading-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2000;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .loading-overlay-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          pointer-events: none;
        }
      `}</style>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
