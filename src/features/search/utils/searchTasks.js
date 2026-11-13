export function searchTasks(tasks, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return tasks.filter((task) => {
    const title = task.title?.toLowerCase() ?? '';
    const description = task.description?.toLowerCase() ?? '';

    return (
      title.includes(normalizedQuery) || description.includes(normalizedQuery)
    );
  });
}
