import {
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

export function getMonthDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const calendarStart = startOfWeek(monthStart, WEEK_OPTIONS);

  const calendarEnd = endOfWeek(monthEnd, WEEK_OPTIONS);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
}

export function getWeekDays(date) {
  const start = startOfWeek(date, WEEK_OPTIONS);
  const end = endOfWeek(date, WEEK_OPTIONS);

  return eachDayOfInterval({ start, end });
}

export function getTasksForDate(tasks, date) {
  const dateString = format(date, 'yyyy-MM-dd');

  return tasks.filter((task) => task.dueDate === dateString);
}

export function getTasksForMonth(tasks, date) {
  const month = format(date, 'yyyy-MM');

  return tasks.filter((task) => task.dueDate?.startsWith(month));
}

export function getTasksForWeek(tasks, date) {
  const weekDays = getWeekDays(date);

  const dates = new Set(weekDays.map((day) => format(day, 'yyyy-MM-dd')));

  return tasks.filter((task) => task.dueDate && dates.has(task.dueDate));
}
