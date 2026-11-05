import { describe, it, expect } from 'vitest';

import {
  formatPreferenceDate,
  formatPreferenceDateTime,
} from './dateFormatting';

describe('Date formatting utilities', () => {
  const date = new Date(2026, 10, 5, 14, 30);

  it('formats dates as DD/MM/YYYY', () => {
    expect(formatPreferenceDate(date, 'DD/MM/YYYY')).toBe('05/11/2026');
  });

  it('formats dates as MM/DD/YYYY', () => {
    expect(formatPreferenceDate(date, 'MM/DD/YYYY')).toBe('11/05/2026');
  });

  it('formats dates as YYYY-MM-DD', () => {
    expect(formatPreferenceDate(date, 'YYYY-MM-DD')).toBe('2026-11-05');
  });

  it('uses DD/MM/YYYY as the default format', () => {
    expect(formatPreferenceDate(date)).toBe('05/11/2026');
  });

  it('formats date and time correctly', () => {
    expect(formatPreferenceDateTime(date, 'DD/MM/YYYY')).toBe(
      '05/11/2026, 14:30',
    );
  });

  it('returns an empty string for missing dates', () => {
    expect(formatPreferenceDate(null)).toBe('');
  });

  it('returns an empty string for invalid dates', () => {
    expect(formatPreferenceDate('invalid-date')).toBe('');
  });
});
