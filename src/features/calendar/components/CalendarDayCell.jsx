import { format, isSameDay, isSameMonth, isToday } from 'date-fns';

export default function CalendarDayCell({
  date,
  currentDate,
  selectedDate,
  tasks = [],
  onSelectDate,
  onOpenTask,
}) {
  const isCurrentMonth = isSameMonth(date, currentDate);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  const today = isToday(date);

  const visibleTasks = tasks.slice(0, 3);
  const remainingCount = tasks.length - visibleTasks.length;

  const priorityColors = {
    high: 'bg-danger',
    medium: 'bg-warning',
    low: 'bg-info',
  };

  return (
    <div
      className={`
        group relative flex min-h-24 flex-col border-b border-r
        border-border p-1.5 transition-colors sm:min-h-32 sm:p-2
        ${isCurrentMonth ? 'bg-surface' : 'bg-surface-secondary/40'}
        ${isSelected ? 'bg-primary/5' : ''}
        hover:bg-surface-hover/60
      `}
    >
      <button
        type='button'
        onClick={() => onSelectDate(date)}
        aria-label={format(date, 'EEEE, MMMM d, yyyy')}
        aria-pressed={isSelected}
        className='mb-1 flex w-fit items-center justify-center'
      >
        <span
          className={`
            flex size-7 items-center justify-center rounded-full
            text-xs font-medium transition sm:size-8 sm:text-sm
            ${!isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground'}
            ${today ? 'bg-primary text-white' : ''}
            ${isSelected && !today ? 'bg-primary/10 text-primary ring-1 ring-primary' : ''}
          `}
        >
          {format(date, 'd')}
        </span>
      </button>

      <div className='flex flex-col gap-1'>
        {visibleTasks.map((task) => (
          <button
            key={task.id}
            type='button'
            onClick={() => onOpenTask?.(task)}
            title={task.title}
            className={`
              flex min-w-0 items-center gap-1 rounded px-1.5 py-1
              text-left text-[10px] transition sm:text-xs
              ${
                task.completed
                  ? 'bg-surface-secondary text-muted-foreground'
                  : 'bg-primary/10 text-foreground hover:bg-primary/20'
              }
            `}
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${
                priorityColors[task.priority] || 'bg-muted-foreground'
              }`}
            />

            <span
              className={`truncate ${task.completed ? 'line-through' : ''}`}
            >
              {task.title}
            </span>
          </button>
        ))}
      </div>

      {remainingCount > 0 && (
        <span className='mt-1 px-1 text-[10px] font-medium text-muted-foreground sm:text-xs'>
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
