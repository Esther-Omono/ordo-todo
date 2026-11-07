import { describe, it, expect } from 'vitest';
import {
  getMonthDays,
  getWeekDays,
  getTasksForDate,
  getTasksForMonth,
  getTasksForWeek,
} from './calendarUtils';

const tasks = [
  {
    id: '1',
    title: 'Task one',
    dueDate: '2026-11-03',
    completed: false,
  },
  {
    id: '2',
    title: 'Task two',
    dueDate: '2026-11-04',
    completed: true,
  },
  {
    id: '3',
    title: 'Task three',
    dueDate: '2026-12-01',
    completed: false,
  },
  {
    id: '4',
    title: 'Undated task',
    dueDate: null,
    completed: false,
  },
];

describe('Calendar utilities', () => {
  it('returns all days required for a monthly calendar grid', () => {
    const days = getMonthDays(new Date(2026, 10, 3));

    expect(days).toHaveLength(42);
    expect(days[0].getDay()).toBe(1);
    expect(days[41].getDay()).toBe(0);
  });

  it('returns seven days starting Monday', () => {
    const days = getWeekDays(new Date(2026, 10, 3));

    expect(days).toHaveLength(7);
    expect(days[0].getDay()).toBe(1);
    expect(days[6].getDay()).toBe(0);
  });

  it('returns tasks due on a specific date', () => {
    const result = getTasksForDate(tasks, new Date(2026, 10, 3));

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns tasks belonging to a specific month', () => {
    const result = getTasksForMonth(tasks, new Date(2026, 10, 3));

    expect(result).toHaveLength(2);
  });

  it('returns tasks belonging to a specific week', () => {
    const result = getTasksForWeek(tasks, new Date(2026, 10, 3));

    expect(result).toHaveLength(2);
  });

  it('excludes tasks without due dates', () => {
    const result = getTasksForMonth(tasks, new Date(2026, 10, 3));

    expect(result.every((task) => task.dueDate)).toBe(true);
  });

  it('shows a monthly recurring task in subsequent months', () => {
    const recurringTask = {
      id: 'monthly-1',
      title: 'Pay rent',
      dueDate: '2026-11-05',
      completed: false,
      recurrence: {
        frequency: 'monthly',
        interval: 1,
        endDate: null,
      },
    };

    expect(
      getTasksForDate([recurringTask], new Date(2026, 10, 5)),
    ).toHaveLength(1);

    expect(
      getTasksForDate([recurringTask], new Date(2026, 11, 5)),
    ).toHaveLength(1);

    expect(getTasksForDate([recurringTask], new Date(2027, 0, 5))).toHaveLength(
      1,
    );
  });

  it('does not show monthly recurring tasks on the wrong day', () => {
    const recurringTask = {
      id: 'monthly-1',
      dueDate: '2026-11-05',
      completed: false,
      recurrence: {
        frequency: 'monthly',
        interval: 1,
      },
    };

    expect(
      getTasksForDate([recurringTask], new Date(2026, 11, 6)),
    ).toHaveLength(0);
  });

  it('respects the recurrence end date', () => {
    const recurringTask = {
      id: 'monthly-1',
      dueDate: '2026-11-05',
      completed: false,
      recurrence: {
        frequency: 'monthly',
        interval: 1,
        endDate: '2026-12-05',
      },
    };

    expect(getTasksForDate([recurringTask], new Date(2027, 0, 5))).toHaveLength(
      0,
    );
  });

  it('does not show completed occurrences on future dates', () => {
    const recurringTask = {
      id: 'monthly-1',
      dueDate: '2026-11-05',
      completed: true,
      recurrence: {
        frequency: 'monthly',
        interval: 1,
      },
    };

    expect(
      getTasksForDate([recurringTask], new Date(2026, 11, 5)),
    ).toHaveLength(0);
  });
});
