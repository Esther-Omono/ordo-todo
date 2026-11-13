import { useCallback, useMemo, useState } from 'react';

import { TaskDetailsContext } from './taskDetailsContext';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../../projects/hooks/useProjects';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';

export function TaskDetailsProvider({ children }) {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  const openTaskDetails = useCallback((taskOrId) => {
    const taskId = typeof taskOrId === 'object' ? taskOrId?.id : taskOrId;

    if (taskId) {
      setSelectedTaskId(taskId);
    }
  }, []);

  const closeTaskDetails = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedTask,
      openTaskDetails,
      closeTaskDetails,
    }),
    [selectedTask, openTaskDetails, closeTaskDetails],
  );

  return (
    <TaskDetailsContext.Provider value={value}>
      {children}

      <TaskDetailsDrawer
        task={selectedTask}
        onClose={closeTaskDetails}
        projects={projects}
      />
    </TaskDetailsContext.Provider>
  );
}
