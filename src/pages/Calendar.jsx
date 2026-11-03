import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

import { useCalendarNavigation } from '../features/calendar/hooks/useCalendarNavigation';
import { useTasks } from '../features/tasks/useTasks';
import CalendarMonthView from '../features/calendar/components/CalendarMonthView';

const views = ['month', 'week', 'day'];

export default function Calendar() {
  const {
    currentDate,
    selectedDate,
    view,
    goToToday,
    goToPrevious,
    goToNext,
    changeView,
    selectDate,
  } = useCalendarNavigation();

  const { tasks } = useTasks();

  function getDateLabel() {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    }

    if (view === 'week') {
      const start = startOfWeek(currentDate, {
        weekStartsOn: 1,
      });

      const end = endOfWeek(currentDate, {
        weekStartsOn: 1,
      });

      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }

    return format(currentDate, 'EEEE, MMMM d, yyyy');
  }

  return (
    <div className='mx-auto w-full max-w-6xl space-y-8'>
      <header className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <CalendarDays size={22} className='text-primary' />

            <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
              Calendar
            </h1>
          </div>

          <p className='mt-1 text-sm text-muted-foreground'>
            Plan your time and keep track of what's ahead.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={goToToday}
            className='rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover'
          >
            Today
          </button>

          <div className='flex items-center rounded-lg border border-border'>
            <button
              type='button'
              onClick={goToPrevious}
              aria-label='Previous period'
              className='rounded-l-lg p-2.5 hover:bg-surface-hover'
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type='button'
              onClick={goToNext}
              aria-label='Next period'
              className='rounded-r-lg p-2.5 hover:bg-surface-hover'
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-lg font-semibold text-foreground'>
          {getDateLabel()}
        </h2>

        <div className='flex w-fit items-center rounded-lg border border-border bg-surface p-1'>
          {views.map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => changeView(item)}
              aria-pressed={view === item}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition ${
                view === item
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className='flex min-h-96 items-center justify-center rounded-xl border border-border bg-surface'>
        {view === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
            tasks={tasks}
          />
        )}

        {view !== 'month' && (
          <section className='flex min-h-96 items-center justify-center rounded-xl border border-border bg-surface'>
            <p className='text-sm text-muted-foreground'>
              This calendar view is coming in a later batch.
            </p>
          </section>
        )}
      </section>
    </div>
  );
}
