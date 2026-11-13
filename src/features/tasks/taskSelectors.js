import {
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  parseISO,
  format,
} from 'date-fns';

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

export function getFilteredTasks(tasks, filters = {}) {
  const {
    search = '',
    status = 'all',
    priority = 'all',
    projectId = 'all',
    labelId = 'all',
    dueDate = 'all',
    dateFrom = '',
    dateTo = '',
  } = filters;

  const searchTerm = search.trim().toLowerCase();
  const today = format(new Date(), 'yyyy-MM-dd');

  return tasks.filter((task) => {
    // Search
    const title = task.title?.toLowerCase() ?? '';
    const description = task.description?.toLowerCase() ?? '';

    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      description.includes(searchTerm);

    // Status
    const matchesStatus =
      status === 'all' ||
      (status === 'completed' && task.completed) ||
      (status === 'active' && !task.completed);

    // Priority
    const matchesPriority = priority === 'all' || task.priority === priority;

    // Project
    const matchesProject = projectId === 'all' || task.projectId === projectId;

    // Label
    const matchesLabel =
      labelId === 'all' || (task.labelIds ?? []).includes(labelId);

    // Due date
    let matchesDueDate = true;

    if (dueDate !== 'all') {
      const taskDueDate = task.dueDate;

      if (!taskDueDate) {
        matchesDueDate = false;
      } else {
        switch (dueDate) {
          case 'today':
            matchesDueDate = taskDueDate === today;
            break;

          case 'upcoming':
            matchesDueDate = taskDueDate > today;
            break;

          case 'overdue':
            matchesDueDate = taskDueDate < today && !task.completed;
            break;

          case 'custom':
            matchesDueDate =
              (!dateFrom || taskDueDate >= dateFrom) &&
              (!dateTo || taskDueDate <= dateTo);
            break;

          default:
            matchesDueDate = true;
        }
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject &&
      matchesLabel &&
      matchesDueDate
    );
  });
}

export function sortTasks(tasks, sortBy = 'createdAt', direction = 'asc') {
  const sortedTasks = [...tasks];

  sortedTasks.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;

      case 'priority':
        comparison =
          (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0);
        break;

      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        comparison = a.dueDate.localeCompare(b.dueDate);
        break;

      case 'updatedAt':
      case 'createdAt':
      default:
        comparison = (a[sortBy] ?? '').localeCompare(b[sortBy] ?? '');
        break;
    }

    return direction === 'desc' ? -comparison : comparison;
  });

  return sortedTasks;
}

export function getTodayTasks(tasks) {
  const today = format(new Date(), 'yyyy-MM-dd');

  return tasks.filter((task) => !task.completed && task.dueDate === today);
}

export function getOverdueTasks(tasks) {
  const today = format(new Date(), 'yyyy-MM-dd');

  return tasks.filter(
    (task) => !task.completed && task.dueDate && task.dueDate < today,
  );
}

export function getUpcomingTasks(tasks) {
  const today = format(new Date(), 'yyyy-MM-dd');

  return tasks.filter(
    (task) => !task.completed && task.dueDate && task.dueDate > today,
  );
}

export function getCompletedTasks(tasks) {
  return tasks.filter((task) => task.completed);
}

export function getAllTasks(tasks) {
  return tasks;
}

export function getProjectTasks(tasks, projectId) {
  return tasks.filter((task) => task.projectId === projectId);
}

export function getSubtaskProgress(task) {
  const subtasks = task.subtasks ?? [];
  const total = subtasks.length;
  const completed = subtasks.filter((subtask) => subtask.completed).length;

  return {
    total,
    completed,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
