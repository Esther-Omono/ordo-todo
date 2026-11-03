import { format, isToday } from 'date-fns';

import { getTasksForDate } from '../utils/calendarUtils';
import { CalendarDays, Clock3, CircleCheck, ListTodo } from 'lucide-react';

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueTime && !b.dueTime) return 0;
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;

    return a.dueTime.localeCompare(b.dueTime);
  });
}

function formatTime(time) {
  if (!time) return null;

  const [hours, minutes] = time.split(':');
  const date = new Date();

  date.setHours(Number(hours), Number(minutes));

  return format(date, 'h:mm a');
}

function AgendaTask({ task, onOpenTask }) {
  return (
    <button
      type='button'
      onClick={() => onOpenTask?.(task)}
      className='
        group flex w-full items-start gap-4 rounded-xl
        border border-border bg-surface p-4 text-left
        transition hover:border-primary/40
        hover:bg-surface-hover
      '
    >
      <div className='flex min-w-16 flex-col items-center gap-1'>
        {task.dueTime ? (
          <>
            <Clock3 size={15} className='text-muted-foreground' />
            <span className='text-xs font-medium text-foreground'>
              {formatTime(task.dueTime)}
            </span>
          </>
        ) : (
          <span className='text-xs text-muted-foreground'>Anytime</span>
        )}
      </div>

      <div
        className='mt-1 h-2.5 w-2.5 shrink-0 rounded-full'
        style={{
          backgroundColor:
            task.priority === 'high'
              ? 'var(--color-danger)'
              : task.priority === 'medium'
                ? 'var(--color-warning)'
                : 'var(--color-info)',
        }}
      />

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <h3
            className={`
              text-sm font-medium text-foreground
              ${task.completed ? 'line-through text-muted-foreground' : ''}
            `}
          >
            {task.title}
          </h3>

          {task.completed && <CircleCheck size={14} className='text-success' />}
        </div>

        {task.description && (
          <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
            {task.description}
          </p>
        )}

        <span className='mt-2 inline-block text-[10px] font-medium capitalize text-muted-foreground'>
          {task.priority || 'Normal'} priority
        </span>
      </div>
    </button>
  );
}

export default function CalendarDayView({
  currentDate,
  tasks = [],
  onOpenTask,
}) {
  const date = currentDate;

  const dayTasks = sortTasks(getTasksForDate(tasks, date));

  const timedTasks = dayTasks.filter((task) => task.dueTime);
  const anytimeTasks = dayTasks.filter((task) => !task.dueTime);

  const completedCount = dayTasks.filter((task) => task.completed).length;

  const today = isToday(date);

  return (
    <div className='space-y-6'>
      {/* Daily heading */}
      <div className='rounded-xl border border-border bg-surface p-5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <CalendarDays size={18} className='text-primary' />

              <span className='text-xs font-medium text-muted-foreground'>
                {today ? 'TODAY' : 'DAILY AGENDA'}
              </span>
            </div>

            <h2 className='mt-2 text-xl font-semibold text-foreground'>
              {format(date, 'EEEE, MMMM d')}
            </h2>

            <p className='mt-1 text-sm text-muted-foreground'>
              {dayTasks.length} tasks scheduled
            </p>
          </div>

          <div className='rounded-lg bg-surface-secondary px-4 py-3'>
            <div className='flex items-center gap-2'>
              <ListTodo size={17} className='text-primary' />

              <span className='text-sm font-medium text-foreground'>
                {completedCount}/{dayTasks.length} completed
              </span>
            </div>

            <p className='mt-1 text-xs text-muted-foreground'>
              Keep making progress.
            </p>
          </div>
        </div>
      </div>

      {/* Agenda */}
      {dayTasks.length === 0 ? (
        <div className='flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 text-center'>
          <CalendarDays size={36} className='mb-3 text-muted-foreground' />

          <h3 className='font-medium text-foreground'>Nothing scheduled</h3>

          <p className='mt-1 text-sm text-muted-foreground'>
            Your day is clear. Enjoy the breathing room!
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Timed tasks */}
          {timedTasks.length > 0 && (
            <section className='space-y-3'>
              <h3 className='text-sm font-semibold text-foreground'>
                Scheduled
              </h3>

              <div className='space-y-2'>
                {timedTasks.map((task) => (
                  <AgendaTask
                    key={task.id}
                    task={task}
                    onOpenTask={onOpenTask}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tasks without times */}
          {anytimeTasks.length > 0 && (
            <section className='space-y-3'>
              <h3 className='text-sm font-semibold text-foreground'>Anytime</h3>

              <div className='space-y-2'>
                {anytimeTasks.map((task) => (
                  <AgendaTask
                    key={task.id}
                    task={task}
                    onOpenTask={onOpenTask}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
