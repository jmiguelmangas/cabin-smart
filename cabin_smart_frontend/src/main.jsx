import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { WebSocketProvider } from './context/WebSocketContext';
import './index.css';
import './styles/notification.css';
import './styles/loading.css';
import './styles/header.css';
import './styles/cabin.css';
import './styles/crew.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </NotificationProvider>
    </LoadingProvider>
  </StrictMode>,
);
