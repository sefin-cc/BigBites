import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppProvider } from './context/AppContext';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppProvider>
      <StrictMode>
          <App />
      </StrictMode>
    </AppProvider>
  </Provider>
)
