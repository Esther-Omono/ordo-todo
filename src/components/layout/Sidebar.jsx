import { Link } from 'react-router-dom';
import {
  mainNavigation,
  secondaryNavigation,
} from '../../routes/navigationConfig';
import NavigationItem from './NavigationItem';

export default function Sidebar() {
  return (
    <aside
      className='
      hidden h-screen w-64 shrink-0 flex-col
      border-r border-border bg-surface
      lg:flex
    '
    >
      {/* Brand */}
      <div className='flex h-20 items-center px-7'>
        <Link
          to='/today'
          className='text-2xl font-bold tracking-tight text-primary'
        >
          ordo<span className='text-foreground'>.</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav aria-label='Main navigation' className='flex-1 space-y-1 px-4 py-4'>
        <p className='mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          Workspace
        </p>

        {mainNavigation.map((item) => (
          <NavigationItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Secondary navigation */}
      <div className='border-t border-border p-4'>
        {secondaryNavigation.map((item) => (
          <NavigationItem key={item.path} item={item} />
        ))}
      </div>
    </aside>
  );
}
