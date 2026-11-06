import { useState } from 'react';
import {
  CalendarDays,
  Clock3,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Badge, Checkbox, Dropdown } from '../../../components/ui';
import { useTasks } from '../useTasks';
import TaskFormModal from './TaskFormModal';

import { usePreferences } from '../../preferences/usePreferences';
import { formatPreferenceDate } from '../../preferences/dateFormatting';
import { useLabels } from '../../labels/useLabels';
import TaskLabels from '../../labels/components/TaskLabels';

const priorityVariants = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
};

export default function TaskRow({ task, onOpenDetails, projects = [] }) {
  const { toggleTaskCompletion, deleteTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const { preferences } = usePreferences();
  const { labels } = useLabels();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (confirmed) {
      deleteTask(task.id);
    }
  }

  const formattedDate = task.dueDate
    ? formatPreferenceDate(task.dueDate, preferences.dateFormat)
    : null;

  return (
    <>
      <div
        className='
          group flex items-center gap-3 border-b border-border
          px-3 py-4 transition-colors
          hover:bg-surface-hover/50
        '
      >
        <Checkbox
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          className='shrink-0'
        />

        <button
          type='button'
          onClick={() => onOpenDetails?.(task)}
          className='min-w-0 flex-1 text-left'
        >
          <span
            className={`
              block truncate text-sm font-medium
              ${
                task.completed
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground'
              }
            `}
          >
            {task.title}
          </span>

          {task.description && (
            <span className='mt-1 block truncate text-xs text-muted-foreground'>
              {task.description}
            </span>
          )}
        </button>

        <TaskLabels labelIds={task.labelIds ?? []} labels={labels} />

        <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
          <Badge variant={priorityVariants[task.priority] || 'default'}>
            {task.priority}
          </Badge>

          {formattedDate && (
            <span className='hidden items-center gap-1 text-xs text-muted-foreground sm:flex'>
              <CalendarDays size={14} />
              {formattedDate}
            </span>
          )}

          {task.dueTime && (
            <span className='hidden items-center gap-1 text-xs text-muted-foreground sm:flex'>
              <Clock3 size={14} />
              {task.dueTime}
            </span>
          )}
        </div>

        <div className='opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
          <Dropdown align='right' trigger={<MoreHorizontal size={19} />}>
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-foreground hover:bg-surface-hover'
            >
              <Pencil size={15} />
              Edit task
            </button>

            <button
              type='button'
              onClick={handleDelete}
              className='flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-danger hover:bg-surface-hover'
            >
              <Trash2 size={15} />
              Delete task
            </button>
          </Dropdown>
        </div>
      </div>

      {isEditing && (
        <TaskFormModal
          key={task.id}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          task={task}
          projects={projects}
        />
      )}
    </>
  );
}
