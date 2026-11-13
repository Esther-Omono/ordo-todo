import { RotateCcw, SlidersHorizontal } from 'lucide-react';

import { Button } from '../../../components/ui';
import { useProjects } from '../../projects/hooks/useProjects';
import { useLabels } from '../../labels/hooks/useLabels';

export default function TaskFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const { projects } = useProjects();
  const { labels } = useLabels();

  const activeFilters = [
    filters.projectId !== 'all',
    filters.labelId !== 'all',
    filters.priority !== 'all',
    filters.status !== 'all',
    filters.dueDate !== 'all',
  ].filter(Boolean).length;

  function handleChange(event) {
    const { name, value } = event.target;
    onFilterChange(name, value);
  }

  return (
    <section className='space-y-4 rounded-xl border border-border bg-surface p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <SlidersHorizontal size={17} />
          <h3 className='text-sm font-semibold text-foreground'>Filters</h3>

          {activeFilters > 0 && (
            <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
              {activeFilters} active
            </span>
          )}
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={onClearFilters}
          disabled={activeFilters === 0}
        >
          <RotateCcw size={14} />
          Clear all
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Project */}
        <FilterSelect
          label='Project'
          name='projectId'
          value={filters.projectId}
          onChange={handleChange}
        >
          <option value='all'>All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </FilterSelect>

        {/* Label */}
        <FilterSelect
          label='Label'
          name='labelId'
          value={filters.labelId}
          onChange={handleChange}
        >
          <option value='all'>All labels</option>
          {labels.map((label) => (
            <option key={label.id} value={label.id}>
              {label.name}
            </option>
          ))}
        </FilterSelect>

        {/* Priority */}
        <FilterSelect
          label='Priority'
          name='priority'
          value={filters.priority}
          onChange={handleChange}
        >
          <option value='all'>All priorities</option>
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </FilterSelect>

        {/* Status */}
        <FilterSelect
          label='Status'
          name='status'
          value={filters.status}
          onChange={handleChange}
        >
          <option value='all'>All statuses</option>
          <option value='active'>Pending</option>
          <option value='completed'>Completed</option>
        </FilterSelect>
      </div>

      {/* Due date */}
      <div className='space-y-2'>
        <label
          htmlFor='filter-due-date'
          className='text-sm font-medium text-foreground'
        >
          Due date
        </label>

        <select
          id='filter-due-date'
          name='dueDate'
          value={filters.dueDate}
          onChange={handleChange}
          className='w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary sm:max-w-xs'
        >
          <option value='all'>Any date</option>
          <option value='today'>Today</option>
          <option value='upcoming'>Upcoming</option>
          <option value='overdue'>Overdue</option>
          <option value='custom'>Custom range</option>
        </select>

        {filters.dueDate === 'custom' && (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md'>
            <div className='space-y-1'>
              <label
                htmlFor='filter-date-from'
                className='text-xs text-muted-foreground'
              >
                From
              </label>
              <input
                id='filter-date-from'
                type='date'
                name='dateFrom'
                value={filters.dateFrom}
                onChange={handleChange}
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
              />
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='filter-date-to'
                className='text-xs text-muted-foreground'
              >
                To
              </label>
              <input
                id='filter-date-to'
                type='date'
                name='dateTo'
                min={filters.dateFrom || undefined}
                value={filters.dateTo}
                onChange={handleChange}
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({ label, name, value, onChange, children }) {
  const id = `task-filter-${name}`;

  return (
    <div className='space-y-1.5'>
      <label
        htmlFor={id}
        className='block text-xs font-medium text-muted-foreground'
      >
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className='w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
      >
        {children}
      </select>
    </div>
  );
}
