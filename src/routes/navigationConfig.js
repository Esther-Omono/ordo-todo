import {
  CalendarDays,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  FolderKanban,
  Settings,
  Calendar,
  Tag,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export const mainNavigation = [
  {
    label: 'Today',
    path: '/today',
    icon: CalendarDays,
  },
  {
    label: 'Overdue',
    path: '/overdue',
    icon: AlertCircle,
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
  {
    label: 'Productivity',
    path: '/productivity',
    icon: TrendingUp,
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
  mainNavigation[1], // Overdue
  mainNavigation[2], // Upcoming
  mainNavigation[3], // All Tasks
];

export const moreNavigation = [
  mainNavigation[4], // Completed
  mainNavigation[5], // Projects
  mainNavigation[6], // Labels
  mainNavigation[7], // Calendar
  mainNavigation[8], // Productivity
  secondaryNavigation[0], // Settings
];
