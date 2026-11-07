import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';

const WEEK_OPTIONS = { weekStartsOn: 1 };

export {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
};

function toDate(value) {
  // 1. Return null immediately if the value is missing
  if (value === null || value === undefined || value === '') return null;

  // 2. If it's already a Date object, just return it
  if (value instanceof Date) {
    return value;
  }

  // 3. If it's a timestamp number (e.g., 1793836800000), convert it to a Date
  if (typeof value === 'number') {
    return new Date(value);
  }

  // 4. If it's a string, handle your custom YYYY-MM-DD parsing or fallback to parseISO
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return parseISO(value);
  }

  // 5. Ultimate fallback for unexpected types
  return new Date(value);
}

function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getMonthDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return eachDayOfInterval({
    start: startOfWeek(monthStart, WEEK_OPTIONS),
    end: endOfWeek(monthEnd, WEEK_OPTIONS),
  });
}

export function getWeekDays(date) {
  return eachDayOfInterval({
    start: startOfWeek(date, WEEK_OPTIONS),
    end: endOfWeek(date, WEEK_OPTIONS),
  });
}

/**
 * Determines whether a recurring task occurs on a given date.
 */
export function isRecurringTaskOnDate(task, date) {
  const recurrence = task.recurrence;

  if (!recurrence || !task.dueDate) return false;

  const startDate = toDate(task.dueDate);
  const targetDate = toDate(date);

  if (!startDate || !targetDate || targetDate < startDate) {
    return false;
  }

  if (recurrence.endDate && isAfter(targetDate, toDate(recurrence.endDate))) {
    return false;
  }

  const interval = Math.max(1, Number(recurrence.interval) || 1);

  const daysDifference = Math.round((targetDate - startDate) / 86400000);

  switch (recurrence.frequency) {
    case 'daily':
      return daysDifference % interval === 0;

    case 'weekly': {
      const daysOfWeek = recurrence.daysOfWeek ?? [];

      if (daysOfWeek.length > 0) {
        const weeksDifference = Math.floor(daysDifference / 7);

        return (
          weeksDifference % interval === 0 &&
          daysOfWeek.includes(getDay(targetDate))
        );
      }

      const weeksDifference = Math.floor(daysDifference / 7);

      return (
        weeksDifference % interval === 0 &&
        getDay(targetDate) === getDay(startDate)
      );
    }

    case 'monthly': {
      const monthsDifference =
        (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
        targetDate.getMonth() -
        startDate.getMonth();

      return (
        monthsDifference >= 0 &&
        monthsDifference % interval === 0 &&
        targetDate.getDate() === startDate.getDate()
      );
    }

    case 'custom': {
      const unit = recurrence.unit ?? 'day';

      if (unit === 'week') {
        return daysDifference % (interval * 7) === 0;
      }

      if (unit === 'month') {
        const monthsDifference =
          (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
          targetDate.getMonth() -
          startDate.getMonth();

        return (
          monthsDifference >= 0 &&
          monthsDifference % interval === 0 &&
          targetDate.getDate() === startDate.getDate()
        );
      }

      return daysDifference % interval === 0;
    }

    default:
      return false;
  }
}

export function getTasksForDate(tasks, date) {
  const dateString = toDateString(date);

  return tasks.filter((task) => {
    if (task.dueDate === dateString) return true;

    if (!task.recurrence) return false;

    // A completed occurrence represents only its own date.
    if (task.completed && task.dueDate !== dateString) {
      return false;
    }

    // Only the original occurrence drives the recurring calendar.
    if (task.recurringSeriesId && task.recurringSeriesId !== task.id) {
      return false;
    }

    return isRecurringTaskOnDate(task, date);
  });
}

export function getTasksForMonth(tasks, date) {
  const month = format(date, 'yyyy-MM');

  return tasks.filter((task) => task.dueDate?.startsWith(month));
}

export function getTasksForWeek(tasks, date) {
  const dates = new Set(
    getWeekDays(date).map((day) => format(day, 'yyyy-MM-dd')),
  );

  return tasks.filter((task) => task.dueDate && dates.has(task.dueDate));
}
