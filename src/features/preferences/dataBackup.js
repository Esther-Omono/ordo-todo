import { storageService, PREFERENCES_KEY } from '../../services/storageService';
import { TASKS_STORAGE_KEY } from '../tasks/TaskProvider';

const PROJECTS_STORAGE_KEY = 'ordo-projects';

export function createBackup() {
  return {
    app: 'Ordo',
    version: 1,
    exportedAt: new Date().toISOString(),

    data: {
      tasks: storageService.get(TASKS_STORAGE_KEY, []),
      projects: storageService.get(PROJECTS_STORAGE_KEY, []),
      preferences: storageService.get(PREFERENCES_KEY, {
        theme: 'light',
        dateFormat: 'DD/MM/YYYY',
        weekStartsOn: 1,
        defaultPriority: 'medium',
      }),
    },
  };
}

export function exportBackup() {
  const backup = createBackup();

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `ordo-backup-${new Date().toISOString().slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  URL.revokeObjectURL(url);
}

const SUPPORTED_BACKUP_VERSION = 1;

export function validateBackup(backup) {
  const errors = [];

  if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
    return {
      valid: false,
      errors: ['Invalid backup file.'],
    };
  }

  if (
    typeof backup.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(backup.exportedAt))
  ) {
    errors.push('Invalid backup export date.');
  }

  if (backup.app !== 'Ordo') {
    errors.push('This file is not an Ordo backup.');
  }

  if (backup.version !== SUPPORTED_BACKUP_VERSION) {
    errors.push('Unsupported backup version.');
  }

  if (!backup.data || typeof backup.data !== 'object') {
    errors.push('Backup data is missing.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const { tasks, projects, preferences } = backup.data;

  if (!Array.isArray(tasks)) {
    errors.push('Tasks data must be an array.');
  }

  if (!Array.isArray(projects)) {
    errors.push('Projects data must be an array.');
  }

  if (
    !preferences ||
    typeof preferences !== 'object' ||
    Array.isArray(preferences)
  ) {
    errors.push('Preferences data is invalid.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const projectIds = new Set();

  projects.forEach((project, index) => {
    if (
      !project ||
      typeof project.id !== 'string' ||
      !project.id.trim() ||
      typeof project.name !== 'string' ||
      !project.name.trim()
    ) {
      errors.push(`Project ${index + 1} has invalid data.`);
      return;
    }

    if (projectIds.has(project.id)) {
      errors.push(`Duplicate project ID: ${project.id}`);
    }

    projectIds.add(project.id);
  });

  const taskIds = new Set();

  tasks.forEach((task, index) => {
    if (
      !task ||
      typeof task.id !== 'string' ||
      !task.id.trim() ||
      typeof task.title !== 'string' ||
      !task.title.trim() ||
      !['low', 'medium', 'high'].includes(task.priority) ||
      typeof task.completed !== 'boolean' ||
      !Array.isArray(task.subtasks)
    ) {
      errors.push(`Task ${index + 1} has invalid data.`);
      return;
    }

    if (taskIds.has(task.id)) {
      errors.push(`Duplicate task ID: ${task.id}`);
    }

    taskIds.add(task.id);

    if (
      task.projectId !== null &&
      task.projectId !== undefined &&
      !projectIds.has(task.projectId)
    ) {
      errors.push(`Task "${task.title}" references an invalid project.`);
    }

    task.subtasks.forEach((subtask, subtaskIndex) => {
      if (
        !subtask ||
        typeof subtask.id !== 'string' ||
        !subtask.id.trim() ||
        typeof subtask.title !== 'string' ||
        !subtask.title.trim() ||
        typeof subtask.completed !== 'boolean'
      ) {
        errors.push(
          `Task ${index + 1}, subtask ${subtaskIndex + 1} is invalid.`,
        );
      }
    });
  });

  if (!['light', 'dark'].includes(preferences.theme)) {
    errors.push('Invalid theme preference.');
  }

  if (
    !['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].includes(preferences.dateFormat)
  ) {
    errors.push('Invalid date format preference.');
  }

  if (![0, 1, 6].includes(preferences.weekStartsOn)) {
    errors.push('Invalid week-start preference.');
  }

  if (!['low', 'medium', 'high'].includes(preferences.defaultPriority)) {
    errors.push('Invalid default priority preference.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function readBackupFile(file) {
  if (!file) {
    throw new Error('Please select a backup file.');
  }

  if (!file.name.toLowerCase().endsWith('.json')) {
    throw new Error('Please select a valid JSON backup file.');
  }

  let backup;

  try {
    const content = await file.text();
    backup = JSON.parse(content);
  } catch {
    throw new Error('The selected file contains invalid JSON.');
  }

  const validation = validateBackup(backup);

  if (!validation.valid) {
    throw new Error(validation.errors.join('\n'));
  }

  return backup;
}
