const STORAGE_KEY = 'ordo-projects';

export function loadProjects() {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}
