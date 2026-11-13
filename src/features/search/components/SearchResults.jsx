import { useEffect, useRef } from 'react';
import {
  Search,
  ListTodo,
  CheckCircle2,
  Circle,
  CalendarDays,
  FolderKanban,
} from 'lucide-react';

import { Badge } from '../../../components/ui';
import { useProjects } from '../../projects/hooks/useProjects';
import { usePreferences } from '../../preferences/hooks/usePreferences';
import { formatPreferenceDate } from '../../preferences/dateFormatting';

const priorityVariants = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
};

export default function SearchResults({
  tasks = [],
  hasQuery,
  onSelect,
  activeIndex = 0,
  onActiveIndexChange,
}) {
  const resultRefs = useRef([]);
  const { projects } = useProjects();
  const { preferences } = usePreferences();

  useEffect(() => {
    resultRefs.current[activeIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex]);

  if (!hasQuery) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Search size={22} />
        </div>

        <h3 className='text-sm font-medium text-foreground'>
          Search your tasks
        </h3>

        <p className='mt-1 text-xs text-muted-foreground'>
          Search by task title or description.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <ListTodo size={22} />
        </div>

        <h3 className='text-sm font-medium text-foreground'>No tasks found</h3>

        <p className='mt-1 text-xs text-muted-foreground'>
          Try another search term.
        </p>
      </div>
    );
  }

  return (
    <div
      id='search-results'
      role='listbox'
      aria-label='Task search results'
      className='max-h-[min(55vh,480px)] overflow-y-auto p-2'
    >
      {tasks.map((task, index) => {
        const project = projects.find((item) => item.id === task.projectId);

        const isActive = index === activeIndex;

        const dueDate = task.dueDate
          ? formatPreferenceDate(task.dueDate, preferences.dateFormat)
          : null;

        return (
          <button
            key={task.id}
            ref={(element) => {
              resultRefs.current[index] = element;
            }}
            id={`search-result-${task.id}`}
            type='button'
            role='option'
            aria-selected={isActive}
            onClick={() => onSelect(task)}
            onMouseEnter={() => onActiveIndexChange?.(index)}
            className={`
              flex w-full items-start gap-3 rounded-lg px-3 py-3
              text-left transition-colors
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-primary
              ${
                isActive
                  ? 'bg-primary/10 ring-1 ring-inset ring-primary/20'
                  : 'hover:bg-muted/70'
              }
            `}
          >
            <div className='mt-0.5 shrink-0'>
              {task.completed ? (
                <CheckCircle2 size={18} className='text-success' />
              ) : (
                <Circle size={18} className='text-muted-foreground' />
              )}
            </div>

            <div className='min-w-0 flex-1 space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <span
                  className={`text-sm font-medium ${
                    task.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>

                {task.completed && <Badge variant='success'>Completed</Badge>}
              </div>

              {task.description && (
                <p className='line-clamp-2 text-xs text-muted-foreground'>
                  {task.description}
                </p>
              )}

              <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                {project && (
                  <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <FolderKanban size={13} />
                    {project.name}
                  </span>
                )}

                {priorityVariants[task.priority] && (
                  <Badge variant={priorityVariants[task.priority]}>
                    {task.priority}
                  </Badge>
                )}

                {dueDate && (
                  <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <CalendarDays size={13} />
                    {dueDate}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
