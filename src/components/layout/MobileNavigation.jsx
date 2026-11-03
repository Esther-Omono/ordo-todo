import { NavLink } from 'react-router-dom';
import { mobileNavigation } from '../../routes/navigationConfig';

export default function MobileNavigation() {
  return (
    <nav
      aria-label='Mobile navigation'
      className='
        fixed inset-x-0 bottom-0 z-40
        grid grid-cols-5 border-t border-border
        bg-surface px-2 pb-[env(safe-area-inset-bottom)] pt-2
        lg:hidden
      '
    >
      {mobileNavigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/projects'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1
              rounded-lg py-2 text-[11px] font-medium
              transition-colors
              ${isActive ? 'text-primary' : 'text-muted-foreground'}
            `}
          >
            <Icon size={20} strokeWidth={1.8} />

            <span>{item.label === 'All Tasks' ? 'Tasks' : item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
