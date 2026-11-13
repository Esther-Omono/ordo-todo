import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PreferencesProvider } from './features/preferences/context/PreferencesProvider.jsx';
import { TaskProvider } from './features/tasks/context/TaskProvider.jsx';
import { LabelProvider } from './features/labels/context/LabelProvider.jsx';
import { ProjectProvider } from './features/projects/context/ProjectProvider.jsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <TaskProvider>
        <LabelProvider>
          <ProjectProvider>
            <App />
            <Toaster
              position='top-right'
              richColors
              closeButton
              duration={4000}
            />
          </ProjectProvider>
        </LabelProvider>
      </TaskProvider>
    </PreferencesProvider>
  </StrictMode>,
);
