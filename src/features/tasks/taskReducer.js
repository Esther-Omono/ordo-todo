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

    case 'TOGGLE_TASK_COMPLETION':
      return state.map((task) => {
        if (task.id !== action.payload) return task;

        const completed = !task.completed;

        return {
          ...task,
          completed,
          completedAt: completed ? getCurrentTimestamp() : null,
          updatedAt: getCurrentTimestamp(),
        };
      });

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
