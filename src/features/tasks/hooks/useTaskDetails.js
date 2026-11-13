import { useContext } from 'react';
import { TaskDetailsContext } from '../context/taskDetailsContext';

export function useTaskDetails() {
  const context = useContext(TaskDetailsContext);

  if (!context) {
    throw new Error('useTaskDetails must be used within TaskDetailsProvider');
  }

  return context;
}
