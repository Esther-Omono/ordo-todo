import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button, ThemeToggle } from '../ui';

const pageTitles = {
  '/today': 'Today',
  '/upcoming': 'Upcoming',
  '/tasks': 'All Tasks',
  '/completed': 'Completed',
  '/projects': 'Projects',
  '/settings': 'Settings',
};

export default function Header() {
  const { pathname } = useLocation();

  const pageTitle = pathname.startsWith('/projects/')
    ? 'Project Details'
    : pageTitles[pathname] || 'Ordo';

  return (
    <header
      className='
      flex h-20 shrink-0 items-center justify-between
      border-b border-border bg-surface px-5 sm:px-8
    '
    >
      <div>
        <h1 className='text-lg font-semibold text-foreground'>{pageTitle}</h1>

        <p className='hidden text-xs text-muted-foreground sm:block'>
          Stay organised. Make progress.
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <ThemeToggle />

        <Button
          variant='ghost'
          size='md'
          aria-label='Notifications'
          title='Notifications'
          disabled
        >
          <Bell size={19} />
        </Button>
      </div>
    </header>
  );
}
