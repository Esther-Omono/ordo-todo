import { getMonthDays, getTasksForDate } from '../utils/calendarUtils';
import CalendarDayCell from './CalendarDayCell';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarMonthView({
  currentDate,
  selectedDate,
  tasks = [],
  onSelectDate,
  onOpenTask,
}) {
  const days = getMonthDays(currentDate);

  return (
    <div className='overflow-hidden rounded-xl border border-border bg-surface'>
      <div className='grid grid-cols-7 border-b border-border bg-surface-secondary'>
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className='py-3 text-center text-xs font-semibold text-muted-foreground sm:py-4 sm:text-sm'
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7'>
        {days.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            date={day}
            currentDate={currentDate}
            selectedDate={selectedDate}
            tasks={getTasksForDate(tasks, day)}
            onSelectDate={onSelectDate}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
    </div>
  );
}
