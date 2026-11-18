import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

import { Button, ThemeToggle } from '../ui';
import SearchButton from '../../features/search/components/SearchButton';
import Logo from '../ui/Logo';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      className='
      flex h-20 shrink-0 items-center justify-between
      border-b border-border bg-surface px-5 sm:px-8
    '
    >
      <div className='origin-left scale-90 sm:scale-100 lg:hidden'>
        <Link to='/today' className='focus-visible:outline-none'>
          <Logo />
        </Link>
      </div>

      <div className='ml-auto flex items-center gap-1 sm:gap-2'>
        <SearchButton />

        <ThemeToggle />

        <Button
          variant='ghost'
          size='sm'
          aria-label='Open notifications'
          title='Notifications'
          onClick={() => navigate('/notifications')}
        >
          <Bell size={19} />
        </Button>
      </div>
    </header>
  );
}
