import { describe, it, expect } from 'vitest';

import {
  getTaskStatistics,
  getDailyCompletionTrend,
  getWeeklyCompletionTrend,
  getProjectProgress,
} from './productivityUtils';

const referenceDate = new Date(2026, 10, 6, 12);

const tasks = [
  {
    id: '1',
    title: 'Task one',
    projectId: 'p1',
    dueDate: '2026-11-03',
    completed: true,
    completedAt: '2026-10-30T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task two',
    projectId: 'p1',
    dueDate: '2026-11-10',
    completed: false,
    completedAt: null,
  },
  {
    id: '3',
    title: 'Task three',
    projectId: 'p2',
    dueDate: '2026-11-05',
    completed: false,
    completedAt: null,
  },
  {
    id: '4',
    title: 'Task four',
    projectId: 'p2',
    dueDate: null,
    completed: true,
    completedAt: '2026-11-06T12:00:00.000Z',
  },
  {
    id: '5',
    title: 'Task five',
    projectId: null,
    dueDate: '2026-11-01',
    completed: false,
    completedAt: null,
  },
];

const projects = [
  { id: 'p1', name: 'Project One', color: '#8B5CF6' },
  { id: 'p2', name: 'Project Two', color: '#6366F1' },
  { id: 'p3', name: 'Empty Project', color: '#3B82F6' },
];

describe('Productivity utilities', () => {
  describe('getTaskStatistics', () => {
    it('calculates overall task statistics', () => {
      const result = getTaskStatistics(tasks, referenceDate);

      expect(result).toEqual({
        total: 5,
        completed: 2,
        pending: 3,
        overdue: 2,
        completionRate: 40,
      });
    });

    it('returns zero completion rate when there are no tasks', () => {
      const result = getTaskStatistics([], referenceDate);

      expect(result.completionRate).toBe(0);
      expect(result.total).toBe(0);
    });

    it('does not count completed overdue tasks as overdue', () => {
      const result = getTaskStatistics(tasks, referenceDate);

      expect(result.overdue).toBe(2);
    });
  });

  describe('getDailyCompletionTrend', () => {
    it('returns the requested number of days', () => {
      const result = getDailyCompletionTrend(tasks, 3, referenceDate);

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2026-11-04');
      expect(result[2].date).toBe('2026-11-06');
    });

    it('counts completed tasks on their completion dates', () => {
      const result = getDailyCompletionTrend(tasks, 3, referenceDate);

      expect(result[0].completed).toBe(0);
      expect(result[1].completed).toBe(0);
      expect(result[2].completed).toBe(1);
    });
  });

  describe('getWeeklyCompletionTrend', () => {
    it('returns the requested number of weeks', () => {
      const result = getWeeklyCompletionTrend(tasks, 2, referenceDate);

      expect(result).toHaveLength(2);
    });

    it('counts completed tasks within each week', () => {
      const result = getWeeklyCompletionTrend(tasks, 2, referenceDate);

      expect(result[0].completed).toBe(1);
      expect(result[1].completed).toBe(1);
    });

    it('uses Monday as the beginning of each week', () => {
      const result = getWeeklyCompletionTrend(tasks, 2, referenceDate);

      expect(result[0].startDate).toBe('2026-10-26');
      expect(result[1].startDate).toBe('2026-11-02');
    });
  });

  describe('getProjectProgress', () => {
    it('calculates progress for each project', () => {
      const result = getProjectProgress(projects, tasks);

      expect(result).toHaveLength(3);

      expect(result[0]).toMatchObject({
        projectId: 'p1',
        total: 2,
        completed: 1,
        pending: 1,
        completionRate: 50,
      });
    });

    it('returns zero progress for projects without tasks', () => {
      const result = getProjectProgress(projects, tasks);

      expect(result[2]).toMatchObject({
        projectId: 'p3',
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
      });
    });
  });
});
