import { describe, it, expect } from 'vitest';
import { taskReducer } from './taskReducer';

const sampleTask = {
  id: 'task-1',
  title: 'Build Ordo',
  description: '',
  priority: 'high',
  dueDate: null,
  dueTime: null,
  projectId: null,
  completed: false,
  completedAt: null,
  subtasks: [],
  createdAt: '2026-11-03T10:00:00.000Z',
  updatedAt: '2026-11-03T10:00:00.000Z',
};

describe('taskReducer', () => {
  it('adds a task', () => {
    const result = taskReducer([], {
      type: 'ADD_TASK',
      payload: sampleTask,
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Build Ordo');
  });

  it('updates a task without changing its ID', () => {
    const result = taskReducer([sampleTask], {
      type: 'UPDATE_TASK',
      payload: {
        id: 'task-1',
        updates: { title: 'Build the Ordo task engine' },
      },
    });

    expect(result[0].title).toBe('Build the Ordo task engine');
    expect(result[0].id).toBe('task-1');
    expect(result[0].createdAt).toBe(sampleTask.createdAt);
  });

  it('toggles task completion', () => {
    const result = taskReducer([sampleTask], {
      type: 'TOGGLE_TASK_COMPLETION',
      payload: 'task-1',
    });

    expect(result[0].completed).toBe(true);
    expect(result[0].completedAt).toBeTruthy();
  });

  it('deletes a task', () => {
    const result = taskReducer([sampleTask], {
      type: 'DELETE_TASK',
      payload: 'task-1',
    });

    expect(result).toHaveLength(0);
  });

  it('adds a subtask to its parent task', () => {
    const subtask = {
      id: 'subtask-1',
      title: 'Write reducer tests',
      completed: false,
      completedAt: null,
      createdAt: '2026-11-03T10:00:00.000Z',
    };

    const result = taskReducer([sampleTask], {
      type: 'ADD_SUBTASK',
      payload: {
        taskId: 'task-1',
        subtask,
      },
    });

    expect(result[0].subtasks).toHaveLength(1);
    expect(result[0].subtasks[0].title).toBe('Write reducer tests');
  });

  it('toggles subtask completion', () => {
    const taskWithSubtask = {
      ...sampleTask,
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Write tests',
          completed: false,
          completedAt: null,
          createdAt: '2026-11-03T10:00:00.000Z',
        },
      ],
    };

    const result = taskReducer([taskWithSubtask], {
      type: 'TOGGLE_SUBTASK_COMPLETION',
      payload: {
        taskId: 'task-1',
        subtaskId: 'subtask-1',
      },
    });

    expect(result[0].subtasks[0].completed).toBe(true);
    expect(result[0].subtasks[0].completedAt).toBeTruthy();
  });

  it('updates a subtask title', () => {
    const taskWithSubtask = {
      ...sampleTask,
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Old title',
          completed: false,
          completedAt: null,
          createdAt: '2026-11-03T10:00:00.000Z',
        },
      ],
    };

    const result = taskReducer([taskWithSubtask], {
      type: 'UPDATE_SUBTASK',
      payload: {
        taskId: 'task-1',
        subtaskId: 'subtask-1',
        updates: { title: 'New title' },
      },
    });

    expect(result[0].subtasks[0].title).toBe('New title');
  });

  it('deletes a subtask', () => {
    const taskWithSubtask = {
      ...sampleTask,
      subtasks: [
        {
          id: 'subtask-1',
          title: 'Write tests',
          completed: false,
        },
      ],
    };

    const result = taskReducer([taskWithSubtask], {
      type: 'DELETE_SUBTASK',
      payload: {
        taskId: 'task-1',
        subtaskId: 'subtask-1',
      },
    });

    expect(result[0].subtasks).toHaveLength(0);
  });

  it('adds the next occurrence when a recurring task is completed', () => {
    const task = {
      id: 'task-1',
      title: 'Daily planning',
      completed: false,
      recurrence: { frequency: 'daily', interval: 1 },
    };

    const nextTask = {
      id: 'task-2',
      title: 'Daily planning',
      completed: false,
      recurringSeriesId: 'task-1',
      occurrenceDate: '2026-11-08',
    };

    const result = taskReducer([task], {
      type: 'TOGGLE_TASK_COMPLETION',
      payload: {
        id: 'task-1',
        completedAt: '2026-11-07T10:00:00.000Z',
        nextTask,
      },
    });

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1]).toEqual(nextTask);
  });

  it('does not add a duplicate occurrence', () => {
    const task = {
      id: 'task-1',
      title: 'Daily planning',
      completed: false,
    };

    const existingOccurrence = {
      id: 'task-2',
      recurringSeriesId: 'task-1',
      occurrenceDate: '2026-11-08',
    };

    const duplicateOccurrence = {
      id: 'task-3',
      recurringSeriesId: 'task-1',
      occurrenceDate: '2026-11-08',
    };

    const result = taskReducer([task, existingOccurrence], {
      type: 'TOGGLE_TASK_COMPLETION',
      payload: {
        id: 'task-1',
        completedAt: '2026-11-07T10:00:00.000Z',
        nextTask: duplicateOccurrence,
      },
    });

    expect(result).toHaveLength(2);
    expect(result.some((item) => item.id === 'task-3')).toBe(false);
  });

  it('does not generate a successor when a task is unchecked', () => {
    const task = {
      id: 'task-1',
      title: 'Daily planning',
      completed: true,
    };

    const result = taskReducer([task], {
      type: 'TOGGLE_TASK_COMPLETION',
      payload: {
        id: 'task-1',
        nextTask: {
          id: 'task-2',
          recurringSeriesId: 'task-1',
          occurrenceDate: '2026-11-08',
        },
      },
    });

    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(false);
  });
});
