import { describe, expect, it } from 'vitest';
import { getNextOccurrenceDate } from './recurrenceUtils';

describe('getNextOccurrenceDate', () => {
  it('calculates the next daily occurrence', () => {
    const task = {
      dueDate: '2026-11-07',
      recurrence: {
        frequency: 'daily',
        interval: 1,
      },
    };

    expect(getNextOccurrenceDate(task)).toBe('2026-11-08');
  });

  it('calculates a recurring weekly occurrence', () => {
    const task = {
      dueDate: '2026-11-07',
      recurrence: {
        frequency: 'weekly',
        interval: 2,
        daysOfWeek: [],
      },
    };

    expect(getNextOccurrenceDate(task)).toBe('2026-11-21');
  });

  it('uses selected weekdays for weekly recurrence', () => {
    const task = {
      dueDate: '2026-11-07', // Saturday
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      },
    };

    expect(getNextOccurrenceDate(task)).toBe('2026-11-09');
  });

  it('calculates monthly recurrence and handles shorter months', () => {
    const task = {
      dueDate: '2026-01-31',
      recurrence: {
        frequency: 'monthly',
        interval: 1,
      },
    };

    expect(getNextOccurrenceDate(task)).toBe('2026-02-28');
  });

  it('calculates custom recurrence in weeks', () => {
    const task = {
      dueDate: '2026-11-07',
      recurrence: {
        frequency: 'custom',
        interval: 3,
        unit: 'week',
      },
    };

    expect(getNextOccurrenceDate(task)).toBe('2026-11-28');
  });

  it('does not generate an occurrence beyond the end date', () => {
    const task = {
      dueDate: '2026-11-07',
      recurrence: {
        frequency: 'daily',
        interval: 1,
        endDate: '2026-11-07',
      },
    };

    expect(getNextOccurrenceDate(task)).toBeNull();
  });
});
