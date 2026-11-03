import { format, isSameDay, isToday } from 'date-fns';

import { getWeekDays, getTasksForDate } from '../utils/calendarUtils';

const priorityStyles = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-info',
};

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueTime && !b.dueTime) return 0;
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;

    return a.dueTime.localeCompare(b.dueTime);
  });
}

export default function CalendarWeekView({
  currentDate,
  selectedDate,
  tasks = [],
  onSelectDate,
  onOpenTask,
}) {
  const days = getWeekDays(currentDate);

  return (
    <div className='overflow-x-auto rounded-xl border border-border bg-surface'>
      <div className='grid min-w-[840px] grid-cols-7'>
        {days.map((day) => {
          const dayTasks = sortTasks(getTasksForDate(tasks, day));

          const today = isToday(day);
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;

          return (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className='min-h-[420px] border-r border-border last:border-r-0'
            >
              {/* Day heading */}
              <button
                type='button'
                onClick={() => onSelectDate(day)}
                aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                aria-pressed={selected}
                className={`
                  flex w-full flex-col items-center gap-1
                  border-b border-border px-2 py-4
                  transition-colors hover:bg-surface-hover
                  ${selected ? 'bg-primary/5' : ''}
                `}
              >
                <span className='text-xs font-medium uppercase text-muted-foreground'>
                  {format(day, 'EEE')}
                </span>

                <span
                  className={`
                    flex size-9 items-center justify-center
                    rounded-full text-sm font-semibold
                    ${
                      today
                        ? 'bg-primary text-white'
                        : selected
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground'
                    }
                  `}
                >
                  {format(day, 'd')}
                </span>

                <span className='text-[10px] text-muted-foreground'>
                  {dayTasks.length === 1
                    ? '1 task'
                    : `${dayTasks.length} tasks`}
                </span>
              </button>

              {/* Day tasks */}
              <div className='space-y-2 p-2'>
                {dayTasks.length === 0 ? (
                  <p className='py-6 text-center text-xs text-muted-foreground'>
                    No tasks
                  </p>
                ) : (
                  dayTasks.map((task) => (
                    <button
                      key={task.id}
                      type='button'
                      onClick={() => onOpenTask?.(task)}
                      title={task.title}
                      className={`
                        w-full rounded-lg border border-border
                        bg-surface-secondary/50 p-2 text-left
                        transition hover:border-primary/40
                        hover:bg-surface-hover
                        ${task.completed ? 'opacity-60' : ''}
                      `}
                    >
                      <div className='flex items-center gap-1.5'>
                        <span
                          className={`
                            size-1.5 shrink-0 rounded-full
                            ${priorityStyles[task.priority] || 'bg-muted-foreground'}
                          `}
                        />

                        <span className='truncate text-[10px] font-medium capitalize text-muted-foreground'>
                          {task.priority || 'Normal'}
                        </span>
                      </div>

                      <p
                        className={`
                          mt-1.5 break-words text-xs font-medium
                          text-foreground
                          ${
                            task.completed
                              ? 'line-through text-muted-foreground'
                              : ''
                          }
                        `}
                      >
                        {task.title}
                      </p>

                      {task.dueTime && (
                        <p className='mt-2 text-[10px] text-muted-foreground'>
                          {task.dueTime}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
