import { storageService } from '../../services/storageService';

export const LABELS_STORAGE_KEY = 'ordo-labels';

export function loadLabels() {
  const savedLabels = storageService.get(LABELS_STORAGE_KEY, []);

  return Array.isArray(savedLabels) ? savedLabels : [];
}

export function saveLabels(labels) {
  storageService.set(LABELS_STORAGE_KEY, labels);
}
