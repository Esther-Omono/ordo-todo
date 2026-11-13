import { useCallback, useMemo, useState } from 'react';

import { useTasks } from '../../tasks/useTasks';
import { searchTasks } from '../utils/searchTasks';

export function useTaskSearch() {
  const { tasks } = useTasks();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchTasks(tasks, query), [tasks, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const hasQuery = query.trim().length > 0;

  return {
    query,
    setQuery,
    results,
    clearSearch,
    hasQuery,
    resultCount: results.length,
  };
}
