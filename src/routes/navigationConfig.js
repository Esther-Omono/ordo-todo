import {
  CalendarDays,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  FolderKanban,
  Settings,
  Calendar,
  Tag,
  MoreHorizontal,
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
  mainNavigation[0],
  mainNavigation[1],
  mainNavigation[2],
  mainNavigation[4],
  secondaryNavigation[0],
];
