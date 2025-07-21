// App.test.jsx
import { render, screen } from '@testing-library/react';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { LoadingProvider } from './context/LoadingContext';

test('renders CabinSmart app', () => {
  render(
    <LoadingProvider>
      <NotificationProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </NotificationProvider>
    </LoadingProvider>
  );
  const appTitle = screen.getByRole('heading', { name: /CabinSmart/i });
  expect(appTitle).toBeInTheDocument();
});

