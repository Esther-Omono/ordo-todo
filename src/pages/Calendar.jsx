import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

import { useCalendarNavigation } from '../features/calendar/hooks/useCalendarNavigation';
import { useTasks } from '../features/tasks/useTasks';
import { useProjects } from '../features/projects/useProjects';

import CalendarMonthView from '../features/calendar/components/CalendarMonthView';
import CalendarWeekView from '../features/calendar/components/CalendarWeekView';
import CalendarDayView from '../features/calendar/components/CalendarDayView';

import { Button } from '../components/ui';

import TaskDetailsDrawer from '../features/tasks/components/TaskDetailsDrawer';
import TaskFormModal from '../features/tasks/components/TaskFormModal';

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
  const { projects } = useProjects();

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  function handleOpenTask(task) {
    setSelectedTaskId(task.id);
  }

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
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={17} />
            <span>Add task</span>
          </Button>
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
            onOpenTask={handleOpenTask}
          />
        )}

        {view === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            tasks={tasks}
            onSelectDate={selectDate}
            onOpenTask={handleOpenTask}
          />
        )}

        {view === 'day' && (
          <CalendarDayView
            currentDate={currentDate}
            selectedDate={selectedDate}
            tasks={tasks}
            onSelectDate={selectDate}
            onOpenTask={handleOpenTask}
          />
        )}
      </section>

      {isCreating && (
        <TaskFormModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          defaultDueDate={format(currentDate, 'yyyy-MM-dd')}
        />
      )}

      <TaskDetailsDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        projects={projects}
      />
    </div>
  );
}
