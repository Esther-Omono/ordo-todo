import { useCallback, useMemo, useState } from 'react';

import { useTasks } from '../../tasks/hooks/useTasks';
import { getFilteredTasks } from '../taskSelectors';

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  labelId: 'all',
  dueDate: 'all',
  dateFrom: '',
  dateTo: '',
};

export function useTaskFilters() {
  const { tasks } = useTasks();

  const [filters, setFilters] = useState(initialFilters);

  // Update an individual filter.
  const updateFilter = useCallback((name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }, []);

  // Reset every filter to its initial value.
  const clearFilters = useCallback(() => {
    setFilters({ ...initialFilters });
  }, []);

  // Apply the current filters to the task collection.
  const filteredTasks = useMemo(
    () => getFilteredTasks(tasks, filters),
    [tasks, filters],
  );

  // Count active filter categories, not individual selected values.
  const activeFilterCount = useMemo(() => {
    return [
      filters.search.trim() !== '',
      filters.status !== 'all',
      filters.priority !== 'all',
      filters.projectId !== 'all',
      filters.labelId !== 'all',
      filters.dueDate !== 'all',
    ].filter(Boolean).length;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    filteredTasks,
    updateFilter,
    clearFilters,
    activeFilterCount,
    hasActiveFilters,
  };
}
