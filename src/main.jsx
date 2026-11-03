import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PreferencesProvider } from './features/preferences/PreferencesContext.jsx';
import { TaskProvider } from './features/tasks/TaskProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </PreferencesProvider>
  </StrictMode>,
);
