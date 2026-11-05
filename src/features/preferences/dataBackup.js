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
