import { useEffect, useReducer } from 'react';
import { TaskContext } from './taskContext';
import { taskReducer } from './taskReducer';
import { createTask, createSubtask } from './taskUtils';
import { storageService } from '../../services/storageService';

export const TASKS_STORAGE_KEY = 'ordo-tasks';

function getInitialTasks() {
  const savedTasks = storageService.get(TASKS_STORAGE_KEY, []);

  return Array.isArray(savedTasks) ? savedTasks : [];
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, getInitialTasks);

  useEffect(() => {
    storageService.set(TASKS_STORAGE_KEY, tasks);
  }, [tasks]);

  function addTask(fields) {
    const task = createTask(fields);

    dispatch({
      type: 'ADD_TASK',
      payload: task,
    });

    return task.id;
  }

  function updateTask(id, updates) {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id, updates },
    });
  }

  function deleteTask(id) {
    dispatch({
      type: 'DELETE_TASK',
      payload: id,
    });
  }

  function toggleTaskCompletion(id) {
    dispatch({
      type: 'TOGGLE_TASK_COMPLETION',
      payload: id,
    });
  }

  function addSubtask(taskId, title) {
    if (!title.trim()) return;

    dispatch({
      type: 'ADD_SUBTASK',
      payload: {
        taskId,
        subtask: createSubtask(title),
      },
    });
  }

  function updateSubtask(taskId, subtaskId, updates) {
    dispatch({
      type: 'UPDATE_SUBTASK',
      payload: { taskId, subtaskId, updates },
    });
  }

  function deleteSubtask(taskId, subtaskId) {
    dispatch({
      type: 'DELETE_SUBTASK',
      payload: { taskId, subtaskId },
    });
  }

  function toggleSubtaskCompletion(taskId, subtaskId) {
    dispatch({
      type: 'TOGGLE_SUBTASK_COMPLETION',
      payload: { taskId, subtaskId },
    });
  }

  function replaceTasks(tasks) {
    dispatch({
      type: 'LOAD_TASKS',
      payload: tasks,
    });
  }

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtaskCompletion,
    replaceTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
