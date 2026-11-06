import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isValid,
  parseISO,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns';

const WEEK_OPTIONS = { weekStartsOn: 1 };

function getCompletionDate(task) {
  if (!task.completedAt) return null;

  const date = parseISO(task.completedAt);

  return isValid(date) ? format(date, 'yyyy-MM-dd') : null;
}

// 1. Overall task statistics
export function getTaskStatistics(tasks, referenceDate = new Date()) {
  const today = format(referenceDate, 'yyyy-MM-dd');

  const completed = tasks.filter((task) => task.completed).length;

  const pending = tasks.filter((task) => !task.completed).length;

  const overdue = tasks.filter(
    (task) => !task.completed && task.dueDate && task.dueDate < today,
  ).length;

  const total = tasks.length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  };
}

// 2. Daily completion trend
export function getDailyCompletionTrend(
  tasks,
  days = 7,
  referenceDate = new Date(),
) {
  const endDate = new Date(referenceDate);
  const startDate = subDays(endDate, days - 1);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return calendarDays.map((date) => {
    const dateKey = format(date, 'yyyy-MM-dd');

    const completedCount = tasks.filter(
      (task) => getCompletionDate(task) === dateKey,
    ).length;

    return {
      date: dateKey,
      label: format(date, 'EEE'),
      completed: completedCount,
    };
  });
}

// 3. Weekly completion trend
export function getWeeklyCompletionTrend(
  tasks,
  weeks = 6,
  referenceDate = new Date(),
) {
  return Array.from({ length: weeks }, (_, index) => {
    const weekDate = subWeeks(referenceDate, weeks - index - 1);

    const start = startOfWeek(weekDate, WEEK_OPTIONS);
    const end = endOfWeek(weekDate, WEEK_OPTIONS);

    const startKey = format(start, 'yyyy-MM-dd');
    const endKey = format(end, 'yyyy-MM-dd');

    const completed = tasks.filter((task) => {
      const completionDate = getCompletionDate(task);

      return (
        completionDate && completionDate >= startKey && completionDate <= endKey
      );
    }).length;

    return {
      startDate: startKey,
      endDate: endKey,
      label: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
      completed,
    };
  });
}

// 4. Individual project progress
export function getProjectProgress(projects, tasks) {
  return projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);

    const total = projectTasks.length;

    const completed = projectTasks.filter((task) => task.completed).length;

    return {
      projectId: project.id,
      projectName: project.name,
      projectColor: project.color,
      total,
      completed,
      pending: total - completed,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    };
  });
}
