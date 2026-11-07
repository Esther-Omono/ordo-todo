import { getCurrentTimestamp } from './taskUtils';

export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];

    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              ...action.payload.updates,
              id: task.id,
              createdAt: task.createdAt,
              updatedAt: getCurrentTimestamp(),
            }
          : task,
      );

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);

    case 'TOGGLE_TASK_COMPLETION': {
      const { id, completedAt, nextTask } =
        typeof action.payload === 'string'
          ? { id: action.payload, completedAt: null, nextTask: null }
          : action.payload;

      const task = state.find((item) => item.id === id);

      if (!task) return state;

      const completed = !task.completed;

      const updatedTasks = state.map((item) =>
        item.id === id
          ? {
              ...item,
              completed,
              completedAt: completed
                ? (completedAt ?? getCurrentTimestamp())
                : null,
              updatedAt: getCurrentTimestamp(),
            }
          : item,
      );

      if (!completed || !nextTask) return updatedTasks;

      // Prevent duplicate occurrences if a task is unchecked and completed again.
      const alreadyExists = updatedTasks.some(
        (item) =>
          item.recurringSeriesId === nextTask.recurringSeriesId &&
          item.occurrenceDate === nextTask.occurrenceDate,
      );

      return alreadyExists ? updatedTasks : [...updatedTasks, nextTask];
    }

    case 'ADD_SUBTASK':
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: [...task.subtasks, action.payload.subtask],
              updatedAt: getCurrentTimestamp(),
            }
          : task,
      );

    case 'UPDATE_SUBTASK':
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === action.payload.subtaskId
                  ? { ...subtask, ...action.payload.updates }
                  : subtask,
              ),
              updatedAt: getCurrentTimestamp(),
            }
          : task,
      );

    case 'DELETE_SUBTASK':
      return state.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask.id !== action.payload.subtaskId,
              ),
              updatedAt: getCurrentTimestamp(),
            }
          : task,
      );

    case 'TOGGLE_SUBTASK_COMPLETION':
      return state.map((task) => {
        if (task.id !== action.payload.taskId) return task;

        return {
          ...task,
          subtasks: task.subtasks.map((subtask) => {
            if (subtask.id !== action.payload.subtaskId) return subtask;

            const completed = !subtask.completed;

            return {
              ...subtask,
              completed,
              completedAt: completed ? getCurrentTimestamp() : null,
            };
          }),
          updatedAt: getCurrentTimestamp(),
        };
      });

    case 'LOAD_TASKS':
      return action.payload;

    default:
      return state;
  }
}
