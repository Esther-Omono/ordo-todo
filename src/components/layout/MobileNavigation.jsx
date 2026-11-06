import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MoreHorizontal, X } from 'lucide-react';

import {
  mobileNavigation,
  moreNavigation,
} from '../../routes/navigationConfig';

export default function MobileNavigation() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const location = useLocation();

  const isMoreActive = moreNavigation.some(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`),
  );

  function closeMoreMenu() {
    setIsMoreOpen(false);
  }

  return (
    <nav
      aria-label='Mobile navigation'
      className='
        fixed inset-x-0 bottom-0 z-40
        border-t border-border bg-surface
        px-2 pb-[env(safe-area-inset-bottom)] pt-2
        lg:hidden
      '
    >
      {/* More menu */}
      {isMoreOpen && (
        <>
          <button
            type='button'
            aria-label='Close navigation menu'
            onClick={closeMoreMenu}
            className='fixed inset-0 z-40 bg-black/20'
          />

          <div
            className='
              absolute bottom-full right-3 z-50 mb-3
              w-56 rounded-xl border border-border
              bg-surface p-2 shadow-xl
            '
          >
            <div className='mb-2 flex items-center justify-between px-3 py-2'>
              <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                More
              </span>

              <button
                type='button'
                onClick={closeMoreMenu}
                aria-label='Close menu'
                className='rounded-md p-1 text-muted-foreground hover:bg-surface-hover'
              >
                <X size={16} />
              </button>
            </div>

            <div className='space-y-1'>
              {moreNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMoreMenu}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-lg
                      px-3 py-2.5 text-sm font-medium
                      transition-colors
                      ${
                        isActive
                          ? 'bg-primary-soft text-primary'
                          : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={1.8} />

                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom navigation */}
      <div className='grid grid-cols-5'>
        {mobileNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/projects'}
              onClick={closeMoreMenu}
              className={({ isActive }) => `
                flex flex-col items-center justify-center
                gap-1 rounded-lg py-2 text-[11px]
                font-medium transition-colors
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
            >
              <Icon size={20} strokeWidth={1.8} />

              <span>{item.label === 'All Tasks' ? 'Tasks' : item.label}</span>
            </NavLink>
          );
        })}

        {/* More button */}
        <button
          type='button'
          onClick={() => setIsMoreOpen((previous) => !previous)}
          aria-label='More navigation options'
          aria-expanded={isMoreOpen}
          className={`
            flex flex-col items-center justify-center
            gap-1 rounded-lg py-2 text-[11px]
            font-medium transition-colors
            ${
              isMoreOpen || isMoreActive
                ? 'text-primary'
                : 'text-muted-foreground'
            }
          `}
        >
          {isMoreOpen ? <X size={20} /> : <MoreHorizontal size={20} />}

          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
