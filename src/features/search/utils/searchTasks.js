export function searchTasks(tasks = [], query = '') {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  return tasks.filter((task) => {
    const searchableText = [task.title, task.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchTerms.every((term) => searchableText.includes(term));
  });
}
