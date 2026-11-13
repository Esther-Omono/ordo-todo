import { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

import { Button } from '../../../components/ui';
import { useProjects } from '../../projects/hooks/useProjects';
import { useLabels } from '../../labels/hooks/useLabels';

export default function TaskFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);

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

  function handleClear() {
    onClearFilters();
  }

  return (
    <div className='relative'>
      {/* Dropdown trigger */}
      <div className='flex items-center gap-2'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
          aria-haspopup='true'
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilters > 0 && (
            <span className='flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white'>
              {activeFilters}
            </span>
          )}
          <ChevronDown
            size={15}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        {activeFilters > 0 && (
          <button
            type='button'
            onClick={handleClear}
            className='text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className='absolute right-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-3rem))] space-y-4 rounded-xl border border-border bg-surface p-4 shadow-xl sm:w-80'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-foreground'>
              Filter tasks
            </h3>
          </div>

          <div className='space-y-3'>
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

            {/* Due date */}
            <FilterSelect
              label='Due date'
              name='dueDate'
              value={filters.dueDate}
              onChange={handleChange}
            >
              <option value='all'>Any date</option>
              <option value='today'>Today</option>
              <option value='upcoming'>Upcoming</option>
              <option value='overdue'>Overdue</option>
              <option value='custom'>Custom range</option>
            </FilterSelect>

            {/* Custom date range */}
            {filters.dueDate === 'custom' && (
              <div className='grid grid-cols-2 gap-2'>
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
                    className='w-full rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground'
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
                    className='w-full rounded-md border border-border bg-background px-2 py-2 text-xs text-foreground'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
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
