import {
  CalendarDays,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  FolderKanban,
  Settings,
  Calendar,
  Tag,
} from 'lucide-react';

export const mainNavigation = [
  {
    label: 'Today',
    path: '/today',
    icon: CalendarDays,
  },
  {
    label: 'Upcoming',
    path: '/upcoming',
    icon: CalendarClock,
  },
  {
    label: 'All Tasks',
    path: '/tasks',
    icon: ListTodo,
  },
  {
    label: 'Completed',
    path: '/completed',
    icon: CheckCircle2,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Labels',
    path: '/labels',
    icon: Tag,
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: Calendar,
  },
];

export const secondaryNavigation = [
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export const mobileNavigation = [
  mainNavigation[0], // Today
  mainNavigation[1], // Upcoming
  mainNavigation[2], // All Tasks
  mainNavigation[4], // Projects
];

export const moreNavigation = [
  mainNavigation[3], // Completed
  mainNavigation[5], // Labels
  mainNavigation[6], // Calendar
  secondaryNavigation[0], // Settings
];
