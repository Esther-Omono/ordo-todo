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
  } = filters;

  const searchTerm = search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);

    const matchesStatus =
      status === 'all' ||
      (status === 'completed' && task.completed) ||
      (status === 'active' && !task.completed);

    const matchesPriority = priority === 'all' || task.priority === priority;

    const matchesProject = projectId === 'all' || task.projectId === projectId;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
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
        // Tasks without a due date should remain at the bottom.
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        comparison = a.dueDate.localeCompare(b.dueDate);
        break;

      case 'updatedAt':
      case 'createdAt':
      default:
        comparison = a[sortBy].localeCompare(b[sortBy]);
        break;
    }

    return direction === 'desc' ? -comparison : comparison;
  });

  return sortedTasks;
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
