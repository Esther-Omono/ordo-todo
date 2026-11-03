import { describe, it, expect } from 'vitest';
import {
  getFilteredTasks,
  sortTasks,
  getSubtaskProgress,
  getTodayTasks,
  getUpcomingTasks,
  getCompletedTasks,
  getProjectTasks,
} from './taskSelectors';

import { format, addDays, subDays } from 'date-fns';

const tasks = [
  {
    id: '1',
    title: 'Build dashboard',
    description: 'Create the main dashboard',
    priority: 'high',
    projectId: 'project-1',
    completed: false,
    dueDate: '2026-11-05',
    createdAt: '2026-11-03T10:00:00.000Z',
    updatedAt: '2026-11-03T10:00:00.000Z',
    subtasks: [
      { id: 's1', completed: true },
      { id: 's2', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Read documentation',
    description: 'Review React documentation',
    priority: 'low',
    projectId: null,
    completed: true,
    dueDate: null,
    createdAt: '2026-11-02T10:00:00.000Z',
    updatedAt: '2026-11-02T10:00:00.000Z',
    subtasks: [],
  },
];

describe('taskSelectors', () => {
  it('filters tasks by completion status', () => {
    const result = getFilteredTasks(tasks, { status: 'active' });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('searches task titles and descriptions', () => {
    const result = getFilteredTasks(tasks, { search: 'dashboard' });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('sorts tasks by priority', () => {
    const result = sortTasks(tasks, 'priority', 'desc');

    expect(result[0].priority).toBe('high');
    expect(result[1].priority).toBe('low');
  });

  it('calculates subtask progress', () => {
    const result = getSubtaskProgress(tasks[0]);

    expect(result).toEqual({
      total: 2,
      completed: 1,
      percentage: 50,
    });
  });

  it('includes overdue tasks in Today', () => {
    const overdueTask = {
      ...tasks[0],
      dueDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      completed: false,
    };

    const result = getTodayTasks([overdueTask]);

    expect(result).toHaveLength(1);
  });

  it('includes tasks due today in Today', () => {
    const todayTask = {
      ...tasks[0],
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      completed: false,
    };

    const result = getTodayTasks([todayTask]);

    expect(result).toHaveLength(1);
  });

  it('excludes completed tasks from Today', () => {
    const completedTask = {
      ...tasks[0],
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      completed: true,
    };

    expect(getTodayTasks([completedTask])).toHaveLength(0);
  });

  it('includes future tasks in Upcoming', () => {
    const futureTask = {
      ...tasks[0],
      dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      completed: false,
    };

    expect(getUpcomingTasks([futureTask])).toHaveLength(1);
  });

  it('returns only completed tasks', () => {
    expect(getCompletedTasks(tasks)).toHaveLength(1);
  });

  it('filters tasks by project ID', () => {
    const result = getProjectTasks(tasks, 'project-1');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
