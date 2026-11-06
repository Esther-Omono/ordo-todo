import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  FolderKanban,
  Pencil,
  Trash2,
  X,
  Tag,
} from 'lucide-react';

import { Badge, Button, Checkbox } from '../../../components/ui';
import { useTasks } from '../useTasks';
import SubtaskManager from './SubtaskManager';
import TaskFormModal from './TaskFormModal';

import { usePreferences } from '../../preferences/usePreferences';

import { useLabels } from '../../labels/useLabels';
import TaskLabels from '../../labels/components/TaskLabels';

import {
  formatPreferenceDate,
  formatPreferenceDateTime,
} from '../../preferences/dateFormatting';

const priorityVariants = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
};

function TaskDetailsDrawer({ task, onClose, projects = [] }) {
  const { toggleTaskCompletion, deleteTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);

  const { preferences } = usePreferences();
  const { labels } = useLabels();

  useEffect(() => {
    if (!task) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [task, onClose]);

  if (!task) return null;

  const project = projects.find((item) => item.id === task.projectId);

  const formattedDate = task.dueDate
    ? formatPreferenceDate(task.dueDate, preferences.dateFormat)
    : null;

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?',
    );

    if (!confirmed) return;

    deleteTask(task.id);
    onClose();
  };

  return (
    <>
      <div
        className='fixed inset-0 z-40 bg-black/40'
        onClick={onClose}
        aria-hidden='true'
      />

      <aside
        role='dialog'
        aria-modal='true'
        aria-labelledby='task-details-title'
        className='
          fixed inset-y-0 right-0 z-50
          flex w-full flex-col
          border-l border-border
          bg-background text-foreground
          shadow-xl
          sm:max-w-120
        '
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-border px-5 py-4'>
          <p className='text-sm font-medium text-muted-foreground'>
            Task details
          </p>

          <button
            type='button'
            onClick={onClose}
            aria-label='Close task details'
            className='rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground'
          >
            <X size={19} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className='flex-1 space-y-7 overflow-y-auto p-5'>
          {/* Completion and title */}
          <section className='space-y-4'>
            <div className='flex items-start gap-3'>
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />

              <div className='min-w-0 flex-1'>
                <h2
                  id='task-details-title'
                  className={`text-xl font-semibold leading-snug ${
                    task.completed ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {task.title}
                </h2>

                <p className='mt-2 text-sm text-muted-foreground'>
                  {task.completed
                    ? 'This task is completed.'
                    : 'This task is still active.'}
                </p>
              </div>
            </div>

            {task.description && (
              <div className='rounded-xl bg-muted/50 p-4'>
                <p className='whitespace-pre-wrap text-sm leading-6 text-muted-foreground'>
                  {task.description}
                </p>
              </div>
            )}
          </section>

          {/* Task information */}
          <section className='space-y-4'>
            <h3 className='text-sm font-semibold'>Task information</h3>

            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Badge variant={priorityVariants[task.priority]}>
                  {task.priority}
                </Badge>
                <span className='text-sm text-muted-foreground'>Priority</span>
              </div>

              <div className='flex items-center gap-3'>
                <FolderKanban size={18} className='text-muted-foreground' />
                <span className='text-sm'>
                  {project?.name || 'No project assigned'}
                </span>
              </div>

              <div className='flex items-start gap-3'>
                <Tag size={18} className='mt-0.5 text-muted-foreground' />

                <div className='min-w-0 flex-1 space-y-2'>
                  <span className='text-sm text-muted-foreground'>Labels</span>

                  <TaskLabels
                    labelIds={task.labelIds ?? []}
                    labels={labels}
                    showEmpty
                  />
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <CalendarDays size={18} className='text-muted-foreground' />
                <span className='text-sm'>
                  {formattedDate || 'No due date'}
                </span>
              </div>

              <div className='flex items-center gap-3'>
                <Clock3 size={18} className='text-muted-foreground' />
                <span className='text-sm'>{task.dueTime || 'No due time'}</span>
              </div>
            </div>
          </section>

          {/* Subtasks */}
          <section className='space-y-4'>
            <div className='border-t border-border pt-6'>
              <SubtaskManager task={task} />
            </div>
          </section>

          {/* Task timestamps */}
          <section className='space-y-2 border-t border-border pt-5'>
            <p className='text-xs text-muted-foreground'>
              Created:{' '}
              {formatPreferenceDateTime(task.createdAt, preferences.dateFormat)}
            </p>

            <p className='text-xs text-muted-foreground'>
              Last updated:{' '}
              {formatPreferenceDateTime(task.updatedAt, preferences.dateFormat)}
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className='flex items-center gap-3 border-t border-border p-5'>
          <Button
            variant='primary'
            onClick={() => setIsEditing(true)}
            className='flex-1'
          >
            <Pencil size={16} />
            Edit task
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            aria-label='Delete task'
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </aside>

      {/* Edit modal */}
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

export default TaskDetailsDrawer;
