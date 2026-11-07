export function generateId() {
  return crypto.randomUUID();
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}

export function createSubtask(title) {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId(),
    title: title.trim(),
    completed: false,
    completedAt: null,
    createdAt: timestamp,
  };
}

export function createTask(fields = {}) {
  const timestamp = getCurrentTimestamp();
  const id = generateId();

  return {
    id,
    title: fields.title?.trim() ?? '',
    description: fields.description ?? '',
    priority: fields.priority ?? 'medium',
    dueDate: fields.dueDate ?? null,
    dueTime: fields.dueTime ?? null,
    projectId: fields.projectId ?? null,
    labelIds: Array.isArray(fields.labelIds)
      ? [...new Set(fields.labelIds)]
      : [],
    completed: false,
    completedAt: null,
    subtasks: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    recurrence: fields.recurrence ?? null,
    recurringSeriesId: fields.recurrence
      ? (fields.recurringSeriesId ?? id)
      : null,
    occurrenceDate: fields.recurrence
      ? (fields.occurrenceDate ?? fields.dueDate ?? null)
      : null,
  };
}
