import { useState } from 'react';

import { addDays, addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [view, setView] = useState('month');

  function goToToday() {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  }

  function goToPrevious() {
    setCurrentDate((date) => {
      if (view === 'month') return subMonths(date, 1);
      if (view === 'week') return subWeeks(date, 1);

      return addDays(date, -1);
    });
  }

  function goToNext() {
    setCurrentDate((date) => {
      if (view === 'month') return addMonths(date, 1);
      if (view === 'week') return addWeeks(date, 1);

      return addDays(date, 1);
    });
  }

  function changeView(nextView) {
    setView(nextView);
  }

  function selectDate(date) {
    setSelectedDate(date);
    setCurrentDate(date);
  }

  return {
    currentDate,
    selectedDate,
    view,
    goToToday,
    goToPrevious,
    goToNext,
    changeView,
    selectDate,
  };
}
