import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getDay,
  isAfter,
  parseISO,
} from 'date-fns';

function toDate(value) {
  if (!value) return new Date();

  // Parse date-only values consistently as local dates.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return parseISO(value);
}

function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getNextOccurrenceDate(task, fromDate = null) {
  const recurrence = task.recurrence;

  if (!recurrence) return null;

  const baseDate = toDate(fromDate || task.dueDate || new Date());
  const interval = Math.max(1, Number(recurrence.interval) || 1);

  let nextDate;

  switch (recurrence.frequency) {
    case 'daily':
      nextDate = addDays(baseDate, interval);
      break;

    case 'weekly': {
      const days = recurrence.daysOfWeek ?? [];

      if (days.length > 0) {
        // Find the next selected weekday after the current occurrence.
        for (let offset = 1; offset <= 7 * interval; offset += 1) {
          const candidate = addDays(baseDate, offset);

          if (days.includes(getDay(candidate))) {
            nextDate = candidate;
            break;
          }
        }
      } else {
        nextDate = addWeeks(baseDate, interval);
      }

      break;
    }

    case 'monthly':
      nextDate = addMonths(baseDate, interval);
      break;

    case 'custom': {
      const unit = recurrence.unit ?? 'day';

      if (unit === 'week') {
        nextDate = addWeeks(baseDate, interval);
      } else if (unit === 'month') {
        nextDate = addMonths(baseDate, interval);
      } else {
        nextDate = addDays(baseDate, interval);
      }

      break;
    }

    default:
      return null;
  }

  if (!nextDate) return null;

  const nextDateString = toDateString(nextDate);

  if (recurrence.endDate && isAfter(nextDate, toDate(recurrence.endDate))) {
    return null;
  }

  return nextDateString;
}

export function createNextOccurrence(task, nextDate, createTask) {
  return createTask({
    title: task.title,
    description: task.description,
    priority: task.priority,
    projectId: task.projectId,
    labelIds: task.labelIds,
    dueDate: nextDate,
    dueTime: task.dueTime,
    recurrence: task.recurrence,
    recurringSeriesId: task.recurringSeriesId || task.id,
    occurrenceDate: nextDate,
  });
}
