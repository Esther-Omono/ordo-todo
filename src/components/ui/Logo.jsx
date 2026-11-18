import { usePreferences } from '../../features/preferences/hooks/usePreferences';

import lightLogo from '../../assets/logos/logo-light.svg';
import darkLogo from '../../assets/logos/logo-dark.svg';

export default function Logo() {
  const { preferences } = usePreferences();
  const isDark = preferences.theme === 'dark';
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className='flex items-center text-current'>
      <img
        src={logo}
        alt=''
        aria-hidden='true'
        className='-mt-1.5 h-12 w-12 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105'
      />

      <div className='flex flex-col justify-center'>
        <span className='text-lg sm:text-xl font-bold leading-none tracking-tight'>
          Ordo.
        </span>

        <span className='text-[10px] font-medium tracking-wide opacity-75'>
          Make every day count.
        </span>
      </div>
    </div>
  );
}
