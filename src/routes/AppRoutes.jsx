import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Today } from '../pages/Today';
import { Upcoming } from '../pages/Upcoming';
import { AllTasks } from '../pages/AllTasks';
import { Completed } from '../pages/Completed';
import { Projects } from '../pages/Projects';
import { ProjectDetails } from '../pages/ProjectDetails';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/today' replace />} />

        <Route path='/today' element={<Today />} />
        <Route path='/upcoming' element={<Upcoming />} />
        <Route path='/tasks' element={<AllTasks />} />
        <Route path='/completed' element={<Completed />} />

        <Route path='/projects' element={<Projects />} />
        <Route path='/projects/:projectId' element={<ProjectDetails />} />

        <Route path='/settings' element={<Settings />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
